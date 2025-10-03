import { http, HttpResponse } from 'msw';

/**
 * MSW handlers for mocking API responses in tests
 * Covers the restaurant booking system's API endpoints
 */

// Mock restaurant data (matches the structure from data/restaurant.json)
const mockRestaurantData = {
  name: "Old Crown",
  description: "A traditional British pub in the heart of Girton",
  address: {
    street: "1 High Street",
    city: "Girton",
    county: "Cambridgeshire", 
    postcode: "CB3 0QH",
    country: "United Kingdom"
  },
  contact: {
    phone: "+44 1223 277217",
    email: "oldcrown@lapeninns.com"
  },
  openingHours: {
    monday: { open: "12:00", close: "23:00" },
    tuesday: { open: "12:00", close: "23:00" },
    wednesday: { open: "12:00", close: "23:00" },
    thursday: { open: "12:00", close: "23:00" },
    friday: { open: "12:00", close: "23:00" },
    saturday: { open: "12:00", close: "23:00" },
    sunday: { open: "12:00", close: "22:30" }
  },
  features: [
    "Dog Friendly",
    "Family Friendly", 
    "Student Offers",
    "Live Sport",
    "Sunday Roast",
    "Private Hire",
    "Group Dining"
  ],
  menu: {
    highlights: [
      { name: "Fish & Chips", price: "£14.95", description: "Fresh cod with hand-cut chips" },
      { name: "Sunday Roast", price: "£16.95", description: "Traditional roast with all the trimmings" },
      { name: "Steak & Ale Pie", price: "£15.95", description: "Homemade with local ale" }
    ]
  }
};

// Mock booking form submission
const handleBookingRequest = http.post('/api/booking', async ({ request }) => {
  const body = await request.json() as any;
  
  // Simulate validation
  if (!body.name || !body.phone) {
    return HttpResponse.json(
      { error: 'Name and phone are required' },
      { status: 400 }
    );
  }

  // Simulate successful booking
  return HttpResponse.json({
    success: true,
    message: 'Booking request received',
    bookingId: 'BOOK-' + Math.random().toString(36).substr(2, 9),
    data: body
  });
});

// Mock contact form submission
const handleContactForm = http.post('/api/contact', async ({ request }) => {
  const body = await request.json() as any;
  
  if (!body.email || !body.message) {
    return HttpResponse.json(
      { error: 'Email and message are required' },
      { status: 400 }
    );
  }

  return HttpResponse.json({
    success: true,
    message: 'Message sent successfully'
  });
});

// Mock restaurant data loading
const handleRestaurantData = http.get('/api/restaurant', () => {
  return HttpResponse.json(mockRestaurantData);
});

// Mock data loading with environment awareness
const handleDataLoad = http.get('/api/data', ({ request }) => {
  const url = new URL(request.url);
  const env = url.searchParams.get('env') || 'development';
  
  return HttpResponse.json({
    ...mockRestaurantData,
    environment: env,
    timestamp: new Date().toISOString()
  });
});

// Mock newsletter subscription
const handleNewsletterSignup = http.post('/api/newsletter', async ({ request }) => {
  const body = await request.json() as any;
  
  if (!body.email) {
    return HttpResponse.json(
      { error: 'Email is required' },
      { status: 400 }
    );
  }

  return HttpResponse.json({
    success: true,
    message: 'Successfully subscribed to newsletter'
  });
});

// Mock Stripe webhook (for testing payment flows)
const handleStripeWebhook = http.post('/api/webhooks/stripe', async ({ request }) => {
  const signature = request.headers.get('stripe-signature');
  
  if (!signature) {
    return HttpResponse.json(
      { error: 'Missing Stripe signature' },
      { status: 400 }
    );
  }

  return HttpResponse.json({ received: true });
});

// Mock Mailgun webhook (for testing email flows)
const handleMailgunWebhook = http.post('/api/webhooks/mailgun', async ({ request }) => {
  const body = await request.json() as any;
  
  return HttpResponse.json({
    success: true,
    event: body.event || 'delivered'
  });
});

// Mock menu data with different formats
const handleMenuData = http.get('/api/menu', ({ request }) => {
  const url = new URL(request.url);
  const format = url.searchParams.get('format') || 'json';
  
  const menuData = {
    categories: [
      {
        name: "Starters",
        items: [
          { name: "Soup of the Day", price: "£5.95", description: "Ask your server for today's selection" },
          { name: "Garlic Bread", price: "£4.95", description: "With herbs and cheese" }
        ]
      },
      {
        name: "Mains", 
        items: [
          { name: "Fish & Chips", price: "£14.95", description: "Fresh cod with hand-cut chips" },
          { name: "Steak & Ale Pie", price: "£15.95", description: "Homemade with local ale" }
        ]
      }
    ]
  };
  
  if (format === 'pdf') {
    return new HttpResponse(
      new Blob(['Mock PDF content'], { type: 'application/pdf' }),
      {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="menu.pdf"'
        }
      }
    );
  }
  
  return HttpResponse.json(menuData);
});

// Error simulation handlers
const handleServerError = http.get('/api/error', () => {
  return HttpResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
});

const handleNotFound = http.get('/api/notfound', () => {
  return HttpResponse.json(
    { error: 'Resource not found' },
    { status: 404 }
  );
});

const handleUnauthorized = http.get('/api/unauthorized', () => {
  return HttpResponse.json(
    { error: 'Unauthorized access' },
    { status: 401 }
  );
});

// Rate limiting simulation
let requestCount = 0;
const handleRateLimit = http.post('/api/ratelimit', () => {
  requestCount++;
  
  if (requestCount > 5) {
    return HttpResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }
  
  return HttpResponse.json({ success: true });
});

// Network delay simulation
const handleSlowResponse = http.get('/api/slow', async () => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return HttpResponse.json({ data: 'Slow response' });
});

// Export all handlers
export const handlers = [
  handleBookingRequest,
  handleContactForm,
  handleRestaurantData,
  handleDataLoad,
  handleNewsletterSignup,
  handleStripeWebhook,
  handleMailgunWebhook,
  handleMenuData,
  handleServerError,
  handleNotFound,
  handleUnauthorized,
  handleRateLimit,
  handleSlowResponse,
];

// Export individual handlers for specific test needs
export {
  handleBookingRequest,
  handleContactForm,
  handleRestaurantData,
  handleDataLoad,
  handleNewsletterSignup,
  handleStripeWebhook,
  handleMailgunWebhook,
  handleMenuData,
  handleServerError,
  handleNotFound,
  handleUnauthorized,
  handleRateLimit,
  handleSlowResponse,
};

// Export mock data for direct use in tests
export { mockRestaurantData };

// Helper to reset request counters for rate limiting tests
export function resetMockState(): void {
  requestCount = 0;
}
