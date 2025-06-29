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
import Link from 'next/link';
import { Icon } from '@/components/atoms/Icon';
import { getCompanyDefaults, updateCompanyDefaults } from '@/api/company';
import type { CompanyDefaults } from '@/types/company';
import { Input } from '@/components/ui/input';

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
  const [companyDefaults, setCompanyDefaults] = useState<CompanyDefaults | null>(null);
  const [loadingDefaults, setLoadingDefaults] = useState(false);
  const [newInterest, setNewInterest] = useState('');
  const [newAudience, setNewAudience] = useState('');
  const [saving, setSaving] = useState(false);

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

  // Fetch company defaults if user is manager
  useEffect(() => {
    if (user?.role === 'MANAGER') {
      setLoadingDefaults(true);
      getCompanyDefaults()
        .then(setCompanyDefaults)
        .catch(() => toast.error('Failed to load company defaults'))
        .finally(() => setLoadingDefaults(false));
    }
  }, [user]);

  const handleAddInterest = async () => {
    if (!newInterest.trim() || !companyDefaults) return;
    const updated = { ...companyDefaults, interests: [...companyDefaults.interests, newInterest.trim()] };
    setSaving(true);
    try {
      const res = await updateCompanyDefaults({ interests: updated.interests });
      setCompanyDefaults(res);
      setNewInterest('');
      toast.success('Interest added');
    } catch {
      toast.error('Failed to add interest');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveInterest = async (interest: string) => {
    if (!companyDefaults) return;
    const updated = { ...companyDefaults, interests: companyDefaults.interests.filter(i => i !== interest) };
    setSaving(true);
    try {
      const res = await updateCompanyDefaults({ interests: updated.interests });
      setCompanyDefaults(res);
      toast.success('Interest removed');
    } catch {
      toast.error('Failed to remove interest');
    } finally {
      setSaving(false);
    }
  };

  const handleAddAudience = async () => {
    if (!newAudience.trim() || !companyDefaults) return;
    const updated = { ...companyDefaults, audiences: [...companyDefaults.audiences, newAudience.trim()] };
    setSaving(true);
    try {
      const res = await updateCompanyDefaults({ audiences: updated.audiences });
      setCompanyDefaults(res);
      setNewAudience('');
      toast.success('Audience added');
    } catch {
      toast.error('Failed to add audience');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveAudience = async (audience: string) => {
    if (!companyDefaults) return;
    const updated = { ...companyDefaults, audiences: companyDefaults.audiences.filter(a => a !== audience) };
    setSaving(true);
    try {
      const res = await updateCompanyDefaults({ audiences: updated.audiences });
      setCompanyDefaults(res);
      toast.success('Audience removed');
    } catch {
      toast.error('Failed to remove audience');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return <div className="p-8">Loading profile...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <div className="mb-4">
        <Link href="/dashboard" aria-label="Back to dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-1">
          <Icon size={24} title="Back to dashboard">
            <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </Icon>
          <span className="hidden sm:inline">Back to Dashboard</span>
        </Link>
      </div>
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
      {/* Company Defaults Management Section (Manager only) */}
      {user.role === 'MANAGER' && (
        <section aria-label="Company Defaults" className="bg-white rounded shadow p-6">
          <h2 className="text-2xl font-bold mb-6">Default Interests & Audiences</h2>
          {loadingDefaults ? (
            <div>Loading defaults...</div>
          ) : companyDefaults ? (
            <>
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Default Interests</h3>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newInterest}
                    onChange={e => setNewInterest(e.target.value)}
                    placeholder="Add interest"
                    className="w-64"
                    disabled={saving}
                    onKeyDown={e => e.key === 'Enter' && handleAddInterest()}
                  />
                  <Button onClick={handleAddInterest} disabled={saving || !newInterest.trim()} size="sm">Add</Button>
                </div>
                <ul className="flex flex-wrap gap-2">
                  {companyDefaults.interests.map((interest) => (
                    <li key={interest} className="bg-muted px-3 py-1 rounded-full flex items-center gap-2">
                      <span>{interest}</span>
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveInterest(interest)} disabled={saving} aria-label={`Remove ${interest}`}>
                        ×
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Default Audiences</h3>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newAudience}
                    onChange={e => setNewAudience(e.target.value)}
                    placeholder="Add audience"
                    className="w-64"
                    disabled={saving}
                    onKeyDown={e => e.key === 'Enter' && handleAddAudience()}
                  />
                  <Button onClick={handleAddAudience} disabled={saving || !newAudience.trim()} size="sm">Add</Button>
                </div>
                <ul className="flex flex-wrap gap-2">
                  {companyDefaults.audiences.map((audience) => (
                    <li key={audience} className="bg-muted px-3 py-1 rounded-full flex items-center gap-2">
                      <span>{audience}</span>
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveAudience(audience)} disabled={saving} aria-label={`Remove ${audience}`}>
                        ×
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div>No defaults set.</div>
          )}
        </section>
      )}
    </div>
  );
} 