'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { copyToClipboard } from '@/lib/clipboard';
import { toast } from 'sonner';


interface URLPreviewProps {
  url: string;
}

export function URLPreview({ url }: URLPreviewProps) {
  const handleCopy = () => {
    if (url) {
      copyToClipboard(url)
        .then(() => {
            toast.success('URL copied to clipboard!');
        })
        .catch(() => {
            toast.error('Failed to copy URL.');
        });
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="generated-url">Generated URL</Label>
      <div className="flex items-center space-x-2">
        <Input id="generated-url" value={url} readOnly placeholder="Your generated URL will appear here" />
        <Button onClick={handleCopy} disabled={!url}>
          Copy
        </Button>
      </div>
    </div>
  );
} 