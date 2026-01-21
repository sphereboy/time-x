"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { format } from "date-fns";
import { Plus, Trash2, Home, RotateCcw } from "lucide-react";
import styles from "@/styles/TimeZoneComparer.module.css";
import { useTimeZoneStore } from "@/store/timeZoneStore";
import { AddLocationDialog } from "@/components/AddLocationDialog";
import { SettingsDialog } from "@/components/Settings";
import { VALIDATION_LIMITS, sanitizeInput } from "@/lib/validation";
import { getBackgroundColor, isLightColor } from "@/lib/colors";
import {
  isValidTimeZone,
  getAdjustedTime as getAdjustedTimeUtil,
  formatTime as formatTimeUtil,
  getTimezoneAbbreviation as getTimezoneAbbreviationUtil,
} from "@/lib/timeFormatting";
import { timeZoneMapping } from "@/constants/timezoneMapping";

export { timeZoneMapping };

export function TimeZoneComparer(): React.ReactElement {
  const {
    locations,
    settings,
    removeLocation,
    updateLocation,
    initializeWithCurrentTimezone,
    setCurrentTime,
    resetToCurrentTimezone,
  } = useTimeZoneStore();

  const [currentTime, setLocalCurrentTime] = useState<Date>(new Date());
  const [editingHour, setEditingHour] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [editingLabel, setEditingLabel] = useState<{
    id: string;
    index: number;
  } | null>(null);
  const [labelInputValue, setLabelInputValue] = useState("");
  const [newLabelInput, setNewLabelInput] = useState<{
    id: string;
    value: string;
  } | null>(null);
  const [showColon, setShowColon] = useState(true);
  const [isManuallyAdjusted, setIsManuallyAdjusted] = useState(false);

  // Initialize timezone once
  useEffect(() => {
    initializeWithCurrentTimezone();
  }, [initializeWithCurrentTimezone]);

  // Update time every second or half second when showing seconds
  useEffect(() => {
    const updateTime = () => {
      if (!isManuallyAdjusted) {
        const newTime = new Date();
        setLocalCurrentTime(newTime);
        setCurrentTime(newTime);
      }
    };

    updateTime();
    const timer = setInterval(updateTime, settings.showSeconds ? 500 : 1000);
    return () => clearInterval(timer);
  }, [setCurrentTime, isManuallyAdjusted, settings.showSeconds]);

  // Blink colon
  useEffect(() => {
    const colonInterval = setInterval(() => {
      setShowColon((prev) => !prev);
    }, 500);
    return () => clearInterval(colonInterval);
  }, []);

  const getAdjustedTime = useCallback((baseTime: Date, timeZone: string) => {
    return getAdjustedTimeUtil(baseTime, timeZone);
  }, []);

  const formatTime = useCallback(
    (date: Date, timeZone: string) => {
      return formatTimeUtil(date, timeZone, {
        showSeconds: settings.showSeconds,
        use24HourFormat: settings.use24HourFormat,
      });
    },
    [settings.use24HourFormat, settings.showSeconds]
  );

  const handleHourChange = useCallback(
    (_locationId: string, newHour: string) => {
      const parsedHour = parseInt(newHour, 10);
      const maxHour = settings.use24HourFormat ? 23 : 12;

      if (!isNaN(parsedHour) && parsedHour >= 0 && parsedHour <= maxHour) {
        const newDate = new Date(currentTime);
        if (!settings.use24HourFormat) {
          // Convert 12h format to 24h for internal storage
          const currentHour = currentTime.getHours();
          const isPM = currentHour >= 12;
          const newHour24 = isPM
            ? parsedHour === 12
              ? 12
              : parsedHour + 12
            : parsedHour === 12
            ? 0
            : parsedHour;
          newDate.setHours(newHour24);
        } else {
          newDate.setHours(parsedHour);
        }
        setLocalCurrentTime(newDate);
        setCurrentTime(newDate);
        setIsManuallyAdjusted(true);
      }
      setEditingHour(null);
      setInputValue("");
    },
    [currentTime, setCurrentTime, settings.use24HourFormat]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const maxHour = settings.use24HourFormat ? 23 : 12;
      if (
        value === "" ||
        (parseInt(value) >= 0 && parseInt(value) <= maxHour)
      ) {
        setInputValue(value);
      }
    },
    [settings.use24HourFormat]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, locationId: string) => {
      if (e.key === "Enter") {
        handleHourChange(locationId, inputValue);
      } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        const currentHour = currentTime.getHours();
        const newHour =
          e.key === "ArrowUp"
            ? (currentHour + 1) % 24
            : (currentHour - 1 + 24) % 24;
        const newDate = new Date(currentTime);
        newDate.setHours(newHour);
        setLocalCurrentTime(newDate);
        setCurrentTime(newDate);
        setInputValue(newHour.toString().padStart(2, "0"));
      }
    },
    [handleHourChange, inputValue, currentTime, setCurrentTime]
  );

  const handleAddCustomLabel = useCallback((locationId: string) => {
    setNewLabelInput({ id: locationId, value: "" });
  }, []);

  const handleNewLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (newLabelInput) {
      setNewLabelInput({ ...newLabelInput, value: e.target.value });
    }
  };

  const handleNewLabelSubmit = (locationId: string) => {
    if (newLabelInput && newLabelInput.value.trim()) {
      const location = locations.find((loc) => loc.id === locationId);
      if (location) {
        const sanitizedLabel = sanitizeInput(newLabelInput.value);
        if (sanitizedLabel) {
          const updatedLabels = location.secondaryLabels
            ? [...location.secondaryLabels, sanitizedLabel]
            : [sanitizedLabel];
          updateLocation(locationId, { secondaryLabels: updatedLabels });
        }
      }
    }
    setNewLabelInput(null);
  };

  const handleRemoveLocation = useCallback(
    (id: string) => {
      const locationToRemove = locations.find((loc) => loc.id === id);
      if (locationToRemove && !locationToRemove.isCurrent) {
        removeLocation(id);
      }
    },
    [locations, removeLocation]
  );

  const handleLabelChange = (locationId: string, index: number) => {
    const location = locations.find((loc) => loc.id === locationId);
    if (location) {
      const updatedLabels = [...(location.secondaryLabels || [])];
      const sanitizedLabel = sanitizeInput(labelInputValue);
      if (sanitizedLabel === "") {
        // Remove the label if it's empty
        updatedLabels.splice(index, 1);
      } else {
        updatedLabels[index] = sanitizedLabel;
      }
      updateLocation(locationId, { secondaryLabels: updatedLabels });
    }
    setEditingLabel(null);
    setLabelInputValue("");
  };

  const handleLabelClick = (
    locationId: string,
    index: number,
    currentLabel: string
  ) => {
    setEditingLabel({ id: locationId, index });
    setLabelInputValue(currentLabel);
  };

  // Add this new handler for resetting only the time
  const handleTimeReset = useCallback(() => {
    const newTime = new Date();
    setLocalCurrentTime(newTime);
    setCurrentTime(newTime);
    setIsManuallyAdjusted(false);
  }, [setCurrentTime]);

  // Add this function to handle resetting
  const handleReset = useCallback(() => {
    resetToCurrentTimezone();
    setIsManuallyAdjusted(false);
    const newTime = new Date();
    setLocalCurrentTime(newTime);
    setCurrentTime(newTime);
  }, [resetToCurrentTimezone, setCurrentTime]);

  // Memoize sorted locations to prevent unnecessary re-renders
  const sortedLocations = useMemo(() => locations, [locations]);

  const hourInputStyles = {
    width: "2ch",
    background: "transparent",
    border: "none",
    color: "inherit",
    fontSize: "inherit",
    fontFamily: "inherit",
    textAlign: "center" as const,
    padding: 0,
    outline: "none",
    position: "relative" as const,
    zIndex: 2,
  };

  const getTimezoneAbbreviation = useCallback(
    (timeZone: string, date: Date): string => {
      return getTimezoneAbbreviationUtil(timeZone, date);
    },
    []
  );

  if (!currentTime) {
    return <div>Loading...</div>;
  }

  // Calculate button colors based on first location's background
  const firstLocation = sortedLocations[0];
  const firstLocationTime = firstLocation
    ? formatTime(currentTime, firstLocation.label || "")
    : "12:00";
  const firstHour = parseInt(firstLocationTime.split(":")[0], 10);
  const firstBgColor = getBackgroundColor(firstHour);
  const buttonTextColor = isLightColor(firstBgColor) ? "#393939" : "white";
  const buttonBgColor = isLightColor(firstBgColor)
    ? "rgba(0, 0, 0, 0.1)"
    : "rgba(255, 255, 255, 0.1)";
  const buttonBorderColor = isLightColor(firstBgColor)
    ? "rgba(0, 0, 0, 0.2)"
    : "rgba(255, 255, 255, 0.2)";

  return (
    <div
      className={styles.container}
      style={{
        "--button-color": buttonTextColor,
        "--button-bg": buttonBgColor,
        "--button-border": buttonBorderColor,
      } as React.CSSProperties}
    >
      <div className={styles.topButtons}>
        <AddLocationDialog>
          <button className={styles.addButton} aria-label="Add location">
            <Plus size={20} />
          </button>
        </AddLocationDialog>
        {isManuallyAdjusted && (
          <button
            className={styles.resetTimeButton}
            onClick={handleTimeReset}
            aria-label="Reset to current time"
          >
            Reset Time
          </button>
        )}
        <SettingsDialog />
        <button
          className={styles.resetButton}
          onClick={handleReset}
          aria-label="Reset locations"
        >
          <RotateCcw size={20} />
        </button>
      </div>
      <div className={styles.timezonesContainer}>
        {sortedLocations.map((location) => {
          const adjustedTime = getAdjustedTime(
            currentTime,
            location.label || ""
          );
          const formattedTime = formatTime(currentTime, location.label || "");
          const [timeWithoutAmPm, amPm] = formattedTime.split(" ");
          const [hours, minutes, seconds] = timeWithoutAmPm.split(":");
          const localHour = parseInt(hours, 10);
          const backgroundColor = getBackgroundColor(localHour);
          const isCurrentTimezone = location.isCurrent;
          const textColor = isLightColor(backgroundColor) ? "#393939" : "white";

          return (
            <div
              key={location.id}
              className={styles.timezoneColumn}
              style={{
                backgroundColor,
                color: textColor,
              }}
            >
              {!location.isCurrent && (
                <div className={styles.deleteIconWrapper}>
                  <button
                    onClick={() => handleRemoveLocation(location.id)}
                    className={styles.deleteButton}
                    aria-label="Delete location"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
              <div className={styles.timeContent}>
                <div className={styles.time}>
                  <div className={styles.hourMinuteWrapper}>
                    <div className={styles.hourInputWrapper}>
                      {editingHour === location.id ? (
                        <div style={{ position: "relative" }}>
                          <input
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            onBlur={() =>
                              handleHourChange(location.id, inputValue)
                            }
                            onKeyDown={(e) => handleKeyDown(e, location.id)}
                            style={hourInputStyles}
                            maxLength={2}
                            autoFocus
                          />
                          {!inputValue && (
                            <div className={styles.placeholderHour}>
                              {hours}
                            </div>
                          )}
                        </div>
                      ) : (
                        <button
                          type="button"
                          className={styles.hours}
                          onClick={() => {
                            setEditingHour(location.id);
                            setInputValue("");
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setEditingHour(location.id);
                              setInputValue("");
                            }
                          }}
                          aria-label={`Edit hour, currently ${hours}`}
                        >
                          {hours}
                        </button>
                      )}
                    </div>
                    <div className={styles.colonWrapper}>
                      <div
                        className={`${styles.colon} ${
                          showColon ? styles.visible : styles.hidden
                        }`}
                      >
                        :
                      </div>
                    </div>
                    <div className={styles.minutes}>{minutes}</div>
                    {settings.showSeconds && (
                      <>
                        <div className={styles.colonWrapper}>
                          <div
                            className={`${styles.colon} ${
                              showColon ? styles.visible : styles.hidden
                            }`}
                          >
                            :
                          </div>
                        </div>
                        <div className={styles.seconds}>{seconds}</div>
                      </>
                    )}
                    {!settings.use24HourFormat && (
                      <div className={styles.amPm}>{amPm}</div>
                    )}
                  </div>
                </div>
                <div className={styles.date}>
                  {format(adjustedTime, "EEE. do")}
                </div>
                <div className={styles.location}>
                  {location.name || "Unknown"}
                </div>
                <div className={styles.timezone}>
                  {location.label || "Unknown"}
                  {settings.showTimezoneAbbreviation && (
                    <span className={styles.timezoneAbbreviation}>
                      (
                      {getTimezoneAbbreviation(
                        location.label || "",
                        currentTime
                      )}
                      )
                    </span>
                  )}
                </div>
                {location.secondaryLabels &&
                  Array.isArray(location.secondaryLabels) && (
                    <div className={styles.secondaryLabels}>
                      {location.secondaryLabels.map((label, i) => (
                        <div key={i} className={styles.secondaryLabelWrapper}>
                          {editingLabel?.id === location.id &&
                          editingLabel.index === i ? (
                            <input
                              type="text"
                              value={labelInputValue}
                              onChange={(e) =>
                                setLabelInputValue(e.target.value)
                              }
                              onBlur={() => handleLabelChange(location.id, i)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter")
                                  handleLabelChange(location.id, i);
                                if (e.key === "Escape") setEditingLabel(null);
                              }}
                              className={styles.labelInput}
                              maxLength={VALIDATION_LIMITS.LABEL_MAX_LENGTH}
                            />
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                handleLabelClick(location.id, i, label)
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  handleLabelClick(location.id, i, label);
                                }
                              }}
                              className={styles.labelText}
                              aria-label={`Edit label: ${label}`}
                            >
                              {label}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                {newLabelInput && newLabelInput.id === location.id ? (
                  <div className={styles.newLabelInputWrapper}>
                    <input
                      type="text"
                      value={newLabelInput.value}
                      onChange={handleNewLabelChange}
                      onBlur={() => handleNewLabelSubmit(location.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter")
                          handleNewLabelSubmit(location.id);
                        if (e.key === "Escape") setNewLabelInput(null);
                      }}
                      className={styles.newLabelInput}
                      placeholder="New label"
                      autoFocus
                      maxLength={VALIDATION_LIMITS.LABEL_MAX_LENGTH}
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => handleAddCustomLabel(location.id)}
                    className={styles.addCustomLabelButton}
                    aria-label="Add custom label"
                  >
                    <Plus size={16} />
                  </button>
                )}
              </div>
              <div className={styles.footer}>
                {isCurrentTimezone && (
                  <div className={styles.homeIconWrapper}>
                    <Home size={20} />
                  </div>
                )}
                <div className={styles.offset}>
                  {(() => {
                    if (isValidTimeZone(location.label || "")) {
                      const abbreviation = getTimezoneAbbreviation(
                        location.label || "",
                        currentTime
                      );
                      return settings.showTimezoneAbbreviation
                        ? abbreviation
                        : "";
                    }
                    return "Invalid TZ";
                  })()}
                </div>
                {isCurrentTimezone && (
                  <div className={styles.utcReference}>
                    {formatTime(currentTime, "UTC")} UTC
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {locations.length === 1 && (
        <div className={styles.addLocationPrompt}>
          <p>Add more locations to compare timezones</p>
          <AddLocationDialog>
            <button className={styles.addButton}>Add Location</button>
          </AddLocationDialog>
        </div>
      )}
    </div>
  );
}
