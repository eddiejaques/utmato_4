'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { setUTMField, clearUTMFields, validateUrl, generateUTMLink } from '@/store/utmSlice';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { UTMParameterInput } from './UTMParameterInput';
import { URLPreview } from './URLPreview';
import { UTMLinkCreate } from '@/types/utm';

interface UTMBuilderModalProps {
    campaignId: string;
}

export function UTMBuilderModal({ campaignId }: UTMBuilderModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const utmState = useSelector((state: RootState) => state.utm);
  const {
    destinationUrl,
    utmSource,
    utmMedium,
    utmTerm,
    utmContent,
    generatedUrl,
    validation,
    loading
  } = utmState;

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (destinationUrl) {
      const handler = setTimeout(() => {
        dispatch(validateUrl({ url: destinationUrl }));
      }, 500);

      return () => {
        clearTimeout(handler);
      };
    }
  }, [destinationUrl, dispatch]);

  const handleFieldChange = (field: any, value: string) => {
    dispatch(setUTMField({ field, value }));
  };
  
  const handleGenerateLink = () => {
    const utmData: UTMLinkCreate = {
      destination_url: destinationUrl,
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_term: utmTerm,
      utm_content: utmContent,
      campaign_id: campaignId
    };
    dispatch(generateUTMLink(utmData));
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      dispatch(clearUTMFields());
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>Create UTM Link</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Create UTM Link</DialogTitle>
          <DialogDescription>
            Fill in the details below to generate a trackable UTM link for your campaign.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <UTMParameterInput
                id="destinationUrl"
                label="Destination URL"
                value={destinationUrl}
                onChange={(e) => handleFieldChange('destinationUrl', e.target.value)}
                placeholder="https://example.com"
                required
            />
             {validation.message && (
                <p className={`text-sm ${validation.isValid ? 'text-green-600' : 'text-red-600'}`}>
                    {validation.message}
                </p>
            )}
          <div className="grid grid-cols-2 gap-4">
            <UTMParameterInput
              id="utmSource"
              label="Source"
              value={utmSource}
              onChange={(e) => handleFieldChange('utmSource', e.target.value)}
              placeholder="e.g., google, newsletter"
              required
            />
            <UTMParameterInput
              id="utmMedium"
              label="Medium"
              value={utmMedium}
              onChange={(e) => handleFieldChange('utmMedium', e.target.value)}
              placeholder="e.g., cpc, email"
              required
            />
          </div>
          <UTMParameterInput
            id="utmTerm"
            label="Term"
            value={utmTerm}
            onChange={(e) => handleFieldChange('utmTerm', e.target.value)}
            placeholder="e.g., running+shoes (Optional)"
          />
          <UTMParameterInput
            id="utmContent"
            label="Content"
            value={utmContent}
            onChange={(e) => handleFieldChange('utmContent', e.target.value)}
            placeholder="e.g., logo_link, text_ad (Optional)"
          />
          <URLPreview url={generatedUrl} />
        </div>
        <DialogFooter>
          <Button 
            type="button" 
            onClick={handleGenerateLink} 
            disabled={!validation.isValid || !utmSource || !utmMedium || loading}
          >
            {loading ? 'Generating...' : 'Generate Link'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 