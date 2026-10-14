import { Category, Article } from '../types/blog';
import { ARTICLES, CATEGORIES } from '../data/articles';
import { formatMetaDescription } from './metaDescriptionRules';

export type Route =
  | { type: 'home'; category: 'All' }
  | { type: 'category'; category: Exclude<Category, 'All'> }
  | { type: 'article'; article: Article; slug: string }
  | { type: 'about' }
  | { type: 'contact' }
  | { type: 'privacy' }
  | { type: 'search'; query: string }
  | { type: 'not-found'; path: string };

export function categoryToSlug(category: Category): string {
  if (category === 'All') return '';
  return category.toLowerCase();
}

export function slugToCategory(slug: string): Category | null {
  const normalized = slug.trim().toLowerCase();
  for (const cat of CATEGORIES) {
    if (cat.toLowerCase() === normalized) {
      return cat;
    }
  }
  return null;
}

export function getArticleUrl(slug: string): string {
  return `/article/${slug}`;
}

export function getCategoryUrl(category: Category): string {
  if (category === 'All') return '/';
  return `/category/${category.toLowerCase()}`;
}

export function getAboutUrl(): string {
  return '/about';
}

export function getContactUrl(): string {
  return '/contact';
}

export function getPrivacyUrl(): string {
  return '/privacy';
}

export function getSearchUrl(query?: string): string {
  if (!query || !query.trim()) return '/search';
  return `/search?q=${encodeURIComponent(query.trim())}`;
}

/**
 * Parses the current browser URL (pathname, search query, and legacy hash fallback) into a Route
 */
