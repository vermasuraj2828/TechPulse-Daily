export type Category = 
  | 'All'
  | 'AI'
  | 'Technology'
  | 'Gadgets'
  | 'Apps'
  | 'Productivity'
  | 'Future';

export interface Author {
  name: string;
  role: string;
  avatar: string;
}

export interface ArticleSection {
  heading: string;
  paragraphs: string[];
  bulletPoints?: string[];
  quote?: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: Exclude<Category, 'All'>;
  author: Author;
  date: string;
  readTime: string;
  featuredImage: string;
  imageCaption: string;
  excerpt: string;
  leadParagraph: string;
  sections: ArticleSection[];
  keyTakeaways: string[];
  tags: string[];
  featured?: boolean;
}
