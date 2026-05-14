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

/**
 * ODPT時刻表APIからデータを取得する。
 *
 * ⚠️ URLSearchParams を使わない理由:
 *   ODPT API はパス (`odpt:StationTimetable`) とクエリパラメータ名 (`odpt:railway`) に
 *   コロンを含む非標準形式を使用する。URLSearchParams はコロンを %3A にエンコードするため
 *   APIが404を返す可能性がある。パラメータは全て定数でユーザー入力を含まないため
 *   テンプレートリテラルによる手動構築が安全かつ正確。
 *
 * ⚠️ cache: "no-store" を使う理由:
 *   next: { revalidate } を使うと Next.js 拡張キャッシュ経由になり、
 *   Vercel 本番環境 (Linux) でURLの処理が変わって404が発生する。
 *   cache: "no-store" で素のHTTPリクエストになり、ローカル/本番で同じ挙動になる。
 */
export async function fetchStationTimetable(): Promise<StationTimetable[]> {
  const url =
    `${ODPT_BASE_URL}/odpt:StationTimetable` +
    `?odpt:railway=${RAILWAY_ID}` +
    `&odpt:station=${STATION_ID}`;

  if (process.env.NODE_ENV === "development") {
    console.log("[ODPT] fetch →", url);
  }

  let res: Response;
  try {
    res = await fetch(url, {
      cache: "no-store", // ISRキャッシュを使わず毎回最新データを取得
    });
  } catch (networkError) {
    const msg = networkError instanceof Error ? networkError.message : String(networkError);
    throw new Error(`ODPT API ネットワークエラー: ${msg}`, { cause: url });
  }

  if (!res.ok) {
    throw new Error(`ODPT API エラー: ${res.status} ${res.statusText}`, { cause: url });
  }

  const data = (await res.json()) as StationTimetable[];

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("ODPT API: データが空でした", { cause: url });
  }

  return data;
}

// HH:MM 形式の文字列を「その日の経過分」に変換
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

// カレンダー判定は src/lib/calendar.ts の getCalendarInfo() を使用。
// 祝日対応済み（@holiday-jp/holiday_jp による振替休日・国民の休日を含む判定）。
