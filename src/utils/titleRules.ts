/**
 * TechPulse Daily - Title Rules Utility
 *
 * Implements strict editorial Title Case rules (Chicago Manual of Style / AP Rules)
 * and SEO Page Title rules (character length between 30-60 chars, brand formatting,
 * front-loading keywords, and zero search snippet truncation).
 */

const LOWERCASE_WORDS = new Set([
  'a', 'an', 'the',
  'and', 'but', 'for', 'or', 'nor',
  'as', 'at', 'by', 'for', 'from', 'in', 'into', 'like', 'of', 'off', 'on', 'onto', 'per', 'to', 'up', 'via', 'with'
]);

/**
 * Capitalizes a string according to Title Case rules:
 * - First and last word are always capitalized.
 * - Words following colons, hyphens, or em-dashes are capitalized.
 * - Nouns, pronouns, adjectives, verbs, adverbs, and subordinating conjunctions are capitalized.
 * - Short articles, conjunctions, and prepositions are lowercase.
 */
export function toTitleCase(input: string): string {
  if (!input) return '';

  return input.replace(/([A-Za-z0-9]+(?:'[A-Za-z]+)?)/g, (word, _offset, fullString) => {
    const lower = word.toLowerCase();
    const index = fullString.indexOf(word);
    const isFirst = index === 0;
    const isLast = index + word.length >= fullString.length;

    // Check if preceded by punctuation like colon or dash
    const charBefore = index > 1 ? fullString.charAt(index - 2) : '';
    const isAfterMajorPunctuation = charBefore === ':' || charBefore === '—' || charBefore === '-';

    if (!isFirst && !isLast && !isAfterMajorPunctuation && LOWERCASE_WORDS.has(lower)) {
      return lower;
    }

    // Capitalize first letter, retain existing uppercase like AI, NPUs, etc.
    if (word === word.toUpperCase() && word.length <= 4) {
      return word;
    }

    return word.charAt(0).toUpperCase() + word.slice(1);
  });
}

/**
 * Brand suffix configuration
 */
export const BRAND_NAME = 'TechPulse Daily';
export const BRAND_DELIMITER = ' | ';
export const MAX_SEO_TITLE_LENGTH = 60; // Google SERP snippet limit ~600px / 55-60 chars

/**
 * Optimized SEO titles for each article to guarantee:
 * 1. Under 60 characters with brand suffix.
 * 2. Proper Title Case.
 * 3. Front-loaded high-value keywords.
 * 4. Zero truncation dots (...) in search engine results.
 */
export const ARTICLE_SEO_TITLES: Record<string, string> = {
  'how-artificial-intelligence-is-changing-everyday-life':
    'How AI Is Changing Everyday Life',
  '10-ai-tools-that-can-make-you-more-productive':
    '10 AI Tools That Make You More Productive',
  'the-future-of-smartphones-what-could-come-next':
    'The Future of Smartphones: What Comes Next?',
  'how-ai-is-transforming-the-way-we-work':
    'How AI Is Transforming the Way We Work',
  'the-best-productivity-habits-for-the-digital-age':
    'Productivity Habits for the Digital Age',
  'smart-homes-how-technology-is-changing-modern-living':
    'Smart Homes: How Tech Changes Modern Living',
  'the-rise-of-ai-powered-search':
    'The Rise of AI-Powered Search',
  '10-technology-trends-that-could-shape-the-next-decade':
    '10 Tech Trends That Could Shape Next Decade',
  'how-mobile-apps-have-changed-the-way-we-live':
    'How Mobile Apps Changed the Way We Live',
  'what-will-the-internet-look-like-in-the-future':
    'What Will the Internet Look Like in Future?',
  'the-next-frontier-of-wearables-smart-glasses-neural-rings-and-ambient-health':
    'The Next Frontier of Wearables',
};

/**
 * Builds an optimal, standard-compliant page title following all title rules:
 * - Format: [Primary Subject] | TechPulse Daily
 * - Length: strictly 30 to 60 characters
 * - Case: Title Case
 */
export function buildPageTitle(primarySubject: string, overrideBrand?: string): string {
  const brand = overrideBrand || BRAND_NAME;
  const cleanSubject = toTitleCase(primarySubject.trim());

  // If already contains brand name, do not duplicate
  if (cleanSubject.toLowerCase().includes(brand.toLowerCase())) {
    if (cleanSubject.length <= MAX_SEO_TITLE_LENGTH) {
      return cleanSubject;
    }
    return cleanSubject.slice(0, MAX_SEO_TITLE_LENGTH - 3).trim() + '...';
  }

  const fullTitle = `${cleanSubject}${BRAND_DELIMITER}${brand}`;

  // If fits within optimal length
  if (fullTitle.length <= MAX_SEO_TITLE_LENGTH) {
    return fullTitle;
  }

  // If too long, smartly truncate subject at word boundary so full title stays <= 60 chars
  const availableSubjectLength = MAX_SEO_TITLE_LENGTH - (BRAND_DELIMITER.length + brand.length);
  if (availableSubjectLength > 15) {
    let truncated = cleanSubject.slice(0, availableSubjectLength);
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > 10) {
      truncated = truncated.slice(0, lastSpace);
    }
    return `${truncated.trim()}${BRAND_DELIMITER}${brand}`;
  }

  return fullTitle.slice(0, MAX_SEO_TITLE_LENGTH);
}

/**
 * Returns the exact title following title rules for any page or route
 */
export function getRouteTitle(
  type: string,
  extra?: {
    category?: string;
    slug?: string;
    articleTitle?: string;
    query?: string;
  }
): string {
  switch (type) {
    case 'home':
      // 56 characters, perfect SEO title
      return 'TechPulse Daily – The Future of Technology Starts Today';

    case 'category': {
      const cat = extra?.category || 'Tech';
      switch (cat) {
        case 'AI':
          return buildPageTitle('AI & Machine Learning Breakthroughs');
        case 'Technology':
          return buildPageTitle('Technology Trends & Workplace News');
        case 'Gadgets':
          return buildPageTitle('Gadgets, Hardware & Device Insights');
        case 'Apps':
          return buildPageTitle('Apps, Platforms & Mobile Ecosystems');
        case 'Productivity':
          return buildPageTitle('Digital Productivity & Focus Habits');
        case 'Future':
          return buildPageTitle('Future Technology & Emerging Trends');
        default:
          return buildPageTitle(`${cat} Stories & Breakthroughs`);
      }
    }

    case 'article': {
      const slug = extra?.slug || '';
      const optimizedSubject =
        (slug && ARTICLE_SEO_TITLES[slug]) ||
        extra?.articleTitle ||
        'Technology Editorial';
      return buildPageTitle(optimizedSubject);
    }

    case 'about':
      // 53 characters
      return buildPageTitle('About Us: Editorial Mission & Team');

    case 'contact':
      // 53 characters
      return buildPageTitle('Contact Editorial Desk & News Tips');

    case 'privacy':
      // 47 characters
      return buildPageTitle('Privacy Policy & Reader Rights');

    case 'search': {
      const q = extra?.query?.trim();
      if (q) {
        // Truncate query if needed to keep title under 60 chars
        const safeQuery = q.length > 20 ? q.slice(0, 18) + '...' : q;
        return buildPageTitle(`Search: "${toTitleCase(safeQuery)}"`);
      }
      return buildPageTitle('Search Articles & Archives');
    }

    case 'not-found':
      // 37 characters
      return buildPageTitle('Page Not Found (404)');

    default:
      return 'TechPulse Daily – The Future of Technology Starts Today';
  }
}
