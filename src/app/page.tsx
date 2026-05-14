// 毎リクエスト時にサーバー側でODPT APIからデータを取得する
// （静的生成・ISRを使わない）
export const dynamic = "force-dynamic";

import { fetchStationTimetable } from "@/lib/odpt";
import DepartureBoard from "@/components/DepartureBoard";

export default async function Page() {
  let timetables;
  let error: string | null = null;
  let errorUrl: string | null = null;

  try {
    timetables = await fetchStationTimetable();
  } catch (e) {
    if (e instanceof Error) {
      error = e.message;
      // cause にリクエストURLが入っている（開発時デバッグ用）
      if (typeof e.cause === "string") {
        errorUrl = e.cause;
      }
    } else {
      error = "データ取得に失敗しました";
    }
  }

  if (error || !timetables) {
    return (
      <main className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center max-w-sm w-full">
          <p className="text-red-400 text-lg font-bold">データ取得に失敗しました</p>
          <p className="text-gray-400 mt-2 text-sm">
            しばらくしてからページを再読み込みしてください
          </p>
          {/* 開発環境のみ詳細を表示（本番では非表示） */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-4 text-left bg-gray-900 rounded p-3 text-xs text-gray-500 space-y-1">
              <p className="font-bold text-gray-400">開発用エラー詳細:</p>
              <p className="break-all">{error}</p>
              {errorUrl && (
                <>
                  <p className="font-bold text-gray-400 mt-2">リクエストURL:</p>
                  <p className="break-all text-gray-600">{errorUrl}</p>
                </>
              )}
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="p-3 sm:p-6 max-w-2xl mx-auto">
      <DepartureBoard timetables={timetables} />
      <section className="mt-6 pt-4 border-t border-gray-800/50">
        <h2 className="text-xs font-semibold text-gray-600 mb-2">
          西馬込 次のホームとは
        </h2>
        <p className="text-xs text-gray-700 leading-relaxed">
          「西馬込 次のホーム」は、都営浅草線・西馬込駅の次の発車ホームをスマホですぐ確認できる非公式Webアプリです。
          西馬込駅の1番線・2番線どちらに向かえばよいかを時刻表データをもとにリアルタイムで表示します。
          通勤・通学・おでかけ時の発車ホーム確認にご活用ください。
        </p>
        <p className="text-xs text-gray-700 leading-relaxed mt-1.5">
          本サービスはODPT（公共交通オープンデータ協議会）および東京都交通局が提供するオープンデータを利用した非公式サービスです。
          実際の発車番線は駅の案内表示でご確認ください。
        </p>
      </section>
    </main>
  );
}
