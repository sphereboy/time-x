import { create } from "zustand";
import { persist } from "zustand/middleware";
import { addHours } from "date-fns";

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

const initialLocations: Location[] = [
  { id: "1", name: "Los Angeles, USA", offset: -10, label: "PDT" },
  { id: "2", name: "Guadalajara, MEX", offset: -8, label: "CDT" },
  { id: "3", name: "Miami, USA", offset: -7, label: "EDT" },
  { id: "4", name: "Indrek P", offset: -3, label: "GMT" },
  {
    id: "5",
    name: "Lisbon, PRT",
    offset: -2,
    label: "WEST",
    secondaryLabels: ["London, GBR (BST)"],
  },
  {
    id: "6",
    name: "Tartu, EST",
    offset: 0,
    label: "EEST",
    secondaryLabels: ["Estonia (EEST)", "Eyüp (+03)"],
  },
  { id: "7", name: "Cebu", offset: 5, label: "PST" },
];

// Remove any 'current' location from initialLocations
const filteredInitialLocations = initialLocations.filter(
  (loc) => loc.id !== "current"
);

export const useTimeZoneStore = create<TimeZoneState>()(
  persist(
    (set, get) => ({
      locations: [getCurrentTimezone(), ...filteredInitialLocations],
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
            // Keep the location if it's not the one to be removed
            // or if it's the current timezone (isCurrent is true)
            return loc.id !== id || loc.isCurrent;
          }),
        })),
      updateLocation: (id, updates) =>
        set((state) => ({
          locations: state.locations.map((loc) =>
            loc.id === id ? { ...loc, ...updates } : loc
          ),
        })),
      setCurrentTime: (time) => set({ currentTime: time }),
      initializeWithCurrentTimezone: () => {
        const { locations } = get();
        const currentLocation = locations.find((loc) => loc.isCurrent);
        if (!currentLocation) {
          set((state) => ({
            locations: [
              getCurrentTimezone(),
              ...state.locations.filter((loc) => !loc.isCurrent),
            ],
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
