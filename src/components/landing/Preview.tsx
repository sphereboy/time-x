"use client";

import { getBackgroundColor, isLightColor } from "@/lib/colors";

interface PreviewTimezone {
  city: string;
  timezone: string;
  hour: number;
}

const PREVIEW_TIMEZONES: PreviewTimezone[] = [
  { city: "New York", timezone: "America/New_York", hour: 8 },
  { city: "London", timezone: "Europe/London", hour: 13 },
  { city: "Tokyo", timezone: "Asia/Tokyo", hour: 22 },
];

export function Preview() {
  return (
    <section className="py-20 px-6 bg-gray-950">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
          See Time Come Alive
        </h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          Each timezone displays with colors that reflect the actual time of day
        </p>

        {/* Preview mock */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-0 rounded-2xl overflow-hidden shadow-2xl">
          {PREVIEW_TIMEZONES.map((tz) => {
            const bgColor = getBackgroundColor(tz.hour);
            const textColor = isLightColor(bgColor) ? "#393939" : "white";
            const hour12 = tz.hour > 12 ? tz.hour - 12 : tz.hour === 0 ? 12 : tz.hour;
            const amPm = tz.hour >= 12 ? "PM" : "AM";

            return (
              <div
                key={tz.city}
                className="flex-1 py-12 px-6 flex flex-col items-center justify-center transition-all"
                style={{ backgroundColor: bgColor, color: textColor }}
              >
                <div className="text-5xl md:text-6xl font-light tracking-tight mb-2">
                  {hour12.toString().padStart(2, "0")}
                  <span className="opacity-70">:</span>
                  00
                  <span className="text-2xl md:text-3xl ml-2 font-normal">
                    {amPm}
                  </span>
                </div>
                <div className="text-lg font-medium mt-4">{tz.city}</div>
                <div
                  className="text-sm mt-1"
                  style={{ opacity: 0.7 }}
                >
                  {tz.timezone}
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-gray-500 text-center mt-8 text-sm">
          Morning light in New York, afternoon glow in London, evening twilight in Tokyo
        </p>
      </div>
    </section>
  );
}
