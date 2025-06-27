"use client";

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchCampaigns, deleteCampaign, duplicateCampaign } from '@/store/campaignSlice';
import { Campaign } from '@/types/campaign';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { useRouter } from 'next/navigation';
import { CampaignForm } from './CampaignForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export function CampaignList() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { campaigns, loading, error } = useSelector((state: RootState) => state.campaigns);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | undefined>(undefined);

  useEffect(() => {
    if (isAuthenticated && campaigns.length === 0) {
      dispatch(fetchCampaigns());
    }
  }, [dispatch, isAuthenticated, campaigns.length]);

  const handleEdit = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setEditModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if(window.confirm('Are you sure you want to delete this campaign?')) {
        dispatch(deleteCampaign(id));
    }
  };

  const handleDuplicate = (id: string) => {
    dispatch(duplicateCampaign(id));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
        <div className="flex justify-end mb-4">
            <Button onClick={() => setCreateModalOpen(true)}>Create Campaign</Button>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setCreateModalOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Campaign</DialogTitle>
                </DialogHeader>
                <CampaignForm onSuccess={() => setCreateModalOpen(false)} />
            </DialogContent>
        </Dialog>
        
        <Dialog open={isEditModalOpen} onOpenChange={setEditModalOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Campaign</DialogTitle>
                </DialogHeader>
                <CampaignForm campaign={selectedCampaign} onSuccess={() => setEditModalOpen(false)} />
            </DialogContent>
        </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.map((campaign) => (
            <TableRow key={campaign.id} >
              <TableCell onClick={() => router.push(`/campaigns/${campaign.id}`)} className="cursor-pointer">{campaign.name}</TableCell>
              <TableCell>{campaign.status}</TableCell>
              <TableCell>{new Date(campaign.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleEdit(campaign)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/campaigns/${campaign.id}`)}>View Details</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDuplicate(campaign.id)}>Duplicate</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleDelete(campaign.id)} className="text-red-600">Delete</DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 