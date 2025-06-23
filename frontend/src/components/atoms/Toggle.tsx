import * as React from 'react'

export interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked: boolean
  onChange: (checked: boolean) => void
}

export function Toggle({ checked, onChange, className = '', ...props }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${checked ? 'bg-primary' : 'bg-muted'} ${className}`}
      {...props}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </button>
  )
} 