import { render, screen, fireEvent } from '@testing-library/react'
import { CampaignListContainer } from './CampaignListContainer'

describe('CampaignListContainer', () => {
  it('renders campaigns, search, and pagination', () => {
    const onSearchChange = jest.fn()
    const onSearch = jest.fn()
    const onCampaignClick = jest.fn()
    const onPageChange = jest.fn()
    render(
      <CampaignListContainer
        campaigns={[{ id: '1', name: 'Camp1', status: 'Active' }]}
        searchValue=""
        onSearchChange={onSearchChange}
        onSearch={onSearch}
        onCampaignClick={onCampaignClick}
        page={1}
        totalPages={2}
        onPageChange={onPageChange}
      />
    )
    expect(screen.getByText('Camp1')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Camp1'))
    expect(onCampaignClick).toHaveBeenCalledWith('1')
    fireEvent.click(screen.getByText('Next'))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })
}) 