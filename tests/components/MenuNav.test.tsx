import React from 'react';
import { render, screen } from '@testing-library/react';

import MenuNav from '../../components/menu/legacy/MenuNav';

describe('MenuNav', () => {
  it('renders links to sections and highlights the active one', () => {
    const sections = [
      { id: 'starters', name: 'Starters' },
      { id: 'mains', name: 'Mains' },
    ];

    // set the hash to simulate an active section
    window.location.hash = '#starters';
    render(<MenuNav sections={sections} />);

    // Component renders multiple nav instances (desktop left, desktop right, mobile)
    // So we use getAllByRole and test the first instance
    const starterLinks = screen.getAllByRole('link', { name: /starters/i });
    const mainsLinks = screen.getAllByRole('link', { name: /mains/i });

    expect(starterLinks.length).toBeGreaterThan(0);
    expect(mainsLinks.length).toBeGreaterThan(0);

    // Test the first instance of each link
    const starterLink = starterLinks[0];
    const mainsLink = mainsLinks[0];

    expect(starterLink).toBeInTheDocument();
    expect(mainsLink).toBeInTheDocument();

    // href should be fragment links so we don't create routes
    expect(starterLink).toHaveAttribute('href', '#starters');
    expect(mainsLink).toHaveAttribute('href', '#mains');

    // active nav should have aria-current
    expect(starterLink).toHaveAttribute('aria-current', 'page');
    expect(mainsLink).not.toHaveAttribute('aria-current');
  });
});
