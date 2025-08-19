import React from 'react';
import { render, screen } from '@testing-library/react';

import MenuNav from '../../components/menu/MenuNav';

describe('MenuNav', () => {
  it('renders links to sections and highlights the active one', () => {
    const sections = [
      { id: 'starters', name: 'Starters' },
      { id: 'mains', name: 'Mains' },
    ];

  // set the hash to simulate an active section
  window.location.hash = '#starters';
  render(<MenuNav sections={sections} />);

    const starterLink = screen.getByRole('link', { name: /starters/i });
    const mainsLink = screen.getByRole('link', { name: /mains/i });

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
