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

import { timeZoneMapping } from "./TimeZoneComparer";

interface AddLocationDialogProps {
  children: React.ReactNode;
}

export function AddLocationDialog({ children }: AddLocationDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedTimezone, setSelectedTimezone] = useState("");
  const [locationName, setLocationName] = useState("");
  const addLocation = useTimeZoneStore((state) => state.addLocation);

  const handleTimezoneChange = (value: string) => {
    setSelectedTimezone(value);
    if (!locationName) {
      setLocationName(
        Object.keys(timeZoneMapping).find(
          (key) => timeZoneMapping[key] === value
        ) || value
      );
    }
  };

  const handleAddLocation = () => {
    if (selectedTimezone) {
      addLocation(locationName || selectedTimezone, selectedTimezone);
      setOpen(false);
      setSelectedTimezone("");
      setLocationName("");
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
                {Object.entries(timeZoneMapping).map(([name, value]) => (
                  <SelectItem key={value} value={value}>
                    {name}
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
        <Button onClick={handleAddLocation} disabled={!selectedTimezone}>
          Add Location
        </Button>
      </DialogContent>
    </Dialog>
  );
}
