import { Badge } from '../atoms/Badge'
import React from 'react'

export interface CampaignCardProps {
  name: string
  description?: string
  status: string
  onClick?: () => void
}

export function CampaignCard({ name, description, status, onClick }: CampaignCardProps) {
  return (
    <div className="border rounded-lg p-4 shadow hover:bg-muted cursor-pointer" onClick={onClick}>
      <div className="flex items-center gap-2 mb-2">
        <span className="font-semibold text-lg">{name}</span>
        <Badge>{status}</Badge>
      </div>
      {description && <div className="text-sm text-muted-foreground">{description}</div>}
    </div>
  )
} 