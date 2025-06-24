import { CampaignCard } from '../molecules/CampaignCard'
import { SearchBox } from '../molecules/SearchBox'
import React from 'react'

export interface CampaignListContainerProps {
  campaigns: { id: string; name: string; description?: string; status: string }[]
  searchValue: string
  onSearchChange: (value: string) => void
  onSearch: () => void
  onCampaignClick?: (id: string) => void
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function CampaignListContainer({
  campaigns,
  searchValue,
  onSearchChange,
  onSearch,
  onCampaignClick,
  page,
  totalPages,
  onPageChange,
}: CampaignListContainerProps) {
  return (
    <section className="flex flex-col gap-4">
      <SearchBox value={searchValue} onChange={onSearchChange} onSearch={onSearch} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="list">
        {campaigns.map(campaign => (
          <CampaignCard
            key={campaign.id}
            name={campaign.name}
            description={campaign.description}
            status={campaign.status}
            onClick={() => onCampaignClick?.(campaign.id)}
          />
        ))}
      </div>
      <nav className="flex justify-center gap-2 mt-4" aria-label="Pagination">
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          Previous
        </button>
        <span className="px-2">Page {page} of {totalPages}</span>
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
        >
          Next
        </button>
      </nav>
    </section>
  )
} 