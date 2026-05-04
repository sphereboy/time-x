export interface City {
  slug: string;
  name: string;
  country: string;
  timezone: string;
  isHub: boolean;
  description: string;
}

export const CITIES: City[] = [
  {
    slug: "new-york",
    name: "New York",
    country: "United States",
    timezone: "America/New_York",
    isHub: true,
    description:
      "New York City is the financial capital of the United States and home to the NYSE and NASDAQ. It runs on Eastern Time, which observes daylight saving time from March to November.",
  },
  {
    slug: "london",
    name: "London",
    country: "United Kingdom",
    timezone: "Europe/London",
    isHub: true,
    description:
      "London anchors global finance and remains a critical hub for international business across EMEA. It alternates between Greenwich Mean Time in winter and British Summer Time in summer.",
  },
  {
    slug: "paris",
    name: "Paris",
    country: "France",
    timezone: "Europe/Paris",
    isHub: true,
    description:
      "Paris sits at the center of European business and diplomacy. It uses Central European Time, shifting to Central European Summer Time during the warmer months.",
  },
  {
    slug: "dubai",
    name: "Dubai",
    country: "United Arab Emirates",
    timezone: "Asia/Dubai",
    isHub: true,
    description:
      "Dubai bridges working hours between Europe and Asia and runs on Gulf Standard Time year-round. The UAE does not observe daylight saving time, so the offset is fixed at UTC+4.",
  },
  {
    slug: "tokyo",
    name: "Tokyo",
    country: "Japan",
    timezone: "Asia/Tokyo",
    isHub: true,
    description:
      "Tokyo is the world's largest metropolitan area and a primary Asian financial center. Japan stays on Japan Standard Time year-round (UTC+9) and does not observe daylight saving.",
  },
  {
    slug: "sydney",
    name: "Sydney",
    country: "Australia",
    timezone: "Australia/Sydney",
    isHub: true,
    description:
      "Sydney is Australia's largest city and the country's main financial hub. It alternates between Australian Eastern Standard Time and Australian Eastern Daylight Time, with DST running roughly October through April.",
  },
  {
    slug: "los-angeles",
    name: "Los Angeles",
    country: "United States",
    timezone: "America/Los_Angeles",
    isHub: true,
    description:
      "Los Angeles is the largest city on the U.S. West Coast and a major media and tech hub. It uses Pacific Time, observing daylight saving from March to November.",
  },
  {
    slug: "chicago",
    name: "Chicago",
    country: "United States",
    timezone: "America/Chicago",
    isHub: false,
    description:
      "Chicago is the third-largest U.S. city and a major financial and logistics center. It runs on Central Time, observing daylight saving from March to November.",
  },
  {
    slug: "toronto",
    name: "Toronto",
    country: "Canada",
    timezone: "America/Toronto",
    isHub: false,
    description:
      "Toronto is Canada's largest city and home to the Toronto Stock Exchange. It shares Eastern Time with New York and observes daylight saving on the same schedule.",
  },
  {
    slug: "sao-paulo",
    name: "São Paulo",
    country: "Brazil",
    timezone: "America/Sao_Paulo",
    isHub: false,
    description:
      "São Paulo is South America's largest city and Brazil's financial capital. Brazil stopped observing daylight saving in 2019, so it now stays on Brasília Time (UTC-3) year-round.",
  },
  {
    slug: "mexico-city",
    name: "Mexico City",
    country: "Mexico",
    timezone: "America/Mexico_City",
    isHub: false,
    description:
      "Mexico City is the most populous city in North America and a major Latin American business hub. As of 2022, most of Mexico no longer observes daylight saving time.",
  },
  {
    slug: "berlin",
    name: "Berlin",
    country: "Germany",
    timezone: "Europe/Berlin",
    isHub: false,
    description:
      "Berlin is Germany's capital and a growing European tech hub. It uses Central European Time, switching to Central European Summer Time alongside the rest of the EU.",
  },
  {
    slug: "amsterdam",
    name: "Amsterdam",
    country: "Netherlands",
    timezone: "Europe/Amsterdam",
    isHub: false,
    description:
      "Amsterdam is a major European financial and tech center and home to the world's oldest stock exchange. It uses Central European Time with the standard EU summer-time switch.",
  },
  {
    slug: "madrid",
    name: "Madrid",
    country: "Spain",
    timezone: "Europe/Madrid",
    isHub: false,
    description:
      "Madrid is the capital of Spain and a primary economic center for southern Europe and Latin America. It runs on Central European Time, observing summer time across the EU schedule.",
  },
  {
    slug: "rome",
    name: "Rome",
    country: "Italy",
    timezone: "Europe/Rome",
    isHub: false,
    description:
      "Rome is Italy's capital and a key southern European hub. It uses Central European Time, alternating with Central European Summer Time on the standard EU schedule.",
  },
  {
    slug: "istanbul",
    name: "Istanbul",
    country: "Turkey",
    timezone: "Europe/Istanbul",
    isHub: false,
    description:
      "Istanbul straddles Europe and Asia and is Turkey's largest city. Turkey stays on UTC+3 year-round and stopped observing daylight saving time in 2016.",
  },
  {
    slug: "moscow",
    name: "Moscow",
    country: "Russia",
    timezone: "Europe/Moscow",
    isHub: false,
    description:
      "Moscow is Russia's capital and the country's largest financial center. It runs on Moscow Standard Time (UTC+3) year-round; Russia eliminated daylight saving in 2014.",
  },
  {
    slug: "riyadh",
    name: "Riyadh",
    country: "Saudi Arabia",
    timezone: "Asia/Riyadh",
    isHub: false,
    description:
      "Riyadh is Saudi Arabia's capital and the financial center of the Gulf's largest economy. It runs on Arabia Standard Time (UTC+3) year-round with no daylight saving.",
  },
  {
    slug: "karachi",
    name: "Karachi",
    country: "Pakistan",
    timezone: "Asia/Karachi",
    isHub: false,
    description:
      "Karachi is Pakistan's largest city and primary financial center. It uses Pakistan Standard Time (UTC+5) year-round and does not observe daylight saving time.",
  },
  {
    slug: "mumbai",
    name: "Mumbai",
    country: "India",
    timezone: "Asia/Kolkata",
    isHub: false,
    description:
      "Mumbai is India's financial capital and home to the Bombay Stock Exchange. India runs on India Standard Time (UTC+5:30) nationwide and does not observe daylight saving.",
  },
  {
    slug: "bangalore",
    name: "Bangalore",
    country: "India",
    timezone: "Asia/Kolkata",
    isHub: false,
    description:
      "Bangalore is India's leading technology and outsourcing hub, hosting headquarters for many global tech firms. It shares India Standard Time (UTC+5:30) with the rest of India.",
  },
  {
    slug: "singapore",
    name: "Singapore",
    country: "Singapore",
    timezone: "Asia/Singapore",
    isHub: false,
    description:
      "Singapore is a global financial center and the primary gateway to Southeast Asia. It runs on Singapore Standard Time (UTC+8) year-round with no daylight saving.",
  },
  {
    slug: "hong-kong",
    name: "Hong Kong",
    country: "China",
    timezone: "Asia/Hong_Kong",
    isHub: false,
    description:
      "Hong Kong is one of Asia's largest financial centers and home to the Hong Kong Stock Exchange. It uses Hong Kong Time (UTC+8) year-round with no daylight saving.",
  },
  {
    slug: "beijing",
    name: "Beijing",
    country: "China",
    timezone: "Asia/Shanghai",
    isHub: false,
    description:
      "Beijing is China's capital and a primary political and economic hub. All of mainland China uses China Standard Time (UTC+8) and does not observe daylight saving.",
  },
  {
    slug: "seoul",
    name: "Seoul",
    country: "South Korea",
    timezone: "Asia/Seoul",
    isHub: false,
    description:
      "Seoul is South Korea's capital and the country's primary business and technology hub. It runs on Korea Standard Time (UTC+9) year-round with no daylight saving.",
  },
  {
    slug: "jakarta",
    name: "Jakarta",
    country: "Indonesia",
    timezone: "Asia/Jakarta",
    isHub: false,
    description:
      "Jakarta is Indonesia's capital and Southeast Asia's most populous city. It uses Western Indonesian Time (UTC+7) year-round with no daylight saving.",
  },
  {
    slug: "nairobi",
    name: "Nairobi",
    country: "Kenya",
    timezone: "Africa/Nairobi",
    isHub: false,
    description:
      "Nairobi is Kenya's capital and East Africa's largest economic hub. It runs on East Africa Time (UTC+3) year-round with no daylight saving.",
  },
  {
    slug: "lagos",
    name: "Lagos",
    country: "Nigeria",
    timezone: "Africa/Lagos",
    isHub: false,
    description:
      "Lagos is Nigeria's largest city and the commercial center of West Africa. It uses West Africa Time (UTC+1) year-round with no daylight saving.",
  },
  {
    slug: "johannesburg",
    name: "Johannesburg",
    country: "South Africa",
    timezone: "Africa/Johannesburg",
    isHub: false,
    description:
      "Johannesburg is South Africa's largest city and home to the Johannesburg Stock Exchange. It runs on South Africa Standard Time (UTC+2) year-round with no daylight saving.",
  },
  {
    slug: "cairo",
    name: "Cairo",
    country: "Egypt",
    timezone: "Africa/Cairo",
    isHub: false,
    description:
      "Cairo is Egypt's capital and the largest city in the Arab world. Egypt reintroduced daylight saving time in 2023, shifting between EET (UTC+2) and EEST (UTC+3).",
  },
  {
    slug: "auckland",
    name: "Auckland",
    country: "New Zealand",
    timezone: "Pacific/Auckland",
    isHub: false,
    description:
      "Auckland is New Zealand's largest city and one of the first major cities each day to enter a new date. It alternates between NZST (UTC+12) and NZDT (UTC+13) on a southern-hemisphere DST schedule.",
  },
];

