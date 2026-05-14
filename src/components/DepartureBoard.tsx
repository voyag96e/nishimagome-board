"use client";

import { useState, useEffect } from "react";
import type { StationTimetable, StationTimetableObject } from "@/lib/odpt";
import { timeToMinutes } from "@/lib/odpt";
import { getCalendarInfo } from "@/lib/calendar";
import { getStationName, getRailwayName, getTrainType } from "@/lib/stationNames";
import { getPlatformInfo } from "@/lib/platform-map";

interface Props {
  timetables: StationTimetable[];
}

function platformColors(platform: string) {
  if (platform === "1") return { bg: "bg-sky-600", text: "text-white" };
  if (platform === "2") return { bg: "bg-orange-500", text: "text-white" };
  return { bg: "bg-gray-700", text: "text-gray-300" };
}

// テーブル行用: 「N番線」ピル表示
function PlatformPill({ platform }: { platform: string }) {
  const { bg, text } = platformColors(platform);
  const label = platform === "?" ? "?" : `${platform}番線`;
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-lg text-xs font-bold whitespace-nowrap ${bg} ${text}`}
    >
      {label}
    </span>
  );
}

// 次発カード用: 番線をヒーロー表示
function PlatformHero({
  platform,
  isEstimated,
}: {
  platform: string;
  isEstimated: boolean;
}) {
  const { bg, text } = platformColors(platform);
  const label = platform === "?" ? "番線不明" : `${platform}番線`;
  return (
    <div className={`w-full rounded-xl py-6 text-center ${bg}`}>
      <p className={`text-5xl font-black tracking-wide leading-none ${text}`}>
        {label}
      </p>
      {isEstimated && (
        <p className="text-xs text-white/70 mt-2">※ 番線は推定です</p>
      )}
    </div>
  );
}

function WaitText({ minutes }: { minutes: number }) {
  if (minutes <= 0) {
    return (
      <span className="text-yellow-300 font-bold whitespace-nowrap">
        まもなく
      </span>
    );
  }
  return (
    <span className="text-gray-300 whitespace-nowrap">{minutes}分後</span>
  );
}

function TrainTypeBadge({ typeId }: { typeId: string }) {
  const { label, bg, text } = getTrainType(typeId);
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap ${bg} ${text}`}
    >
      {label}
    </span>
  );
}

// テーブルの1行（4列レイアウト）
function TrainRow({
  train,
  waitMinutes,
}: {
  train: StationTimetableObject;
  waitMinutes: number;
}) {
  const destination = train["odpt:destinationStation"][0] ?? "";
  const destinationName = getStationName(destination);
  const via = train["odpt:viaRailway"];
  const { platform } = getPlatformInfo(
    train["odpt:trainNumber"],
    train["odpt:platformNumber"]
  );

  return (
    <tr className="border-b border-gray-800">
      {/* 番線 */}
      <td className="py-2.5 pl-3 pr-1 text-center">
        <PlatformPill platform={platform} />
      </td>
      {/* 発車時刻 */}
      <td className="py-2.5 px-1 font-mono text-base font-bold whitespace-nowrap">
        {train["odpt:departureTime"]}
      </td>
      {/* 行先 + 種別（折り返しOK） */}
      <td className="py-2.5 px-1">
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
          <TrainTypeBadge typeId={train["odpt:trainType"]} />
          <span className="font-bold text-sm">{destinationName}</span>
        </div>
        {via && via.length > 0 && (
          <div className="text-xs text-gray-400 mt-0.5">
            {via.map(getRailwayName).join("・")}経由
          </div>
        )}
        {train["odpt:isLast"] && (
          <div className="text-xs text-red-400 font-bold">最終</div>
        )}
      </td>
      {/* あと何分 */}
      <td className="py-2.5 pl-1 pr-3 text-right text-sm">
        <WaitText minutes={waitMinutes} />
      </td>
    </tr>
  );
}

