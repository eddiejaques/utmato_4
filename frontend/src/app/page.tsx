"use client";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { HeroSection } from "./landing/HeroSection";
import { FeaturesSection } from "./landing/FeaturesSection";
import { SEO } from "./landing/SEO";
import { Button } from "@/components/atoms/Button";
import type { RootState } from "@/store";

export default function Home() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null; // Optionally, show a loading spinner
  }

  return (
    <>
      <SEO />
      <main id="main-content" tabIndex={-1}>
        <HeroSection />
        <FeaturesSection />
        <section className="flex justify-center py-12" aria-label="Sign up CTA">
          <Button asChild size="lg" variant="default" aria-label="Sign up for Utmato (footer)">
            <a href="/sign-up/">Create Your Free Account</a>
          </Button>
        </section>
      </main>
    </>
  );
}