export function parseRoute(pathname: string, search: string = '', hash: string = ''): Route {
  // 1. Graceful legacy hash URLs conversion (e.g., #article/foo or #about or #/category/ai)
  if (hash) {
    const cleanHash = hash.replace(/^#\/?/, '');
    if (cleanHash.startsWith('article/')) {
      const slug = cleanHash.replace('article/', '').trim();
      const article = ARTICLES.find((a) => a.slug === slug);
      if (article) {
        return { type: 'article', article, slug };
      }
    } else if (cleanHash.startsWith('category/')) {
      const slug = cleanHash.replace('category/', '').trim();
      const matched = slugToCategory(slug);
      if (matched && matched !== 'All') {
        return { type: 'category', category: matched };
      }
    } else if (cleanHash === 'about') {
      return { type: 'about' };
    } else if (cleanHash === 'contact') {
      return { type: 'contact' };
    } else if (cleanHash === 'privacy') {
      return { type: 'privacy' };
    } else if (cleanHash.startsWith('search')) {
      const q = new URLSearchParams(search || cleanHash.split('?')[1] || '').get('q') || '';
      return { type: 'search', query: q };
    }
  }

  // 2. Parse search query string if present
  const searchParams = new URLSearchParams(search);
  const queryParam = searchParams.get('q') || '';

  // 3. Normalize pathname: lowercase, remove trailing slash (except root '/')
  let cleanPath = pathname.trim().toLowerCase();
  if (cleanPath.length > 1 && cleanPath.endsWith('/')) {
    cleanPath = cleanPath.slice(0, -1);
  }

  // Root Homepage
  if (cleanPath === '' || cleanPath === '/') {
    return { type: 'home', category: 'All' };
  }

  // Search page
  if (cleanPath === '/search') {
    return { type: 'search', query: queryParam };
  }

  // Static Pages
  if (cleanPath === '/about') {
    return { type: 'about' };
  }
  if (cleanPath === '/contact') {
    return { type: 'contact' };
  }
  if (cleanPath === '/privacy') {
    return { type: 'privacy' };
  }

  // Article Route: /article/:slug or /articles/:slug or /post/:slug
  const articleMatch = cleanPath.match(/^\/(?:articles?|post)\/([a-z0-9-]+)$/i);
  if (articleMatch) {
    const slug = articleMatch[1].toLowerCase();
    const article = ARTICLES.find((a) => a.slug === slug);
    if (article) {
      return { type: 'article', article, slug };
    }
    return { type: 'not-found', path: cleanPath };
  }

  // Category Route: /category/:categorySlug or /categories/:categorySlug
  const categoryMatch = cleanPath.match(/^\/categor(?:y|ies)\/([a-z0-9-]+)$/i);
  if (categoryMatch) {
    const slug = categoryMatch[1].toLowerCase();
    const matchedCategory = slugToCategory(slug);
    if (matchedCategory && matchedCategory !== 'All') {
      return { type: 'category', category: matchedCategory };
    }
    return { type: 'not-found', path: cleanPath };
  }

  // Direct category slug shorthand: e.g. /ai, /gadgets, /technology
  const directSlug = cleanPath.replace(/^\//, '');
  const directCat = slugToCategory(directSlug);
  if (directCat && directCat !== 'All') {
    return { type: 'category', category: directCat };
  }

  // Unrecognized route
  return { type: 'not-found', path: cleanPath };
}

/**
 * Updates browser metadata, canonical tag, OpenGraph tags, and JSON-LD schema
 */
export function updatePageMetadata(
  title: string,
  description: string,
  canonicalPath: string,
  ogImage?: string,
  article?: Article
) {
  // 1. Page title
  document.title = title;

  // 2. Base origin for canonical URLs
  const origin = window.location.origin || 'https://techpulsedaily.com';
  const fullCanonicalUrl = `${origin}${canonicalPath}`;

  // 3. Canonical Link Tag
  let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonicalEl) {
    canonicalEl = document.createElement('link');
    canonicalEl.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.setAttribute('href', fullCanonicalUrl);

  // 4. Open Graph URL
  let ogUrlEl = document.querySelector('meta[property="og:url"]') as HTMLMetaElement | null;
  if (!ogUrlEl) {
    ogUrlEl = document.createElement('meta');
    ogUrlEl.setAttribute('property', 'og:url');
    document.head.appendChild(ogUrlEl);
  }
  ogUrlEl.setAttribute('content', fullCanonicalUrl);

  // 5. Meta Description (strictly verified against 120-158 length rule and formatting)
  const validDescription = formatMetaDescription(description);

  let descEl = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
  if (!descEl) {
    descEl = document.createElement('meta');
    descEl.setAttribute('name', 'description');
    document.head.appendChild(descEl);
  }
  descEl.setAttribute('content', validDescription);

  // 6. OG Title
  let ogTitleEl = document.querySelector('meta[property="og:title"]') as HTMLMetaElement | null;
  if (!ogTitleEl) {
    ogTitleEl = document.createElement('meta');
    ogTitleEl.setAttribute('property', 'og:title');
    document.head.appendChild(ogTitleEl);
  }
  ogTitleEl.setAttribute('content', title);

  // 7. OG Description
  let ogDescEl = document.querySelector('meta[property="og:description"]') as HTMLMetaElement | null;
  if (!ogDescEl) {
    ogDescEl = document.createElement('meta');
    ogDescEl.setAttribute('property', 'og:description');
    document.head.appendChild(ogDescEl);
  }
  ogDescEl.setAttribute('content', validDescription);

  // 8. OG Image
  if (ogImage) {
    let ogImgEl = document.querySelector('meta[property="og:image"]') as HTMLMetaElement | null;
    if (!ogImgEl) {
      ogImgEl = document.createElement('meta');
      ogImgEl.setAttribute('property', 'og:image');
      document.head.appendChild(ogImgEl);
    }
    const fullImgUrl = ogImage.startsWith('http') ? ogImage : `${origin}${ogImage}`;
    ogImgEl.setAttribute('content', fullImgUrl);

    let twImgEl = document.querySelector('meta[name="twitter:image"]') as HTMLMetaElement | null;
    if (!twImgEl) {
      twImgEl = document.createElement('meta');
      twImgEl.setAttribute('name', 'twitter:image');
      document.head.appendChild(twImgEl);
    }
    twImgEl.setAttribute('content', fullImgUrl);
  }

  // 9. Site Name & Twitter Meta
  let siteNameEl = document.querySelector('meta[property="og:site_name"]') as HTMLMetaElement | null;
  if (!siteNameEl) {
    siteNameEl = document.createElement('meta');
    siteNameEl.setAttribute('property', 'og:site_name');
    document.head.appendChild(siteNameEl);
  }
  siteNameEl.setAttribute('content', 'TechPulse Daily');

  let twTitleEl = document.querySelector('meta[name="twitter:title"]') as HTMLMetaElement | null;
  if (!twTitleEl) {
    twTitleEl = document.createElement('meta');
    twTitleEl.setAttribute('name', 'twitter:title');
    document.head.appendChild(twTitleEl);
  }
  twTitleEl.setAttribute('content', title);

  let twDescEl = document.querySelector('meta[name="twitter:description"]') as HTMLMetaElement | null;
  if (!twDescEl) {
    twDescEl = document.createElement('meta');
    twDescEl.setAttribute('name', 'twitter:description');
    document.head.appendChild(twDescEl);
  }
  twDescEl.setAttribute('content', validDescription);

  // 10. Structured Data JSON-LD
  let schemaScript = document.getElementById('techpulse-schema') as HTMLScriptElement | null;
  if (!schemaScript) {
    schemaScript = document.createElement('script');
    schemaScript.id = 'techpulse-schema';
    schemaScript.type = 'application/ld+json';
    document.head.appendChild(schemaScript);
  }

  if (article) {
    schemaScript.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: article.title,
      description: article.excerpt,
      image: [article.featuredImage.startsWith('http') ? article.featuredImage : `${origin}${article.featuredImage}`],
      datePublished: article.date,
      dateModified: article.date,
      author: {
        '@type': 'Person',
        name: article.author.name,
        jobTitle: article.author.role,
      },
      publisher: {
        '@type': 'Organization',
        name: 'TechPulse Daily',
        url: origin,
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': fullCanonicalUrl,
      },
    });
  } else {
    schemaScript.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'TechPulse Daily',
      url: origin,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${origin}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    });
  }
}
