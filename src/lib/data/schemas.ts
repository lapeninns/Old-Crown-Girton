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
  hours: z.record(z.string(), z.string()),
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
  env: z.enum(["dev", "staging", "prod"]),
  featureFlags: z.record(z.string(), z.boolean()).default({}),
  api: z
    .object({
      baseUrl: z.string().url().optional(),
  menuEndpoint: z.string().url().optional(),
  marketingEndpoint: z.string().url().optional(),
  restaurantEndpoint: z.string().url().optional(),
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

export type Menu = z.infer<typeof MenuSchema>;
export type Restaurant = z.infer<typeof RestaurantSchema>;
export type Marketing = z.infer<typeof MarketingSchema>;
export type AppConfig = z.infer<typeof ConfigSchema>;
