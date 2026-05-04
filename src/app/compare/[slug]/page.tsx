import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClockCard } from "@/components/tentacle/ClockCard";
import { Breadcrumbs } from "@/components/tentacle/Breadcrumbs";
import { ConversionTable } from "@/components/tentacle/ConversionTable";
import { CtaOpenInApp } from "@/components/tentacle/CtaOpenInApp";
import { Faq, buildCompareFaq } from "@/components/tentacle/Faq";
import { RelatedLinks } from "@/components/tentacle/RelatedLinks";
import { TentacleFooter } from "@/components/tentacle/TentacleFooter";
import {
  doesObserveDST,
  generateCanonicalPairs,
  getOffsetMinutes,
  getRelatedPairsForCompare,
  parseComparePair,
} from "@/data/cities";

export const dynamic = "force-static";
export const dynamicParams = false;

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return generateCanonicalPairs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const pair = parseComparePair(params.slug);
  if (!pair) return {};

  const { from, to } = pair;
  const title = `${from.name} vs ${to.name} Time Difference & Converter`;
  const description = `Compare the current time in ${from.name} and ${to.name}. See the time difference, business-hour overlap, and a full hour-by-hour conversion table.`;
  const url = `/compare/${params.slug}`;

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

export default function ComparePairPage({ params }: PageProps) {
  const pair = parseComparePair(params.slug);
  if (!pair) notFound();

  const { from, to } = pair;
  const baseTime = new Date();

  const fromOffset = getOffsetMinutes(from.timezone, baseTime);
  const toOffset = getOffsetMinutes(to.timezone, baseTime);
  const diffMinutes = toOffset - fromOffset;
  const diffAbs = Math.abs(diffMinutes) / 60;
  const diffLabel = Number.isInteger(diffAbs)
    ? `${diffAbs} hour${diffAbs === 1 ? "" : "s"}`
    : `${diffAbs.toFixed(2).replace(/\.?0+$/, "")} hours`;
  const diffSentence =
    diffMinutes === 0
      ? `${from.name} and ${to.name} are currently in the same UTC offset.`
      : diffMinutes > 0
        ? `${to.name} is ${diffLabel} ahead of ${from.name}.`
        : `${to.name} is ${diffLabel} behind ${from.name}.`;

  const fromDst = doesObserveDST(from.timezone);
  const toDst = doesObserveDST(to.timezone);
  let dstSentence: string;
  if (fromDst && toDst) {
    dstSentence = `Both cities observe daylight saving time, so the offset stays roughly stable across the year.`;
  } else if (!fromDst && !toDst) {
    dstSentence = `Neither city observes daylight saving time, so this offset is fixed year-round.`;
  } else {
    const dstCity = fromDst ? from.name : to.name;
    dstSentence = `${dstCity} observes daylight saving time but the other city does not, so the gap shifts by an hour during the DST window.`;
  }

  const relatedSlugs = getRelatedPairsForCompare(from.slug, to.slug);
  const relatedLinks = [
    {
      href: `/time-in/${from.slug}`,
      label: `Current time in ${from.name}`,
    },
    {
      href: `/time-in/${to.slug}`,
      label: `Current time in ${to.name}`,
    },
    ...relatedSlugs
      .map((slug) => {
        const p = parseComparePair(slug);
        if (!p) return null;
        return {
          href: `/compare/${slug}`,
          label: `${p.from.name} vs ${p.to.name}`,
        };
      })
      .filter((x): x is { href: string; label: string } => x !== null),
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <main className="max-w-4xl mx-auto px-6 py-10 md:py-16">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Compare", href: "/" },
            { label: `${from.name} vs ${to.name}` },
          ]}
        />

        <header className="mt-6 mb-8">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            {from.name} vs {to.name}
          </h1>
          <p className="mt-2 text-gray-400 text-lg">
            Live time comparison and meeting-hour overlap between {from.name},{" "}
            {from.country} and {to.name}, {to.country}.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ClockCard city={from} baseTime={baseTime} size="md" />
          <ClockCard city={to} baseTime={baseTime} size="md" />
        </div>

        <section className="prose prose-invert max-w-none mt-10 space-y-4">
          <p className="text-gray-300 leading-relaxed">{diffSentence}</p>
          <p className="text-gray-300 leading-relaxed">
            If your workday in {from.name} runs 9:00 AM to 5:00 PM, the
            corresponding window in {to.name} can be read directly from the
            conversion table below — overlapping rows are highlighted.
          </p>
          <p className="text-gray-300 leading-relaxed">{dstSentence}</p>
        </section>

        <ConversionTable from={from} to={to} baseTime={baseTime} />

        <CtaOpenInApp
          label={`Compare ${from.name} & ${to.name} in TZGrid`}
          caption={`We'll add both cities to your grid so you can scrub through the day.`}
          addSlugs={[from.slug, to.slug]}
        />

        <RelatedLinks title="Related comparisons" links={relatedLinks} />

        <Faq items={buildCompareFaq(from, to, baseTime)} />
      </main>
      <TentacleFooter year={baseTime.getFullYear()} />
    </div>
  );
}
