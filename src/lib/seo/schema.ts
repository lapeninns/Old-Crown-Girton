import { restaurantFacts, getOpeningHoursSpecifications, siteUrl } from '@/src/lib/site/site';
import type { HomepageFaqItem } from '@/src/lib/site/homepage';

type SchemaThing = {
  name: string;
  description?: string;
};

type ArticleSchemaAuthor = {
  type?: 'Person' | 'Organization';
  name: string;
  description?: string;
};

function toAbsoluteUrl(value: string) {
  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return siteUrl(value.startsWith('/') ? value : `/${value}`);
}

function buildImageObject(url: string, alt: string) {
  return {
    '@type': 'ImageObject',
    url: toAbsoluteUrl(url),
    width: 1200,
    height: 630,
    alt,
  };
}

function countWordsFromHtml(html: string) {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z0-9#]+;/gi, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
}

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': siteUrl('/#organization'),
    name: restaurantFacts.name,
    alternateName: restaurantFacts.alternateName,
    url: siteUrl('/'),
    logo: {
      '@type': 'ImageObject',
      url: restaurantFacts.logo,
    },
    image: restaurantFacts.images,
    email: restaurantFacts.email,
    telephone: restaurantFacts.telephone,
    address: {
      '@type': 'PostalAddress',
      ...restaurantFacts.address,
    },
    sameAs: Object.values(restaurantFacts.social),
  };
}

export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': siteUrl('/#website'),
    url: siteUrl('/'),
    name: restaurantFacts.name,
    description: restaurantFacts.description,
    inLanguage: 'en-GB',
    publisher: {
      '@id': siteUrl('/#organization'),
    },
  };
}

export function buildRestaurantSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': siteUrl('/#restaurant'),
    name: restaurantFacts.name,
    alternateName: restaurantFacts.alternateName,
    description: restaurantFacts.description,
    url: siteUrl('/'),
    telephone: restaurantFacts.telephone,
    email: restaurantFacts.email,
    logo: restaurantFacts.logo,
    image: restaurantFacts.images,
    priceRange: restaurantFacts.priceRange,
    servesCuisine: restaurantFacts.cuisines,
    acceptsReservations: restaurantFacts.acceptsReservations,
    hasMenu: restaurantFacts.menuUrl,
    hasMap: restaurantFacts.mapUrl,
    parentOrganization: {
      '@id': siteUrl('/#organization'),
    },
    address: {
      '@type': 'PostalAddress',
      ...restaurantFacts.address,
    },
    geo: {
      '@type': 'GeoCoordinates',
      ...restaurantFacts.geo,
    },
    openingHoursSpecification: getOpeningHoursSpecifications('bar'),
    sameAs: Object.values(restaurantFacts.social),
    inLanguage: 'en-GB',
  };
}

export function buildWebPageSchema({
  path,
  title,
  description,
  type = 'WebPage',
}: {
  path: string;
  title: string;
  description: string;
  type?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': `${siteUrl(path)}#webpage`,
    url: siteUrl(path),
    name: title,
    description,
    inLanguage: 'en-GB',
    isPartOf: {
      '@id': siteUrl('/#website'),
    },
    about: {
      '@id': siteUrl('/#organization'),
    },
    publisher: {
      '@id': siteUrl('/#organization'),
    },
  };
}

export function buildCollectionPageSchema({
  path,
  title,
  description,
  type = 'CollectionPage',
}: {
  path: string;
  title: string;
  description: string;
  type?: string;
}) {
  return buildWebPageSchema({
    path,
    title,
    description,
    type,
  });
}

export function buildBlogSchema({
  path,
  name,
  description,
}: {
  path: string;
  name: string;
  description: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${siteUrl(path)}#blog`,
    url: siteUrl(path),
    name,
    description,
    inLanguage: 'en-GB',
    publisher: {
      '@id': siteUrl('/#organization'),
    },
    about: {
      '@id': siteUrl('/#restaurant'),
    },
  };
}

export function buildItemListSchema({
  path,
  name,
  items,
}: {
  path: string;
  name: string;
  items: Array<{
    name: string;
    path: string;
    description?: string;
    image?: string;
    datePublished?: string;
    type?: string;
  }>;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${siteUrl(path)}#itemlist`,
    name,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: siteUrl(item.path),
      name: item.name,
      item: {
        '@type': item.type || 'CreativeWork',
        '@id': siteUrl(item.path),
        url: siteUrl(item.path),
        name: item.name,
        description: item.description,
        image: item.image ? toAbsoluteUrl(item.image) : undefined,
        datePublished: item.datePublished,
      },
    })),
  };
}

export function buildArticleSchemas({
  path,
  headline,
  description,
  image,
  publishedDate,
  modifiedDate,
  author,
  section,
  tags = [],
  html,
  wordCount,
  articleType = 'BlogPosting',
  about,
  sameAs,
  collectionPath = '/blog',
  collectionName = 'Old Crown Girton Blog',
  collectionSchemaType = 'Blog',
}: {
  path: string;
  headline: string;
  description: string;
  image: string;
  publishedDate: string;
  modifiedDate?: string;
  author: ArticleSchemaAuthor;
  section: string;
  tags?: string[];
  html?: string;
  wordCount?: number;
  articleType?: 'BlogPosting' | 'NewsArticle';
  about?: SchemaThing[];
  sameAs?: string[];
  collectionPath?: string;
  collectionName?: string;
  collectionSchemaType?: string;
}) {
  const normalizedWordCount = wordCount || (html ? countWordsFromHtml(html) : undefined);

  const webpage = {
    ...buildWebPageSchema({
      path,
      title: headline,
      description,
    }),
    mainContentOfPage: {
      '@type': 'WebPageElement',
      cssSelector: 'article',
    },
  };

  const article = {
    '@context': 'https://schema.org',
    '@type': articleType,
    '@id': `${siteUrl(path)}#article`,
    headline,
    description,
    url: siteUrl(path),
    datePublished: publishedDate,
    dateModified: modifiedDate || publishedDate,
    author: {
      '@type': author.type || 'Person',
      name: author.name,
      description: author.description,
    },
    publisher: {
      '@id': siteUrl('/#organization'),
    },
    mainEntityOfPage: {
      '@id': webpage['@id'],
    },
    image: buildImageObject(image, headline),
    articleSection: section,
    keywords: tags.join(', '),
    wordCount: normalizedWordCount,
    inLanguage: 'en-GB',
    isPartOf: {
      '@type': collectionSchemaType,
      '@id': `${siteUrl(collectionPath)}#${collectionSchemaType.toLowerCase()}`,
      name: collectionName,
      url: siteUrl(collectionPath),
    },
    about: about?.map((entry) => ({
      '@type': 'Thing',
      name: entry.name,
      description: entry.description,
    })),
    sameAs,
  };

  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Blog', path: collectionPath },
    { name: headline, path },
  ]);

  return [article, webpage, breadcrumb];
}

export function buildFaqSchema(items: HomepageFaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function buildBreadcrumbSchema(
  items: Array<{ name: string; path: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: siteUrl(item.path),
    })),
  };
}
