import { User } from '@/types/user';
import { api } from './api';

export async function fetchUserProfile(token?: string | null): Promise<User> {
  // Calls '/users/profile' endpoint
  return api.get<User>('/users/profile', token);
}

export async function updateUserProfile(profile: Partial<User>): Promise<User> {
  // Calls '/users/profile' endpoint
  return api.put<User>('/users/profile', profile);
}

export async function changeUserRole(role: string): Promise<string> {
  // TODO: Replace '/user/role' with actual endpoint
  await api.put('/user/role', { role });
  return role;
} 