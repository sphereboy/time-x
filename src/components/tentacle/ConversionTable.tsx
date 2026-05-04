import { getOffsetMinutes } from "@/data/cities";
import type { City } from "@/data/cities";

interface ConversionTableProps {
  from: City;
  to: City;
  baseTime: Date;
}

function formatHourMin(totalMinutes: number, hour12 = true): string {
  const wrapped = ((totalMinutes % 1440) + 1440) % 1440;
  const h = Math.floor(wrapped / 60);
  const m = wrapped % 60;
  if (hour12) {
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
  }
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

function isBusinessHour(totalMinutes: number): boolean {
  const wrapped = ((totalMinutes % 1440) + 1440) % 1440;
  const h = Math.floor(wrapped / 60);
  return h >= 9 && h < 17;
}

export function ConversionTable({ from, to, baseTime }: ConversionTableProps) {
  const fromOffset = getOffsetMinutes(from.timezone, baseTime);
  const toOffset = getOffsetMinutes(to.timezone, baseTime);
  const diffMinutes = toOffset - fromOffset;

  const rows = Array.from({ length: 24 }, (_, h) => {
    const fromMin = h * 60;
    const toMin = fromMin + diffMinutes;
    const dayDelta = Math.floor(toMin / 1440);
    return {
      fromMin,
      toMin,
      dayDelta,
      overlap: isBusinessHour(fromMin) && isBusinessHour(toMin),
    };
  });

  return (
    <section className="py-8">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
        Hour-by-hour conversion
      </h2>
      <p className="text-gray-400 mb-6">
        Each row shows the same instant in both cities. Rows where standard
        business hours (9:00–17:00) overlap in both locations are highlighted —
        these are the best windows to schedule meetings.
      </p>
      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="w-full text-sm">
          <thead className="bg-gray-900 text-gray-300">
            <tr>
              <th className="px-4 py-3 text-left font-medium">{from.name}</th>
              <th className="px-4 py-3 text-left font-medium">{to.name}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {rows.map((row) => {
              const dayLabel =
                row.dayDelta > 0
                  ? " (next day)"
                  : row.dayDelta < 0
                    ? " (prev day)"
                    : "";
              return (
                <tr
                  key={row.fromMin}
                  className={
                    row.overlap
                      ? "bg-emerald-950/40 text-white"
                      : "text-gray-300"
                  }
                >
                  <td className="px-4 py-2 tabular-nums">
                    {formatHourMin(row.fromMin)}
                  </td>
                  <td className="px-4 py-2 tabular-nums">
                    {formatHourMin(row.toMin)}
                    {dayLabel && (
                      <span className="ml-2 text-xs text-gray-500">
                        {dayLabel}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
