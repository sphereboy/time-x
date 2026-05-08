import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClockCard } from "@/components/tentacle/ClockCard";
import { Breadcrumbs } from "@/components/tentacle/Breadcrumbs";
import { CtaOpenInApp } from "@/components/tentacle/CtaOpenInApp";
import { Faq, buildCityFaq } from "@/components/tentacle/Faq";
import { RelatedLinks } from "@/components/tentacle/RelatedLinks";
import { TentacleFooter } from "@/components/tentacle/TentacleFooter";
import {
  doesObserveDST,
  getAllCities,
  getCityBySlug,
  getRelatedPairsForCity,
  getUtcOffsetString,
  parseComparePair,
} from "@/data/cities";
import { getTimezoneAbbreviation } from "@/lib/timeFormatting";

export const dynamic = "force-static";
export const dynamicParams = false;

interface PageProps {
  params: Promise<{ city: string }>;
}

export function generateStaticParams() {
  return getAllCities().map((c) => ({ city: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { city: citySlug } = await params;
  const city = getCityBySlug(citySlug);
  if (!city) return {};

  const title = `Current Time in ${city.name}, ${city.country}`;
  const description = `What time is it in ${city.name} right now? Live local time, UTC offset, daylight-saving status, and timezone details for ${city.name} (${city.timezone}).`;
  const url = `/time-in/${city.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function TimeInCityPage({ params }: PageProps) {
  const { city: citySlug } = await params;
  const city = getCityBySlug(citySlug);
  if (!city) notFound();

  const baseTime = new Date();
  const offset = getUtcOffsetString(city.timezone, baseTime);
  const abbr = getTimezoneAbbreviation(city.timezone, baseTime);
  const observesDst = doesObserveDST(city.timezone);

  const relatedSlugs = getRelatedPairsForCity(city.slug);
  const relatedLinks = relatedSlugs
    .map((slug) => {
      const pair = parseComparePair(slug);
      if (!pair) return null;
      return {
        href: `/compare/${slug}`,
        label: `${pair.from.name} vs ${pair.to.name}`,
      };
    })
    .filter((x): x is { href: string; label: string } => x !== null);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <main className="max-w-3xl mx-auto px-6 py-10 md:py-16">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Time in", href: "/" },
            { label: city.name },
          ]}
        />

        <header className="mt-6 mb-8">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            Current Time in {city.name}
          </h1>
          <p className="mt-2 text-gray-400 text-lg">
            Live local time in {city.name}, {city.country}.
          </p>
        </header>

        <ClockCard city={city} baseTime={baseTime} />

        <section className="prose prose-invert max-w-none mt-10 space-y-4">
          <p className="text-gray-300 leading-relaxed">{city.description}</p>
          <p className="text-gray-300 leading-relaxed">
            {city.name} is currently observing {offset}
            {abbr ? ` (${abbr})` : ""}.{" "}
            {observesDst
              ? `${city.name} observes daylight saving time, so the offset shifts by one hour between summer and winter.`
              : `${city.name} stays at this offset year-round and does not observe daylight saving time.`}{" "}
            The IANA timezone identifier is <code>{city.timezone}</code>, which
            is the canonical name used in software, calendars, and operating
            systems.
          </p>
        </section>

        <CtaOpenInApp
          label={`Add ${city.name} to TZGrid`}
          caption={`We'll save ${city.name} to your grid alongside any timezones you already have.`}
          addSlugs={[city.slug]}
        />

        <RelatedLinks
          title={`Compare ${city.name} with another city`}
          links={relatedLinks}
        />

        <Faq items={buildCityFaq(city, baseTime)} />
      </main>
      <TentacleFooter year={baseTime.getFullYear()} />
    </div>
  );
}
