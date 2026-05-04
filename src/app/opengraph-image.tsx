import { ImageResponse } from "next/og";
import { getBackgroundColor } from "@/lib/colors";

export const runtime = "edge";
export const alt = "TZGrid — Compare Time Zones at a Glance";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SAMPLE_CLOCKS = [
  { city: "Los Angeles", tz: "PST", hour: 6, time: "06:42" },
  { city: "London", tz: "GMT", hour: 14, time: "14:42" },
  { city: "Tokyo", tz: "JST", hour: 22, time: "22:42" },
];

export default async function OpengraphImage() {
  const displayFont = await fetch(
    new URL("./fonts/PPRader-Medium.woff", import.meta.url)
  ).then((res) => res.arrayBuffer());

  const morning = getBackgroundColor(SAMPLE_CLOCKS[0].hour);
  const day = getBackgroundColor(SAMPLE_CLOCKS[1].hour);
  const night = getBackgroundColor(SAMPLE_CLOCKS[2].hour);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: `linear-gradient(120deg, ${morning} 0%, ${day} 50%, ${night} 100%)`,
          position: "relative",
          fontFamily: "PPRader",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0, 0, 0, 0.18)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: "72px 80px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 16,
              color: "white",
            }}
          >
            <div style={{ fontSize: 64, fontWeight: 700, letterSpacing: -2 }}>
              TZGrid
            </div>
            <div style={{ fontSize: 24, opacity: 0.75 }}>
              www.tzgrid.com
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 32,
              width: "100%",
              justifyContent: "center",
            }}
          >
            {SAMPLE_CLOCKS.map((clock) => {
              const bg = getBackgroundColor(clock.hour);
              return (
                <div
                  key={clock.city}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 280,
                    height: 320,
                    borderRadius: 28,
                    background: bg,
                    color: "white",
                    boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 96,
                      fontWeight: 600,
                      letterSpacing: -3,
                      lineHeight: 1,
                    }}
                  >
                    {clock.time}
                  </div>
                  <div
                    style={{
                      fontSize: 26,
                      marginTop: 24,
                      opacity: 0.95,
                    }}
                  >
                    {clock.city}
                  </div>
                  <div
                    style={{
                      fontSize: 18,
                      marginTop: 6,
                      opacity: 0.7,
                      letterSpacing: 1,
                    }}
                  >
                    {clock.tz}
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 32,
              color: "white",
              opacity: 0.92,
              fontWeight: 300,
              letterSpacing: -0.5,
              textAlign: "center",
            }}
          >
            Compare time zones at a glance with day &amp; night gradients
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "PPRader",
          data: displayFont,
          style: "normal",
          weight: 500,
        },
      ],
    }
  );
}
