import { TeamMember, Invite } from '@/types/user';
import { api } from './api';

export async function fetchTeam(): Promise<{ members: TeamMember[]; invites: Invite[] }> {
  // TODO: Replace '/team' with actual endpoint
  return api.get<{ members: TeamMember[]; invites: Invite[] }>('/team');
}

export async function inviteUser(payload: { email: string; role: string }): Promise<Invite> {
  // TODO: Replace '/team/invite' with actual endpoint
  return api.post<Invite>('/team/invite', payload);
}

export async function acceptInvite(inviteId: string): Promise<TeamMember> {
  // TODO: Replace `/team/invite/${inviteId}/accept` with actual endpoint
  return api.post<TeamMember>(`/team/invite/${inviteId}/accept`, {});
}

export async function rejectInvite(inviteId: string): Promise<string> {
  // TODO: Replace `/team/invite/${inviteId}/reject` with actual endpoint
  await api.post(`/team/invite/${inviteId}/reject`, {});
  return inviteId;
}

export async function removeUser(userId: string): Promise<string> {
  // TODO: Replace `/team/member/${userId}` with actual endpoint
  await api.delete(`/team/member/${userId}`);
  return userId;
}

export async function updateUserRole(payload: { userId: string; role: string }): Promise<{ userId: string; role: string }> {
  // TODO: Replace `/team/member/${payload.userId}/role` with actual endpoint
  await api.put(`/team/member/${payload.userId}/role`, { role: payload.role });
  return payload;
} 