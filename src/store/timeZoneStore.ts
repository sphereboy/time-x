import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TimeZoneLocation } from "@/types/Location";
import { VALIDATION_LIMITS } from "@/lib/validation";

const isValidLocation = (loc: unknown): loc is TimeZoneLocation => {
  if (!loc || typeof loc !== "object") return false;
  const l = loc as Record<string, unknown>;
  return (
    typeof l.id === "string" &&
    l.id.length > 0 &&
    l.id.length <= 100 &&
    typeof l.name === "string" &&
    l.name.length <= VALIDATION_LIMITS.LOCATION_NAME_MAX_LENGTH &&
    typeof l.label === "string" &&
    l.label.length <= VALIDATION_LIMITS.LABEL_MAX_LENGTH &&
    typeof l.offset === "number" &&
    typeof l.isCurrent === "boolean" &&
    (l.secondaryLabels === undefined ||
      (Array.isArray(l.secondaryLabels) &&
        l.secondaryLabels.every(
          (s) =>
            typeof s === "string" &&
            s.length <= VALIDATION_LIMITS.LABEL_MAX_LENGTH
        )))
  );
};

const sanitizeLocations = (
  locations: unknown[]
): TimeZoneLocation[] => {
  if (!Array.isArray(locations)) return [];
  return locations
    .filter(isValidLocation)
    .map((loc) => ({
      ...loc,
      name: loc.name.slice(0, VALIDATION_LIMITS.LOCATION_NAME_MAX_LENGTH),
      label: loc.label.slice(0, VALIDATION_LIMITS.LABEL_MAX_LENGTH),
      secondaryLabels: loc.secondaryLabels?.map((s) =>
        s.slice(0, VALIDATION_LIMITS.LABEL_MAX_LENGTH)
      ),
    }));
};

const getTimezoneOffset = (timeZone: string): number => {
  const date = new Date();
  const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
  const tzDate = new Date(date.toLocaleString("en-US", { timeZone }));
  return (tzDate.getTime() - utcDate.getTime()) / 60000;
};

type ThemeMode = "light" | "dark" | "system";

interface Settings {
  showSeconds: boolean;
  use24HourFormat: boolean;
  showTimezoneAbbreviation: boolean;
  theme: ThemeMode;
}

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
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
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
            id: crypto.randomUUID(),
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
      settings: {
        showSeconds: false,
        use24HourFormat: true,
        showTimezoneAbbreviation: true,
        theme: "system",
      },
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: {
            ...state.settings,
            ...newSettings,
          },
        })),
    }),
    {
      name: "time-zone-storage",
      partialize: (state) => ({
        locations: state.locations.map((loc) => ({
          ...loc,
          offset: 0,
        })),
        settings: state.settings,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.locations = sanitizeLocations(state.locations);
          if (state.locations.length === 0) {
            state.locations = [getCurrentTimezone()];
          }
        }
      },
    }
  )
);
