import React from 'react';
import { render } from '@testing-library/react';
import LandingPage from './page';

describe('LandingPage', () => {
  it('renders without crashing', () => {
    const { container } = render(<LandingPage />);
    expect(container).toBeInTheDocument();
  });
}); 