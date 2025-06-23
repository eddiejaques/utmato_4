import * as React from 'react'

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Radio(props: RadioProps) {
  return (
    <input
      type="radio"
      className="h-4 w-4 rounded-full border border-input text-primary focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
      {...props}
    />
  )
} 