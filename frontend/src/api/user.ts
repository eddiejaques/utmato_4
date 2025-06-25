import { User } from '@/types/user';
import { api } from './api';

export async function fetchUserProfile(): Promise<User> {
  // TODO: Replace '/user/profile' with actual endpoint
  return api.get<User>('/user/profile');
}

export async function updateUserProfile(profile: Partial<User>): Promise<User> {
  // TODO: Replace '/user/profile' with actual endpoint
  return api.put<User>('/user/profile', profile);
}

export async function changeUserRole(role: string): Promise<string> {
  // TODO: Replace '/user/role' with actual endpoint
  await api.put('/user/role', { role });
  return role;
} 