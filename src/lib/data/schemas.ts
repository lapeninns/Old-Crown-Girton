import { z } from "zod";

export const DietarySchema = z.object({
  vegetarian: z.boolean().optional(),
  vegan: z.boolean().optional(),
  glutenFree: z.boolean().optional(),
  spicy: z.boolean().optional(),
});

export const MoneySchema = z.object({
  amount: z.number().nonnegative(),
  currency: z.enum(["USD", "EUR", "GBP"]).default("GBP"),
});

export const MenuItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().default(""),
  price: MoneySchema,
  available: z.boolean().default(true),
  dietary: DietarySchema.default({}),
  tags: z.array(z.string()).default([]),
});

export const MenuSectionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  items: z.array(MenuItemSchema),
});

export const MenuSchema = z.object({
  updatedAt: z.string(),
  sections: z.array(MenuSectionSchema),
});

export const RestaurantSchema = z.object({
  name: z.string(),
  phone: z.string(),
  email: z.string(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
  }),
  hours: z.union([
    z.record(z.string(), z.string()), // Legacy format: {"Mon-Thu": "12:00-23:00"}
    z.object({
      kitchen: z.record(z.string(), z.string()),
      bar: z.record(z.string(), z.string()),
    }), // New detailed format: {kitchen: {monday: "12:00-15:00,17:00-22:00"}, bar: {monday: "12:00-22:00"}}
  ]),
});

export const MarketingSchema = z.object({
  hero: z.object({ title: z.string(), subtitle: z.string().optional() }),
  promos: z
    .array(z.object({ id: z.string(), title: z.string(), body: z.string() }))
    .default([]),
  seo: z.object({ title: z.string(), description: z.string() }).optional(),
  buttons: z.record(z.string(), z.string()).default({}),
});

export const ConfigSchema = z.object({
  env: z.enum(["app", "dev", "staging", "prod"]).default("app"),
  featureFlags: z.record(z.string(), z.boolean()).default({}),
  api: z
    .object({
      baseUrl: z.string().url().optional(),
  menuEndpoint: z.string().url().optional(),
  marketingEndpoint: z.string().url().optional(),
  restaurantEndpoint: z.string().url().optional(),
  contentEndpoint: z.string().url().optional(),
    })
    .default({}),
  cms: z.object({ enabled: z.boolean().default(false) }).default({ enabled: false }),
  metadata: z
    .object({
      appName: z.string().default("Old Crown"),
      domainName: z.string().default("localhost"),
    })
    .default({ appName: "Old Crown", domainName: "localhost" }),
});

// Content Management Schemas
export const LinkSchema = z.object({
  href: z.string(),
  label: z.string(),
  external: z.boolean().optional(),
});

export const SocialMediaSchema = z.object({
  url: z.string().url(),
  label: z.string(),
});

export const NavigationSchema = z.object({
  header: z.object({
    links: z.array(LinkSchema),
  }),
  footer: z.object({
    sections: z.array(z.object({
      title: z.string(),
      links: z.array(LinkSchema),
    })),
    copyright: z.string(),
    socialMedia: z.record(z.string(), SocialMediaSchema).optional(),
  }),
  breadcrumbs: z.object({
    home: z.string(),
    separator: z.string(),
  }),
});

export const UISchema = z.object({
  buttons: z.record(z.string(), z.string()),
  labels: z.record(z.string(), z.string()),
  messages: z.record(z.string(), z.string()),
  placeholders: z.record(z.string(), z.string()),
});

export const AccessibilitySchema = z.object({
  ariaLabels: z.record(z.string(), z.string()),
  altTexts: z.record(z.string(), z.string()),
  descriptions: z.record(z.string(), z.string()),
});

export const HeroSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  cta: z.object({
    primary: z.string(),
    secondary: z.string().optional(),
  }).optional(),
});

export const FeatureItemSchema = z.object({
  icon: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  text: z.string().optional(),
});

export const CTAButtonSchema = z.object({
  text: z.string(),
  href: z.string(),
  variant: z.string().optional(),
  key: z.string().optional(),
  external: z.boolean().optional(),
  ariaLabel: z.string().optional(),
});

export const SlideImageSchema = z.object({
  primary: z.string(),
  fallback: z.string().optional(),
  alt: z.string().optional(),
  width: z.number().nullable().optional(),
  height: z.number().nullable().optional(),
});

export const SlideCTASchema = z.object({
  bookUrl: z.string().optional(),
  callTel: z.string().optional(),
  menuUrl: z.string().optional(),
  secondaryUrl: z.string().optional(),
});

export const SlideSchema = z.object({
  id: z.string(),
  required: z.boolean().optional(),
  image: SlideImageSchema,
  alt: z.string().optional(),
  eyebrow: z.string().optional(),
  headline: z.string().optional(),
  copy: z.string().optional(),
  badges: z.array(z.string()).optional(),
  ctas: SlideCTASchema.optional(),
});

export const SlideshowSettingsSchema = z.object({
  autoplay: z.boolean().optional(),
  intervalMs: z.number().optional(),
  sessionSize: z.number().optional(),
});

export const SlideshowContentSchema = z.object({
  settings: SlideshowSettingsSchema.default({}),
  slides: z.array(SlideSchema),
});

export const PressFeatureSchema = z.object({
  label: z.string().optional(),
  eyebrow: z.string().optional(),
  title: z.string().optional(),
  summary: z.string().optional(),
  quote: z.string().optional(),
  quoteAttribution: z.string().optional(),
  cta: z.object({
    text: z.string().optional(),
    href: z.string().optional(),
  }).optional(),
});

