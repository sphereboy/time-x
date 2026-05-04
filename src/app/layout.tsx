import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import { StructuredData } from "@/components/StructuredData";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const SITE_NAME = "TZGrid";
const SITE_TITLE = "TZGrid — Compare Time Zones at a Glance";
const SITE_DESCRIPTION =
  "Compare time zones at a glance with stunning day and night gradients. Add locations, customize labels, and travel through time.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.tzgrid.com"),
  title: {
    default: SITE_TITLE,
    template: "%s | TZGrid",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "time zone converter",
    "world clock",
    "timezone comparison",
    "meeting planner",
    "international time",
    "TZGrid",
  ],
  authors: [{ name: "TZGrid" }],
  creator: "TZGrid",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: SITE_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
    ],
    apple: { url: "/icon.png", sizes: "192x192", type: "image/png" },
  },
  manifest: "/manifest.json",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <StructuredData />
        {process.env.NODE_ENV === "production" && (
          <>
            <Script id="ga-optout" strategy="beforeInteractive">
              {`
                try {
                  var p = new URLSearchParams(window.location.search);
                  if (p.get('gaoff') === '1') localStorage.setItem('ga-optout', '1');
                  if (p.get('gaon') === '1') localStorage.removeItem('ga-optout');
                  if (localStorage.getItem('ga-optout') === '1') {
                    window['ga-disable-G-X6F87S4SBR'] = true;
                  }
                } catch (e) {}
              `}
            </Script>
            <Script
              src="https://www.googletagmanager.com/gtag/js?id=G-X6F87S4SBR"
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-X6F87S4SBR');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
