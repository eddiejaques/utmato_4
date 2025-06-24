import { Button } from '../atoms/Button'
import React from 'react'

export interface SidebarProps {
  userInfo?: React.ReactNode
  navLinks: { label: string; href: string }[]
  onNavClick?: (href: string) => void
}

export function Sidebar({ userInfo, navLinks, onNavClick }: SidebarProps) {
  return (
    <aside className="w-64 h-full border-r bg-white flex flex-col gap-4 p-4">
      {userInfo && <div className="mb-4">{userInfo}</div>}
      <nav className="flex flex-col gap-2">
        {navLinks.map(link => (
          <Button key={link.href} variant="ghost" onClick={() => onNavClick?.(link.href)}>
            {link.label}
          </Button>
        ))}
      </nav>
    </aside>
  )
} 