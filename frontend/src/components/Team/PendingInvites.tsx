import React, { useEffect, useState } from 'react';
import { fetchPendingInvites, rejectInvite } from '@/api/team';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface PendingInvite {
  id: string;
  email: string;
  role: 'Team Member' | 'Viewer';
  status: 'pending' | 'expired';
}

export function PendingInvites() {
  const token = useSelector((state: RootState) => state.auth.token);
  const company = useSelector((state: RootState) => state.auth.company);
  const [invites, setInvites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const loadInvites = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!company?.id) {
        setError('Company context is missing.');
        setInvites([]);
        return;
      }
      if (!token) {
        setError('Authentication token is missing.');
        setInvites([]);
        return;
      }
      const data = await fetchPendingInvites(company.id, token);
      setInvites(data || []);
    } catch (err: any) {
      setError('Failed to load invites');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvites();
  }, []);

  const handleResend = (id: string) => {
    setMessage('Resend is not supported yet.');
  };

  const handleCancel = async (id: string) => {
    if (!window.confirm('Cancel this invite? This cannot be undone.')) return;
    setCancellingId(id);
    try {
      await rejectInvite(id);
      setMessage('Invite cancelled.');
      loadInvites();
    } catch {
      setError('Failed to cancel invite');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div data-testid="pending-invites-list">
      {loading && <div>Loading invites...</div>}
      {error && <div className="text-red-600 text-sm" role="alert">{error}</div>}
      {message && <div className="text-green-600 text-sm mb-2" role="status">{message}</div>}
      {!loading && invites.length === 0 ? (
        <div className="text-muted-foreground">No pending invites.</div>
      ) : (
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invites.map((invite) => (
              <tr key={invite.id} className="border-b last:border-0">
                <td className="px-4 py-2">{invite.email}</td>
                <td className="px-4 py-2">{invite.role}</td>
                <td className="px-4 py-2 space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleResend(invite.id)}
                    aria-label={`Resend invite to ${invite.email}`}
                    disabled
                  >
                    Resend
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleCancel(invite.id)}
                    aria-label={`Cancel invite to ${invite.email}`}
                    disabled={cancellingId === invite.id}
                  >
                    {cancellingId === invite.id ? 'Cancelling...' : 'Cancel'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 