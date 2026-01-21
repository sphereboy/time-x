"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
            linear-gradient(135deg,
              #16053a 0%,
              #4D2971 20%,
              #9a626a 40%,
              #f29b55 60%,
              #f9e886 80%,
              #c1dabe 100%
            )
          `,
          backgroundSize: "400% 400%",
          animation: "gradientShift 15s ease infinite",
        }}
      />

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20 z-[1]" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
          Time-X
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 font-light max-w-2xl mx-auto">
          Compare time zones at a glance with beautiful day and night gradients
        </p>
        <Link
          href="/app"
          className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-full font-semibold text-lg hover:bg-white/90 transition-all hover:scale-105 hover:shadow-lg"
        >
          Open App
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      {/* CSS for gradient animation */}
      <style jsx>{`
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </section>
  );
}
