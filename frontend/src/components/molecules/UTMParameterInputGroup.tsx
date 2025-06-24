import { Input } from '../atoms/Input'
import React from 'react'

export interface UTMParameterInputGroupProps {
  utmParams: { [key: string]: string }
  onChange: (key: string, value: string) => void
  fields?: string[]
}

const defaultFields = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
]

export function UTMParameterInputGroup({ utmParams, onChange, fields = defaultFields }: UTMParameterInputGroupProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {fields.map(field => (
        <Input
          key={field}
          value={utmParams[field] || ''}
          onChange={e => onChange(field, e.target.value)}
          placeholder={field.replace('utm_', '').replace('_', ' ').toUpperCase()}
          name={field}
          label={field.replace('utm_', '').replace('_', ' ').toUpperCase()}
        />
      ))}
    </div>
  )
} 