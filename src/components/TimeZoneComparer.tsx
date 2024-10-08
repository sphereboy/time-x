"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { format, addHours, setHours, differenceInHours } from "date-fns";
import { Plus, Trash2, Home, X, Edit2 } from "lucide-react";
import styles from "@/styles/TimeZoneComparer.module.css";
import { useTimeZoneStore } from "@/store/timeZoneStore";
import { AddLocationDialog } from "@/components/AddLocationDialog";
import timezones, { getTimezoneOffset } from "@/lib/timezones";

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

export function TimeZoneComparer(): React.ReactElement {
  const {
    locations,
    removeLocation,
    updateLocation,
    initializeWithCurrentTimezone,
  } = useTimeZoneStore();
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [editingHour, setEditingHour] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [manualAdjustment, setManualAdjustment] = useState(false);
  const [editingLabel, setEditingLabel] = useState<{
    id: string;
    index: number;
  } | null>(null);
  const [labelInputValue, setLabelInputValue] = useState("");
  const labelInputRef = useRef<HTMLInputElement>(null);
  const [newLabelInput, setNewLabelInput] = useState<{
    id: string;
    value: string;
  } | null>(null);

  const currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [showColon, setShowColon] = useState(true);

  // Add this effect for the pulsing colon
  useEffect(() => {
    const colonInterval = setInterval(() => {
      setShowColon((prev) => !prev);
    }, 500);

    return () => clearInterval(colonInterval);
  }, []);

  // Initialize with current timezone if it doesn't exist
  useEffect(() => {
    initializeWithCurrentTimezone();
  }, [initializeWithCurrentTimezone]);

  // Set initial time and update it every second
  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      if (!manualAdjustment) {
        setCurrentTime(new Date());
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [manualAdjustment]);

  // Update the current timezone's offset
  useEffect(() => {
    if (currentTime) {
      const currentLocation = locations.find((loc) => loc.isCurrent);
      if (currentLocation) {
        const currentTimezoneData = timezones.find((tz) =>
          tz.utc.includes(currentTimezone)
        );
        if (currentTimezoneData) {
          const offset = getTimezoneOffset(currentTimezoneData);
          if (currentLocation.offset !== offset) {
            updateLocation("current", {
              offset,
              name: "Current Location",
              label: currentTimezone,
            });
          }
        }
      }
    }
  }, [locations, updateLocation, currentTime, currentTimezone]);

  useEffect(() => {
    if (editingHour && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingHour]);

  useEffect(() => {
    if (editingLabel && labelInputRef.current) {
      labelInputRef.current.focus();
    }
  }, [editingLabel]);

  const handleAddLocation = useCallback((): void => {
    // This function will be passed to AddLocationDialog
    // It can be used to perform any actions after a location is added
  }, []);

  const handleHourChange = useCallback(
    (locationId: string, newHour: string) => {
      const parsedHour = parseInt(newHour, 10);
      if (!isNaN(parsedHour) && parsedHour >= 0 && parsedHour <= 23) {
        const location = locations.find((loc) => loc.id === locationId);
        if (location && currentTime) {
          const localTime = addHours(currentTime, location.offset);
          const newLocalTime = setHours(localTime, parsedHour);
          const timeDiff = differenceInHours(newLocalTime, localTime);
          const newGlobalTime = addHours(currentTime, timeDiff);
          setCurrentTime(newGlobalTime);
          setManualAdjustment(true);
        }
      }
      setEditingHour(null);
      setInputValue("");
    },
    [locations, currentTime, setCurrentTime]
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
        const location = locations.find((loc) => loc.id === locationId);
        if (location && currentTime) {
          const localTime = addHours(currentTime, location.offset);
          const currentHour = parseInt(format(localTime, "HH"), 10);
          const newHour =
            e.key === "ArrowUp"
              ? (currentHour + 1) % 24
              : (currentHour - 1 + 24) % 24;
          const newLocalTime = setHours(localTime, newHour);
          const timeDiff = differenceInHours(newLocalTime, localTime);
          const newGlobalTime = addHours(currentTime, timeDiff);
          setCurrentTime(newGlobalTime);
          setInputValue(newHour.toString().padStart(2, "0"));
          setManualAdjustment(true);
        }
      }
    },
    [handleHourChange, inputValue, locations, currentTime, setCurrentTime]
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

  const handleEditLabel = (
    locationId: string,
    index: number,
    currentLabel: string
  ) => {
    setEditingLabel({ id: locationId, index });
    setLabelInputValue(currentLabel);
  };

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

  const handleDeleteLabel = (locationId: string, index: number) => {
    const location = locations.find((loc) => loc.id === locationId);
    if (location && location.secondaryLabels) {
      const updatedLabels = location.secondaryLabels.filter(
        (_, i) => i !== index
      );
      updateLocation(locationId, { secondaryLabels: updatedLabels });
    }
  };

  const handleLabelClick = (
    locationId: string,
    index: number,
    currentLabel: string
  ) => {
    setEditingLabel({ id: locationId, index });
    setLabelInputValue(currentLabel);
  };

  const getAdjustedTime = (baseTime: Date, offset: number) => {
    const utcTime = baseTime.getTime() + baseTime.getTimezoneOffset() * 60000;
    return new Date(utcTime + offset * 3600000);
  };

  if (!currentTime) {
    return <div>Loading...</div>; // Or any loading indicator
  }

  return (
    <div className={styles.container}>
      <AddLocationDialog onAdd={handleAddLocation}>
        <button className={styles.addButton} aria-label="Add location">
          <Plus size={24} />
        </button>
      </AddLocationDialog>
      <div className={styles.timezonesContainer}>
        {locations.map((location) => {
          const adjustedTime = getAdjustedTime(currentTime, location.offset);
          const localHour = parseInt(format(adjustedTime, "H"), 10);
          const backgroundColor = getBackgroundColor(localHour);
          const isCurrentTimezone = location.label === currentTimezone;
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
                            ref={inputRef}
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
                              {format(adjustedTime, "HH")}
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
                          {format(adjustedTime, "HH")}
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
                    <div className={styles.minutes}>
                      {format(adjustedTime, "mm")}
                    </div>
                  </div>
                </div>
                <div className={styles.date}>
                  {format(adjustedTime, "EEE. do")}
                </div>
                <div className={styles.location}>{location.name}</div>
                <div className={styles.timezone}>{location.label}</div>
                {location.secondaryLabels && (
                  <div className={styles.secondaryLabels}>
                    {location.secondaryLabels.map((label, i) => (
                      <div key={i} className={styles.secondaryLabelWrapper}>
                        {editingLabel?.id === location.id &&
                        editingLabel.index === i ? (
                          <input
                            ref={labelInputRef}
                            type="text"
                            value={labelInputValue}
                            onChange={(e) => setLabelInputValue(e.target.value)}
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
                <div className={styles.offset}>{location.offset}</div>
                {isCurrentTimezone && (
                  <div className={styles.utcReference}>
                    {format(addHours(adjustedTime, -location.offset), "HH:mm")}{" "}
                    UTC
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className={styles.actionButtons}>
        <button className={styles.actionButton}>👤</button>
        <button className={styles.actionButton}>💬</button>
      </div>
    </div>
  );
}
