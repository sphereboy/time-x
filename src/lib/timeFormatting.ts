import { getMappedTimeZone } from "@/constants/timezoneMapping";
import { logger } from "./logger";

export const isValidTimeZone = (timeZone: string): boolean => {
  try {
    const mappedTimeZone = getMappedTimeZone(timeZone);
    Intl.DateTimeFormat(undefined, { timeZone: mappedTimeZone });
    return true;
  } catch {
    logger.warn(`Invalid time zone: ${timeZone}`);
    return false;
  }
};

export const getAdjustedTime = (baseTime: Date, timeZone: string): Date => {
  const mappedTimeZone = getMappedTimeZone(timeZone);
  try {
    return new Date(
      baseTime.toLocaleString("en-US", { timeZone: mappedTimeZone })
    );
  } catch {
    logger.warn(`Invalid time zone: ${timeZone}. Using local time instead.`);
    return new Date(baseTime);
  }
};

interface FormatTimeOptions {
  showSeconds?: boolean;
  use24HourFormat?: boolean;
}

export const formatTime = (
  date: Date,
  timeZone: string,
  options: FormatTimeOptions = {}
): string => {
  const { showSeconds = false, use24HourFormat = true } = options;
  const mappedTimeZone = getMappedTimeZone(timeZone);

  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: mappedTimeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: showSeconds ? "2-digit" : undefined,
      hour12: !use24HourFormat,
    }).format(date);
  } catch {
    logger.warn(
      `Invalid time zone: ${timeZone}. Using local time format instead.`
    );
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: showSeconds ? "2-digit" : undefined,
      hour12: !use24HourFormat,
    });
  }
};

export const getTimezoneAbbreviation = (
  timeZone: string,
  date: Date
): string => {
  const mappedTimeZone = getMappedTimeZone(timeZone);
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: mappedTimeZone,
      timeZoneName: "short",
    });
    const parts = formatter.formatToParts(date);
    const timeZonePart = parts.find((part) => part.type === "timeZoneName");
    return timeZonePart?.value || "";
  } catch {
    logger.warn(`Error getting timezone abbreviation for ${timeZone}`);
    return "";
  }
};
