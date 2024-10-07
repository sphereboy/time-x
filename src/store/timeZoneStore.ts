import { create } from "zustand";
import { persist } from "zustand/middleware";
import { addHours } from "date-fns";

interface Location {
  id: string;
  name: string;
  offset: number;
  label?: string;
  secondaryLabels?: string[];
}

interface TimeZoneState {
  locations: Location[];
  currentTime: Date;
  addLocation: (location: Location) => void;
  removeLocation: (id: string) => void;
  updateLocation: (id: string, updates: Partial<Location>) => void;
  setCurrentTime: (time: Date) => void;
}

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

export const useTimeZoneStore = create<TimeZoneState>()(
  persist(
    (set, get) => ({
      locations: initialLocations,
      currentTime: new Date(),
      addLocation: (location) =>
        set((state) => ({ locations: [...state.locations, location] })),
      removeLocation: (id) =>
        set((state) => ({
          locations: state.locations.filter((loc) => loc.id !== id),
        })),
      updateLocation: (id, updates) =>
        set((state) => ({
          locations: state.locations.map((loc) =>
            loc.id === id ? { ...loc, ...updates } : loc
          ),
        })),
      setCurrentTime: (time) => set({ currentTime: time }),
    }),
    {
      name: "time-zone-storage",
      partialize: (state) => ({ locations: state.locations }),
    }
  )
);
