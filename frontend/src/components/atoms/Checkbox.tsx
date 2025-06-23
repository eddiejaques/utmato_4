import * as React from 'react'

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Checkbox(props: CheckboxProps) {
  return (
    <input
      type="checkbox"
      className="h-4 w-4 rounded border border-input text-primary focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
      {...props}
    />
  )
} 