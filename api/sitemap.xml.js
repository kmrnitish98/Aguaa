// Vercel Serverless Function — generates XML sitemap including public profile URLs.
//
// BACKEND_URL must be set in Vercel environment variables dashboard.
// This is a SERVER-SIDE runtime variable — NOT the Vite VITE_API_URL build-time variable.

/* global process */

export default async function handler(req, res) {
  try {
    const rawBackend =
      process.env.BACKEND_URL ||
      process.env.VITE_BACKEND_URL ||
      (process.env.VITE_API_URL ? process.env.VITE_API_URL.replace(/\/api\/?$/, '') : '') ||
      '';
    const BACKEND_URL = rawBackend.replace(/\/+$/, '');

    let profileUrls = [];
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Fetch public profile IDs from the backend if BACKEND_URL is configured.
    // The /api/biodata/public endpoint returns { biodatas: [...], pagination: {...} }
    // We extract only valid public profiles to build profile URLs.
    if (BACKEND_URL) {
      try {
        const response = await fetch(`${BACKEND_URL}/api/biodata/public?limit=50&page=1`, {
          signal: AbortSignal.timeout(5000), // 5s timeout — don't block sitemap for slow API
        });

        if (response.ok) {
          const json = await response.json();
          // Extract biodatas array from either object response { biodatas: [...] } or plain array
          let list = Array.isArray(json) ? json : (json?.biodatas || []);

          // If there are multiple pages, fetch remaining pages (up to 10 pages / 500 profiles) safely within timeout
          const totalPages = json?.pagination?.totalPages || 1;
          if (totalPages > 1) {
            try {
              const pagePromises = [];
              for (let p = 2; p <= Math.min(totalPages, 10); p++) {
                pagePromises.push(
                  fetch(`${BACKEND_URL}/api/biodata/public?limit=50&page=${p}`, {
                    signal: AbortSignal.timeout(4000),
                  })
                    .then((r) => (r.ok ? r.json() : null))
                    .then((d) => (Array.isArray(d) ? d : (d?.biodatas || [])))
                    .catch(() => [])
                );
              }
              const extraPages = await Promise.all(pagePromises);
              extraPages.forEach((pageItems) => {
                if (Array.isArray(pageItems) && pageItems.length > 0) {
                  list = list.concat(pageItems);
                }
              });
            } catch (pageErr) {
              console.warn('[Sitemap] Could not fetch additional pages:', pageErr.message);
            }
          }

          // Build sitemap entries for public biodatas (strictly excluding any private items)
          profileUrls = list
            .filter((b) => b && b._id && b.isPublic !== false)
            .map((b) => {
              const lastmod = b.updatedAt
                ? new Date(b.updatedAt).toISOString().split('T')[0]
                : today;
              return `
  <url>
    <loc>https://myaguaa.in/profile/${b._id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
            });
        }
      } catch (fetchErr) {
        // Non-fatal — we still return the static pages sitemap even if backend is down
        console.warn('[Sitemap] Could not fetch profile IDs from backend:', fetchErr.message);
      }
    } else {
      console.warn('[Sitemap] BACKEND_URL is not set — profile URLs will be omitted from sitemap');
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

  <!-- Static pages -->
  <url>
    <loc>https://myaguaa.in/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://myaguaa.in/explore</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.95</priority>
  </url>
  <url>
    <loc>https://myaguaa.in/about</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://myaguaa.in/pricing</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://myaguaa.in/gallery</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.75</priority>
  </url>
  <url>
    <loc>https://myaguaa.in/contact</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://myaguaa.in/privacy</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>https://myaguaa.in/terms</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>https://myaguaa.in/refund</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>

  <!-- Dynamic public profile pages -->
${profileUrls.join('')}

</urlset>`;

    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    // Cache at Vercel edge for 24 hours; serve stale for another 24h while revalidating
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=86400');
    return res.status(200).send(sitemap.trim());

  } catch (error) {
    console.error('[Sitemap] Unexpected error:', error.message);
    return res.status(500).send('Internal Server Error');
  }
}
