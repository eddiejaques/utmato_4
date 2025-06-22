"use client";

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchCampaignById, deleteCampaign, updateCampaign } from '@/store/campaignSlice';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CampaignForm } from '@/components/Campaigns/CampaignForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Campaign, CampaignStatus } from '@/types/campaign';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  

export default function CampaignDetailPage() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    
    const { currentCampaign, loading, error } = useSelector((state: RootState) => state.campaigns);
    const [isEditModalOpen, setEditModalOpen] = useState(false);

    useEffect(() => {
        if (id) {
            dispatch(fetchCampaignById(id));
        }
    }, [dispatch, id]);

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this campaign?')) {
            dispatch(deleteCampaign(id)).then(() => {
                router.push('/dashboard');
            });
        }
    };
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!currentCampaign) return <div>Campaign not found.</div>;

    return (
        <div className="container mx-auto py-10">
             <Card>
                <CardHeader>
                    <CardTitle>{currentCampaign.name}</CardTitle>
                    <CardDescription>Campaign ID: {currentCampaign.id}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p><strong>Status:</strong> {currentCampaign.status}</p>
                    <p><strong>Created:</strong> {new Date(currentCampaign.created_at).toLocaleString()}</p>
                    {currentCampaign.updated_at && <p><strong>Last Updated:</strong> {new Date(currentCampaign.updated_at).toLocaleString()}</p>}
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => router.push('/dashboard')}>Back to List</Button>
                    <Button onClick={() => setEditModalOpen(true)}>Edit</Button>
                    <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                </CardFooter>
            </Card>

            <Dialog open={isEditModalOpen} onOpenChange={setEditModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Campaign</DialogTitle>
                    </DialogHeader>
                    <CampaignForm campaign={currentCampaign} onSuccess={() => setEditModalOpen(false)} />
                </DialogContent>
            </Dialog>
        </div>
    );
} 