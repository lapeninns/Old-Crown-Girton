import type { Metadata } from "next";
import type { ReactElement } from "react";
import config from "@/config";

/**
 * Contract for getSEOTags inputs.
 * We accept all Next.js Metadata fields and two helpers:
 * - canonicalUrlRelative: relative path (e.g. "/about") that will be turned into the canonical alternate
 * - extraTags: arbitrary extra metadata you may want to merge in
 */
type SEOTagOptions = Metadata & {
  canonicalUrlRelative?: string;
  extraTags?: Record<string, any>;
};

/**
 * Build a Metadata object prefilled from `config` with sane defaults.
 * Returns a value compatible with Next.js app router `metadata` export.
 */
export const getSEOTags = (opts: SEOTagOptions = {}): Metadata => {
  const { title, description, keywords, openGraph, canonicalUrlRelative, extraTags } = opts;

  const metadataBase = new URL(
    process.env.NODE_ENV === "development" ? "http://localhost:3000/" : `https://${config.domainName}/`
  );

  // Normalize keywords: accept string | string[] | undefined
  const normalizedKeywords: Metadata["keywords"] = Array.isArray(keywords)
    ? keywords
    : typeof keywords === "string"
    ? keywords.split(",").map((k) => k.trim()).filter(Boolean)
    : [config.appName];

  const defaultOGUrl = `${metadataBase.origin}/`;

  const metadata: Metadata = {
    title: title || config.appName,
    description: description || config.appDescription,
    keywords: normalizedKeywords,
    applicationName: config.appName,
    metadataBase,

    openGraph: {
      title: openGraph?.title || title || config.appName,
      description: openGraph?.description || description || config.appDescription,
      url: openGraph?.url || defaultOGUrl,
      siteName: openGraph?.siteName || config.appName,
      locale: "en_US",
      type: "website",
      ...(openGraph?.images ? { images: openGraph.images } : {}),
    },

    twitter: {
      title: openGraph?.title || title || config.appName,
      description: openGraph?.description || description || config.appDescription,
      card: "summary_large_image",
      creator: "@lapeninns",
    },

    // Merge any additional tags (be careful not to clobber typed fields)
    ...extraTags,
  };

  if (canonicalUrlRelative) {
    // Next.js will resolve this relative canonical with metadataBase
    metadata.alternates = { canonical: canonicalUrlRelative };
  }

  return metadata;
};

/**
 * Render structured data scripts for Schema.org rich results.
 * Pass an array of JSON-LD objects or let the helper render a sensible default.
 */
export const renderSchemaTags = (schemas?: Array<Record<string, any>>): ReactElement | null => {
  const defaultSchema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: config.appName,
    description: config.appDescription,
    image: `${config.domainName.startsWith("http") ? config.domainName : `https://${config.domainName}`}/icon.png`,
    url: `https://${config.domainName}/`,
    telephone: "+44 1223 277217",
    email: "oldcrown@lapeninns.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "89 High Street",
      addressLocality: "Girton",
      addressRegion: "Cambridgeshire",
      postalCode: "CB3 0QQ",
      addressCountry: "GB"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "52.2434",
      longitude: "0.0732"
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday"],
        opens: "12:00",
        closes: "22:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Tuesday"],
        opens: "12:00",
        closes: "22:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Wednesday"],
        opens: "12:00",
        closes: "22:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Thursday"],
        opens: "12:00",
        closes: "22:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Friday"],
        opens: "12:00",
        closes: "23:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "12:00",
        closes: "23:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Sunday"],
        opens: "12:00",
        closes: "22:00"
      }
    ],
    servesCuisine: ["Nepalese", "British", "Pub Food"],
    priceRange: "££",
    acceptsReservations: true,
    hasMenu: `https://${config.domainName}/menu`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.5",
      reviewCount: "127"
    }
  };

  const schemasToRender = schemas && schemas.length > 0 ? schemas : [defaultSchema];

  return (
    <>
      {schemasToRender.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
};
