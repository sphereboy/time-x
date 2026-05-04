/* eslint-disable react/no-danger -- JSON-LD must be inlined into the HTML
   for search crawlers to parse it reliably; next/script defers/externalizes
   the tag and Google often skips those. dangerouslySetInnerHTML is the
   documented Next.js pattern for inline JSON-LD. */
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/config/site";

const schema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript. Requires HTML5.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
