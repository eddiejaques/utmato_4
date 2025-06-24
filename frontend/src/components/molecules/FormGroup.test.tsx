import { render, screen } from '@testing-library/react'
import { FormGroup } from './FormGroup'

describe('FormGroup', () => {
  it('renders label and input', () => {
    render(<FormGroup label="Email" htmlFor="email" inputProps={{ id: 'email' }} />)
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })
}) 