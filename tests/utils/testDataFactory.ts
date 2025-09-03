/**
 * Test Data Factory
 * Generates realistic test data for API testing
 */

import { faker } from '@faker-js/faker';

export class TestDataFactory {
  static createUser(overrides = {}) {
    return {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      age: faker.number.int({ min: 18, max: 99 }),
      createdAt: faker.date.recent().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
      ...overrides
    };
  }

  static createMenuItem(overrides = {}) {
    return {
      id: faker.string.uuid(),
      name: faker.food.dish(),
      description: faker.food.description(),
      price: {
        amount: faker.number.float({ min: 5, max: 50, precision: 0.01 }),
        currency: 'GBP'
      },
      category: faker.helpers.arrayElement(['Starters', 'Mains', 'Desserts', 'Drinks']),
      available: faker.datatype.boolean(),
      dietary: {
        vegetarian: faker.datatype.boolean(),
        vegan: faker.datatype.boolean(),
        glutenFree: faker.datatype.boolean(),
        dairyFree: faker.datatype.boolean()
      },
      allergens: faker.helpers.arrayElements(['nuts', 'dairy', 'gluten', 'eggs'], { min: 0, max: 3 }),
      tags: faker.helpers.arrayElements(['spicy', 'popular', 'chef-special', 'seasonal'], { min: 0, max: 2 }),
      ...overrides
    };
  }

  static createRestaurantInfo(overrides = {}) {
    return {
      name: faker.company.name(),
      phone: faker.phone.number(),
      email: faker.internet.email(),
      address: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zip: faker.location.zipCode(),
        country: 'UK'
      },
      hours: {
        monday: '11:30 AM - 10:00 PM',
        tuesday: '11:30 AM - 10:00 PM',
        wednesday: '11:30 AM - 10:00 PM',
        thursday: '11:30 AM - 10:00 PM',
        friday: '11:30 AM - 10:00 PM',
        saturday: '11:30 AM - 11:00 PM',
        sunday: '12:00 PM - 9:00 PM'
      },
      ...overrides
    };
  }

  static createMarketingContent(overrides = {}) {
    return {
      hero: {
        title: faker.company.catchPhrase(),
        subtitle: faker.company.buzzPhrase(),
        description: faker.lorem.sentences(2),
        cta: {
          text: faker.helpers.arrayElement(['Order Now', 'Book a Table', 'View Menu']),
          href: faker.helpers.arrayElement(['#menu', '#reservation', '/menu'])
        }
      },
      promos: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
        id: faker.string.uuid(),
        title: faker.commerce.productName(),
        body: faker.commerce.productDescription(),
        discount: faker.helpers.arrayElement(['10%', '15%', '20% OFF', 'Buy One Get One Free']),
        validUntil: faker.date.future().toISOString(),
        ...overrides
      })),
      testimonials: Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, () => ({
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        rating: faker.number.int({ min: 4, max: 5 }),
        comment: faker.lorem.sentences(2),
        date: faker.date.recent().toISOString(),
        ...overrides
      })),
      ...overrides
    };
  }

  static createBulkUsers(count = 10) {
    return Array.from({ length: count }, () => this.createUser());
  }

  static createMenuSection(overrides = {}) {
    return {
      id: faker.string.uuid(),
      name: faker.helpers.arrayElement(['Starters', 'Mains', 'Desserts', 'Drinks', 'Specials']),
      description: faker.lorem.sentence(),
      items: Array.from({ length: faker.number.int({ min: 3, max: 8 }) }, () => this.createMenuItem()),
      ...overrides
    };
  }

  static createFullMenu(overrides = {}) {
    return {
      updatedAt: faker.date.recent().toISOString(),
      sections: Array.from({ length: faker.number.int({ min: 3, max: 6 }) }, () => this.createMenuSection()),
      ...overrides
    };
  }

  static createReservation(overrides = {}) {
    return {
      id: faker.string.uuid(),
      customerName: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      partySize: faker.number.int({ min: 1, max: 12 }),
      date: faker.date.future().toISOString().split('T')[0],
      time: faker.helpers.arrayElement(['18:00', '19:00', '20:00', '21:00']),
      specialRequests: faker.helpers.arrayElement([faker.lorem.sentence(), '', null]),
      status: faker.helpers.arrayElement(['confirmed', 'pending', 'cancelled']),
      createdAt: faker.date.recent().toISOString(),
      ...overrides
    };
  }

  static createLead(overrides = {}) {
    return {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      message: faker.lorem.paragraph(),
      source: faker.helpers.arrayElement(['website', 'phone', 'email', 'social-media']),
      status: faker.helpers.arrayElement(['new', 'contacted', 'qualified', 'converted']),
      createdAt: faker.date.recent().toISOString(),
      ...overrides
    };
  }
}
