import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useContent } from '@/hooks/useContent';

function TestComponent() {
  const { data, error, loading } = useContent();
  if (loading) return <div>loading</div>;
  if (error) return <div>error</div>;
  return <div data-testid="site-name">{data?.global.site.name}</div>;
}

describe('useContent hook - standardized API unwrapping', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    // @ts-ignore
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  it('unwraps standardized API response (status+data)', async () => {
    const payload = {
      global: {
        site: { name: 'Old Crown', title: 'Site', description: '', keywords: [], branding: { tagline: '', slogan: '' } },
        navigation: { header: { links: [] }, footer: { sections: [], copyright: '' }, breadcrumbs: { home: '', separator: '>' } },
        ui: { buttons: {}, labels: {}, messages: {}, placeholders: {} },
        accessibility: { ariaLabels: {}, altTexts: {}, descriptions: {} },
      },
      pages: {
        home: { hero: { title: 'Home' }, sections: { features: { title: '', items: [] }, quickLinks: [] } },
        about: { hero: { title: 'About' }, story: { title: '', introduction: '', timeline: [] }, cta: { title: '', description: '', button: '', contact: { address: '', hours: '' } } },
        contact: { hero: { title: 'Contact' } },
        events: { hero: { title: 'Events' }, regularEvents: [], contact: { title: '', description: '', phone: '', email: '' } },
        menu: { hero: { title: 'Menu', cta: { book: '', order: '' } }, sections: { description: '', allergenNotice: '' } },
        offline: {},
        notFound: {},
      },
      components: {},
      forms: { validation: { required: '', email: '', phone: '', minLength: '', maxLength: '' }, messages: {}, labels: {} },
      api: { messages: {}, errors: { menu: { loadFailed: '', notFound: '' }, restaurant: { loadFailed: '', notFound: '' }, marketing: { loadFailed: '', notFound: '' }, config: { loadFailed: '', notFound: '' }, validation: {}, auth: {}, payment: {} } },
      legal: { terms: { title: '', effectiveDate: '', contact: '' }, privacy: { title: '', effectiveDate: '', contact: '' } },
    };

    // @ts-ignore
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ status: 'success', data: payload, meta: { cached: false } }),
    });

    render(<TestComponent />);

    const el = await screen.findByTestId('site-name');
    expect(el.textContent).toBe('Old Crown');
    expect(global.fetch).toHaveBeenCalledWith('/api/content', expect.any(Object));
  });

  it('accepts raw content JSON (legacy)', async () => {
    const payload = {
      global: {
        site: { name: 'Legacy Site', title: 'Site', description: '', keywords: [], branding: { tagline: '', slogan: '' } },
        navigation: { header: { links: [] }, footer: { sections: [], copyright: '' }, breadcrumbs: { home: '', separator: '>' } },
        ui: { buttons: {}, labels: {}, messages: {}, placeholders: {} },
        accessibility: { ariaLabels: {}, altTexts: {}, descriptions: {} },
      },
      pages: {
        home: { hero: { title: 'Home' }, sections: { features: { title: '', items: [] }, quickLinks: [] } },
        about: { hero: { title: 'About' }, story: { title: '', introduction: '', timeline: [] }, cta: { title: '', description: '', button: '', contact: { address: '', hours: '' } } },
        contact: { hero: { title: 'Contact' } },
        events: { hero: { title: 'Events' }, regularEvents: [], contact: { title: '', description: '', phone: '', email: '' } },
        menu: { hero: { title: 'Menu', cta: { book: '', order: '' } }, sections: { description: '', allergenNotice: '' } },
        offline: {},
        notFound: {},
      },
      components: {},
      forms: { validation: { required: '', email: '', phone: '', minLength: '', maxLength: '' }, messages: {}, labels: {} },
      api: { messages: {}, errors: { menu: { loadFailed: '', notFound: '' }, restaurant: { loadFailed: '', notFound: '' }, marketing: { loadFailed: '', notFound: '' }, config: { loadFailed: '', notFound: '' }, validation: {}, auth: {}, payment: {} } },
      legal: { terms: { title: '', effectiveDate: '', contact: '' }, privacy: { title: '', effectiveDate: '', contact: '' } },
    };

    // @ts-ignore
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => payload,
    });

    render(<TestComponent />);
    await waitFor(() => expect(screen.getByTestId('site-name').textContent).toBe('Legacy Site'));
  });
});

