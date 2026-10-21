import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const publicDir = path.resolve(rootDir, 'public');

const SITE_URL = 'https://tec-plus-daily-1s5c.vercel.app';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function prerender() {
  console.log('🚀 Starting Static Site Generation (SSG) prerendering...');

  if (!fs.existsSync(distDir)) {
    throw new Error('dist directory does not exist! Please run "vite build" first.');
  }

  const templatePath = path.resolve(distDir, 'index.html');
  if (!fs.existsSync(templatePath)) {
    throw new Error('dist/index.html not found! Please run "vite build" first.');
  }
  const baseTemplate = fs.readFileSync(templatePath, 'utf-8');

  // Create a Vite dev server in middleware mode to load SSR modules
  const vite = await createServer({
    root: rootDir,
    server: { middlewareMode: true },
    appType: 'custom',
  });

  try {
    const { getAllRoutes, renderRoute } = await vite.ssrLoadModule('/src/prerender-entry.tsx');
    const routes: string[] = getAllRoutes();
    console.log(`📋 Found ${routes.length} routes to prerender.\n`);

    const generatedFiles: { path: string; file: string; size: number; title: string }[] = [];

    for (const route of routes) {
      const {
        html,
        title,
        description,
        canonicalUrl,
        ogImage,
        ogType,
        jsonLd,
      } = renderRoute(route);

      let pageHtml = baseTemplate;

      // 1. Replace Title
      pageHtml = pageHtml.replace(
        /<title>[\s\S]*?<\/title>/i,
        `<title>${escapeHtml(title)}</title>`
      );

      // 2. Replace or inject Meta Description
      if (pageHtml.includes('name="description"')) {
        pageHtml = pageHtml.replace(
          /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/?>/i,
          `<meta name="description" content="${escapeHtml(description)}" />`
        );
      } else {
        pageHtml = pageHtml.replace(
          '</head>',
          `  <meta name="description" content="${escapeHtml(description)}" />\n</head>`
        );
      }

      // 3. Inject or update Canonical Tag
      if (pageHtml.includes('rel="canonical"')) {
        pageHtml = pageHtml.replace(
          /<link\s+rel="canonical"\s+href="[\s\S]*?"\s*\/?>/i,
          `<link rel="canonical" href="${canonicalUrl}" />`
        );
      } else {
        pageHtml = pageHtml.replace(
          '</head>',
          `  <link rel="canonical" href="${canonicalUrl}" />\n</head>`
        );
      }

      // 4. Update / Inject Open Graph tags
      const ogTags = [
        `<meta property="og:site_name" content="TechPulse Daily" />`,
        `<meta property="og:title" content="${escapeHtml(title)}" />`,
        `<meta property="og:description" content="${escapeHtml(description)}" />`,
        `<meta property="og:url" content="${canonicalUrl}" />`,
        `<meta property="og:type" content="${ogType}" />`,
        `<meta property="og:image" content="${ogImage}" />`,
        `<meta name="twitter:card" content="summary_large_image" />`,
        `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
        `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
        `<meta name="twitter:image" content="${ogImage}" />`,
      ].join('\n  ');

      // Strip existing generic OG tags to prevent duplicates
      pageHtml = pageHtml
        .replace(/<meta\s+property="og:site_name"[\s\S]*?>/gi, '')
        .replace(/<meta\s+property="og:title"[\s\S]*?>/gi, '')
        .replace(/<meta\s+property="og:description"[\s\S]*?>/gi, '')
        .replace(/<meta\s+property="og:url"[\s\S]*?>/gi, '')
        .replace(/<meta\s+property="og:type"[\s\S]*?>/gi, '')
        .replace(/<meta\s+property="og:image"[\s\S]*?>/gi, '')
        .replace(/<meta\s+name="twitter:card"[\s\S]*?>/gi, '')
        .replace(/<meta\s+name="twitter:title"[\s\S]*?>/gi, '')
        .replace(/<meta\s+name="twitter:description"[\s\S]*?>/gi, '')
        .replace(/<meta\s+name="twitter:image"[\s\S]*?>/gi, '');

      // Inject structured JSON-LD schemas
      const schemaScript = jsonLd && jsonLd.length > 0
        ? `\n  <script type="application/ld+json">\n${JSON.stringify(jsonLd.length === 1 ? jsonLd[0] : jsonLd, null, 2)}\n  </script>`
        : '';

      pageHtml = pageHtml.replace(
        '</head>',
        `  ${ogTags}${schemaScript}\n</head>`
      );

      // 5. Inject Pre-rendered React Tree into <div id="root"></div>
      pageHtml = pageHtml.replace(
        '<div id="root"></div>',
        `<div id="root">${html}</div>`
      );

      // 6. Write target files
      if (route === '/') {
        fs.writeFileSync(path.resolve(distDir, 'index.html'), pageHtml, 'utf-8');
        generatedFiles.push({
          path: '/',
          file: 'dist/index.html',
          size: Buffer.byteLength(pageHtml, 'utf-8'),
          title,
        });
      } else {
        const routeSubdir = path.resolve(distDir, route.replace(/^\//, ''));
        fs.mkdirSync(routeSubdir, { recursive: true });
        
        // Write folder/index.html (e.g. dist/category/ai/index.html)
        const indexPath = path.resolve(routeSubdir, 'index.html');
        fs.writeFileSync(indexPath, pageHtml, 'utf-8');

        // Also write folder.html (e.g. dist/category/ai.html) for cleanUrls
        const cleanPath = path.resolve(distDir, `${route.replace(/^\//, '')}.html`);
        fs.writeFileSync(cleanPath, pageHtml, 'utf-8');

        // If route is 404, also ensure root dist/404.html exists for Vercel default 404
        if (route === '/404') {
          fs.writeFileSync(path.resolve(distDir, '404.html'), pageHtml, 'utf-8');
        }

        generatedFiles.push({
          path: route,
          file: `dist${route}/index.html`,
          size: Buffer.byteLength(pageHtml, 'utf-8'),
          title,
        });
      }

      console.log(`✓ Prerendered: ${route} (${title})`);
    }

    // 7. Generate Sitemap XML (Indexable content pages only, excluding error pages)
    const indexableRoutes = routes.filter((r) => r !== '/404' && r !== '/484');
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexableRoutes
  .map((r) => {
    const loc = `${SITE_URL}${r === '/' ? '/' : r}`;
    const priority = r === '/' ? '1.0' : r.startsWith('/article/') ? '0.85' : '0.8';
    const changefreq = r === '/' ? 'daily' : r.startsWith('/article/') ? 'weekly' : 'monthly';
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>2026-10-20</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  })
  .join('\n')}
</urlset>`;

    fs.writeFileSync(path.resolve(distDir, 'sitemap.xml'), sitemapXml, 'utf-8');
    fs.writeFileSync(path.resolve(publicDir, 'sitemap.xml'), sitemapXml, 'utf-8');
    console.log(`\n✓ Generated: dist/sitemap.xml and public/sitemap.xml`);

    // 8. Generate robots.txt
    const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
    fs.writeFileSync(path.resolve(distDir, 'robots.txt'), robotsTxt, 'utf-8');
    fs.writeFileSync(path.resolve(publicDir, 'robots.txt'), robotsTxt, 'utf-8');
    console.log(`✓ Generated: dist/robots.txt and public/robots.txt`);

    console.log(`\n🎉 SSG Prerendering complete! Total pages generated: ${generatedFiles.length}`);
    console.table(
      generatedFiles.map((f) => ({
        Route: f.path,
        File: f.file,
        'Size (KB)': (f.size / 1024).toFixed(1),
        Title: f.title.slice(0, 45) + (f.title.length > 45 ? '...' : ''),
      }))
    );
  } finally {
    await vite.close();
  }
}

prerender().catch((err) => {
  console.error('SSG Prerender failed:', err);
  process.exit(1);
});
