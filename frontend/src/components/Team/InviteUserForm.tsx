import React, { useState } from 'react';

interface InviteFormState {
  emails: string;
  role: 'Team Member' | 'Viewer';
  error?: string;
  success?: string;
}

export function InviteUserForm() {
  const [form, setForm] = useState<InviteFormState>({ emails: '', role: 'Team Member' });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value, error: undefined, success: undefined });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Basic validation: require at least one email
    if (!form.emails.trim()) {
      setForm((f) => ({ ...f, error: 'Please enter at least one email address.' }));
      return;
    }
    // Mock submit handler
    setForm((f) => ({ ...f, success: 'Invitations sent (mock)!', error: undefined, emails: '' }));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" data-testid="invite-user-form">
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
        >
          <option value="Team Member">Team Member</option>
          <option value="Viewer">Viewer</option>
        </select>
      </div>
      {form.error && <div className="text-red-600 text-sm">{form.error}</div>}
      {form.success && <div className="text-green-600 text-sm">{form.success}</div>}
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Send Invites
      </button>
    </form>
  );
} 