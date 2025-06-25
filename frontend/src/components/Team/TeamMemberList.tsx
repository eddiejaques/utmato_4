import React from 'react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Manager' | 'Team Member' | 'Viewer';
  status: 'active' | 'pending' | 'removed';
}

// Mock data for now
const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@company.com',
    role: 'Manager',
    status: 'active',
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@company.com',
    role: 'Team Member',
    status: 'active',
  },
  {
    id: '3',
    name: 'Carol Lee',
    email: 'carol@company.com',
    role: 'Viewer',
    status: 'pending',
  },
];

export function TeamMemberList() {
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
        {mockTeamMembers.map((member) => (
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
              {/* Role change action (placeholder) */}
              <button
                className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                disabled={member.status !== 'active'}
                aria-label={`Change role for ${member.name}`}
              >
                Change Role
              </button>
              {/* Remove action (placeholder) */}
              <button
                className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200"
                disabled={member.status !== 'active'}
                aria-label={`Remove ${member.name}`}
              >
                Remove
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
} 