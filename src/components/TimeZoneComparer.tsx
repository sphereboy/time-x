"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { format, addHours, setHours, differenceInHours } from "date-fns";
import { Plus, Edit2, Trash2 } from "lucide-react";
import styles from "@/styles/TimeZoneComparer.module.css";
import { useTimeZoneStore } from "@/store/timeZoneStore";

const getBackgroundColor = (hour: number): string => {
  const colors = [
    "bg-indigo-900", // 0-3: Night
    "bg-purple-900", // 4-7: Dawn
    "bg-rose-400", // 8-11: Morning
    "bg-yellow-400", // 12-15: Afternoon
    "bg-orange-400", // 16-19: Evening
    "bg-teal-600", // 20-23: Night
  ];
  return colors[Math.floor(hour / 4)] || "bg-gray-400";
};

export function TimeZoneComparer(): React.ReactElement {
  const {
    locations,
    currentTime,
    addLocation,
    removeLocation,
    updateLocation,
    setCurrentTime,
  } = useTimeZoneStore();
  const [editingHour, setEditingHour] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [manualAdjustment, setManualAdjustment] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!manualAdjustment) {
      timer = setInterval(() => setCurrentTime(new Date()), 1000);
    }
    return () => clearInterval(timer);
  }, [setCurrentTime, manualAdjustment]);

  useEffect(() => {
    if (editingHour && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingHour]);

  const handleAddLocation = useCallback((): void => {
    const newLocation = {
      id: String(locations.length + 1),
      name: "New Location",
      offset: 0,
      label: "UTC",
    };
    addLocation(newLocation);
  }, [locations.length, addLocation]);

  const handleHourChange = useCallback(
    (locationId: string, newHour: string) => {
      const parsedHour = parseInt(newHour, 10);
      if (!isNaN(parsedHour) && parsedHour >= 0 && parsedHour <= 23) {
        const location = locations.find((loc) => loc.id === locationId);
        if (location) {
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
        if (location) {
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

  return (
    <div className={styles.container}>
      <button
        onClick={handleAddLocation}
        className={styles.addButton}
        aria-label="Add location"
      >
        <Plus size={24} />
      </button>
      <div className={styles.timezonesContainer}>
        {locations.map((location) => {
          const localTime = addHours(currentTime, location.offset);
          const localHour = parseInt(format(localTime, "H"), 10);
          const backgroundColor = getBackgroundColor(localHour);

          return (
            <div
              key={location.id}
              className={`${styles.timezoneColumn} ${backgroundColor}`}
            >
              <div className={styles.time}>
                <div className={styles.hourInputWrapper}>
                  {editingHour === location.id ? (
                    <>
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onBlur={() => handleHourChange(location.id, inputValue)}
                        onKeyDown={(e) => handleKeyDown(e, location.id)}
                        className={styles.hourInput}
                        maxLength={2}
                      />
                      {!inputValue && (
                        <div className={styles.placeholderHour}>
                          {format(localTime, "HH")}
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
                      {format(localTime, "HH")}
                    </div>
                  )}
                </div>
                <div className={styles.minutes}>{format(localTime, "mm")}</div>
              </div>
              <div className={styles.date}>{format(localTime, "EEE. do")}</div>
              <div className={styles.location}>{location.name}</div>
              <div className={styles.timezone}>{location.label}</div>
              {location.secondaryLabels && (
                <div className={styles.secondaryLabels}>
                  {location.secondaryLabels.map((label, i) => (
                    <div key={i}>{label}</div>
                  ))}
                </div>
              )}
              <div className={styles.offset}>{location.offset}</div>
              <div className={styles.hoverCard}>
                <button
                  onClick={() => {
                    const newName = prompt("Enter new name:", location.name);
                    if (newName) updateLocation(location.id, { name: newName });
                  }}
                  className={styles.editButton}
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => removeLocation(location.id)}
                  className={styles.deleteButton}
                >
                  <Trash2 size={16} />
                </button>
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
