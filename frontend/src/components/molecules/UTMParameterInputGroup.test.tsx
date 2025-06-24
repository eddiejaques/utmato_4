import { render, screen, fireEvent } from '@testing-library/react'
import { UTMParameterInputGroup } from './UTMParameterInputGroup'

describe('UTMParameterInputGroup', () => {
  it('renders UTM fields and calls onChange', () => {
    const utmParams = { utm_source: '', utm_medium: '', utm_campaign: '' }
    const onChange = jest.fn()
    render(
      <UTMParameterInputGroup utmParams={utmParams} onChange={onChange} fields={['utm_source', 'utm_medium']} />
    )
    const sourceInput = screen.getByPlaceholderText(/source/i)
    fireEvent.change(sourceInput, { target: { value: 'google' } })
    expect(onChange).toHaveBeenCalledWith('utm_source', 'google')
  })
}) 