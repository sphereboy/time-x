"use client";

import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 px-6 bg-gray-950 border-t border-gray-800">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-gray-500 text-sm">
          {currentYear} Time-X
        </div>
        <Link
          href="/app"
          className="text-gray-400 hover:text-white transition-colors text-sm"
        >
          Open App
        </Link>
      </div>
    </footer>
  );
}
