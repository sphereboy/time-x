"use client";

import React, { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { Plus, Trash2, Home } from "lucide-react";
import styles from "@/styles/TimeZoneComparer.module.css";
import { useTimeZoneStore } from "@/store/timeZoneStore";
import { AddLocationDialog } from "@/components/AddLocationDialog";
import timezones from "@/lib/timezones";

// Add this mapping at the top of your file, after the imports
const timeZoneMapping: { [key: string]: string } = {};

timezones.forEach((tz) => {
  timeZoneMapping[tz.abbr] = tz.value;
  timeZoneMapping[tz.text] = tz.value;
});

// Add any additional mappings that might be necessary
Object.assign(timeZoneMapping, {
  "Hawaiian Standard Time": "Pacific/Honolulu",
  "Alaskan Standard Time": "America/Anchorage",
  "Pacific Standard Time": "America/Los_Angeles",
  "Mountain Standard Time": "America/Denver",
  "Central Standard Time": "America/Chicago",
  "Eastern Standard Time": "America/New_York",
  // Add any other necessary mappings here
});

const getBackgroundColor = (hour: number): string => {
  const colors = [
    { time: 0, color: "#16053a" },
    { time: 1, color: "#040B1D" },
    { time: 2, color: "#030c1b" },
    { time: 3, color: "#040F21" },
    { time: 4, color: "#081930" },
    { time: 5, color: "#1b475b" },
    { time: 6, color: "#477a88" },
    { time: 7, color: "#69aab1" },
    { time: 8, color: "#93c6bc" },
    { time: 9, color: "#c1dabe" },
    { time: 10, color: "#e9ebb5" },
    { time: 11, color: "#F5EB9F" },
    { time: 12, color: "#f9e886" },
    { time: 13, color: "#FEE56D" },
    { time: 14, color: "#fbcf63" },
    { time: 15, color: "#F7B45B" },
    { time: 16, color: "#f29b55" },
    { time: 17, color: "#d37d5c" },
    { time: 18, color: "#9a626a" },
    { time: 19, color: "#6a4277" },
    { time: 20, color: "#4D2971" },
    { time: 21, color: "#2d1852" },
    { time: 22, color: "#301755" },
    { time: 23, color: "#0C052C" },
    { time: 24, color: "#16053a" }, // Repeat the first color for a smooth 24-hour cycle
  ];

  const getColorComponent = (
    start: number,
    end: number,
    ratio: number
  ): number => {
    return Math.round(start + (end - start) * ratio);
  };

  const interpolateColor = (
    color1: string,
    color2: string,
    ratio: number
  ): string => {
    const r1 = parseInt(color1.slice(1, 3), 16);
    const g1 = parseInt(color1.slice(3, 5), 16);
    const b1 = parseInt(color1.slice(5, 7), 16);
    const r2 = parseInt(color2.slice(1, 3), 16);
    const g2 = parseInt(color2.slice(3, 5), 16);
    const b2 = parseInt(color2.slice(5, 7), 16);

    const r = getColorComponent(r1, r2, ratio);
    const g = getColorComponent(g1, g2, ratio);
    const b = getColorComponent(b1, b2, ratio);

    return `#${r.toString(16).padStart(2, "0")}${g
      .toString(16)
      .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  };

  for (let i = 0; i < colors.length - 1; i++) {
    if (hour >= colors[i].time && hour <= colors[i + 1].time) {
      const ratio =
        (hour - colors[i].time) / (colors[i + 1].time - colors[i].time);
      return interpolateColor(colors[i].color, colors[i + 1].color, ratio);
    }
  }

  // Fallback color if something goes wrong
  return "#000000";
};

const isLightColor = (color: string): boolean => {
  const hex = color.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 155; // You can adjust this threshold as needed
};

const isValidTimeZone = (timeZone: string): boolean => {
  try {
    const mappedTimeZone = timeZoneMapping[timeZone] || timeZone;
    Intl.DateTimeFormat(undefined, { timeZone: mappedTimeZone });
    return true;
  } catch (error) {
    console.warn(`Invalid time zone: ${timeZone}`);
    return false;
  }
};

export function TimeZoneComparer(): React.ReactElement {
  const {
    locations,
    removeLocation,
    updateLocation,
    initializeWithCurrentTimezone,
    setCurrentTime,
    resetToCurrentTimezone, // Add this line
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

  useEffect(() => {
    initializeWithCurrentTimezone();
  }, [initializeWithCurrentTimezone]);

  useEffect(() => {
    const updateTime = () => {
      const newTime = new Date();
      setLocalCurrentTime(newTime);
      setCurrentTime(newTime);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, [setCurrentTime]);

  useEffect(() => {
    const colonInterval = setInterval(() => {
      setShowColon((prev) => !prev);
    }, 500);

    return () => clearInterval(colonInterval);
  }, []);

  const getAdjustedTime = useCallback((baseTime: Date, timeZone: string) => {
    const mappedTimeZone = timeZoneMapping[timeZone] || timeZone;
    if (isValidTimeZone(mappedTimeZone)) {
      return new Date(
        baseTime.toLocaleString("en-US", { timeZone: mappedTimeZone })
      );
    }
    console.warn(`Invalid time zone: ${timeZone}. Using local time instead.`);
    return new Date(baseTime);
  }, []);

  const formatTime = useCallback((date: Date, timeZone: string) => {
    const mappedTimeZone = timeZoneMapping[timeZone] || timeZone;
    if (isValidTimeZone(mappedTimeZone)) {
      return new Intl.DateTimeFormat("en-US", {
        timeZone: mappedTimeZone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(date);
    }
    console.warn(
      `Invalid time zone: ${timeZone}. Using local time format instead.`
    );
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }, []);

  const handleHourChange = useCallback(
    (locationId: string, newHour: string) => {
      const parsedHour = parseInt(newHour, 10);
      if (!isNaN(parsedHour) && parsedHour >= 0 && parsedHour <= 23) {
        const newDate = new Date(currentTime);
        newDate.setHours(parsedHour);
        setLocalCurrentTime(newDate);
        setCurrentTime(newDate);
      }
      setEditingHour(null);
      setInputValue("");
    },
    [currentTime, setCurrentTime]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === "" || (parseInt(value) >= 0 && parseInt(value) <= 23)) {
        setInputValue(value);
      }
    },
    []
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
        const updatedLabels = location.secondaryLabels
          ? [...location.secondaryLabels, newLabelInput.value.trim()]
          : [newLabelInput.value.trim()];
        updateLocation(locationId, { secondaryLabels: updatedLabels });
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
      if (labelInputValue.trim() === "") {
        // Remove the label if it's empty
        updatedLabels.splice(index, 1);
      } else {
        updatedLabels[index] = labelInputValue.trim();
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

  // Add this function to handle resetting
  const handleReset = useCallback(() => {
    resetToCurrentTimezone();
  }, [resetToCurrentTimezone]);

  console.log("Locations:", JSON.stringify(locations, null, 2));

  if (!currentTime) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <AddLocationDialog>
        <button className={styles.addButton} aria-label="Add location">
          <Plus />
        </button>
      </AddLocationDialog>
      <button className={styles.resetButton} onClick={handleReset}>
        Reset to Current Time
      </button>
      <div className={styles.timezonesContainer}>
        {locations.map((location) => {
          const adjustedTime = getAdjustedTime(
            currentTime,
            location.label || ""
          );
          const formattedTime = formatTime(currentTime, location.label || "");
          const [hours, minutes] = formattedTime.split(":");
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
                        <>
                          <input
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            onBlur={() =>
                              handleHourChange(location.id, inputValue)
                            }
                            onKeyDown={(e) => handleKeyDown(e, location.id)}
                            className={styles.hourInput}
                            maxLength={2}
                          />
                          {!inputValue && (
                            <div className={styles.placeholderHour}>
                              {hours}
                            </div>
                          )}
                        </>
                      ) : (
                        <div
                          className={styles.hours}
                          onClick={() => {
                            setEditingHour(location.id);
                            setInputValue("");
                          }}
                        >
                          {hours}
                        </div>
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
                            />
                          ) : (
                            <span
                              onClick={() =>
                                handleLabelClick(location.id, i, label)
                              }
                              className={styles.labelText}
                            >
                              {label}
                            </span>
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
                      const parts = new Intl.DateTimeFormat("en-US", {
                        timeZone:
                          timeZoneMapping[location.label || ""] ||
                          location.label,
                        timeZoneName: "short",
                      }).formatToParts(currentTime);
                      const timeZonePart = parts.find(
                        (part) => part.type === "timeZoneName"
                      );
                      return timeZonePart ? timeZonePart.value : "Unknown";
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
