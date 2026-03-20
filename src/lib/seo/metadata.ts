import type { Metadata } from 'next';
import { metadataBaseUrl, restaurantFacts, siteMetadata, siteUrl } from '@/src/lib/site/site';

export type SEOTagOptions = Metadata & {
  canonicalUrlRelative?: string;
  extraTags?: Record<string, any>;
};

export function buildSEOTags(opts: SEOTagOptions = {}): Metadata {
  const { title, description, keywords, openGraph, canonicalUrlRelative, extraTags, ...rest } = opts;

  const normalizedKeywords: Metadata['keywords'] = Array.isArray(keywords)
    ? keywords
    : typeof keywords === 'string'
      ? keywords.split(',').map((keyword) => keyword.trim()).filter(Boolean)
      : [siteMetadata.name];

  const defaultDescription = description || siteMetadata.description;
  const defaultTitle = title || siteMetadata.title;
  const defaultOgUrl = openGraph?.url || siteUrl(canonicalUrlRelative || '/');
  const defaultSocialImage = siteMetadata.defaultSocialImage;

  const metadata: Metadata = {
    metadataBase: metadataBaseUrl(),
    title: defaultTitle,
    description: defaultDescription,
    keywords: normalizedKeywords,
    applicationName: siteMetadata.name,
    authors: [{ name: siteMetadata.name }],
    creator: siteMetadata.name,
    publisher: siteMetadata.publisher,
    category: 'restaurant',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    openGraph: {
      title: openGraph?.title || defaultTitle,
      description: openGraph?.description || defaultDescription,
      url: defaultOgUrl,
      siteName: siteMetadata.name,
      locale: 'en_GB',
      type: 'website',
      images: openGraph?.images || [
        {
          url: defaultSocialImage,
          width: 1200,
          height: 630,
          alt: siteMetadata.name,
        },
      ],
    },
    twitter: {
      title: openGraph?.title || defaultTitle,
      description: openGraph?.description || defaultDescription,
      card: 'summary_large_image',
      creator: '@lapeninns',
      images: [defaultSocialImage],
    },
    alternates: canonicalUrlRelative ? { canonical: canonicalUrlRelative } : undefined,
    other: {
      telephone: restaurantFacts.telephone,
    },
    ...rest,
    ...extraTags,
  };

  return metadata;
}

type SharedPageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  keywords?: Metadata['keywords'];
  socialTitle?: string;
  socialDescription?: string;
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'article';
};

function toAbsoluteAssetUrl(value?: string) {
  if (!value) {
    return undefined;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return siteUrl(value.startsWith('/') ? value : `/${value}`);
}

function buildSocialImages(image?: string, imageAlt?: string) {
  const url = toAbsoluteAssetUrl(image) || siteMetadata.defaultSocialImage;

  return [
    {
      url,
      width: 1200,
      height: 630,
      alt: imageAlt || siteMetadata.name,
    },
  ];
}

export function buildPageMetadata({
  title,
  description,
  path,
  keywords,
  socialTitle,
  socialDescription,
  image,
  imageAlt,
  type = 'website',
}: SharedPageMetadataOptions): Metadata {
  const images = buildSocialImages(image, imageAlt || socialTitle || title);

  return buildSEOTags({
    title,
    description,
    keywords,
    canonicalUrlRelative: path,
    openGraph: {
      title: socialTitle || title,
      description: socialDescription || description,
      url: siteUrl(path),
      type,
      images,
    },
    twitter: {
      title: socialTitle || title,
      description: socialDescription || description,
      card: 'summary_large_image',
      creator: '@lapeninns',
      images: images.map((entry) => entry.url),
    },
  });
}

export function buildArticleMetadata(
  opts: Omit<SharedPageMetadataOptions, 'type'>
): Metadata {
  return buildPageMetadata({
    ...opts,
    type: 'article',
  });
}
