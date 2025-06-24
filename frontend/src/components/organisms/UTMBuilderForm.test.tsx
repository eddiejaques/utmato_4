import { render, screen, fireEvent } from '@testing-library/react'
import { UTMBuilderForm } from './UTMBuilderForm'

describe('UTMBuilderForm', () => {
  it('renders destination url, utm fields, and generates url', () => {
    const onDestinationUrlChange = jest.fn()
    const onUtmParamChange = jest.fn()
    const onGenerate = jest.fn()
    render(
      <UTMBuilderForm
        destinationUrl="https://example.com"
        onDestinationUrlChange={onDestinationUrlChange}
        utmParams={{ utm_source: '', utm_medium: '' }}
        onUtmParamChange={onUtmParamChange}
        onGenerate={onGenerate}
        generatedUrl="https://example.com?utm_source=google"
      />
    )
    expect(screen.getByLabelText(/destination url/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /generate/i })).toBeInTheDocument()
    expect(screen.getByText(/utm_source/i)).toBeInTheDocument()
    expect(screen.getByText(/utm_medium/i)).toBeInTheDocument()
    expect(screen.getByText('https://example.com?utm_source=google')).toBeInTheDocument()
  })
}) 