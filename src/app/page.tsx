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
    </main>
  );
}
