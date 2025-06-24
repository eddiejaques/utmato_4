import { render, screen, fireEvent } from '@testing-library/react'
import { Alert } from './Alert'

describe('Alert', () => {
  it('renders message and calls onClose', () => {
    const onClose = jest.fn()
    render(<Alert message="Success!" type="success" onClose={onClose} />)
    expect(screen.getByText('Success!')).toBeInTheDocument()
    fireEvent.click(screen.getByText('×'))
    expect(onClose).toHaveBeenCalled()
  })
}) 