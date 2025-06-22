'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { copyToClipboard } from '@/lib/clipboard';
import { UTMLink } from '@/types/utm';
import { toast } from 'sonner';

interface UTMLinkListProps {
  links: UTMLink[];
}

export function UTMLinkList({ links }: UTMLinkListProps) {
  const handleCopy = (url: string) => {
    copyToClipboard(url)
      .then(() => {
        toast.success('URL copied to clipboard!');
      })
      .catch(() => {
        toast.error('Failed to copy URL.');
      });
  };

  if (links.length === 0) {
    return <p>No UTM links have been generated for this campaign yet.</p>;
  }

  return (
    <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Generated UTM Links</h3>
        <Table>
        <TableHeader>
            <TableRow>
            <TableHead>Generated URL</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Medium</TableHead>
            <TableHead className="text-right">Actions</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {links.map((link) => (
            <TableRow key={link.id}>
                <TableCell className="font-medium truncate max-w-xs">{link.generated_url}</TableCell>
                <TableCell>{link.utm_source}</TableCell>
                <TableCell>{link.utm_medium}</TableCell>
                <TableCell className="text-right">
                <Button variant="outline" size="sm" onClick={() => handleCopy(link.generated_url)}>
                    Copy
                </Button>
                </TableCell>
            </TableRow>
            ))}
        </TableBody>
        </Table>
    </div>
  );
} 