import { Input } from '../atoms/Input'
import { Button } from '../atoms/Button'
import React from 'react'

export interface SearchBoxProps {
  value: string
  onChange: (value: string) => void
  onSearch: () => void
  placeholder?: string
  isLoading?: boolean
}

export function SearchBox({ value, onChange, onSearch, placeholder, isLoading }: SearchBoxProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 items-center w-full" role="search" aria-label="Search">
      <Input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || 'Search...'}
        className="flex-1"
        aria-label={placeholder || 'Search'}
      />
      <Button onClick={onSearch} disabled={isLoading} type="button" aria-label="Search">
        {isLoading ? 'Searching...' : 'Search'}
      </Button>
    </div>
  )
} 