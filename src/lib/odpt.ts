// ODPT公開API（認証不要）
export const ODPT_BASE_URL = "https://api-public.odpt.org/api/v4";

export const RAILWAY_ID = "odpt.Railway:Toei.Asakusa";
export const STATION_ID = "odpt.Station:Toei.Asakusa.NishiMagome";
export const OPERATOR_ID = "odpt.Operator:Toei";
export const CALENDAR_WEEKDAY = "odpt.Calendar:Weekday";
export const CALENDAR_SAT_HOL = "odpt.Calendar:SaturdayHoliday";

export interface StationTimetableObject {
  "odpt:trainNumber": string;
  "odpt:trainType": string;
  "odpt:departureTime": string;
  "odpt:platformNumber"?: string;
  "odpt:destinationStation": string[];
  "odpt:viaRailway"?: string[];
  "odpt:isLast"?: boolean;
  "odpt:isOrigin"?: boolean;
}

export interface StationTimetable {
  "@id": string;
  "@type": "odpt:StationTimetable";
  "dc:date": string;
  "owl:sameAs": string;
  "odpt:railway": string;
  "odpt:station": string;
  "odpt:calendar": string;
  "odpt:operator": string;
  "odpt:railDirection": string;
  "odpt:stationTimetableObject": StationTimetableObject[];
}

const FETCH_HEADERS = {
  Accept: "application/json",
  "User-Agent": "nishimagome-board/1.0",
};

/**
 * ODPT APIを呼び出す共通ラッパー。
 * 失敗時は console.error で詳細をログ出力し（Vercel Runtime Logs に出る）、
 * エラーをスローする。
 *
 * ⚠️ URLSearchParams を使わない理由:
 *   ODPT API はパス (`odpt:StationTimetable`) とクエリパラメータ名 (`odpt:railway`) に
 *   コロンを含む非標準形式を使用する。URLSearchParams はコロンを %3A にエンコードするため
 *   API が 404 を返す。パラメータは全て定数でユーザー入力を含まないため安全。
 *
 * ⚠️ cache: "no-store" を使う理由:
 *   next: { revalidate } を使うと Next.js 拡張キャッシュ経由になり、
 *   Vercel 本番環境でURL処理が変わって404が発生するため。
 */
async function odptFetch(apiLabel: string, url: string): Promise<unknown> {
  console.log(`[ODPT][${apiLabel}] fetch → ${url}`);

  let res: Response;
  try {
    res = await fetch(url, {
      cache: "no-store",
      headers: FETCH_HEADERS,
    });
  } catch (networkError) {
    const msg = networkError instanceof Error ? networkError.message : String(networkError);
    console.error(`[ODPT][${apiLabel}] ネットワークエラー`, {
      url,
      error: msg,
    });
    throw new Error(`ODPT API ネットワークエラー: ${msg}`, { cause: url });
  }

  if (!res.ok) {
    let body = "(読み取り失敗)";
    try {
      const raw = await res.text();
      body = raw.slice(0, 500);
    } catch {
      // レスポンスボディ読み取り失敗は無視
    }
    console.error(`[ODPT][${apiLabel}] HTTP エラー`, {
      url,
      status: res.status,
      statusText: res.statusText,
      responseBody: body,
    });
    throw new Error(`ODPT API エラー: ${res.status} ${res.statusText}`, { cause: url });
  }

  let data: unknown;
  try {
    data = await res.json();
  } catch (parseError) {
    const msg = parseError instanceof Error ? parseError.message : String(parseError);
    console.error(`[ODPT][${apiLabel}] JSONパースエラー`, { url, error: msg });
    throw new Error(`ODPT API JSONパースエラー: ${msg}`, { cause: url });
  }

  return data;
}

export async function fetchStationTimetable(): Promise<StationTimetable[]> {
  const url =
    `${ODPT_BASE_URL}/odpt:StationTimetable` +
    `?odpt:railway=${RAILWAY_ID}` +
    `&odpt:station=${STATION_ID}`;

  const data = await odptFetch("StationTimetable", url);

  if (!Array.isArray(data) || data.length === 0) {
    console.error("[ODPT][StationTimetable] データが空", { url, data });
    throw new Error("ODPT API: データが空でした", { cause: url });
  }

  console.log(`[ODPT][StationTimetable] 取得成功: ${(data as unknown[]).length} 件`);
  return data as StationTimetable[];
}

// HH:MM 形式の文字列を「その日の経過分」に変換
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

// カレンダー判定は src/lib/calendar.ts の getCalendarInfo() を使用。
// 祝日対応済み（@holiday-jp/holiday_jp による振替休日・国民の休日を含む判定）。
