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
 * ODPT API の URL を安全に生成する。
 *
 * ⚠️ URLSearchParams を使わない理由:
 *   ODPT API はパス名・クエリパラメータ名に非標準のコロンを使用する
 *   例: /odpt:StationTimetable?odpt:railway=odpt.Railway:Toei.Asakusa
 *   URLSearchParams はコロンを %3A にエンコードするため API が 404 を返す。
 *
 * @param endpoint - エンドポイント名。先頭スラッシュの有無を正規化する
 *                   例: "odpt:StationTimetable" または "/odpt:StationTimetable"
 * @param params   - クエリパラメータ。キー・値のコロンはそのまま使用する
 */
function buildOdptUrl(
  endpoint: string,
  params: Record<string, string>
): string {
  // 末尾スラッシュを除去して正規化
  const base = ODPT_BASE_URL.replace(/\/$/, "");
  // 先頭スラッシュの有無を吸収
  const ep = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  // クエリ文字列を手動で構築（URLSearchParams は使用しない）
  const query = Object.entries(params)
    .map(([k, v]) => `${k}=${v}`)
    .join("&");

  const url = `${base}/${ep}?${query}`;

  // URL構築の各コンポーネントをログ出力（本番Vercelでも常に出力）
  console.log("[ODPT] buildOdptUrl:", {
    base,
    endpoint: ep,
    params,
    result: url,
  });

  return url;
}

/**
 * ODPT API を呼び出す共通ラッパー。
 * 失敗時は console.error で詳細をログ出力し（Vercel Runtime Logs に出る）、
 * エラーをスローする。
 */
async function odptFetch(apiLabel: string, url: string): Promise<unknown> {
  console.log(`[ODPT][${apiLabel}] fetch →`, url);

  let res: Response;
  try {
    res = await fetch(url, {
      cache: "no-store",
      headers: FETCH_HEADERS,
    });
  } catch (networkError) {
    const msg =
      networkError instanceof Error
        ? networkError.message
        : String(networkError);
    console.error(`[ODPT][${apiLabel}] ネットワークエラー`, { url, error: msg });
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
    throw new Error(`ODPT API エラー: ${res.status} ${res.statusText}`, {
      cause: url,
    });
  }

  let data: unknown;
  try {
    data = await res.json();
  } catch (parseError) {
    const msg =
      parseError instanceof Error ? parseError.message : String(parseError);
    console.error(`[ODPT][${apiLabel}] JSONパースエラー`, { url, error: msg });
    throw new Error(`ODPT API JSONパースエラー: ${msg}`, { cause: url });
  }

  return data;
}

export async function fetchStationTimetable(): Promise<StationTimetable[]> {
  const url = buildOdptUrl("odpt:StationTimetable", {
    "odpt:railway": RAILWAY_ID,
    "odpt:station": STATION_ID,
  });

  const data = await odptFetch("StationTimetable", url);

  if (!Array.isArray(data) || data.length === 0) {
    console.error("[ODPT][StationTimetable] データが空", { url, data });
    throw new Error("ODPT API: データが空でした", { cause: url });
  }

  console.log(
    `[ODPT][StationTimetable] 取得成功: ${(data as unknown[]).length} 件`
  );
  return data as StationTimetable[];
}

// HH:MM 形式の文字列を「その日の経過分」に変換
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

// カレンダー判定は src/lib/calendar.ts の getCalendarInfo() を使用。
// 祝日対応済み（@holiday-jp/holiday_jp による振替休日・国民の休日を含む判定）。