const CITY_BY_SLUG = new Map(CITIES.map((c) => [c.slug, c]));

export function getCityBySlug(slug: string): City | undefined {
  return CITY_BY_SLUG.get(slug);
}

export function getAllCities(): City[] {
  return CITIES;
}

function canonicalPairSlug(a: string, b: string): string {
  return [a, b].sort()[0] === a ? `${a}-vs-${b}` : `${b}-vs-${a}`;
}

export function generateCanonicalPairs(): string[] {
  const hubs = CITIES.filter((c) => c.isHub);
  const nonHubs = CITIES.filter((c) => !c.isHub);
  const pairs: string[] = [];

  for (const hub of hubs) {
    for (const other of nonHubs) {
      pairs.push(canonicalPairSlug(hub.slug, other.slug));
    }
  }

  for (let i = 0; i < hubs.length; i++) {
    for (let j = i + 1; j < hubs.length; j++) {
      pairs.push(canonicalPairSlug(hubs[i].slug, hubs[j].slug));
    }
  }

  return pairs.sort();
}

export function parseComparePair(
  slug: string
): { from: City; to: City } | null {
  const parts = slug.split("-vs-");
  if (parts.length !== 2) return null;
  const from = getCityBySlug(parts[0]);
  const to = getCityBySlug(parts[1]);
  if (!from || !to) return null;
  if (from.slug === to.slug) return null;
  return { from, to };
}

