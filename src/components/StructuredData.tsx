/* eslint-disable react/no-danger -- JSON-LD must be inlined into the HTML
   for search crawlers to parse it reliably; next/script defers/externalizes
   the tag and Google often skips those. dangerouslySetInnerHTML is the
   documented Next.js pattern for inline JSON-LD. */
const SITE_URL = "https://www.tzgrid.com";

const schema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "TZGrid",
  description:
    "Compare time zones at a glance with stunning day and night gradients. Add locations, customize labels, and travel through time.",
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
