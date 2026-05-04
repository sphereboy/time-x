/* eslint-disable react/no-danger -- Inline JSON-LD per Next.js docs. */
import {
  doesObserveDST,
  getOffsetMinutes,
  getUtcOffsetString,
} from "@/data/cities";
import type { City } from "@/data/cities";
import { getTimezoneAbbreviation } from "@/lib/timeFormatting";

export interface QA {
  question: string;
  answer: string;
}

interface FaqProps {
  items: QA[];
}

export function Faq({ items }: FaqProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((qa) => ({
      "@type": "Question",
      name: qa.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: qa.answer,
      },
    })),
  };

  return (
    <section className="py-8">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
        Frequently asked questions
      </h2>
      <dl className="space-y-6">
        {items.map((qa) => (
          <div key={qa.question}>
            <dt className="text-lg font-semibold text-white">{qa.question}</dt>
            <dd className="mt-2 text-gray-400 leading-relaxed">{qa.answer}</dd>
          </div>
        ))}
      </dl>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </section>
  );
}

export function buildCityFaq(city: City, baseTime: Date): QA[] {
  const offset = getUtcOffsetString(city.timezone, baseTime);
  const abbr = getTimezoneAbbreviation(city.timezone, baseTime);
  const observesDst = doesObserveDST(city.timezone);

  return [
    {
      question: `What is the current UTC offset in ${city.name}?`,
      answer: `${city.name} is currently at ${offset}${abbr ? ` (${abbr})` : ""}.`,
    },
    {
      question: `Does ${city.name} observe daylight saving time?`,
      answer: observesDst
        ? `Yes, ${city.name} observes daylight saving time, so the UTC offset shifts by one hour between summer and winter.`
        : `No, ${city.name} stays on the same UTC offset year-round and does not observe daylight saving time.`,
    },
    {
      question: `What timezone does ${city.name} use?`,
      answer: `${city.name} uses the ${city.timezone} IANA timezone${
        abbr ? `, currently displayed as ${abbr}` : ""
      }.`,
    },
    {
      question: `What time is it in ${city.name} right now?`,
      answer: `Open this page to see the current local time in ${city.name}, ${city.country}, with a live day or night gradient based on the local hour.`,
    },
  ];
}

export function buildCompareFaq(
  from: City,
  to: City,
  baseTime: Date
): QA[] {
  const fromOffset = getOffsetMinutes(from.timezone, baseTime);
  const toOffset = getOffsetMinutes(to.timezone, baseTime);
  const diffMinutes = toOffset - fromOffset;
  const diffHours = Math.abs(diffMinutes) / 60;
  const diffLabel = Number.isInteger(diffHours)
    ? `${diffHours} hour${diffHours === 1 ? "" : "s"}`
    : `${diffHours.toFixed(2).replace(/\.?0+$/, "")} hours`;
  const ahead =
    diffMinutes === 0
      ? `${to.name} and ${from.name} are currently in the same timezone offset.`
      : diffMinutes > 0
        ? `${to.name} is ${diffLabel} ahead of ${from.name}.`
        : `${to.name} is ${diffLabel} behind ${from.name}.`;

  const fromDst = doesObserveDST(from.timezone);
  const toDst = doesObserveDST(to.timezone);
  let dstAnswer: string;
  if (fromDst && toDst) {
    dstAnswer = `Both ${from.name} and ${to.name} observe daylight saving time, so the offset between them stays roughly stable across the year — though brief periods around DST transitions can shift the gap by an hour.`;
  } else if (!fromDst && !toDst) {
    dstAnswer = `Neither ${from.name} nor ${to.name} observes daylight saving time, so the offset between them is fixed year-round.`;
  } else {
    const dstCity = fromDst ? from.name : to.name;
    dstAnswer = `${dstCity} observes daylight saving time but the other city does not, so the time difference shifts by an hour during the DST window.`;
  }

  return [
    {
      question: `What is the time difference between ${from.name} and ${to.name}?`,
      answer: ahead,
    },
    {
      question: `When do business hours overlap between ${from.name} and ${to.name}?`,
      answer: `Use the conversion table on this page to find the overlap window. As a rule of thumb, look for the rows where both cities show times between 9:00 and 17:00 — those are the hours when teams in both locations are typically working at the same time.`,
    },
    {
      question: `Do ${from.name} and ${to.name} observe daylight saving time?`,
      answer: dstAnswer,
    },
    {
      question: `How can I quickly convert a meeting time between ${from.name} and ${to.name}?`,
      answer: `Open TZGrid to add both cities to a live grid, then drag or click the hour to scrub through the day and see how times line up across both locations.`,
    },
  ];
}
