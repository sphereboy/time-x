import React, { useState, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTimeZoneStore } from "@/store/timeZoneStore";
import { ScrollArea } from "@/components/ui/scroll-area";

import timezones, {
  getTimezoneName,
  getTimezoneAbbr,
  Timezone,
} from "@/lib/timezones";

interface AddLocationDialogProps {
  onAdd: () => void;
  children: ReactNode;
}

const getFunnyName = (timezone: string): string => {
  const funnyNames: { [key: string]: string } = {
    "Pacific Standard Time": "Surfer's Paradise",
    "Mountain Standard Time": "Rocky Mountain High",
    "Central Standard Time": "Cornfield Central",
    "Eastern Standard Time": "Big Apple Time",
    "Greenwich Mean Time": "Tea Time Central",
    "Central European Time": "Schnitzel Standard Time",
    "Eastern European Time": "Tzatziki Time Zone",
    "Japan Standard Time": "Sushi Standard Time",
    "Australian Eastern Standard Time": "Kangaroo Klock",
  };

  return funnyNames[timezone] || `Quirky ${timezone.split(" ")[0]} Time`;
};

export function AddLocationDialog({ onAdd, children }: AddLocationDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedTimezone, setSelectedTimezone] = useState<string>("");
  const [locationName, setLocationName] = useState<string>("");
  const { addLocation, locations } = useTimeZoneStore();

  const handleTimezoneChange = (value: string) => {
    setSelectedTimezone(value);
    const timezone = timezones.find((tz) => tz.value === value);
    const funnyName = getFunnyName(getTimezoneName(timezone));
    setLocationName("");
    setTimeout(() => {
      const input = document.getElementById(
        "locationNameInput"
      ) as HTMLInputElement;
      if (input) {
        input.placeholder = funnyName;
      }
    }, 0);
  };

  const getTimezoneOffset = (timezone: Timezone): number => {
    const now = new Date();
    const tzDate = new Date(
      now.toLocaleString("en-US", { timeZone: timezone.utc[0] })
    );
    const tzOffset = (tzDate.getTime() - now.getTime()) / (60 * 60 * 1000);
    return Math.round(tzOffset);
  };

  const handleAddLocation = () => {
    if (selectedTimezone) {
      const timezone = timezones.find((tz) => tz.value === selectedTimezone);
      if (timezone) {
        const offset = getTimezoneOffset(timezone);
        const newLocation = {
          id: uuidv4(),
          timezone: selectedTimezone,
          label: locationName || getTimezoneAbbr(timezone),
          offset: offset,
          name: getTimezoneName(timezone),
        };
        addLocation(newLocation);
        setOpen(false);
        setSelectedTimezone("");
        setLocationName("");
        onAdd();
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Location</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Select onValueChange={handleTimezoneChange} value={selectedTimezone}>
            <SelectTrigger>
              <SelectValue placeholder="Select Timezone" />
            </SelectTrigger>
            <SelectContent>
              <ScrollArea className="h-[300px]">
                {timezones.map((timezone) => (
                  <SelectItem key={timezone.value} value={timezone.value}>
                    {getTimezoneName(timezone)} ({getTimezoneAbbr(timezone)})
                  </SelectItem>
                ))}
              </ScrollArea>
            </SelectContent>
          </Select>
          <Input
            id="locationNameInput"
            placeholder="Location Name"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
          />
        </div>
        <Button onClick={handleAddLocation}>
          {locations.some(
            (loc) =>
              loc.label ===
              getTimezoneAbbr(
                timezones.find((tz) => tz.value === selectedTimezone)!
              )
          )
            ? "Add Label"
            : "Add Location"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
