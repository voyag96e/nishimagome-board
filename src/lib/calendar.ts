import Holidays from "@holiday-jp/holiday_jp";
import { CALENDAR_WEEKDAY, CALENDAR_SAT_HOL } from "./odpt";

export interface CalendarInfo {
  type: string;   // CALENDAR_WEEKDAY | CALENDAR_SAT_HOL
  label: string;  // "平日" | "土休日"
  reason: string; // "月曜" | "土曜" | "日曜" | "祝日: 成人の日"
}

const DAY_JP = ["日", "月", "火", "水", "木", "金", "土"] as const;

/**
 * 日付からダイヤ種別・表示ラベル・理由を返す。
 * 祝日は @holiday-jp/holiday_jp で判定（振替休日・国民の休日を含む）。
 * date は端末のローカル時刻を使用。日本在住ユーザー（JST）を前提とする。
 */
export function getCalendarInfo(date: Date): CalendarInfo {
  // 祝日チェック（当日の start/end に同日を渡して取得）
  const holidayList = Holidays.between(date, date);
  const holiday = holidayList[0];

  if (holiday) {
    return {
      type: CALENDAR_SAT_HOL,
      label: "土休日",
      reason: `祝日: ${holiday.name}`,
    };
  }

  const day = date.getDay();

  if (day === 0) {
    return { type: CALENDAR_SAT_HOL, label: "土休日", reason: "日曜" };
  }
  if (day === 6) {
    return { type: CALENDAR_SAT_HOL, label: "土休日", reason: "土曜" };
  }

  return {
    type: CALENDAR_WEEKDAY,
    label: "平日",
    reason: `${DAY_JP[day]}曜`,
  };
}
