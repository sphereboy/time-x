import { create } from "zustand";
import { persist } from "zustand/middleware";
// import { addHours } from "date-fns";

// Add this function at the top of the file, after the imports
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
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

// Import the timeZoneMapping here or define it in this file
const timeZoneMapping: { [key: string]: string } = {
  "Hawaiian Standard Time": "Pacific/Honolulu",
  "Alaskan Standard Time": "America/Anchorage",
  "Pacific Standard Time": "America/Los_Angeles",
  "Mountain Standard Time": "America/Denver",
  "Central Standard Time": "America/Chicago",
  "Eastern Standard Time": "America/New_York",
  // Add more mappings as needed
};

export const useTimeZoneStore = create<TimeZoneState>()(
  persist(
    (set, get) => ({
      locations: [getCurrentTimezone()],
      currentTime: new Date(),
      addLocation: (name: string, label: string) =>
        set((state) => {
          const newLocation: Location = {
            id: generateId(),
            name,
            label,
            offset: 0,
            isCurrent: false,
          };
          return { locations: [...state.locations, newLocation] };
        }),
      removeLocation: (id: string) =>
        set((state) => ({
          locations: state.locations.filter(
            (loc) => loc.id !== id || loc.isCurrent
          ),
        })),
      updateLocation: (id: string, updates: Partial<Location>) =>
        set((state) => {
          const location = state.locations.find((loc) => loc.id === id);
          if (!location) return state;
          const updatedLocation = { ...location, ...updates };
          if (JSON.stringify(location) === JSON.stringify(updatedLocation)) {
            return state;
          }
          return {
            locations: state.locations.map((loc) =>
              loc.id === id ? updatedLocation : loc
            ),
          };
        }),
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
