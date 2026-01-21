"use client";

import { Clock, Palette, MousePointer, CloudOff, Tag, RefreshCw } from "lucide-react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: <Palette className="w-6 h-6" />,
    title: "Day & Night Colors",
    description:
      "Visual gradients that change based on the time of day in each location",
  },
  {
    icon: <MousePointer className="w-6 h-6" />,
    title: "Time Travel",
    description:
      "Click on any hour to adjust time and see how zones compare at different moments",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Real-Time Updates",
    description:
      "Clocks update every second with blinking colons for that classic feel",
  },
  {
    icon: <CloudOff className="w-6 h-6" />,
    title: "Works Offline",
    description:
      "No server required. Your data stays in your browser, always available",
  },
  {
    icon: <Tag className="w-6 h-6" />,
    title: "Custom Labels",
    description:
      "Add notes to any timezone like 'Team Standup' or 'Client Call'",
  },
  {
    icon: <RefreshCw className="w-6 h-6" />,
    title: "Instant Reset",
    description:
      "One click to return to current time or reset all your locations",
  },
];

export function Features() {
  return (
    <section className="py-20 px-6 bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
          Built for Time Zone Clarity
        </h2>
        <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
          Simple, focused features that make comparing time zones intuitive
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="group p-6 rounded-xl bg-gray-800/50 border border-gray-700/50 hover:border-gray-600 transition-all hover:bg-gray-800"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-orange-500/20 flex items-center justify-center text-white mb-4 group-hover:from-purple-500/30 group-hover:to-orange-500/30 transition-all">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
