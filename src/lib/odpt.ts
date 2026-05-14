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

export async function fetchStationTimetable(): Promise<StationTimetable[]> {
  const url =
    `${ODPT_BASE_URL}/odpt:StationTimetable` +
    `?odpt:railway=${RAILWAY_ID}` +
    `&odpt:station=${STATION_ID}`;

  const res = await fetch(url, {
    next: { revalidate: 3600 }, // 1時間キャッシュ
  });

  if (!res.ok) {
    throw new Error(`ODPT API エラー: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<StationTimetable[]>;
}

// HH:MM 形式の文字列を「その日の経過分」に変換
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

// カレンダー判定は src/lib/calendar.ts の getCalendarInfo() を使用。
// 祝日対応済み（@holiday-jp/holiday_jp による振替休日・国民の休日を含む判定）。
