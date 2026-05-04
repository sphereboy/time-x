import dynamic from "next/dynamic";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AddCitiesFromQuery } from "@/components/AddCitiesFromQuery";

export const metadata = {
  title: "App",
  description:
    "Compare time zones across the world with visual day/night gradients.",
};

const TimeZoneComparer = dynamic(
  () =>
    import("@/components/TimeZoneComparer").then((mod) => mod.TimeZoneComparer),
  { ssr: false }
);

export default function AppPage() {
  return (
    <main className="min-h-screen md:h-screen md:overflow-hidden">
      <ErrorBoundary>
        <AddCitiesFromQuery />
        <TimeZoneComparer />
      </ErrorBoundary>
    </main>
  );
}
