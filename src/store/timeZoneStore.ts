import { create } from "zustand";
import { persist } from "zustand/middleware";
// import { addHours } from "date-fns";

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
  addLocation: (location: Location) => void;
  removeLocation: (id: string) => void;
  updateLocation: (id: string, updates: Partial<Location>) => void;
  setCurrentTime: (time: Date) => void;
  initializeWithCurrentTimezone: () => void;
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
      locations: [getCurrentTimezone()], // Initialize with only the current timezone
      currentTime: new Date(),
      addLocation: (location) =>
        set((state) => {
          const exists = state.locations.some((loc) => loc.id === location.id);
          if (exists) return state;
          return { locations: [...state.locations, location] };
        }),
      removeLocation: (id) =>
        set((state) => ({
          locations: state.locations.filter((loc) => {
            return loc.id !== id || loc.isCurrent;
          }),
        })),
      updateLocation: (id, updates) =>
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
      setCurrentTime: (time) => set({ currentTime: time }),
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
    }),
    {
      name: "time-zone-storage",
      partialize: (state) => ({ locations: state.locations }),
    }
  )
);
