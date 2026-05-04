"use client";

import { useEffect } from "react";
import { useTimeZoneStore } from "@/store/timeZoneStore";
import { getCityBySlug } from "@/data/cities";

export function AddCitiesFromQuery() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("add");
    if (!raw) return;

    const slugs = raw
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
      .slice(0, 10);

    const apply = () => {
      const { addLocation } = useTimeZoneStore.getState();
      for (const slug of slugs) {
        const city = getCityBySlug(slug);
        if (city) addLocation(city.name, city.timezone);
      }
      const url = new URL(window.location.href);
      url.searchParams.delete("add");
      const cleaned = url.pathname + (url.search || "") + url.hash;
      window.history.replaceState(null, "", cleaned);
    };

    if (useTimeZoneStore.persist.hasHydrated()) {
      apply();
      return;
    }
    const unsub = useTimeZoneStore.persist.onFinishHydration(apply);
    return unsub;
  }, []);

  return null;
}
