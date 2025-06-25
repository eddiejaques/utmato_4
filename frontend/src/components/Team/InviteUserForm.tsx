import React, { useState } from 'react';
import { inviteUser } from '@/api/team';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface InviteFormState {
  emails: string;
  role: 'Team Member' | 'Viewer';
  error?: string;
  success?: string;
  loading?: boolean;
}

export function InviteUserForm() {
  const [form, setForm] = useState<InviteFormState>({ emails: '', role: 'Team Member' });
  const company = useSelector((state: RootState) => state.auth.company);
  const token = useSelector((state: RootState) => state.auth.token);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value, error: undefined, success: undefined });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setForm((f) => ({ ...f, error: undefined, success: undefined }));
    if (!form.emails.trim()) {
      setForm((f) => ({ ...f, error: 'Please enter at least one email address.' }));
      return;
    }
    if (!company?.id) {
      setForm((f) => ({ ...f, error: 'Company context is missing.' }));
      return;
    }
    if (!token) {
      setForm((f) => ({ ...f, error: 'Authentication token is missing.' }));
      return;
    }
    const emails = Array.from(new Set(form.emails.split(',').map((em) => em.trim()).filter(Boolean)));
    if (emails.length === 0) {
      setForm((f) => ({ ...f, error: 'Please enter at least one valid email address.' }));
      return;
    }
    setForm((f) => ({ ...f, loading: true }));
    let errorCount = 0;
    // Map UI role to backend enum
    const roleMap: Record<string, string> = {
      'Team Member': 'MEMBER',
      'Viewer': 'VIEWER',
    };
    const backendRole = roleMap[form.role] || form.role;
    for (const email of emails) {
      try {
        await inviteUser({ email, role: backendRole, company_id: company.id }, token);
      } catch (err: any) {
        errorCount++;
      }
    }
    setForm((f) => ({
      ...f,
      loading: false,
      emails: '',
      success: errorCount === 0 ? 'Invitations sent!' : `Some invites failed to send (${errorCount}/${emails.length}).`,
      error: errorCount === emails.length ? 'All invites failed to send.' : undefined,
    }));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" data-testid="invite-user-form" aria-label="Invite team members">
      <div>
        <label htmlFor="emails" className="block font-medium mb-1">
          Email addresses
        </label>
        <input
          id="emails"
          name="emails"
          type="text"
          className="w-full border rounded px-3 py-2"
          placeholder="Enter one or more emails, separated by commas"
          value={form.emails}
          onChange={handleChange}
          autoComplete="off"
          aria-required="true"
        />
        <p className="text-xs text-muted-foreground mt-1">Separate multiple emails with commas.</p>
      </div>
      <div>
        <label htmlFor="role" className="block font-medium mb-1">
          Role
        </label>
        <select
          id="role"
          name="role"
          className="w-full border rounded px-3 py-2"
          value={form.role}
          onChange={handleChange}
          aria-required="true"
        >
          <option value="Team Member">Team Member</option>
          <option value="Viewer">Viewer</option>
        </select>
      </div>
      {form.error && <div className="text-red-600 text-sm" role="alert">{form.error}</div>}
      {form.success && <div className="text-green-600 text-sm" role="status">{form.success}</div>}
      <Button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        aria-label="Send invites"
        disabled={!!form.loading}
      >
        {form.loading ? 'Sending...' : 'Send Invites'}
      </Button>
    </form>
  );
} 