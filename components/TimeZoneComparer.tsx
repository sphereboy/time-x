"use client";

import { useEffect, useState } from "react";

interface Location {
  id: string;
  name: string;
  label: string;
  offset: number;
  isCurrent: boolean;
}

export function TimeZoneComparer() {
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const newLocations = [
      {
        id: "e169c493-c2c2-4761-94ba-ee105a731076",
        name: "Alaskan Standard Time",
        label: "America/Anchorage",
        offset: 0,
        isCurrent: false,
      },
      {
        id: "current",
        name: "Current Location",
        offset: 0,
        label: currentTimeZone,
        isCurrent: true,
      },
    ];

    setLocations(newLocations);
  }, []);

  // Add loading state
  if (locations.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {locations.map((location) => (
        <div key={location.id}>{location.label}</div>
      ))}
    </div>
  );
}
