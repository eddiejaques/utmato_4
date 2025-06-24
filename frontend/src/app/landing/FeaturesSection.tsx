// TODO: Implement FeaturesSection as per future task (see task_049.txt)
// This component will display the value proposition/features for the landing page.
import React from 'react';
import { Button } from '@/components/atoms/Button'
import { Icon } from '@/components/atoms/Icon'

const features = [
  {
    icon: (
      <Icon size={32} color="#2563eb" title="Consistent Metadata">
        <rect x="4" y="8" width="16" height="8" rx="2" fill="currentColor" />
      </Icon>
    ),
    title: 'Consistent Metadata',
    description: 'Enforce campaign naming and metadata standards for reliable reporting.'
  },
  {
    icon: (
      <Icon size={32} color="#059669" title="Instant UTM Generation">
        <circle cx="12" cy="12" r="10" fill="currentColor" />
      </Icon>
    ),
    title: 'Instant UTM Generation',
    description: 'Generate trackable UTM links in seconds and never lose attribution.'
  },
  {
    icon: (
      <Icon size={32} color="#f59e42" title="Searchable Campaigns">
        <path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20zm4 10a4 4 0 1 0-8 0 4 4 0 0 0 8 0z" fill="currentColor" />
      </Icon>
    ),
    title: 'Searchable Campaigns',
    description: 'Find any campaign or UTM instantly with powerful search.'
  },
  {
    icon: (
      <Icon size={32} color="#7c3aed" title="Team Collaboration">
        <ellipse cx="12" cy="12" rx="10" ry="6" fill="currentColor" />
      </Icon>
    ),
    title: 'Team Collaboration',
    description: 'Invite your team and manage campaigns together (coming soon).'
  }
]

export function FeaturesSection() {
  return (
    <section
      className="w-full max-w-5xl mx-auto py-16 px-4 md:py-24 md:px-0"
      aria-label="Utmato Features"
    >
      <h2 className="font-sans font-bold text-2xl md:text-4xl text-center mb-10 text-neutral-900 dark:text-neutral-100">
        Why Utmato? Core Benefits
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {features.map((feature, idx) => (
          <div
            key={feature.title}
            className="flex flex-col items-center text-center p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-md h-full"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="font-sans font-semibold text-xl mb-2 text-neutral-900 dark:text-neutral-100">
              {feature.title}
            </h3>
            <p className="font-sans text-base text-neutral-900 dark:text-neutral-100 mb-2">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <Button asChild size="lg" variant="default" aria-label="Sign up for Utmato">
          <a href="/sign-up/">Start for Free</a>
        </Button>
      </div>
    </section>
  );
} 