import Link from "next/link";

const POPULAR_COMPARES = [
  { slug: "london-vs-new-york", label: "New York vs London" },
  { slug: "london-vs-tokyo", label: "London vs Tokyo" },
  { slug: "new-york-vs-tokyo", label: "New York vs Tokyo" },
  { slug: "london-vs-los-angeles", label: "London vs Los Angeles" },
  { slug: "dubai-vs-london", label: "Dubai vs London" },
  { slug: "london-vs-sydney", label: "London vs Sydney" },
  { slug: "new-york-vs-paris", label: "New York vs Paris" },
];

const POPULAR_CITIES = [
  { slug: "new-york", label: "New York" },
  { slug: "london", label: "London" },
  { slug: "tokyo", label: "Tokyo" },
  { slug: "los-angeles", label: "Los Angeles" },
  { slug: "dubai", label: "Dubai" },
  { slug: "sydney", label: "Sydney" },
  { slug: "paris", label: "Paris" },
  { slug: "berlin", label: "Berlin" },
];

export function PopularLinks() {
  return (
    <section className="py-20 px-6 bg-gray-900 border-t border-gray-800">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
          Popular timezone pages
        </h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          Jump into common timezone comparisons or check the current time in a
          major city.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">
              Compare cities
            </h3>
            <ul className="space-y-2">
              {POPULAR_COMPARES.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/compare/${c.slug}`}
                    className="block px-4 py-3 rounded-lg bg-gray-950 hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-4">
              Time in major cities
            </h3>
            <ul className="space-y-2">
              {POPULAR_CITIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/time-in/${c.slug}`}
                    className="block px-4 py-3 rounded-lg bg-gray-950 hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
                  >
                    Current time in {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
