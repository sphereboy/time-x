import { Hero } from "./Hero";
import { Preview } from "./Preview";
import { Features } from "./Features";
import { PopularLinks } from "./PopularLinks";
import { Footer } from "./Footer";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Hero />
      <Preview />
      <Features />
      <PopularLinks />
      <Footer />
    </div>
  );
}
