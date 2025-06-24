import { Icon } from '../atoms/Icon'
import { SearchBox } from '../molecules/SearchBox'
import React from 'react'
import { SignedIn } from '@clerk/nextjs'
import { LogoutButton } from '@/components/Auth/LogoutButton'

export interface HeaderProps {
  userProfile?: React.ReactNode
  searchValue: string
  onSearchChange: (value: string) => void
  onSearch: () => void
}

export function Header({ userProfile, searchValue, onSearchChange, onSearch }: HeaderProps) {
  return (
    <header className="flex flex-col md:flex-row items-center justify-between px-4 py-2 border-b bg-white gap-2" role="banner">
      <div className="flex items-center gap-2">
        <Icon name="campaign" />
        <span className="font-bold text-xl">utmato</span>
      </div>
      <SearchBox value={searchValue} onChange={onSearchChange} onSearch={onSearch} />
      <div className="flex items-center gap-2">{userProfile}
        <SignedIn>
          <LogoutButton />
        </SignedIn>
      </div>
    </header>
  )
} 