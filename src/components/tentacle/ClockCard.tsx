import {
  formatTime,
  getAdjustedTime,
  getTimezoneAbbreviation,
} from "@/lib/timeFormatting";
import { getBackgroundColor, isLightColor } from "@/lib/colors";
import { getUtcOffsetString } from "@/data/cities";
import type { City } from "@/data/cities";

interface ClockCardProps {
  city: City;
  baseTime: Date;
  size?: "lg" | "md";
}

export function ClockCard({ city, baseTime, size = "lg" }: ClockCardProps) {
  const local = getAdjustedTime(baseTime, city.timezone);
  const fractionalHour = local.getHours() + local.getMinutes() / 60;
  const bgColor = getBackgroundColor(fractionalHour);
  const textColor = isLightColor(bgColor) ? "#1f2937" : "white";
  const abbr = getTimezoneAbbreviation(city.timezone, baseTime);
  const offset = getUtcOffsetString(city.timezone, baseTime);
  const time12 = formatTime(baseTime, city.timezone, {
    use24HourFormat: false,
  });
  const time24 = formatTime(baseTime, city.timezone, {
    use24HourFormat: true,
  });

  const timeClass =
    size === "lg"
      ? "text-5xl md:text-7xl"
      : "text-4xl md:text-5xl";

  return (
    <div
      className="rounded-2xl shadow-2xl overflow-hidden"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <div className="px-6 py-10 md:py-14 flex flex-col items-center text-center">
        <time
          dateTime={baseTime.toISOString()}
          className={`${timeClass} font-light tracking-tight tabular-nums`}
        >
          {time12}
        </time>
        <div className="mt-4 text-xl md:text-2xl font-medium">{city.name}</div>
        <div className="text-sm md:text-base mt-1" style={{ opacity: 0.8 }}>
          {city.country}
        </div>
        <div
          className="mt-4 text-xs md:text-sm uppercase tracking-wider"
          style={{ opacity: 0.7 }}
        >
          {abbr ? `${abbr} · ` : ""}
          {offset} · {time24}
        </div>
      </div>
    </div>
  );
}
