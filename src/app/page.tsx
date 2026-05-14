import { fetchStationTimetable } from "@/lib/odpt";
import DepartureBoard from "@/components/DepartureBoard";

export default async function Page() {
  let timetables;
  let error: string | null = null;

  try {
    timetables = await fetchStationTimetable();
  } catch (e) {
    error = e instanceof Error ? e.message : "データ取得に失敗しました";
  }

  if (error || !timetables) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-400 text-lg">{error ?? "データがありません"}</p>
          <p className="text-gray-400 mt-2 text-sm">
            しばらくしてからページを再読み込みしてください
          </p>
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