export const HomeCTASectionSchema = z.object({
  headline: z.string(),
  description: z.string(),
  buttons: z.array(CTAButtonSchema),
});

export const PageSeoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  schemas: z.array(z.record(z.string(), z.any())).optional(),
}).passthrough();

export const QuickLinkSchema = z.object({
  title: z.string(),
  description: z.string(),
  link: z.string(),
  linkText: z.string(),
});

export const TestimonialSchema = z.object({
  name: z.string(),
  text: z.string(),
  rating: z.number().min(1).max(5).optional(),
  location: z.string().optional(),
  image: z.string().optional(),
});

export const FAQItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

export const EventSchema = z.object({
  title: z.string(),
  description: z.string(),
  frequency: z.string(),
  icon: z.string().optional(),
  // Optional ISO dates for specific scheduled events
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const FormValidationSchema = z.object({
  required: z.string(),
  email: z.string(),
  phone: z.string(),
  minLength: z.string(),
  maxLength: z.string(),
});

export const APIErrorsSchema = z.object({
  menu: z.object({
    loadFailed: z.string(),
    notFound: z.string(),
  }),
  restaurant: z.object({
    loadFailed: z.string(),
    notFound: z.string(),
  }),
  marketing: z.object({
    loadFailed: z.string(),
    notFound: z.string(),
  }),
  config: z.object({
    loadFailed: z.string(),
    notFound: z.string(),
  }),
  validation: z.record(z.string(), z.string()),
  auth: z.record(z.string(), z.string()),
  payment: z.record(z.string(), z.string()),
});

export const ContentSchema = z.object({
  global: z.object({
    site: z.object({
      name: z.string(),
      title: z.string(),
      description: z.string(),
      keywords: z.array(z.string()),
      branding: z.object({
        tagline: z.string(),
        slogan: z.string(),
      }),
    }),
    navigation: NavigationSchema,
    ui: UISchema,
    accessibility: AccessibilitySchema,
  }),
  pages: z.object({
    home: z.object({
      hero: HeroSchema,
      sections: z.object({
        features: z.object({
          title: z.string(),
          items: z.array(FeatureItemSchema),
        }),
        quickLinks: z.array(QuickLinkSchema),
        pressFeature: PressFeatureSchema.optional(),
        cta: HomeCTASectionSchema.optional(),
      }).passthrough(),
      seo: PageSeoSchema.optional(),
    }),
    about: z.object({
      hero: HeroSchema,
      story: z.object({
        title: z.string(),
        introduction: z.string(),
        timeline: z.array(z.object({
          period: z.string(),
          title: z.string(),
          description: z.string(),
        })),
      }),
      cta: z.object({
        title: z.string(),
        description: z.string(),
        button: z.string(),
        contact: z.object({
          address: z.string(),
          hours: z.string(),
        }),
      }),
    }),
    contact: z.object({
      hero: HeroSchema,
      contactInfo: z.record(z.string(), z.any()).optional(),
      hours: z.record(z.string(), z.any()).optional(),
      features: z.object({
        title: z.string(),
        items: z.array(FeatureItemSchema),
      }).optional(),
    }),
    events: z.object({
      hero: HeroSchema,
      regularEvents: z.array(EventSchema),
      // Lightweight SEO-oriented events list (e.g. "Birthday / anniversary")
      seoEvents: z.array(z.string()).optional(),
      contact: z.object({
        title: z.string(),
        description: z.string(),
        phone: z.string(),
        email: z.string(),
      }),
    }),
    menu: z.object({
      hero: HeroSchema.extend({
        cta: z.object({
          book: z.string(),
          order: z.string(),
        }),
      }),
      sections: z.object({
        description: z.string(),
        allergenNotice: z.string(),
      }),
    }),
    signin: z.record(z.string(), z.any()).optional(),
    dashboard: z.record(z.string(), z.any()).optional(),
    offline: z.record(z.string(), z.any()),
    notFound: z.record(z.string(), z.any()),
  }),
  components: z.object({
    testimonials: z.object({
      title: z.string(),
      subtitle: z.string(),
      items: z.array(TestimonialSchema),
    }).optional(),
    faq: z.object({
      title: z.string(),
      subtitle: z.string(),
      items: z.array(FAQItemSchema),
    }).optional(),
    menuHighlights: z.record(z.string(), z.any()).optional(),
    slideshow: SlideshowContentSchema.optional(),
  }),
  forms: z.object({
    validation: FormValidationSchema,
    messages: z.record(z.string(), z.string()),
    labels: z.record(z.string(), z.string()),
  }),
  api: z.object({
    messages: z.record(z.string(), z.string()),
    errors: APIErrorsSchema,
  }),
  legal: z.object({
    terms: z.object({
      title: z.string(),
      effectiveDate: z.string(),
      contact: z.string(),
    }),
    privacy: z.object({
      title: z.string(),
      effectiveDate: z.string(),
      contact: z.string(),
    }),
  }),
});

export type Menu = z.infer<typeof MenuSchema>;
export type Restaurant = z.infer<typeof RestaurantSchema>;
export type Marketing = z.infer<typeof MarketingSchema>;
export type AppConfig = z.infer<typeof ConfigSchema>;
export type Content = z.infer<typeof ContentSchema>;
export type NavigationType = z.infer<typeof NavigationSchema>;
export type UIType = z.infer<typeof UISchema>;
export type HeroType = z.infer<typeof HeroSchema>;
export type TestimonialType = z.infer<typeof TestimonialSchema>;
export type FAQItemType = z.infer<typeof FAQItemSchema>;
export type EventType = z.infer<typeof EventSchema>;
