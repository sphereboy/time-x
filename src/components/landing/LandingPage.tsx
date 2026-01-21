"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Hero } from "./Hero";
import { Preview } from "./Preview";
import { Features } from "./Features";
import { Footer } from "./Footer";

const STORAGE_KEY = "time-zone-storage";

export function LandingPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if user has existing data (returning user)
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        // Check if they have more than just the default current location
        // or if they have customized settings
        const hasCustomData =
          data.state?.locations?.length > 1 ||
          data.state?.settings?.showSeconds !== false ||
          data.state?.settings?.use24HourFormat !== true;

        if (hasCustomData) {
          router.replace("/app");
          return;
        }
      }
    } catch {
      // If parsing fails, treat as new user
    }
    setIsChecking(false);
  }, [router]);

  // Show nothing while checking localStorage to avoid flash
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Hero />
      <Preview />
      <Features />
      <Footer />
    </div>
  );
}
