import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { timeZoneMapping } from "@/components/TimeZoneComparer";

// Remove the import of zonedTimeToUtc

// ... (keep the rest of the imports and interfaces)

// Add this function to calculate timezone offset
const getTimezoneOffset = (timeZone: string): number => {
  const date = new Date();
  const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
  const tzDate = new Date(date.toLocaleString("en-US", { timeZone }));
  return (tzDate.getTime() - utcDate.getTime()) / 60000;
};

interface Location {
  id: string;
  name: string;
  offset: number;
  label?: string;
  secondaryLabels?: string[];
  isCurrent?: boolean;
}

interface TimeZoneState {
  locations: Location[];
  currentTime: Date;
  addLocation: (name: string, label: string) => void;
  removeLocation: (id: string) => void;
  updateLocation: (id: string, updates: Partial<Location>) => void;
  setCurrentTime: (time: Date) => void;
  initializeWithCurrentTimezone: () => void;
  resetToCurrentTimezone: () => void;
  sortLocations: (locations: Location[]) => Location[];
}

const getCurrentTimezone = (): Location => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return {
    id: "current",
    name: "Current Location",
    offset: 0, // This will be calculated dynamically
    label: timezone,
    isCurrent: true,
  };
};

export const useTimeZoneStore = create<TimeZoneState>()(
  persist(
    (set, get) => ({
      locations: [getCurrentTimezone()],
      currentTime: new Date(),
      addLocation: (name: string, label: string) => {
        set((state) => {
          // Check if the location already exists
          if (state.locations.some((loc) => loc.label === label)) {
            console.warn(`Location with label ${label} already exists.`);
            return state; // Return the current state without changes
          }

          const newLocation = {
            id: uuidv4(),
            name,
            label,
            offset: 0,
            isCurrent: false,
          };
          const updatedLocations = [...state.locations, newLocation];
          return { locations: state.sortLocations(updatedLocations) };
        });
      },
      removeLocation: (id: string) => {
        set((state) => ({
          locations: state.sortLocations(
            state.locations.filter((loc) => loc.id !== id)
          ),
        }));
      },
      updateLocation: (id: string, updates: Partial<Location>) => {
        set((state) => ({
          locations: state.sortLocations(
            state.locations.map((loc) =>
              loc.id === id ? { ...loc, ...updates } : loc
            )
          ),
        }));
      },
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
        const currentTimezone = getCurrentTimezone();
        set({ locations: [currentTimezone] });
      },
      sortLocations: (locations: Location[]) => {
        const homeLocation = locations.find((loc) => loc.isCurrent);
        if (!homeLocation) return locations;

        const homeOffset = getTimezoneOffset(homeLocation.label || "UTC");

        return locations.sort((a, b) => {
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
          offset: 0, // Reset offset to avoid storing calculated values
        })),
      }),
    }
  )
);
