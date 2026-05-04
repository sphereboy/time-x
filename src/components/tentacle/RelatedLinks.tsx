import Link from "next/link";

export interface RelatedLink {
  href: string;
  label: string;
}

interface RelatedLinksProps {
  title: string;
  links: RelatedLink[];
}

export function RelatedLinks({ title, links }: RelatedLinksProps) {
  if (links.length === 0) return null;

  return (
    <section className="py-8">
      <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
        {title}
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="block px-4 py-3 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
