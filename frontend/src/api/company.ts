import { CompanyDefaults } from '../types/company';

export async function getCompanyDefaults(): Promise<CompanyDefaults> {
  const res = await fetch('/api/v1/company/defaults', {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch company defaults');
  return res.json();
}

export async function updateCompanyDefaults(data: Partial<CompanyDefaults>): Promise<CompanyDefaults> {
  const res = await fetch('/api/v1/company/defaults', {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update company defaults');
  return res.json();
} 