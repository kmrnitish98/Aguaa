import { lazy } from 'react';

/* ═══════════════════════════════════════════════════════════════
   AGUAA OFFICIAL 5-TEMPLATE REGISTRY
   All official matrimonial templates are registered here.
   Future-payment readiness: isPaid: false, price: 0 (Free).
   ═══════════════════════════════════════════════════════════════ */

export const OFFICIAL_TEMPLATES = [
  {
    id: 'default',
    name: 'Aguaa Classic Royal',
    tagline: 'Deep Maroon · Gold Foil · Heritage Border',
    description: 'Aguaa’s signature matrimonial design featuring auspicious traditional Indian headings, deep maroon hues, and ornate gold foil borders.',
    badge: 'Classic',
    accentColor: '#d4a017',
    primaryColor: '#1c0000',
    gradient: 'from-[#2e0000] via-[#1c0000] to-[#0e0000]',
    borderAccent: 'border-yellow-600/40',
    isPaid: false,
    price: 0,
    componentKey: 'default',
  },
  {
    id: 'royal-gold',
    name: 'Royal Gold',
    tagline: 'Palace Arch · Regal Gold Foil · Majestic Borders',
    description: 'Inspired by royal Indian palaces, featuring intricate arch vector motifs, warm ivory accents, and grand gold framing.',
    badge: 'Popular',
    accentColor: '#D4AF37',
    primaryColor: '#2b0000',
    gradient: 'from-[#4A0404] via-[#2b0000] to-[#170000]',
    borderAccent: 'border-amber-500/40',
    isPaid: false,
    price: 0,
    componentKey: 'royal-gold',
  },
  {
    id: 'elegant-minimal',
    name: 'Elegant Minimal',
    tagline: 'Clean Monochrome · Modern Typography · Airy Layout',
    description: 'Sophisticated modern monochrome styling with clean lines, high-contrast typefaces, and a minimalist aesthetic.',
    badge: 'Modern',
    accentColor: '#111111',
    primaryColor: '#FFFFFF',
    gradient: 'from-gray-100 via-gray-200 to-white',
    borderAccent: 'border-gray-400/40',
    isPaid: false,
    price: 0,
    componentKey: 'elegant-minimal',
  },
  {
    id: 'floral-wedding',
    name: 'Floral Wedding',
    tagline: 'Soft Pastels · Botanical Vines · Rose Peach Accents',
    description: 'A romantic floral layout with pastel cream paper texture, hand-drawn botanical vines, sage leaves, and delicate rose borders.',
    badge: 'Romantic',
    accentColor: '#D49B90',
    primaryColor: '#FCF8F5',
    gradient: 'from-[#FAF5EE] via-[#FCF8F5] to-[#FFE6E6]',
    borderAccent: 'border-rose-400/40',
    isPaid: false,
    price: 0,
    componentKey: 'floral-wedding',
  },
  {
    id: 'modern-premium',
    name: 'Modern Premium',
    tagline: 'Obsidian Black · Frosted Glass · Metallic Gold',
    description: 'A dark luxury theme featuring obsidian black background, glassmorphism cards, ambient light glows, and champagne gold details.',
    badge: 'Exclusive',
    accentColor: '#F3E5AB',
    primaryColor: '#050505',
    gradient: 'from-gray-900 via-black to-[#050505]',
    borderAccent: 'border-yellow-500/40',
    isPaid: false,
    price: 0,
    componentKey: 'modern-premium',
  },
];

/* ─── Lazy Loaded Component Map ─────────────────────────────── */
export const TEMPLATE_COMPONENTS = {
  'default': lazy(() => import('../components/biodata/BiodataPDFTemplate')),
  'royal-gold': lazy(() => import('../components/biodata/templates/TemplateRoyalMaharaja')),
  'elegant-minimal': lazy(() => import('../components/biodata/templates/TemplateModernMinimal')),
  'floral-wedding': lazy(() => import('../components/biodata/templates/TemplateFloralWedding')),
  'modern-premium': lazy(() => import('../components/biodata/templates/TemplatePremiumDark')),
};

/* ─── Legacy & Historical Template ID Aliases ───────────────── */
export const LEGACY_TEMPLATE_MAP = {
  // Direct official IDs
  'default': 'default',
  'royal-gold': 'royal-gold',
  'elegant-minimal': 'elegant-minimal',
  'floral-wedding': 'floral-wedding',
  'modern-premium': 'modern-premium',

  // Legacy camelCase IDs
  'RoyalMaharaja': 'royal-gold',
  'ModernMinimal': 'elegant-minimal',
  'FloralWedding': 'floral-wedding',
  'PremiumDark': 'modern-premium',

  // Historical variants mapped gracefully
  'TraditionalIndian': 'royal-gold',
  'RoyalBlueDiamond': 'royal-gold',
  'RoyalTexture': 'royal-gold',
  'GaneshRoyal': 'royal-gold',
  'ModernPro': 'modern-premium',
  'OmClassic': 'default',
};

/* ─── Resolution Helpers ────────────────────────────────────── */

/**
 * Resolves any template ID (official, legacy camelCase, or undefined) to a valid official template ID.
 * Unknown or invalid IDs safely fall back to 'default'.
 */
export const resolveTemplateId = (rawId) => {
  if (!rawId || typeof rawId !== 'string') return 'default';
  const trimmed = rawId.trim();
  if (LEGACY_TEMPLATE_MAP[trimmed]) {
    return LEGACY_TEMPLATE_MAP[trimmed];
  }
  const lower = trimmed.toLowerCase();
  for (const [key, val] of Object.entries(LEGACY_TEMPLATE_MAP)) {
    if (key.toLowerCase() === lower) {
      return val;
    }
  }
  return 'default';
};

/**
 * Returns the full official template metadata object by ID.
 */
export const getTemplateById = (rawId) => {
  const resolvedId = resolveTemplateId(rawId);
  return OFFICIAL_TEMPLATES.find((t) => t.id === resolvedId) || OFFICIAL_TEMPLATES[0];
};

/**
 * Returns the adjacent template in the list with clean wrapping:
 * - 'next' from index 4 wraps to 0
 * - 'prev' from index 0 wraps to 4
 */
export const getAdjacentTemplate = (currentId, direction = 'next') => {
  const resolvedId = resolveTemplateId(currentId);
  const currentIndex = OFFICIAL_TEMPLATES.findIndex((t) => t.id === resolvedId);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const total = OFFICIAL_TEMPLATES.length;

  let newIndex;
  if (direction === 'next') {
    newIndex = (safeIndex + 1) % total;
  } else {
    newIndex = (safeIndex - 1 + total) % total;
  }

  return OFFICIAL_TEMPLATES[newIndex];
};
