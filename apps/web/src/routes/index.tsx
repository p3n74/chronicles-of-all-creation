import { createFileRoute } from "@tanstack/react-router";

import { About } from "@/components/landing/about";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { Questlines } from "@/components/landing/questlines";
import { SiteNav } from "@/components/landing/site-nav";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="w-full max-w-full overflow-x-hidden bg-ink text-parchment">
      <div id="nav-sentinel" className="pointer-events-none absolute top-0 h-px w-full" aria-hidden />
      <SiteNav />
      <main id="main">
        <Hero />
        <About />
        <Features />
        <Questlines />
        <Footer />
      </main>
    </div>
  );
}
