import { createFileRoute } from "@tanstack/react-router";

import { About } from "@/components/landing/about";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { SiteNav } from "@/components/landing/site-nav";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <main className="min-h-svh bg-ink text-parchment">
      <SiteNav />
      <Hero />
      <About />
      <Features />
      <Footer />
    </main>
  );
}
