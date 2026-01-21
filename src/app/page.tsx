import dynamic from "next/dynamic";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const metadata = {
  title: "Time-X | Compare Time Zones",
};

const TimeZoneComparer = dynamic(
  () =>
    import("@/components/TimeZoneComparer").then((mod) => mod.TimeZoneComparer),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="h-screen overflow-hidden">
      <ErrorBoundary>
        <TimeZoneComparer />
      </ErrorBoundary>
    </main>
  );
}
