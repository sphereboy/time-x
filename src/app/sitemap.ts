import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";
import { generateCanonicalPairs, getAllCities } from "@/data/cities";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const cityPages = getAllCities().map((c) => ({
    url: `${SITE_URL}/time-in/${c.slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const comparePairs = generateCanonicalPairs().map((slug) => ({
    url: `${SITE_URL}/compare/${slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [
    {
      url: `${SITE_URL}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/app`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...cityPages,
    ...comparePairs,
  ];
}
