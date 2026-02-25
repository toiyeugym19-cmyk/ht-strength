---
name: SEO Optimization
description: Search Engine Optimization best practices for modern web applications
---

# SEO Optimization

## Meta Tags

```html
<!-- Essential -->
<title>HT Strength - Premium Gym Management</title>
<meta name="description" content="Professional gym management platform for fitness centers">

<!-- Open Graph (Facebook) -->
<meta property="og:title" content="HT Strength">
<meta property="og:description" content="Premium gym management">
<meta property="og:image" content="https://example.com/og-image.jpg">
<meta property="og:url" content="https://htstrength.com">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="HT Strength">
<meta name="twitter:description" content="Premium gym management">
<meta name="twitter:image" content="https://example.com/twitter-image.jpg">
```

## Semantic HTML

```html
<!-- Good structure -->
<header>
  <nav>...</nav>
</header>
<main>
  <article>
    <h1>Main Title</h1>
    <section>
      <h2>Section Title</h2>
      <p>Content...</p>
    </section>
  </article>
</main>
<footer>...</footer>
```

## Performance

- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Image optimization**: WebP, lazy loading
- **Code splitting**: Reduce bundle size
- **Caching**: Leverage browser cache

## Structured Data

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "GymOrFitnessCente",
  "name": "HT Strength",
  "url": "https://htstrength.com",
  "telephone": "+84-123-456-789"
}
</script>
```

## Sitemap

```xml
<!-- sitemap.xml -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://htstrength.com/</loc>
    <lastmod>2026-02-02</lastmod>
    <priority>1.0</priority>
  </url>
</urlset>
```

## robots.txt

```
User-agent: *
Allow: /
Sitemap: https://htstrength.com/sitemap.xml
```
