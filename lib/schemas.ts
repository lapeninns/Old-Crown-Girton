import { z } from 'zod';

export const ProjectSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  url: z.string().url().optional(),
});

export const SiteDataSchema = z.object({
  version: z.number(),
  projects: z.array(ProjectSchema),
});

export const NavLinkSchema = z.object({
  href: z.string(),
  label: z.string(),
});

export const NavDataSchema = z.object({
  links: z.array(NavLinkSchema),
});

export const HomeDataSchema = z.object({
  heroHeadline: z.string(),
  heroSubheadline: z.string(),
  heroCtaLabel: z.string(),
  heroImage: z.string().url(),
});

export const FooterLinkSchema = z.object({
  href: z.string(),
  label: z.string(),
  external: z.boolean().optional(),
});

export const FooterSectionSchema = z.object({
  title: z.string(),
  links: z.array(FooterLinkSchema),
});

export const FooterDataSchema = z.object({
  sections: z.array(FooterSectionSchema),
});

export const MarketingDataSchema = z.object({
  buttons: z.record(z.string(), z.string()),
});

export type SiteDataParsed = z.infer<typeof SiteDataSchema>;
export type NavDataParsed = z.infer<typeof NavDataSchema>;
export type HomeDataParsed = z.infer<typeof HomeDataSchema>;
export type FooterDataParsed = z.infer<typeof FooterDataSchema>;
export type MarketingDataParsed = z.infer<typeof MarketingDataSchema>;
