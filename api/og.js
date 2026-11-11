/* global process */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─────────────────────────────────────────────────────────────────────────────
// BACKEND_URL resolution:
// Runtime env var set in Vercel dashboard. Fallback to VITE_API_URL or localhost in dev.
// ─────────────────────────────────────────────────────────────────────────────
function getBackendUrl() {
  const rawBackend =
    process.env.BACKEND_URL ||
    process.env.VITE_BACKEND_URL ||
    (process.env.VITE_API_URL ? process.env.VITE_API_URL.replace(/\/api\/?$/, '') : '') ||
    'http://localhost:5006';
  return rawBackend.replace(/\/+$/, '');
}

// Default fallback HTML shell if compiled dist/index.html cannot be read from disk
const DEFAULT_SHELL = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Aguaa — Free Marriage Biodata Maker</title>
  <meta name="description" content="Create elegant, print-ready Indian marriage biodatas free. Verified profiles, beautiful traditional & modern templates." />
  <meta property="og:title" content="Aguaa — Free Marriage Biodata Maker" />
  <meta property="og:description" content="Create elegant, print-ready Indian marriage biodatas free. Verified profiles, beautiful traditional & modern templates." />
  <meta property="og:image" content="https://myaguaa.in/logo.png" />
  <meta property="og:url" content="https://myaguaa.in" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
</head>
<body>
  <div id="root"></div>
</body>
</html>`;

/**
 * Retrieve the base compiled index.html with multiple candidate path fallbacks.
 */
function getBaseHtml() {
  const candidatePaths = [
    path.join(process.cwd(), 'dist', 'index.html'),
    path.join(process.cwd(), 'frontend', 'dist', 'index.html'),
    path.join(__dirname, '..', 'dist', 'index.html'),
    path.join(__dirname, 'dist', 'index.html'),
  ];

  for (const p of candidatePaths) {
    try {
      if (fs.existsSync(p)) {
        return fs.readFileSync(p, 'utf8');
      }
    } catch {
      // Continue to next path
    }
  }

  return DEFAULT_SHELL;
}

/**
 * Safely send fallback HTML with sensible cache headers.
 */
function fallback(res) {
  try {
    const html = getBaseHtml();
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=86400');
    return res.status(200).send(html);
  } catch (err) {
    console.error('[OG] Fallback error:', err.message);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(DEFAULT_SHELL);
  }
}

function calculateAge(dob) {
  if (!dob) return null;
  const birthDate = new Date(dob);
  if (isNaN(birthDate.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age > 0 ? age : null;
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Vercel Serverless Function — Injects profile Open Graph tags for social crawlers.
 * Uses the public /api/biodata/:id/preview endpoint with a strict 2.5s timeout.
 * Never leaks private contact info, respect privacy restrictions, and fails gracefully.
 */
export default async function handler(req, res) {
  try {
    const id = req.query?.id || (req.url ? new URL(req.url, 'http://localhost').searchParams.get('id') : null);
    if (!id || typeof id !== 'string') {
      return fallback(res);
    }

    const cleanId = id.trim();
    // Validate ID format (permits 24-char ObjectId or safe alphanumeric ID)
    if (!cleanId || !/^[a-zA-Z0-9_-]{1,64}$/.test(cleanId)) {
      return fallback(res);
    }

    const BACKEND_URL = getBackendUrl();
    if (!BACKEND_URL) {
      console.warn('[OG] No BACKEND_URL configured — serving fallback HTML');
      return fallback(res);
    }

    // Call the safe, public PREVIEW endpoint — NEVER the protected /:id endpoint
    const apiUrl = `${BACKEND_URL}/api/biodata/${encodeURIComponent(cleanId)}/preview`;

    // 2.5 second sensible timeout using AbortController (prevents Vercel 504 timeouts)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    let response;
    try {
      response = await fetch(apiUrl, { signal: controller.signal });
    } catch (fetchErr) {
      clearTimeout(timeoutId);
      console.warn(`[OG] Backend fetch timed out or failed for ${cleanId}:`, fetchErr.message);
      return fallback(res);
    } finally {
      clearTimeout(timeoutId);
    }

    // If biodata not found (404), private (403), or server error, serve safe fallback
    if (!response || !response.ok) {
      return fallback(res);
    }

    const data = await response.json();
    if (!data || typeof data !== 'object') {
      return fallback(res);
    }

    // Extract safe preview fields only
    const name     = data?.personalInfo?.fullName?.trim() || 'Marriage Biodata';
    const caste    = data?.personalInfo?.caste?.trim() || '';
    const city     = data?.personalInfo?.city?.trim() || '';
    const state    = data?.personalInfo?.state?.trim() || '';
    const location = [city, state].filter(Boolean).join(', ');
    const age      = calculateAge(data?.personalInfo?.dob);
    const photoURL = data?.photoURL || 'https://myaguaa.in/logo.png';

    const title = caste
      ? `${name} (${caste}) | Marriage Biodata | Aguaa`
      : `${name}'s Marriage Biodata | Aguaa`;

    const description = [
      `View ${name}'s verified marriage profile`,
      caste ? `(${caste})` : '',
      age ? `(${age} yrs)` : '',
      location ? `from ${location}` : '',
      '— Dil Se Rishta, Vishwas Se Shaadi.',
    ].filter(Boolean).join(' ');

    let html = getBaseHtml();

    // Strip existing static title, description, OG and Twitter tags to prevent duplicate tags
    html = html
      .replace(/<title>[\s\S]*?<\/title>/gi, '')
      .replace(/<meta\s+name=["']description["'][^>]*>/gi, '')
      .replace(/<meta\s+property=["']og:[^"']+["'][^>]*>/gi, '')
      .replace(/<meta\s+name=["']twitter:[^"']+["'][^>]*>/gi, '');

    // Injected profile-specific OG & Twitter metadata
    const ogTags = `
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${escapeHtml(photoURL)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:url" content="https://myaguaa.in/profile/${encodeURIComponent(cleanId)}" />
    <meta property="og:type" content="profile" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(photoURL)}" />
    `;

    html = html.includes('</head>')
      ? html.replace('</head>', `${ogTags}\n</head>`)
      : `${ogTags}\n${html}`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    // Edge cache for 1 hour, stale-while-revalidate for 24 hours
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).send(html);

  } catch (error) {
    console.error('[OG] Unexpected error in handler:', error.message);
    return fallback(res);
  }
}
