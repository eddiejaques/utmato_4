import React, { useState } from 'react';

interface PendingInvite {
  id: string;
  email: string;
  role: 'Team Member' | 'Viewer';
  status: 'pending' | 'expired';
}

const mockInvites: PendingInvite[] = [
  { id: '1', email: 'dave@company.com', role: 'Team Member', status: 'pending' },
  { id: '2', email: 'eve@company.com', role: 'Viewer', status: 'expired' },
];

export function PendingInvites() {
  const [invites, setInvites] = useState<PendingInvite[]>(mockInvites);
  const [message, setMessage] = useState<string | null>(null);

  function handleResend(id: string) {
    setMessage('Resend invite (mock)');
    // In real implementation, call API and update state
  }

  function handleCancel(id: string) {
    setInvites((prev) => prev.filter((invite) => invite.id !== id));
    setMessage('Invite cancelled (mock)');
  }

  return (
    <div data-testid="pending-invites-list">
      {message && <div className="text-green-600 text-sm mb-2">{message}</div>}
      {invites.length === 0 ? (
        <div className="text-muted-foreground">No pending invites.</div>
      ) : (
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invites.map((invite) => (
              <tr key={invite.id} className="border-b last:border-0">
                <td className="px-4 py-2">{invite.email}</td>
                <td className="px-4 py-2">{invite.role}</td>
                <td className="px-4 py-2">
                  <span className={
                    invite.status === 'pending'
                      ? 'text-yellow-600'
                      : 'text-gray-400 line-through'
                  }>
                    {invite.status}
                  </span>
                </td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                    disabled={invite.status !== 'pending'}
                    onClick={() => handleResend(invite.id)}
                    aria-label={`Resend invite to ${invite.email}`}
                  >
                    Resend
                  </button>
                  <button
                    className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200"
                    onClick={() => handleCancel(invite.id)}
                    aria-label={`Cancel invite to ${invite.email}`}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 