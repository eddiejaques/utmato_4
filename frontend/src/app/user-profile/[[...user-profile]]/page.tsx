'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { fetchUserProfileThunk } from '@/store/userSlice';
import { fetchCampaigns, deleteCampaign } from '@/store/campaignSlice';
import { fetchUTMLinksByCampaign } from '@/store/utmSlice';
import { deleteUTMLink } from '@/api/utm';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useAuth } from '@clerk/nextjs';
import { InviteUserForm } from '@/components/Team/InviteUserForm';
import { PendingInvites } from '@/components/Team/PendingInvites';

export default function UserProfilePage() {
  const dispatch = useDispatch();
  const { getToken } = useAuth();
  const user = useSelector((state: RootState) => state.user.profile);
  const campaigns = useSelector((state: RootState) => state.campaigns.campaigns);
  const campaignLoading = useSelector((state: RootState) => state.campaigns.loading);
  const utmLinks = useSelector((state: RootState) => state.utm.campaignLinks);
  const utmLoading = useSelector((state: RootState) => state.utm.loading);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [deletingCampaignId, setDeletingCampaignId] = useState<string | null>(null);
  const [deletingUTMLinkId, setDeletingUTMLinkId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = await getToken();
      dispatch(fetchUserProfileThunk(token ?? undefined) as any);
    };
    fetchProfile();
  }, [dispatch, getToken]);

  useEffect(() => {
    if (selectedCampaignId) {
      dispatch(fetchUTMLinksByCampaign(selectedCampaignId) as any);
    }
  }, [dispatch, selectedCampaignId]);

  if (!user) {
    return <div className="p-8">Loading profile...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <section aria-label="User Info" className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-bold mb-2">Profile</h2>
        <div className="flex flex-col gap-2">
          <span><strong>Name:</strong> {user.first_name} {user.last_name}</span>
          <span><strong>Email:</strong> {user.email}</span>
        </div>
      </section>
      {/* Access Management Section */}
      <section aria-label="Access Management" className="bg-white rounded shadow p-6">
        <h2 className="text-2xl font-bold mb-6">Access Management</h2>
        {/* Invite Team Member Modal */}
        <div className="mb-8">
          <div className="font-semibold mb-2">Invite Team Members</div>
          <div className="border rounded p-4 bg-muted/50">
            <InviteUserForm />
          </div>
        </div>
        {/* Pending Invites List */}
        <div className="mb-8">
          <div className="font-semibold mb-2">Pending Invitations</div>
          <div className="border rounded p-4 bg-muted/50">
            <PendingInvites />
          </div>
        </div>
        {/* Team Member List */}
        <div>
          <div className="font-semibold mb-2">Team Members</div>
          <div className="border rounded p-4 bg-muted/50">
            {/* <TeamMemberList /> */}
            <div className="text-muted-foreground">[TeamMemberList placeholder]</div>
          </div>
        </div>
      </section>
    </div>
  );
} 