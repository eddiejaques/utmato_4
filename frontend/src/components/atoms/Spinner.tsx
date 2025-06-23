import * as React from 'react'

export interface SpinnerProps extends React.HTMLAttributes<SVGElement> {
  size?: number | string
}

export function Spinner({ size = 24, className = '', ...props }: SpinnerProps) {
  return (
    <svg
      className={`animate-spin text-primary ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      role="status"
      aria-label="Loading"
      {...props}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  )
} 