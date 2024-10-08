import React, { useState } from "react";
import { useTimeZoneStore } from "@/store/timeZoneStore";
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
import { ScrollArea } from "@/components/ui/scroll-area";

import timezones, { getTimezoneName, getTimezoneAbbr } from "@/lib/timezones";

interface AddLocationDialogProps {
  children: React.ReactNode;
}

export function AddLocationDialog({ children }: AddLocationDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedTimezone, setSelectedTimezone] = useState("");
  const [locationName, setLocationName] = useState("");
  const addLocation = useTimeZoneStore((state) => state.addLocation);
  const locations = useTimeZoneStore((state) => state.locations);

  const handleTimezoneChange = (value: string) => {
    setSelectedTimezone(value);
    // If no location name is set, use the timezone name as the default
    if (!locationName) {
      const timezone = timezones.find((tz) => tz.value === value);
      if (timezone) {
        setLocationName(getTimezoneName(timezone));
      }
    }
  };

  const handleAddLocation = () => {
    if (selectedTimezone) {
      const timezone = timezones.find((tz) => tz.value === selectedTimezone);
      if (timezone) {
        const newLocation = {
          id: Date.now().toString(),
          name: locationName || getTimezoneName(timezone), // Use timezone name if no custom name is provided
          offset: 0, // This will be calculated dynamically in TimeZoneComparer
          label: getTimezoneAbbr(timezone),
        };
        addLocation(newLocation);
        setOpen(false);
        setSelectedTimezone("");
        setLocationName("");
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
            placeholder="Location Name (optional)"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
          />
        </div>
        <Button
          onClick={handleAddLocation}
          disabled={!selectedTimezone} // Only disable if no timezone is selected
        >
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
