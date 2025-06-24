import React from 'react'
import { render, screen } from '@testing-library/react'
import { FeaturesSection } from './FeaturesSection'

describe('FeaturesSection', () => {
  it('renders all features and CTA', () => {
    render(<FeaturesSection />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/Why Utmato/i)
    expect(screen.getByText(/Consistent Metadata/i)).toBeInTheDocument()
    expect(screen.getByText(/Instant UTM Generation/i)).toBeInTheDocument()
    expect(screen.getByText(/Searchable Campaigns/i)).toBeInTheDocument()
    expect(screen.getByText(/Team Collaboration/i)).toBeInTheDocument()
    const cta = screen.getByRole('link', { name: /start for free/i })
    expect(cta).toBeInTheDocument()
    expect(cta).toHaveAttribute('href', '/sign-up/')
  })
}) 