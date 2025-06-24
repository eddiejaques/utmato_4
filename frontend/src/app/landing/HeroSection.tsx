// TODO: Implement HeroSection organism as per task_048.txt
// This component will be the hero section for the landing page, using existing atoms/molecules and design tokens.
import React from 'react';
import { Button } from '@/components/atoms/Button'

export function HeroSection() {
  return (
    <section
      className="flex flex-col items-center justify-center text-center py-16 px-4 md:py-32 md:px-0 bg-neutral-100 dark:bg-neutral-900"
      aria-label="Utmato Landing Hero"
    >
      <div className="mb-8">
        {/* Branding: Use globe.svg as a placeholder logo */}
        <img
          src="/globe.svg"
          alt="Utmato logo"
          className="mx-auto mb-4 w-16 h-16 md:w-24 md:h-24"
          width={96}
          height={96}
          loading="lazy"
        />
      </div>
      <h1 className="font-sans font-bold text-3xl md:text-5xl mb-4 text-neutral-900 dark:text-neutral-100">
        Consistent Campaign Tracking.<br className="hidden md:inline" /> Effortless UTM Management.
      </h1>
      <p className="font-sans text-lg md:text-2xl mb-8 text-neutral-900 dark:text-neutral-100 max-w-xl mx-auto">
        Utmato helps marketing teams create, track, and manage campaigns with ease. Maintain consistency, save time, and grow your results.
      </p>
      <Button
        asChild
        size="lg"
        variant="default"
        className="mb-2 md:mb-0"
        aria-label="Sign up for Utmato"
      >
        <a href="/sign-up/">Get Started Free</a>
      </Button>
    </section>
  );
} 