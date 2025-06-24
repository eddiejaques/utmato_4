import { render, screen } from '@testing-library/react';
import SignInPage from './page';

describe('SignInPage', () => {
  it('does not render social login buttons', () => {
    render(<SignInPage />);
    // Check that no button with Google, GitHub, or similar is present
    const googleButton = screen.queryByRole('button', { name: /google/i });
    const githubButton = screen.queryByRole('button', { name: /github/i });
    expect(googleButton).not.toBeInTheDocument();
    expect(githubButton).not.toBeInTheDocument();
  });
}); 