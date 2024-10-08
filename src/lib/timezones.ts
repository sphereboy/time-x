import timezoneData from "@/data/timezones.json";

export interface Timezone {
  value: string;
  abbr: string;
  offset: number;
  isdst: boolean;
  text: string;
  utc: string[];
}

const timezones: Timezone[] = timezoneData;

export default timezones;

// Utility function to get a user-friendly name from the timezone text
export function getTimezoneName(timezone: Timezone | undefined): string {
  if (!timezone) return "";
  const match = timezone.text.match(/\(UTC[+-]\d{2}:\d{2}\)\s(.+)/);
  return match ? match[1] : timezone.text;
}

// Utility function to get the abbreviation, handling both standard and daylight saving time
export function getTimezoneAbbr(timezone: Timezone | undefined): string {
  return timezone?.abbr || "";
}

// Utility function to get the UTC offset as a string (e.g., "UTC+02:00")
export function getTimezoneOffsetString(
  timezone: Timezone | undefined
): string {
  if (!timezone) return "";
  const sign = timezone.offset >= 0 ? "+" : "-";
  const absOffset = Math.abs(timezone.offset);
  const hours = Math.floor(absOffset).toString().padStart(2, "0");
  const minutes = ((absOffset % 1) * 60).toString().padStart(2, "0");
  return `UTC${sign}${hours}:${minutes}`;
}

// Utility function to get the UTC offset, including DST
export function getTimezoneOffset(timezone: Timezone): number {
  const now = new Date();
  const utcDate = new Date(now.toUTCString());
  const tzDate = new Date(
    now.toLocaleString("en-US", { timeZone: timezone.utc[0] })
  );
  const diff = (tzDate.getTime() - utcDate.getTime()) / 3600000;
  return Math.round(diff);
}
