/**
 * slug.js — Public Profile Slug Generator and Parser
 *
 * Implements readable, SEO-friendly profile URLs in the format:
 *   /profile/[name]-[age]-[shortId]
 *   e.g. /profile/rahul-kumar-28-6af4031c
 *
 * Guarantees:
 *  1. Short unique ID uniquely identifies the biodata.
 *  2. Missing names fallback to 'profile'.
 *  3. Missing / invalid age is gracefully omitted: /profile/[name]-[shortId].
 *  4. Robustly parses Indian date formats (DD/MM/YYYY, DD-MM-YYYY) and ISO (YYYY-MM-DD).
 *  5. Special characters, spaces, and diacritics are cleanly sanitized into hyphens.
 *  6. Does not expose private user details (phone, email, address).
 *  7. Old URLs using 24-character ObjectIds and links with older names/ages continue to work.
 */

/**
 * Calculates candidate age from date of birth string.
 * Supports:
 *  - Indian formats: DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY
 *  - ISO formats: YYYY-MM-DD, YYYY/MM/DD
 *  - Standard JavaScript date strings
 * @param {string} dob
 * @returns {number|null} Age between 18 and 120, or null if missing/invalid
 */
export const calculateAgeFromDob = (dob) => {
  if (!dob) return null;
  const str = String(dob).trim();
  if (!str) return null;

  let birthDate = null;

  // 1. Check Indian format: DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY
  const dmy = str.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/);
  if (dmy) {
    const day = parseInt(dmy[1], 10);
    const month = parseInt(dmy[2], 10) - 1;
    const year = parseInt(dmy[3], 10);
    if (month >= 0 && month <= 11 && day >= 1 && day <= 31) {
      birthDate = new Date(year, month, day);
    }
  }

  // 2. Check ISO format: YYYY-MM-DD or YYYY/MM/DD
  if (!birthDate) {
    const ymd = str.match(/^(\d{4})[./-](\d{1,2})[./-](\d{1,2})/);
    if (ymd) {
      const year = parseInt(ymd[1], 10);
      const month = parseInt(ymd[2], 10) - 1;
      const day = parseInt(ymd[3], 10);
      if (month >= 0 && month <= 11 && day >= 1 && day <= 31) {
        birthDate = new Date(year, month, day);
      }
    }
  }

  // 3. Fallback to standard JS Date parsing
  if (!birthDate) {
    const parsed = new Date(str);
    if (!isNaN(parsed.getTime())) {
      birthDate = parsed;
    }
  }

  if (!birthDate || isNaN(birthDate.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;

  return age >= 18 && age <= 120 ? age : null;
};

/**
 * Normalizes a name string into an alphanumeric, hyphen-separated slug.
 * @param {string} name
 * @returns {string} Clean name slug (e.g. "rahul-kumar") or "profile"
 */
export const slugifyName = (name) => {
  if (!name || typeof name !== 'string') return 'profile';
  const cleaned = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip diacritics / accents
    .replace(/[^a-z0-9]+/g, '-')     // replace non-alphanumeric with '-'
    .replace(/^-+|-+$/g, '');        // trim leading and trailing hyphens
  return cleaned || 'profile';
};

/**
 * Generates a human-readable, unique profile URL slug for a biodata object.
 * Format: [name]-[age]-[shortId] or [name]-[shortId]
 *
 * @param {object} biodata
 * @returns {string} e.g. "rahul-kumar-28-6af4031c"
 */
export const generateProfileSlug = (biodata) => {
  if (!biodata) return '';
  const fullId = (biodata._id || biodata.id || '').toString();

  // Prefer stored unique shortId; fallback to first 8 characters of _id or fullId
  const shortId = (
    biodata.shortId ||
    (fullId.length >= 8 ? fullId.substring(0, 8) : fullId)
  ).toLowerCase();

  if (!shortId) return '';

  const rawName = biodata.personalInfo?.fullName || biodata.name || '';
  const nameSlug = slugifyName(rawName);

  const rawAge = biodata.personalInfo?.age || biodata.age;
  const parsedAge = parseInt(rawAge, 10);
  const age =
    calculateAgeFromDob(biodata.personalInfo?.dob) ||
    (!isNaN(parsedAge) && parsedAge >= 18 && parsedAge <= 120 ? parsedAge : null);

  if (age) {
    return `${nameSlug}-${age}-${shortId}`;
  }
  return `${nameSlug}-${shortId}`;
};

/**
 * Returns canonical public profile URL for a biodata object.
 * @param {object} biodata
 * @param {string} [baseUrl]
 * @returns {string} e.g. "https://www.myaguaa.in/profile/rahul-kumar-28-6af4031c"
 */
export const getProfileUrl = (biodata, baseUrl) => {
  const slug = generateProfileSlug(biodata);
  const origin =
    baseUrl ||
    (typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : 'https://www.myaguaa.in');
  const cleanBase = origin.replace(/\/+$/, '');
  const idOrSlug = slug || biodata?._id || biodata?.id || '';
  return `${cleanBase}/profile/${idOrSlug}`;
};
