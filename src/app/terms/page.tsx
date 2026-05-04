import type { Metadata } from "next";
import Link from "next/link";
import { COMPANY_NAME, CONTACT_EMAIL, SITE_NAME } from "@/config/site";
import { TentacleFooter } from "@/components/tentacle/TentacleFooter";

export const dynamic = "force-static";

const EFFECTIVE_DATE = "May 4, 2026";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of service for ${SITE_NAME}, operated by ${COMPANY_NAME}.`,
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <main className="max-w-3xl mx-auto px-6 py-10 md:py-16">
        <nav className="text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-white">
            Home
          </Link>{" "}
          <span className="text-gray-600">/</span>{" "}
          <span className="text-gray-300">Terms of Service</span>
        </nav>

        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
          Terms of Service
        </h1>
        <p className="text-gray-400 mb-10">
          Effective {EFFECTIVE_DATE}. {SITE_NAME} is operated by{" "}
          {COMPANY_NAME}.
        </p>

        <div className="prose prose-invert max-w-none space-y-6 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white">Acceptance of terms</h2>
            <p>
              By accessing or using {SITE_NAME}, you agree to these Terms of
              Service. If you do not agree, please do not use the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">The service</h2>
            <p>
              {SITE_NAME} is a free, browser-based tool for comparing time zones
              and is provided on an &ldquo;as is&rdquo; and &ldquo;as
              available&rdquo; basis. We may modify, suspend, or discontinue the
              service at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">Acceptable use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                use {SITE_NAME} in any way that violates applicable laws or
                regulations;
              </li>
              <li>
                attempt to disrupt the service, including through scraping at
                volumes that degrade performance for other users, denial-of-
                service activity, or attempts to bypass security mechanisms;
              </li>
              <li>
                use {SITE_NAME} to build a competing product through automated
                copying of our content or interface; or
              </li>
              <li>
                misrepresent your affiliation with {COMPANY_NAME} or{" "}
                {SITE_NAME}.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">Accuracy</h2>
            <p>
              {SITE_NAME} relies on the IANA time zone database and standard
              browser internationalization APIs to compute times and offsets.
              While we work to keep this information accurate, time zone rules
              and daylight saving schedules can change. {SITE_NAME} should not
              be used as the sole source for legally binding scheduling, flight
              planning, financial settlement, or other high-stakes decisions.
              Always verify with an authoritative source.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">Intellectual property</h2>
            <p>
              The {SITE_NAME} brand, design, and original content are owned by{" "}
              {COMPANY_NAME}. You may not copy, modify, or redistribute the site
              or its branding without prior written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">Disclaimer of warranties</h2>
            <p>
              {SITE_NAME} is provided &ldquo;as is&rdquo; without warranty of
              any kind, express or implied, including but not limited to the
              warranties of merchantability, fitness for a particular purpose,
              and non-infringement. {COMPANY_NAME} does not warrant that the
              service will be uninterrupted, error-free, or accurate.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">Limitation of liability</h2>
            <p>
              To the fullest extent permitted by law, {COMPANY_NAME} shall not
              be liable for any indirect, incidental, special, consequential, or
              punitive damages, or any loss of profits, revenue, data, or
              opportunity arising from your use of {SITE_NAME}, even if advised
              of the possibility of such damages.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">Changes to these terms</h2>
            <p>
              We may update these Terms from time to time. Material changes will
              be reflected by updating the effective date at the top of this
              page. Continued use of {SITE_NAME} after a change constitutes
              acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">Contact</h2>
            <p>
              Questions about these Terms can be sent to{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-white underline hover:no-underline"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </section>
        </div>
      </main>
      <TentacleFooter />
    </div>
  );
}