export default function DepartureBoard({ timetables }: Props) {
  const [now, setNow] = useState<Date | null>(null);
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    const update = () => {
      const d = new Date();
      setNow(d);
      setLastUpdated(
        d.toLocaleTimeString("ja-JP", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    update();
    const timer = setInterval(update, 30_000);
    return () => clearInterval(timer);
  }, []);

  if (!now) {
    return (
      <div className="text-center py-20 text-gray-400 text-sm">
        読み込み中...
      </div>
    );
  }

  const calendarInfo = getCalendarInfo(now);
  const timetable = timetables.find(
    (t) => t["odpt:calendar"] === calendarInfo.type
  );
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const upcoming: StationTimetableObject[] = timetable
    ? [...timetable["odpt:stationTimetableObject"]]
        .filter((t) => timeToMinutes(t["odpt:departureTime"]) >= nowMinutes)
        .sort(
          (a, b) =>
            timeToMinutes(a["odpt:departureTime"]) -
            timeToMinutes(b["odpt:departureTime"])
        )
        .slice(0, 12)
    : [];

  const anyEstimated = upcoming.some(
    (t) =>
      getPlatformInfo(t["odpt:trainNumber"], t["odpt:platformNumber"])
        .isEstimated
  );
  const timeStr = now.toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const nextTrain = upcoming[0];
  const nextPlatformInfo = nextTrain
    ? getPlatformInfo(
        nextTrain["odpt:trainNumber"],
        nextTrain["odpt:platformNumber"]
      )
    : null;

  return (
    <div>
      {/* ヘッダー */}
      <div className="mb-4 flex items-baseline justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold tracking-wide">西馬込</h1>
          <p className="text-xs text-gray-400 mt-0.5">都営浅草線 | 発車案内</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-mono font-bold text-yellow-300">
            {timeStr}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{calendarInfo.label}ダイヤ</p>
          <p className="text-xs text-gray-500">{calendarInfo.reason}</p>
        </div>
      </div>

      {/* 次の列車カード */}
      {nextTrain && nextPlatformInfo && (
        <div className="mb-4 rounded-xl bg-gray-800 border border-gray-700 p-3">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-gray-400 font-medium">次の列車</p>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
              <span className="text-xs text-gray-400">自動更新中</span>
            </div>
          </div>

          {/* 番線ヒーロー（最も大きく） */}
          <PlatformHero
            platform={nextPlatformInfo.platform}
            isEstimated={nextPlatformInfo.isEstimated}
          />

          {/* 発車情報（縦並びで読みやすく） */}
          <div className="mt-3 space-y-2">
            {/* 時刻 と あと何分 */}
            <div className="flex items-center justify-between">
              <span className="text-3xl font-mono font-bold text-yellow-300">
                {nextTrain["odpt:departureTime"]}
              </span>
              <WaitText
                minutes={
                  timeToMinutes(nextTrain["odpt:departureTime"]) - nowMinutes
                }
              />
            </div>
            {/* 種別 と 行先 */}
            <div className="flex items-center gap-2 flex-wrap">
              <TrainTypeBadge typeId={nextTrain["odpt:trainType"]} />
              <span className="text-lg font-bold">
                {getStationName(nextTrain["odpt:destinationStation"][0] ?? "")}
              </span>
              {nextTrain["odpt:viaRailway"] &&
                nextTrain["odpt:viaRailway"]!.length > 0 && (
                  <span className="text-xs text-gray-400">
                    {nextTrain["odpt:viaRailway"]!.map(getRailwayName).join("・")}経由
                  </span>
                )}
            </div>
          </div>
        </div>
      )}

      {/* 推定番線の注意 */}
      {anyEstimated && (
        <p className="mb-3 text-xs text-orange-400 text-center">
          ※ 一部列車の番線はAPIから取得できなかったため推定です
        </p>
      )}

      {/* 続く列車の一覧 */}
      {upcoming.length > 1 && (
        <div className="rounded-xl border border-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-900 text-gray-400 text-xs">
                <th className="py-2 pl-3 pr-1 text-center">番線</th>
                <th className="py-2 px-1 text-left">発車</th>
                <th className="py-2 px-1 text-left">行先・種別</th>
                <th className="py-2 pl-1 pr-3 text-right">あと</th>
              </tr>
            </thead>
            <tbody>
              {upcoming.slice(1).map((train) => (
                <TrainRow
                  key={`${train["odpt:trainNumber"]}-${train["odpt:departureTime"]}`}
                  train={train}
                  waitMinutes={
                    timeToMinutes(train["odpt:departureTime"]) - nowMinutes
                  }
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {upcoming.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>本日の列車は終了しました</p>
        </div>
      )}

      {/* フッター */}
      <div className="mt-5 space-y-1.5 text-center">
        <p className="text-sm text-gray-400 font-medium">
          実際の発車ホームは駅の案内表示を確認してください
        </p>
        {lastUpdated && (
          <p className="text-xs text-gray-500">
            最終更新 {lastUpdated}　|　30秒ごとに自動更新
          </p>
        )}
        <p className="text-xs text-gray-600">
          データ取得元：ODPT / 東京都交通局
        </p>
        <p className="text-xs text-gray-700 pt-1">
          このサービスは非公式です。東京都交通局・ODPTの公式サービスではありません。
        </p>
      </div>
    </div>
  );
}
