import React, { useState, ReactNode } from "react";
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

import timezones from "@/lib/timezones";

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
  const { addLocation, updateLocation, locations } = useTimeZoneStore();

  const handleTimezoneChange = (value: string) => {
    setSelectedTimezone(value);
    const funnyName = getFunnyName(value);
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

  const handleAdd = () => {
    if (selectedTimezone) {
      const timezone = timezones.find((tz) => tz.name === selectedTimezone);
      if (timezone) {
        const existingLocation = locations.find(
          (loc) => loc.label === timezone.abbreviations[0]
        );

        if (existingLocation) {
          // Add new label to existing location
          const newLabel = locationName || timezone.cities[0].name;
          updateLocation(existingLocation.id, {
            secondaryLabels: [
              ...(existingLocation.secondaryLabels || []),
              newLabel,
            ],
          });
        } else {
          // Add new location
          addLocation({
            id: Date.now().toString(),
            name: locationName || timezone.cities[0].name,
            offset: timezone.offset,
            label: timezone.abbreviations[0],
          });
        }

        onAdd();
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
                  <SelectItem key={timezone.name} value={timezone.name}>
                    {timezone.name} ({timezone.abbreviations.join("/")})
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
        <Button onClick={handleAdd}>
          {locations.some(
            (loc) =>
              loc.label ===
              timezones.find((tz) => tz.name === selectedTimezone)
                ?.abbreviations[0]
          )
            ? "Add Label"
            : "Add Location"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
