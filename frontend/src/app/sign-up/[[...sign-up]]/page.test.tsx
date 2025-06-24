import { render, screen } from '@testing-library/react';
import SignUpPage from './page';

describe('SignUpPage', () => {
  it('does not render social sign-up buttons', () => {
    render(<SignUpPage />);
    // Check that no button with Google, GitHub, or similar is present
    const googleButton = screen.queryByRole('button', { name: /google/i });
    const githubButton = screen.queryByRole('button', { name: /github/i });
    expect(googleButton).not.toBeInTheDocument();
    expect(githubButton).not.toBeInTheDocument();
  });
}); 