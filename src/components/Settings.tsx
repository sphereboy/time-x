"use client";

import React, { useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTimeZoneStore } from "@/store/timeZoneStore";

export function SettingsDialog() {
  const { settings, updateSettings } = useTimeZoneStore();

  useEffect(() => {
    const applyTheme = (theme: string) => {
      const root = document.documentElement;
      if (theme === "system") {
        const systemPrefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        root.classList.toggle("dark", systemPrefersDark);
      } else {
        root.classList.toggle("dark", theme === "dark");
      }
    };

    applyTheme(settings?.theme || "system");

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (settings?.theme === "system") {
        applyTheme("system");
      }
    };
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [settings?.theme]);

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
          <Separator />
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="theme" className="flex flex-col space-y-1">
              <span>Theme</span>
              <span className="font-normal text-sm text-muted-foreground">
                Choose your preferred color scheme
              </span>
            </Label>
            <Select
              value={settings?.theme || "system"}
              onValueChange={(value: "light" | "dark" | "system") =>
                updateSettings({ theme: value })
              }
            >
              <SelectTrigger className="w-[120px]" id="theme">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
