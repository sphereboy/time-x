import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CtaOpenInAppProps {
  label?: string;
  caption?: string;
  addSlugs?: string[];
}

export function CtaOpenInApp({
  label = "Open TZGrid",
  caption,
  addSlugs,
}: CtaOpenInAppProps) {
  const href =
    addSlugs && addSlugs.length > 0
      ? `/app?add=${addSlugs.join(",")}`
      : "/app";

  return (
    <div className="flex flex-col items-center text-center gap-4 py-8">
      {caption && <p className="text-gray-400 max-w-md">{caption}</p>}
      <Link
        href={href}
        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-full font-semibold text-lg hover:bg-white/90 transition-all hover:scale-105 hover:shadow-lg"
      >
        {label}
        <ArrowRight className="w-5 h-5" />
      </Link>
    </div>
  );
}
