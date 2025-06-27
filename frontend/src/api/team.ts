import { TeamMember, Invite } from '@/types/user';
import { api } from './api';

export async function fetchTeam(token?: string | null): Promise<{ members: TeamMember[]; invites: Invite[] }> {
  // TODO: Replace '/team' with actual endpoint
  return api.get<{ members: TeamMember[]; invites: Invite[] }>('/team', token);
}

export async function inviteUser(payload: { email: string; role: string; company_id: string }, token: string): Promise<Invite> {
  // Updated to correct endpoint and payload
  return api.post<Invite>('/invitations/invite', payload, token);
}

export async function acceptInvite(inviteId: string): Promise<TeamMember> {
  // Updated to correct endpoint
  return api.post<TeamMember>(`/invitations/accept`, { token: inviteId });
}

export async function rejectInvite(inviteId: string): Promise<string> {
  // Updated to correct endpoint
  await api.post(`/invitations/reject`, { token: inviteId });
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

export async function fetchPendingInvites(companyId: string, token: string): Promise<Invite[]> {
  return api.get<Invite[]>(`/invitations/list/${companyId}`, token);
} 