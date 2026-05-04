import Link from "next/link";
import { COMPANY_NAME } from "@/config/site";

interface TentacleFooterProps {
  year?: number;
}

export function TentacleFooter({ year }: TentacleFooterProps) {
  const displayYear = year ?? new Date().getFullYear();

  return (
    <footer className="py-12 px-6 bg-gray-950 border-t border-gray-800">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center md:items-start gap-0.5">
          <div className="text-white text-base font-semibold tracking-tight">
            TZGrid
          </div>
          <div className="text-gray-500 text-xs">
            © {displayYear} {COMPANY_NAME}
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm flex-wrap justify-center">
          <Link
            href="/"
            className="text-gray-400 hover:text-white transition-colors"
          >
            Home
          </Link>
          <Link
            href="/app"
            className="text-gray-400 hover:text-white transition-colors"
          >
            Open App
          </Link>
          <Link
            href="/privacy"
            className="text-gray-400 hover:text-white transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-gray-400 hover:text-white transition-colors"
          >
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
