/**
 * Performance Tests Configuration
 * Artillery configuration for load testing API endpoints
 */

export const artilleryConfig = {
  config: {
    target: process.env.BASE_URL || 'http://localhost:3000',
    phases: [
      // Warm-up phase
      {
        duration: 30,
        arrivalRate: 5,
        name: 'Warm up'
      },
      // Ramp-up phase
      {
        duration: 60,
        arrivalRate: 5,
        rampTo: 20,
        name: 'Ramp up load'
      },
      // Sustained load phase
      {
        duration: 120,
        arrivalRate: 20,
        name: 'Sustained load'
      },
      // Peak load phase
      {
        duration: 60,
        arrivalRate: 50,
        name: 'Peak load'
      },
      // Cool down phase
      {
        duration: 30,
        arrivalRate: 5,
        name: 'Cool down'
      }
    ],
    defaults: {
      headers: {
        'User-Agent': 'Artillery Load Test',
        'Accept': 'application/json'
      }
    },
    ensure: {
      p95: 1000, // 95th percentile response time < 1 second
      maxErrorRate: 1 // Max 1% error rate
    }
  },

  scenarios: [
    {
      name: 'Menu API Load Test',
      weight: 40,
      flow: [
        {
          get: {
            url: '/api/menu',
            expect: [
              { statusCode: 200 },
              { hasProperty: 'data' },
              { hasProperty: 'meta' }
            ]
          }
        },
        {
          think: 2 // Wait 2 seconds between requests
        }
      ]
    },
    {
      name: 'Restaurant Info Load Test',
      weight: 25,
      flow: [
        {
          get: {
            url: '/api/restaurant',
            expect: [
              { statusCode: 200 },
              { hasProperty: 'data' }
            ]
          }
        },
        {
          think: 3
        }
      ]
    },
    {
      name: 'Marketing Content Load Test',
      weight: 20,
      flow: [
        {
          get: {
            url: '/api/marketing',
            expect: [
              { statusCode: 200 },
              { hasProperty: 'data' }
            ]
          }
        },
        {
          think: 2
        }
      ]
    },
    {
      name: 'Health Check Load Test',
      weight: 10,
      flow: [
        {
          get: {
            url: '/api/health',
            expect: [
              { statusCode: 200 }
            ]
          }
        },
        {
          think: 1
        }
      ]
    },
    {
      name: 'Config API Load Test',
      weight: 5,
      flow: [
        {
          get: {
            url: '/api/config',
            expect: [
              { statusCode: 200 }
            ]
          }
        },
        {
          think: 5
        }
      ]
    }
  ]
};

export const stressTestConfig = {
  config: {
    target: process.env.BASE_URL || 'http://localhost:3000',
    phases: [
      {
        duration: 60,
        arrivalRate: 10,
        rampTo: 100,
        name: 'Gradual ramp to high load'
      },
      {
        duration: 120,
        arrivalRate: 100,
        name: 'Sustained high load'
      },
      {
        duration: 60,
        arrivalRate: 200,
        name: 'Extreme load'
      }
    ],
    ensure: {
      p99: 5000, // 99th percentile < 5 seconds under stress
      maxErrorRate: 5 // Allow up to 5% error rate under stress
    }
  },

  scenarios: [
    {
      name: 'Stress Test - Menu API',
      flow: [
        {
          get: {
            url: '/api/menu',
            expect: [
              { statusCode: [200, 503] } // Allow service unavailable under extreme load
            ]
          }
        }
      ]
    }
  ]
};

export const spikeTestConfig = {
  config: {
    target: process.env.BASE_URL || 'http://localhost:3000',
    phases: [
      {
        duration: 60,
        arrivalRate: 10,
        name: 'Normal load'
      },
      {
        duration: 30,
        arrivalRate: 200,
        name: 'Traffic spike'
      },
      {
        duration: 60,
        arrivalRate: 10,
        name: 'Return to normal'
      }
    ]
  },

  scenarios: [
    {
      name: 'Spike Test - All Endpoints',
      flow: [
        { get: { url: '/api/menu' } },
        { get: { url: '/api/restaurant' } },
        { get: { url: '/api/marketing' } },
        { get: { url: '/api/health' } }
      ]
    }
  ]
};