export function isCanonicalPairSlug(slug: string): boolean {
  const parts = slug.split("-vs-");
  if (parts.length !== 2) return false;
  return parts[0] < parts[1];
}

export function getRelatedPairsForCity(slug: string, limit = 5): string[] {
  return generateCanonicalPairs()
    .filter((p) => {
      const [a, b] = p.split("-vs-");
      return a === slug || b === slug;
    })
    .slice(0, limit);
}

export function getRelatedPairsForCompare(
  slugA: string,
  slugB: string,
  limit = 4
): string[] {
  const current = canonicalPairSlug(slugA, slugB);
  return generateCanonicalPairs()
    .filter((p) => {
      if (p === current) return false;
      const [a, b] = p.split("-vs-");
      return a === slugA || a === slugB || b === slugA || b === slugB;
    })
    .slice(0, limit);
}

export function doesObserveDST(timezone: string): boolean {
  try {
    const jan = new Date(Date.UTC(new Date().getUTCFullYear(), 0, 1, 12));
    const jul = new Date(Date.UTC(new Date().getUTCFullYear(), 6, 1, 12));
    return offsetMinutes(timezone, jan) !== offsetMinutes(timezone, jul);
  } catch {
    return false;
  }
}

function offsetMinutes(timezone: string, date: Date): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = dtf.formatToParts(date);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const asUTC = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    get("hour") % 24,
    get("minute"),
    get("second")
  );
  return Math.round((asUTC - date.getTime()) / 60000);
}

export function getUtcOffsetString(timezone: string, date: Date): string {
  const minutes = offsetMinutes(timezone, date);
  const sign = minutes >= 0 ? "+" : "-";
  const abs = Math.abs(minutes);
  const hh = String(Math.floor(abs / 60)).padStart(2, "0");
  const mm = String(abs % 60).padStart(2, "0");
  return `UTC${sign}${hh}:${mm}`;
}

export function getOffsetMinutes(timezone: string, date: Date): number {
  return offsetMinutes(timezone, date);
}
