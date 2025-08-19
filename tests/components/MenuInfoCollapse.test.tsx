import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import MenuInfoCollapse from '../../components/menu/MenuInfoCollapse';

describe('MenuInfoCollapse', () => {
  beforeAll(() => {
    // jsdom may report 0 for scrollHeight; mock it so our component measures a realistic value
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
      configurable: true,
      get: function () {
        return 120;
      },
    });
  });

  it('expands and collapses an accordion item by adjusting height', async () => {
    const items = [
      { title: 'Dietary requirements', content: <div>Gluten free options</div> },
    ];

    render(<MenuInfoCollapse items={items} />);

    const button = screen.getByRole('button', { name: /dietary requirements/i });
    expect(button).toBeInTheDocument();

    // the accordion container is the element immediately after the toggle button
    const container = button.nextElementSibling as HTMLElement | null;
    expect(container).toBeTruthy();

    // click to expand
    await userEvent.click(button);

    // wait for effect that measures scrollHeight and updates inline style
    await waitFor(() => {
      expect(container?.style.height).toBe('120px');
    });

    // collapse again
    await userEvent.click(button);
    await waitFor(() => {
      expect(container?.style.height).toBe('0px');
    });
  });
});
