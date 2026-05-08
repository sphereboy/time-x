import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AddCitiesFromQuery } from "@/components/AddCitiesFromQuery";
import { TimeZoneComparer } from "./TimeZoneComparerClient";

export const metadata = {
  title: "App",
  description:
    "Compare time zones across the world with visual day/night gradients.",
};

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
