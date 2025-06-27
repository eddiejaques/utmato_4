import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { fetchTeam, removeUser, updateUserRole } from '@/api/team';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Manager' | 'Team Member' | 'Viewer';
  status: 'active' | 'pending' | 'removed';
}

export function TeamMemberList() {
  const [members, setMembers] = React.useState<TeamMember[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [changingRoleId, setChangingRoleId] = React.useState<string | null>(null);
  const [removingId, setRemovingId] = React.useState<string | null>(null);

  const loadTeam = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTeam();
      setMembers(data.members);
    } catch (err: any) {
      setError('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeam();
  }, []);

  const handleRoleChange = async (userId: string, currentRole: string) => {
    const newRole = window.prompt('Enter new role (Manager, Team Member, Viewer):', currentRole);
    if (!newRole || newRole === currentRole) return;
    setChangingRoleId(userId);
    try {
      await updateUserRole({ userId, role: newRole });
      toast.success('Role updated');
      loadTeam();
    } catch {
      toast.error('Failed to update role');
    } finally {
      setChangingRoleId(null);
    }
  };

  const handleRemove = async (userId: string) => {
    if (!window.confirm('Remove this user from the team? This cannot be undone.')) return;
    setRemovingId(userId);
    try {
      await removeUser(userId);
      toast.success('User removed');
      loadTeam();
    } catch {
      toast.error('Failed to remove user');
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) return <div>Loading team members...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <table className="min-w-full text-sm" data-testid="team-member-list">
      <thead>
        <tr className="bg-muted">
          <th className="px-4 py-2 text-left">Name</th>
          <th className="px-4 py-2 text-left">Email</th>
          <th className="px-4 py-2 text-left">Role</th>
          <th className="px-4 py-2 text-left">Status</th>
          <th className="px-4 py-2 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {members.map((member: TeamMember) => (
          <tr key={member.id} className="border-b last:border-0">
            <td className="px-4 py-2">{member.name}</td>
            <td className="px-4 py-2">{member.email}</td>
            <td className="px-4 py-2">
              <span className="capitalize">{member.role}</span>
            </td>
            <td className="px-4 py-2">
              <span className={
                member.status === 'active'
                  ? 'text-green-600'
                  : member.status === 'pending'
                  ? 'text-yellow-600'
                  : 'text-gray-400 line-through'
              }>
                {member.status}
              </span>
            </td>
            <td className="px-4 py-2 space-x-2">
              <Button
                variant="outline"
                size="sm"
                aria-label={`Change role for ${member.name}`}
                disabled={member.status !== 'active' || changingRoleId === member.id}
                onClick={() => handleRoleChange(member.id, member.role)}
              >
                {changingRoleId === member.id ? 'Changing...' : 'Change Role'}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                aria-label={`Remove ${member.name}`}
                disabled={member.status !== 'active' || removingId === member.id}
                onClick={() => handleRemove(member.id)}
              >
                {removingId === member.id ? 'Removing...' : 'Remove'}
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
} 