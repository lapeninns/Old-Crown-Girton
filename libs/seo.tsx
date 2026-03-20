import type { Metadata } from "next";
import type { ReactElement } from "react";
import {
  buildArticleMetadata,
  buildPageMetadata,
  buildSEOTags,
  type SEOTagOptions,
} from "@/src/lib/seo/metadata";
import { renderJsonLd } from "@/src/lib/seo/renderJsonLd";
import { buildRestaurantSchema } from "@/src/lib/seo/schema";

/**
 * Contract for getSEOTags inputs.
 * We accept all Next.js Metadata fields and two helpers:
 * - canonicalUrlRelative: relative path (e.g. "/about") that will be turned into the canonical alternate
 * - extraTags: arbitrary extra metadata you may want to merge in
 */
export type { SEOTagOptions } from "@/src/lib/seo/metadata";

/**
 * Build a Metadata object prefilled from `config` with sane defaults.
 * Returns a value compatible with Next.js app router `metadata` export.
 */
export const getSEOTags = (opts: SEOTagOptions = {}): Metadata => buildSEOTags(opts);
export { buildArticleMetadata, buildPageMetadata };

/**
 * Render structured data scripts for Schema.org rich results.
 * Pass an array of JSON-LD objects or let the helper render a sensible default.
 */
export const renderSchemaTags = (schemas?: Array<Record<string, any>>): ReactElement | null => {
  const schemasToRender = schemas && schemas.length > 0 ? schemas : [buildRestaurantSchema()];
  return renderJsonLd(schemasToRender);
};
