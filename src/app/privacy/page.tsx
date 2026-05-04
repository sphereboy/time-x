import type { Metadata } from "next";
import Link from "next/link";
import { COMPANY_NAME, CONTACT_EMAIL, SITE_NAME } from "@/config/site";
import { TentacleFooter } from "@/components/tentacle/TentacleFooter";

export const dynamic = "force-static";

const EFFECTIVE_DATE = "May 4, 2026";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${SITE_NAME}, operated by ${COMPANY_NAME}.`,
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <main className="max-w-3xl mx-auto px-6 py-10 md:py-16">
        <nav className="text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-white">
            Home
          </Link>{" "}
          <span className="text-gray-600">/</span>{" "}
          <span className="text-gray-300">Privacy Policy</span>
        </nav>

        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
          Privacy Policy
        </h1>
        <p className="text-gray-400 mb-10">
          Effective {EFFECTIVE_DATE}. {SITE_NAME} is operated by{" "}
          {COMPANY_NAME}.
        </p>

        <div className="prose prose-invert max-w-none space-y-6 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white">Overview</h2>
            <p>
              {SITE_NAME} is a free, browser-based timezone comparison tool. We
              collect as little information as possible. We do not require an
              account, we do not sell or share personal information, and we do
              not store your timezone configuration on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">
              Information stored in your browser
            </h2>
            <p>
              Your saved locations, custom labels, and display preferences (such
              as 24-hour format and theme) are stored locally in your browser
              using <code>localStorage</code>. This data never leaves your
              device, is never transmitted to {COMPANY_NAME}, and can be cleared
              at any time by clearing your browser&apos;s site data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">Analytics</h2>
            <p>
              We use Google Analytics (gtag.js) to understand aggregate usage of{" "}
              {SITE_NAME} — for example, which pages are visited and which
              features are popular. Google Analytics may set cookies and process
              your IP address as described in Google&apos;s privacy policy.
            </p>
            <p>
              You can opt out by appending <code>?gaoff=1</code> to any URL on{" "}
              {SITE_NAME}. This sets a flag in your browser that disables
              Google Analytics on subsequent visits. To re-enable, append{" "}
              <code>?gaon=1</code>. You can also use any standard
              browser-level tracking-protection or opt-out tooling.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">Cookies</h2>
            <p>
              {SITE_NAME} itself does not set first-party cookies. Cookies that
              appear in your browser while using {SITE_NAME} are set by Google
              Analytics. See the analytics section above for opt-out
              instructions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">Third-party services</h2>
            <p>
              The only third-party data processor used by {SITE_NAME} is Google
              Analytics. We do not embed third-party trackers, advertising
              pixels, or social-media widgets.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">Children&apos;s privacy</h2>
            <p>
              {SITE_NAME} is not directed at children under 13 and does not
              knowingly collect personal information from them. If you believe a
              child has provided personal information, please contact us so we
              can investigate.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">Changes to this policy</h2>
            <p>
              We may update this policy from time to time. Material changes will
              be reflected by updating the effective date at the top of this
              page. Continued use of {SITE_NAME} after a change constitutes
              acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">Contact</h2>
            <p>
              Questions about this policy can be sent to{" "}
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
