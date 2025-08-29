import { http, HttpResponse } from 'msw';
import type { Menu, Marketing, Restaurant, AppConfig } from '@/src/lib/data/schemas';

// Mock data builders
export const mockMenu: Menu = {
  updatedAt: '2025-08-12T00:00:00Z',
  sections: [
    {
      id: 'starters',
      name: 'Starters',
      items: [
        {
          id: 'onion-bhaji',
          name: 'Onion Bhaji',
          description: 'Crispy fried onions with spices',
          price: { amount: 4.25, currency: 'GBP' },
          available: true,
          dietary: { glutenFree: true },
          tags: [],
        },
        {
          id: 'veg-momo',
          name: 'Momo (Veg)',
          description: 'Traditional Nepalese dumplings',
          price: { amount: 6.25, currency: 'GBP' },
          available: true,
          dietary: { vegetarian: true },
          tags: ['nepalese', 'dumpling'],
        },
      ],
    },
    {
      id: 'specials',
      name: 'Old Crown Specialities',
      items: [
        {
          id: 'bhutuwa-chicken',
          name: 'Bhutuwa (Chicken)',
          description: 'Traditional Nepalese speciality',
          price: { amount: 12.0, currency: 'GBP' },
          available: true,
          dietary: { glutenFree: true },
          tags: ['nepalese'],
        },
      ],
    },
  ],
};

export const mockMarketing: Marketing = {
  hero: {
    title: 'Old Crown Restaurant',
    subtitle: 'Authentic Nepalese Cuisine',
  },
  promos: [
    {
      id: 'early-bird',
      title: 'Early Bird Special',
      body: '20% off all meals before 6 PM',
    },
  ],
  seo: {
    title: 'Old Crown - Best Nepalese Restaurant',
    description: 'Experience authentic Nepalese cuisine',
  },
  buttons: {
    book: 'Book Now',
    menu: 'View Menu',
  },
};

export const mockRestaurant: Restaurant = {
  name: 'Old Crown',
  phone: '01223277217',
  email: 'oldcrown@lapeninns.com',
  address: {
    street: 'High Street',
    city: 'Cambridge',
    state: 'Cambridgeshire',
    zip: 'CB3 0QQ',
  },
  hours: {
    Monday: '12:00-22:00',
    Tuesday: '12:00-22:00',
    Wednesday: '12:00-22:00',
    Thursday: '12:00-22:00',
    Friday: '12:00-22:30',
    Saturday: '12:00-22:30',
    Sunday: '12:00-21:30',
  },
};

export const mockConfig: AppConfig = {
  env: 'app',
  featureFlags: { cms: false },
  api: {
    baseUrl: 'http://localhost:3000',
    menuEndpoint: 'http://localhost:3000/api/menu',
  },
  cms: { enabled: false },
  metadata: {
    appName: 'Old Crown',
    domainName: 'localhost',
  },
};

// MSW Handlers
export const handlers = [
  // Menu API
  http.get('/api/menu', () => HttpResponse.json(mockMenu)),
  http.get('/api/menu', () => HttpResponse.json(mockMenu, { status: 200 })),
  
  // Marketing API
  http.get('/api/marketing', () => HttpResponse.json(mockMarketing)),
  
  // Restaurant API
  http.get('/api/restaurant', () => HttpResponse.json(mockRestaurant)),
  
  // Config API
  http.get('/api/config', () => HttpResponse.json(mockConfig)),
  
  // Error scenarios
  http.get('/api/menu/error', () => HttpResponse.json({ error: 'Internal Server Error' }, { status: 500 })),
  http.get('/api/menu/timeout', () => new Promise(() => {})), // Never resolves to simulate timeout
  http.get('/api/menu/empty', () => HttpResponse.json({ sections: [] })),
  
  // Booking endpoints
  http.post('/api/reservations', async ({ request }) => {
    const data = await request.json() as Record<string, any>;
    return HttpResponse.json({ id: 'booking-123', status: 'confirmed', ...data });
  }),
  
  // Analytics/vitals
  http.post('/api/vitals', () => HttpResponse.json({ success: true })),
  http.post('/api/analytics', () => HttpResponse.json({ success: true })),
];
