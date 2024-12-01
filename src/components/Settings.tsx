"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useTimeZoneStore } from "@/store/timeZoneStore";

export function SettingsDialog() {
  const { settings, updateSettings } = useTimeZoneStore();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground h-10 w-10"
          aria-label="Open settings"
        >
          <Settings2 size={20} />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="py-6 space-y-6">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="show-seconds" className="flex flex-col space-y-1">
              <span>Show seconds</span>
              <span className="font-normal text-sm text-muted-foreground">
                Display seconds in the time format
              </span>
            </Label>
            <Switch
              id="show-seconds"
              checked={settings?.showSeconds}
              onCheckedChange={(checked) =>
                updateSettings({ showSeconds: checked })
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="24h-format" className="flex flex-col space-y-1">
              <span>24-hour format</span>
              <span className="font-normal text-sm text-muted-foreground">
                Use 24-hour time format instead of 12-hour
              </span>
            </Label>
            <Switch
              id="24h-format"
              checked={settings?.use24HourFormat}
              onCheckedChange={(checked) =>
                updateSettings({ use24HourFormat: checked })
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between space-x-2">
            <Label
              htmlFor="show-timezone-abbreviation"
              className="flex flex-col space-y-1"
            >
              <span>Show timezone abbreviation</span>
              <span className="font-normal text-sm text-muted-foreground">
                Display timezone abbreviations (EST, PST, etc.)
              </span>
            </Label>
            <Switch
              id="show-timezone-abbreviation"
              checked={settings?.showTimezoneAbbreviation}
              onCheckedChange={(checked) =>
                updateSettings({ showTimezoneAbbreviation: checked })
              }
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
