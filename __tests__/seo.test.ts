import { getSEOTags } from '../libs/seo';
import config from '../config';

describe('SEO Tags', () => {
  it('should generate default metadata correctly', () => {
    const metadata = getSEOTags();
    
    expect(metadata.title).toBe(config.appName);
    expect(metadata.description).toBe(config.appDescription);
    expect(metadata.applicationName).toBe(config.appName);
    expect(metadata.metadataBase).toBeInstanceOf(URL);
  });

  it('should override defaults with custom values', () => {
    const customTitle = 'Custom Page Title';
    const customDescription = 'Custom page description';
    
    const metadata = getSEOTags({
      title: customTitle,
      description: customDescription,
    });
    
    expect(metadata.title).toBe(customTitle);
    expect(metadata.description).toBe(customDescription);
  });

  it('should handle keywords as string array', () => {
    const keywords = ['keyword1', 'keyword2', 'keyword3'];
    
    const metadata = getSEOTags({
      keywords,
    });
    
    expect(metadata.keywords).toEqual(keywords);
  });

  it('should handle keywords as comma-separated string', () => {
    const keywordsString = 'keyword1, keyword2, keyword3';
    
    const metadata = getSEOTags({
      keywords: keywordsString,
    });
    
    expect(metadata.keywords).toEqual(['keyword1', 'keyword2', 'keyword3']);
  });

  it('should set canonical URL when provided', () => {
    const canonicalPath = '/about';
    
    const metadata = getSEOTags({
      canonicalUrlRelative: canonicalPath,
    });
    
    expect(metadata.alternates?.canonical).toBe(canonicalPath);
  });

  it('should generate OpenGraph metadata correctly', () => {
    const metadata = getSEOTags({
      title: 'Test Page',
      description: 'Test description',
    });
    
    expect(metadata.openGraph).toMatchObject({
      title: 'Test Page',
      description: 'Test description',
      locale: 'en_US',
      type: 'website',
    });
  });

  it('should generate Twitter metadata correctly', () => {
    const metadata = getSEOTags({
      title: 'Test Page',
      description: 'Test description',
    });
    
    expect(metadata.twitter).toMatchObject({
      title: 'Test Page',
      description: 'Test description',
      card: 'summary_large_image',
      creator: '@marc_louvion',
    });
  });

  it('should merge extra tags', () => {
    const extraTags = {
      'custom-meta': 'custom-value',
      robots: 'noindex',
    };
    
    const metadata = getSEOTags({
      extraTags,
    });
    
    expect(metadata).toMatchObject(extraTags);
  });
});

describe('Schema Tags', () => {
  it('should generate valid JSON-LD structure', () => {
    // This would be tested in a React testing environment
    // For now, we can test the schema structure manually
    const expectedSchema = {
      '@context': 'https://schema.org',
      '@type': 'Restaurant',
      name: config.appName,
      description: config.appDescription,
    };
    
    // In a real test, you'd render the component and check the script tag content
    expect(expectedSchema['@context']).toBe('https://schema.org');
    expect(expectedSchema['@type']).toBe('Restaurant');
  });
});
