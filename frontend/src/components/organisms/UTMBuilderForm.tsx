import { FormGroup } from '../molecules/FormGroup'
import { UTMParameterInputGroup } from '../molecules/UTMParameterInputGroup'
import { Button } from '../atoms/Button'
import { URLPreview } from '../UTM/URLPreview'
import React from 'react'

export interface UTMBuilderFormProps {
  destinationUrl: string
  onDestinationUrlChange: (value: string) => void
  utmParams: { [key: string]: string }
  onUtmParamChange: (key: string, value: string) => void
  onGenerate: () => void
  generatedUrl: string
  isGenerating?: boolean
}

export function UTMBuilderForm({
  destinationUrl,
  onDestinationUrlChange,
  utmParams,
  onUtmParamChange,
  onGenerate,
  generatedUrl,
  isGenerating,
}: UTMBuilderFormProps) {
  return (
    <form className="flex flex-col gap-4" onSubmit={e => { e.preventDefault(); onGenerate(); }}>
      <FormGroup
        label="Destination URL"
        htmlFor="destination-url"
        inputProps={{
          id: 'destination-url',
          value: destinationUrl,
          onChange: e => onDestinationUrlChange(e.target.value),
          placeholder: 'https://example.com',
          required: true,
        }}
      />
      <UTMParameterInputGroup utmParams={utmParams} onChange={onUtmParamChange} />
      <Button type="submit" disabled={isGenerating}>
        {isGenerating ? 'Generating...' : 'Generate UTM Link'}
      </Button>
      {generatedUrl && <URLPreview url={generatedUrl} />}
    </form>
  )
} 