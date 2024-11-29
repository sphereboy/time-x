import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { TimeZoneLocation } from "@/types/Location";

const getTimezoneOffset = (timeZone: string): number => {
  const date = new Date();
  const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
  const tzDate = new Date(date.toLocaleString("en-US", { timeZone }));
  return (tzDate.getTime() - utcDate.getTime()) / 60000;
};

interface TimeZoneState {
  locations: TimeZoneLocation[];
  currentTime: Date;
  addLocation: (name: string, label: string) => void;
  removeLocation: (id: string) => void;
  updateLocation: (id: string, updates: Partial<TimeZoneLocation>) => void;
  setCurrentTime: (time: Date) => void;
  initializeWithCurrentTimezone: () => void;
  resetToCurrentTimezone: () => void;
  sortLocations: (locations: TimeZoneLocation[]) => TimeZoneLocation[];
}

const getCurrentTimezone = (): TimeZoneLocation => ({
  id: "current",
  name: "Current Location",
  offset: 0,
  label: Intl.DateTimeFormat().resolvedOptions().timeZone,
  isCurrent: true,
});

export const useTimeZoneStore = create<TimeZoneState>()(
  persist(
    (set, get) => ({
      locations: [getCurrentTimezone()],
      currentTime: new Date(),
      addLocation: (name: string, label: string) => {
        set((state) => {
          if (state.locations.some((loc) => loc.label === label)) {
            return state;
          }

          const newLocation: TimeZoneLocation = {
            id: uuidv4(),
            name,
            label,
            offset: 0,
            isCurrent: false,
          };
          const updatedLocations = [...state.locations, newLocation];
          return { locations: get().sortLocations(updatedLocations) };
        });
      },
      removeLocation: (id: string) =>
        set((state) => ({
          locations: get().sortLocations(
            state.locations.filter((loc) => loc.id !== id)
          ),
        })),
      updateLocation: (id: string, updates: Partial<TimeZoneLocation>) =>
        set((state) => ({
          locations: get().sortLocations(
            state.locations.map((loc) =>
              loc.id === id ? { ...loc, ...updates } : loc
            )
          ),
        })),
      setCurrentTime: (time: Date) => set({ currentTime: time }),
      initializeWithCurrentTimezone: () => {
        const { locations } = get();
        if (locations.length === 0) {
          set({ locations: [getCurrentTimezone()] });
        } else if (!locations.some((loc) => loc.isCurrent)) {
          set((state) => ({
            locations: [getCurrentTimezone(), ...state.locations],
          }));
        }
      },
      resetToCurrentTimezone: () => {
        set({ locations: [getCurrentTimezone()] });
      },
      sortLocations: (locations: TimeZoneLocation[]) => {
        const homeLocation = locations.find((loc) => loc.isCurrent);
        if (!homeLocation) return locations;

        const homeOffset = getTimezoneOffset(homeLocation.label || "UTC");
        return [...locations].sort((a, b) => {
          const aOffset = getTimezoneOffset(a.label || "UTC") - homeOffset;
          const bOffset = getTimezoneOffset(b.label || "UTC") - homeOffset;
          return aOffset - bOffset;
        });
      },
    }),
    {
      name: "time-zone-storage",
      partialize: (state) => ({
        locations: state.locations.map((loc) => ({
          ...loc,
          offset: 0,
        })),
      }),
    }
  )
);
