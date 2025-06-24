import { render, screen, fireEvent } from '@testing-library/react'
import { CampaignCard } from './CampaignCard'

describe('CampaignCard', () => {
  it('renders name, status, and handles click', () => {
    const onClick = jest.fn()
    render(
      <CampaignCard name="Test Campaign" status="Active" onClick={onClick} />
    )
    expect(screen.getByText('Test Campaign')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Test Campaign'))
    expect(onClick).toHaveBeenCalled()
  })
}) 