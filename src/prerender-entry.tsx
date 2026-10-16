import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import { ARTICLES, CATEGORIES } from './data/articles';
import { getRouteTitle } from './utils/titleRules';
import { getRouteMetaDescription } from './utils/metaDescriptionRules';
import { parseRoute, getArticleUrl, getCategoryUrl } from './utils/router';
import { Article } from './types/blog';

const SITE_URL = 'https://tec-plus-daily-1s5c.vercel.app';
const SITE_NAME = 'TechPulse Daily';

export interface PrerenderResult {
  path: string;
  html: string;
  title: string;
  description: string;
  canonicalUrl: string;
  ogImage: string;
  ogType: 'website' | 'article';
  jsonLd: object[];
}

/**
 * Returns all static routes that need to be prerendered.
 */
export function getAllRoutes(): string[] {
  const routes: string[] = [
    '/',
    '/about',
    '/contact',
    '/privacy',
  ];

  // Category pages
  CATEGORIES.forEach((cat) => {
    if (cat !== 'All') {
      routes.push(getCategoryUrl(cat));
    }
  });

  // Article pages
  ARTICLES.forEach((art) => {
    routes.push(getArticleUrl(art.slug));
  });

  return routes;
}

/**
 * Builds schema JSON-LD for an article
 */
function buildArticleSchema(article: Article, canonicalUrl: string) {
  const articleSchema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    '@id': `${canonicalUrl}#article`,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
    },
    headline: article.title,
    description: article.excerpt,
    url: canonicalUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    image: article.featuredImage?.startsWith('http')
      ? article.featuredImage
      : `${SITE_URL}${article.featuredImage}`,
    datePublished: new Date(article.date).toISOString().split('T')[0] || '2026-10-01',
    dateModified: '2026-10-15',
    author: {
      '@type': 'Person',
      name: article.author.name,
      jobTitle: article.author.role,
      image: article.author.avatar,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/assets/logo.png`,
      },
    },
    keywords: [article.category, ...(article.tags || [])].join(', '),
  };

  const breadcrumbsSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: article.category,
        item: `${SITE_URL}${getCategoryUrl(article.category)}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: canonicalUrl,
      },
    ],
  };

  const schemas: object[] = [articleSchema, breadcrumbsSchema];

  // If this article contains Q&A sections (like "The Rise of AI-Powered Search"), generate FAQPage schema for AEO!
  const qaEntities: { question: string; answer: string }[] = [];
  article.sections?.forEach((section) => {
    // Check if section heading looks like a question or contains Q&A paragraphs
    const isHeadingQuestion = section.heading.trim().endsWith('?') || 
      /^(what|how|why|is|can|will|where)\b/i.test(section.heading.trim());
    
    // Check for inline Q&A paragraphs
    let currentQ = '';
    let currentA = '';
    section.paragraphs.forEach((p) => {
      if (p.startsWith('Question:')) {
        currentQ = p.replace(/^Question:\s*/, '');
      } else if (p.startsWith('Answer:') && currentQ) {
        currentA = p.replace(/^Answer:\s*/, '');
        qaEntities.push({ question: currentQ, answer: currentA });
        currentQ = '';
        currentA = '';
      } else if (p.startsWith('Direct Answer:') && isHeadingQuestion) {
        qaEntities.push({
          question: section.heading,
          answer: p.replace(/^Direct Answer:\s*/, ''),
        });
      }
    });

    if (isHeadingQuestion && !qaEntities.some((e) => e.question === section.heading)) {
      qaEntities.push({
        question: section.heading,
        answer: section.paragraphs[0] || article.excerpt,
      });
    }
  });

  if (qaEntities.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: qaEntities.map((qa) => ({
        '@type': 'Question',
        name: qa.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: qa.answer,
        },
      })),
    });
  }

  return schemas;
}

/**
 * Builds schema JSON-LD for category pages
 */
function buildCategorySchema(category: string, canonicalUrl: string) {
  const catArticles = ARTICLES.filter((a) => a.category === category);
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${category} Articles - ${SITE_NAME}`,
      url: canonicalUrl,
      description: getRouteMetaDescription('category', { category }),
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: catArticles.map((art, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          url: `${SITE_URL}${getArticleUrl(art.slug)}`,
          name: art.title,
        })),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: SITE_URL,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: category,
          item: canonicalUrl,
        },
      ],
    },
  ];
}

/**
 * Renders a specific route to HTML and metadata
 */
export function renderRoute(path: string): PrerenderResult {
  const route = parseRoute(path);
  const canonicalUrl = `${SITE_URL}${path === '/' ? '' : path}`;
  let title = 'TechPulse Daily – The Future of Technology Starts Today';
  let description = 'Discover insightful tech journalism, artificial intelligence breakthroughs, gadget reviews, and future trends shaping our world on TechPulse Daily.';
  let ogImage = `${SITE_URL}/assets/images/hero_ai_everyday_1791347956209.jpg`;
  let ogType: 'website' | 'article' = 'website';
  let jsonLd: object[] = [];

  switch (route.type) {
    case 'home':
      title = getRouteTitle('home');
      description = getRouteMetaDescription('home');
      ogType = 'website';
      jsonLd = [
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: SITE_NAME,
          url: SITE_URL,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${SITE_URL}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: SITE_NAME,
          url: SITE_URL,
          description,
        },
      ];
      break;

    case 'category':
      title = getRouteTitle('category', { category: route.category });
      description = getRouteMetaDescription('category', { category: route.category });
      ogType = 'website';
      jsonLd = buildCategorySchema(route.category, canonicalUrl);
      break;

    case 'article':
      title = getRouteTitle('article', { slug: route.article.slug, articleTitle: route.article.title });
      description = getRouteMetaDescription('article', { slug: route.article.slug, excerpt: route.article.excerpt });
      ogType = 'article';
      if (route.article.featuredImage) {
        ogImage = route.article.featuredImage.startsWith('http')
          ? route.article.featuredImage
          : `${SITE_URL}${route.article.featuredImage}`;
      }
      jsonLd = buildArticleSchema(route.article, canonicalUrl);
      break;

    case 'about':
      title = getRouteTitle('about');
      description = getRouteMetaDescription('about');
      jsonLd = [
        {
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: `About ${SITE_NAME}`,
          url: canonicalUrl,
          description,
        },
      ];
      break;

    case 'contact':
      title = getRouteTitle('contact');
      description = getRouteMetaDescription('contact');
      jsonLd = [
        {
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: `Contact ${SITE_NAME}`,
          url: canonicalUrl,
          description,
        },
      ];
      break;

    case 'privacy':
      title = getRouteTitle('privacy');
      description = getRouteMetaDescription('privacy');
      break;

    default:
      break;
  }

  // Render the React application tree
  const html = renderToString(<App initialPath={path} />);

  return {
    path,
    html,
    title,
    description,
    canonicalUrl,
    ogImage,
    ogType,
    jsonLd,
  };
}
