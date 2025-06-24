import React from 'react'
import { render, screen } from '@testing-library/react'
import { HeroSection } from './HeroSection'

describe('HeroSection', () => {
  it('renders headline, subheadline, CTA, and branding', () => {
    render(<HeroSection />)
    expect(screen.getByRole('img', { name: /utmato logo/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Consistent Campaign Tracking/i)
    expect(screen.getByText(/Utmato helps marketing teams/i)).toBeInTheDocument()
    const cta = screen.getByRole('link', { name: /get started free/i })
    expect(cta).toBeInTheDocument()
    expect(cta).toHaveAttribute('href', '/sign-up/')
  })
}) 