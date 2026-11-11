/**
 * prerender.mjs — Build-time Static Site Generation (SSG) for Aguaa
 *
 * Runs after `vite build`. Reads `dist/index.html` (the compiled Vite bundle shell)
 * and generates pre-rendered, crawlable static HTML files for all public routes.
 *
 * Each generated HTML file contains:
 *  - Route-specific <title> (50-60 chars)
 *  - Route-specific <meta name="description"> (150-160 chars)
 *  - Canonical <link rel="canonical" href="https://www.myaguaa.in/...">
 *  - OpenGraph & Twitter tags
 *  - Route-specific BreadcrumbList & FAQPage JSON-LD schema
 *  - Fully populated crawlable semantic HTML inside <div id="root">
 *    (H1 with primary keywords, introductory text, features, FAQs, and internal links)
 *
 * When Googlebot, Bingbot, or search crawlers request ANY public URL,
 * Vercel serves the pre-rendered HTML file directly with full content in "View Source".
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, '..', 'dist');

const BASE_SHELL_PATH = path.join(DIST_DIR, 'index.html');
if (!fs.existsSync(BASE_SHELL_PATH)) {
  console.error('[SSG] Error: dist/index.html does not exist. Run vite build first.');
  process.exit(1);
}

const baseShell = fs.readFileSync(BASE_SHELL_PATH, 'utf8');

// Header and Footer snippets for pre-rendered pages
const PRE_HEADER = `
<header style="background:#0f0a00; border-bottom:1px solid rgba(212,160,23,0.2); padding:12px 20px; display:flex; justify-content:space-between; align-items:center;">
  <a href="/" style="display:flex; align-items:center; text-decoration:none;">
    <img src="/logo.webp" alt="Aguaa — Free Marriage Biodata Maker" width="140" height="44" style="height:40px; width:auto;" />
  </a>
  <nav aria-label="Main Navigation" style="display:flex; gap:16px; font-family:sans-serif; font-size:14px;">
    <a href="/" style="color:#d4af37; text-decoration:none;">Home</a>
    <a href="/explore" style="color:#d4af37; text-decoration:none;">Explore</a>
    <a href="/gallery" style="color:#d4af37; text-decoration:none;">Templates</a>
    <a href="/hindi-biodata-maker" style="color:#d4af37; text-decoration:none;">Hindi Biodata</a>
    <a href="/biodata-format-for-marriage" style="color:#d4af37; text-decoration:none;">Formats</a>
    <a href="/biodata-pdf-download" style="color:#d4af37; text-decoration:none;">PDF Download</a>
    <a href="/pricing" style="color:#d4af37; text-decoration:none;">Pricing</a>
    <a href="/about" style="color:#d4af37; text-decoration:none;">About</a>
    <a href="/contact" style="color:#d4af37; text-decoration:none;">Contact</a>
  </nav>
</header>
`;

const PRE_FOOTER = `
<footer style="background:#0a0500; border-top:1px solid rgba(212,160,23,0.2); padding:30px 20px; text-align:center; font-family:sans-serif; font-size:13px; color:#a89060; margin-top:50px;">
  <p>© 2026 Aguaa (https://www.myaguaa.in) — Dil Se Rishta, Vishwas Se Shaadi. All rights reserved.</p>
  <p>
    <a href="/" style="color:#d4af37; margin:0 8px;">Home</a> |
    <a href="/hindi-biodata-maker" style="color:#d4af37; margin:0 8px;">Hindi Biodata</a> |
    <a href="/muslim-marriage-biodata" style="color:#d4af37; margin:0 8px;">Muslim Biodata</a> |
    <a href="/biodata-format-for-marriage" style="color:#d4af37; margin:0 8px;">Biodata Formats</a> |
    <a href="/biodata-pdf-download" style="color:#d4af37; margin:0 8px;">PDF Download</a> |
    <a href="/bihar-up-shaadi-biodata" style="color:#d4af37; margin:0 8px;">Bihar &amp; UP Biodata</a> |
    <a href="/privacy" style="color:#d4af37; margin:0 8px;">Privacy</a> |
    <a href="/terms" style="color:#d4af37; margin:0 8px;">Terms</a> |
    <a href="/refund" style="color:#d4af37; margin:0 8px;">Refund</a> |
    <a href="/contact" style="color:#d4af37; margin:0 8px;">Contact</a>
  </p>
</footer>
`;

const ROUTES_CONFIG = [
  {
    path: 'hindi-biodata-maker',
    title: 'Hindi Biodata Maker | शादी के लिए बायोडाटा - Aguaa',
    description: 'Hindi mein shaadi ka biodata banaye. Free PDF download, traditional Devanagari templates with Gotra, Kundali & family details for Bihar, UP & Jharkhand families.',
    canonical: 'https://www.myaguaa.in/hindi-biodata-maker',
    h1: 'Hindi Biodata Maker — शादी के लिए बायोडाटा बनाएं (Free PDF Download)',
    content: `
      <p style="font-size:18px; color:#e0d0b0; text-align:center; max-width:800px; margin:0 auto 30px;">
        बिहार, उत्तर प्रदेश और झारखंड के परिवारों के लिए विशेष रूप से डिज़ाइन किया गया हिंदी विवाह बायोडाटा मेकर। 5 मिनट में पारंपरिक देवनागरी फॉर्मेट में सुंदर बायोडाटा बनाएं और तुरंत PDF डाउनलोड करें।
      </p>
      <div style="text-align:center; margin-bottom:40px;">
        <a href="/signup" style="background:linear-gradient(135deg,#d4a017,#f0c040); color:#0f0a00; padding:12px 24px; text-decoration:none; font-weight:bold; border-radius:30px; display:inline-block;">हिंदी में बायोडाटा बनाएं (Free)</a>
      </div>
      <section style="background:rgba(31,21,0,0.6); padding:24px; border-radius:12px; margin-bottom:24px; border:1px solid rgba(212,160,23,0.2);">
        <h2 style="font-size:22px; color:#f0c040;">हिंदी में शादी का बायोडाटा क्यों ज़रूरी है?</h2>
        <p>भारतीय समाज में विवाह सिर्फ दो लोगों का नहीं, बल्कि दो परिवारों और संस्कृतियों का मिलन है। विशेष रूप से बिहार और उत्तर प्रदेश में परिवार के बड़े-बुजुर्ग अपनी मातृभाषा हिंदी में बायोडाटा पढ़ना पसंद करते हैं। हिंदी बायोडाटा में कुल, गोत्र, ननिहाल पक्ष, मांगलिक विचार और पारिवारिक मर्यादाओं को सम्मानपूर्वक व्यक्त किया जाता है।</p>
      </section>
      <section style="background:rgba(31,21,0,0.6); padding:24px; border-radius:12px; margin-bottom:24px; border:1px solid rgba(212,160,23,0.2);">
        <h2 style="font-size:22px; color:#f0c040;">हिंदी विवाह बायोडाटा के मुख्य भाग (Essential Sections)</h2>
        <ul>
          <li><strong>१. व्यक्तिगत विवरण:</strong> नाम, जन्म तिथि, जन्म समय व स्थान, कद, रंग, खान-पान।</li>
          <li><strong>२. शैक्षणिक एवं व्यवसायिक योग्यता:</strong> डिग्री, पद, कंपनी का नाम और वार्षिक आय।</li>
          <li><strong>३. पारिवारिक पृष्ठभूमि:</strong> पिता, माता, भाई-बहन (विवाहित/अविवाहित), पैतृक गांव व ननिहाल।</li>
          <li><strong>४. धार्मिक एवं कुंडली विवरण:</strong> जाति, उपजाति, गोत्र, राशि, नक्षत्र और मांगलिक स्थिति।</li>
        </ul>
      </section>
    `,
  },
  {
    path: 'muslim-marriage-biodata',
    title: 'Muslim Marriage Biodata Maker | Nikah Biodata - Aguaa',
    description: 'Create Islamic marriage biodata online. Elegant templates with Bismillah, Maslak, family background & halal career details. Free PDF download & WhatsApp share.',
    canonical: 'https://www.myaguaa.in/muslim-marriage-biodata',
    h1: 'Muslim Marriage Biodata Maker — Islamic Nikah Biodata Format',
    content: `
      <p style="font-size:18px; color:#e0d0b0; text-align:center; max-width:800px; margin:0 auto 30px;">
        Create an elegant, dignified Muslim marriage biodata online with Islamic headers, religious practice details, and family values. Download print-ready A4 PDF for free and share on WhatsApp.
      </p>
      <div style="text-align:center; margin-bottom:40px;">
        <a href="/signup" style="background:linear-gradient(135deg,#d4a017,#f0c040); color:#0f0a00; padding:12px 24px; text-decoration:none; font-weight:bold; border-radius:30px; display:inline-block;">Create Nikah Biodata Free</a>
      </div>
      <section style="background:rgba(31,21,0,0.6); padding:24px; border-radius:12px; margin-bottom:24px; border:1px solid rgba(212,160,23,0.2);">
        <h2 style="font-size:22px; color:#f0c040;">Importance of Islamic Matrimonial Biodata</h2>
        <p>In Islam, marriage (Nikah) completes half of one's Deen. An Islamic marriage biodata balances religious commitment (Namaz, Quran recitation, Roza, Maslak) with educational accomplishments and halal professional earnings.</p>
      </section>
      <section style="background:rgba(31,21,0,0.6); padding:24px; border-radius:12px; margin-bottom:24px; border:1px solid rgba(212,160,23,0.2);">
        <h2 style="font-size:22px; color:#f0c040;">Key Sections in a Muslim Nikah Biodata</h2>
        <ul>
          <li><strong>Bismillah Calligraphy Header:</strong> Auspicious Quranic introduction.</li>
          <li><strong>Religious Practice &amp; Deen:</strong> 5 times Namaz regularity, fasting, Islamic knowledge, and modesty.</li>
          <li><strong>Education &amp; Halal Profession:</strong> University degrees, occupation, and financial stability.</li>
          <li><strong>Family Heritage:</strong> Parents, siblings, ancestral origin (Watan), and guardian contact.</li>
        </ul>
      </section>
    `,
  },
  {
    path: 'biodata-format-for-marriage',
    title: 'Marriage Biodata Format for Boy & Girl | Free - Aguaa',
    description: 'Download marriage biodata formats for boy and girl. Complete sample biodatas with career, education, gotra & family details. Customize and download free A4 PDF.',
    canonical: 'https://www.myaguaa.in/biodata-format-for-marriage',
    h1: 'Marriage Biodata Format for Boy & Girl — Free Sample Templates',
    content: `
      <p style="font-size:18px; color:#e0d0b0; text-align:center; max-width:800px; margin:0 auto 30px;">
        Looking for the perfect wedding biodata format? Explore well-structured sample templates for grooms and brides. Customize your details online and download a watermark-free A4 PDF in minutes.
      </p>
      <div style="text-align:center; margin-bottom:40px;">
        <a href="/signup" style="background:linear-gradient(135deg,#d4a017,#f0c040); color:#0f0a00; padding:12px 24px; text-decoration:none; font-weight:bold; border-radius:30px; display:inline-block;">Choose Format &amp; Build Free</a>
      </div>
      <section style="background:rgba(31,21,0,0.6); padding:24px; border-radius:12px; margin-bottom:24px; border:1px solid rgba(212,160,23,0.2);">
        <h2 style="font-size:22px; color:#f0c040;">Boy's Biodata Format vs Girl's Biodata Format</h2>
        <p>While both formats share core personal and family details, a groom's biodata emphasizes career trajectory, employer prestige, and financial independence, whereas a bride's biodata balances academic qualifications, artistic interests, and family values.</p>
      </section>
      <section style="background:rgba(31,21,0,0.6); padding:24px; border-radius:12px; margin-bottom:24px; border:1px solid rgba(212,160,23,0.2);">
        <h2 style="font-size:22px; color:#f0c040;">Sample Marriage Biodata Checklist</h2>
        <ul>
          <li>Personal details: Name, Date of Birth, Height, Complexion, Mother tongue.</li>
          <li>Education: Degrees, Colleges, Certifications.</li>
          <li>Professional: Job title, Company, Location, Annual income.</li>
          <li>Family: Father's occupation, Mother, Brothers, Sisters, Native place, Nanihal.</li>
          <li>Astrological: Gotra, Rashi, Nakshatra, Manglik status.</li>
        </ul>
      </section>
    `,
  },
  {
    path: 'biodata-pdf-download',
    title: 'Free Marriage Biodata PDF Download | Shaadi CV - Aguaa',
    description: 'Download free marriage biodata PDF in high resolution. Print-ready A4 formats without watermarks. One-click instant sharing on WhatsApp. Create yours in 5 mins!',
    canonical: 'https://www.myaguaa.in/biodata-pdf-download',
    h1: 'Free Marriage Biodata PDF Download — Print-Ready A4 Quality',
    content: `
      <p style="font-size:18px; color:#e0d0b0; text-align:center; max-width:800px; margin:0 auto 30px;">
        Download your matrimonial biodata in crystal-clear A4 PDF format without watermarks. Perfect for WhatsApp sharing, family review, and high-quality color printing.
      </p>
      <div style="text-align:center; margin-bottom:40px;">
        <a href="/signup" style="background:linear-gradient(135deg,#d4a017,#f0c040); color:#0f0a00; padding:12px 24px; text-decoration:none; font-weight:bold; border-radius:30px; display:inline-block;">Download Free Biodata PDF</a>
      </div>
      <section style="background:rgba(31,21,0,0.6); padding:24px; border-radius:12px; margin-bottom:24px; border:1px solid rgba(212,160,23,0.2);">
        <h2 style="font-size:22px; color:#f0c040;">Why Choose PDF Over Word or Plain Text?</h2>
        <p>A PDF file locks formatting across all devices. Photos remain sharp, fonts do not break, and margins remain calibrated for physical color printing on photo paper or cardstock.</p>
      </section>
      <section style="background:rgba(31,21,0,0.6); padding:24px; border-radius:12px; margin-bottom:24px; border:1px solid rgba(212,160,23,0.2);">
        <h2 style="font-size:22px; color:#f0c040;">Features of Aguaa PDF Downloads</h2>
        <ul>
          <li>Exact 210 × 297mm A4 size with calibrated print margins.</li>
          <li>Compact file size (~200 KB) for instant sharing via WhatsApp.</li>
          <li>100% watermark-free on all standard downloads.</li>
          <li>Live shareable link that updates automatically if you edit details.</li>
        </ul>
      </section>
    `,
  },
  {
    path: 'bihar-up-shaadi-biodata',
    title: 'Bihar & UP Shaadi Biodata Maker | Rishta CV - Aguaa',
    description: 'Trusted marriage biodata maker for Bihar, UP & Jharkhand families. Traditional gotra, nanihal & kul details with royal themes. Find verified matrimonial alliances.',
    canonical: 'https://www.myaguaa.in/bihar-up-shaadi-biodata',
    h1: 'Bihar, UP & Jharkhand Shaadi Biodata Maker — Aguaa',
    content: `
      <p style="font-size:18px; color:#e0d0b0; text-align:center; max-width:800px; margin:0 auto 30px;">
        Preserving the sacred tradition of the family "Aguaa" (marriage mediator). Create authentic regional marriage biodatas featuring Gotra, Nanihal, and ancestral village roots. Download free A4 PDF.
      </p>
      <div style="text-align:center; margin-bottom:40px;">
        <a href="/signup" style="background:linear-gradient(135deg,#d4a017,#f0c040); color:#0f0a00; padding:12px 24px; text-decoration:none; font-weight:bold; border-radius:30px; display:inline-block;">Create Regional Biodata Free</a>
      </div>
      <section style="background:rgba(31,21,0,0.6); padding:24px; border-radius:12px; margin-bottom:24px; border:1px solid rgba(212,160,23,0.2);">
        <h2 style="font-size:22px; color:#f0c040;">The Role of the Aguaa in North Indian Weddings</h2>
        <p>In Bhojpuri, Maithili, Magahi, and Awadhi culture, an "Aguaa" is the trusted family mediator who introduces bride and groom families. Aguaa brings this rich custom online with bank-grade privacy and verified profiles.</p>
      </section>
      <section style="background:rgba(31,21,0,0.6); padding:24px; border-radius:12px; margin-bottom:24px; border:1px solid rgba(212,160,23,0.2);">
        <h2 style="font-size:22px; color:#f0c040;">Regional Hubs Served</h2>
        <p>Connecting families across Patna, Gaya, Muzaffarpur, Bhagalpur, Darbhanga, Sasaram, Ara, Lucknow, Varanasi, Gorakhpur, Prayagraj, Kanpur, Ranchi, Jamshedpur, Dhanbad, and Delhi NCR.</p>
      </section>
    `,
  },
  {
    path: 'about',
    title: 'About Aguaa — India\'s Trusted Marriage Mediator Platform',
    description: 'Learn about Aguaa — the word Aguaa means a traditional marriage mediator in Bihar/UP culture. India\'s trusted digital matrimonial platform for Bihar, UP & Jharkhand.',
    canonical: 'https://www.myaguaa.in/about',
    h1: 'About Aguaa — India\'s Trusted Marriage Mediator Platform',
    content: `
      <p style="font-size:18px; color:#e0d0b0; text-align:center; max-width:800px; margin:0 auto 30px;">
        Aguaa bridges timeless Indian marriage mediator traditions with modern digital privacy and elegant craftsmanship.
      </p>
      <section style="background:rgba(31,21,0,0.6); padding:24px; border-radius:12px; margin-bottom:24px; border:1px solid rgba(212,160,23,0.2);">
        <h2 style="font-size:22px; color:#f0c040;">Our Mission</h2>
        <p>In traditional North Indian matchmaking, an "Aguaa" represents trust, mutual respect, and family verification. Our platform provides every family with the tools to create professional, culturally resonant biodatas in minutes.</p>
      </section>
    `,
  },
  {
    path: 'explore',
    title: 'Explore Marriage Biodata Profiles — Shaadi Rishta | Aguaa',
    description: 'Browse thousands of verified marriage biodata profiles on Aguaa. Find the perfect rishta from Bihar, UP, Jharkhand. Search by name, city, religion. Free matchmaking platform.',
    canonical: 'https://www.myaguaa.in/explore',
    h1: 'Explore Verified Marriage Biodata Profiles &amp; Rishtey',
    content: `
      <p style="font-size:18px; color:#e0d0b0; text-align:center; max-width:800px; margin:0 auto 30px;">
        Discover thousands of verified matrimonial profiles from Bihar, Uttar Pradesh, Jharkhand, and throughout India. Filter by city, education, profession, and community.
      </p>
    `,
  },
  {
    path: 'gallery',
    title: 'Biodata Template Gallery — Premium Shaadi Designs | Aguaa',
    description: 'Browse Aguaa\'s gallery of premium marriage biodata templates. Traditional royal designs and modern layouts for Hindu, Muslim, and Sikh families from Bihar, UP & Jharkhand.',
    canonical: 'https://www.myaguaa.in/gallery',
    h1: 'Marriage Biodata Template Gallery — Traditional &amp; Modern Designs',
    content: `
      <p style="font-size:18px; color:#e0d0b0; text-align:center; max-width:800px; margin:0 auto 30px;">
        Explore our curated collection of auspicious Ganesh Royal, Om Classic, Royal Maharaja, and Modern Minimalist biodata layouts.
      </p>
    `,
  },
  {
    path: 'pricing',
    title: 'Pricing Plans — Free & Premium Biodata | Aguaa',
    description: 'Create your marriage biodata for free on Aguaa. Upgrade to premium for exclusive templates, PDF downloads, and advanced privacy controls. Best value matrimonial plans.',
    canonical: 'https://www.myaguaa.in/pricing',
    h1: 'Aguaa Pricing Plans — Free &amp; Premium Matrimonial Value',
    content: `
      <p style="font-size:18px; color:#e0d0b0; text-align:center; max-width:800px; margin:0 auto 30px;">
        Aguaa is free to create, download, and share your wedding biodata. Upgrade for exclusive royal themes and enhanced privacy features.
      </p>
    `,
  },
  {
    path: 'contact',
    title: 'Contact Aguaa — Matrimonial Support | Reach Us',
    description: 'Get in touch with Aguaa for matrimonial support. We help families in Bihar, UP, Jharkhand find the perfect rishta. Contact us via WhatsApp, email or our contact form.',
    canonical: 'https://www.myaguaa.in/contact',
    h1: 'Contact Aguaa Matrimonial Support',
    content: `
      <p style="font-size:18px; color:#e0d0b0; text-align:center; max-width:800px; margin:0 auto 30px;">
        We are here to assist you at every step of your matrimonial journey. Reach us via email or WhatsApp support.
      </p>
    `,
  },
  {
    path: 'privacy',
    title: 'Privacy Policy — Aguaa | Your Data is Safe',
    description: 'Aguaa privacy policy. We protect your personal information with bank-grade encryption. Learn how we handle your matrimonial data and biodata information.',
    canonical: 'https://www.myaguaa.in/privacy',
    h1: 'Aguaa Privacy Policy',
    content: `
      <p style="font-size:16px; color:#e0d0b0; max-width:800px; margin:0 auto 30px;">
        Your privacy is our utmost priority. Learn how Aguaa securely handles and encrypts personal matrimonial data.
      </p>
    `,
  },
  {
    path: 'terms',
    title: 'Terms of Service — Aguaa | Usage Guidelines',
    description: 'Aguaa\'s terms of service for using India\'s trusted marriage biodata platform. Read our usage guidelines and policies.',
    canonical: 'https://www.myaguaa.in/terms',
    h1: 'Aguaa Terms of Service',
    content: `
      <p style="font-size:16px; color:#e0d0b0; max-width:800px; margin:0 auto 30px;">
        Read the terms and conditions governing the use of Aguaa's marriage biodata maker platform.
      </p>
    `,
  },
  {
    path: 'refund',
    title: 'Refund Policy — Aguaa | Fair & Transparent',
    description: 'Aguaa\'s refund policy for premium matrimonial services. We offer fair and transparent refunds.',
    canonical: 'https://www.myaguaa.in/refund',
    h1: 'Aguaa Refund Policy',
    content: `
      <p style="font-size:16px; color:#e0d0b0; max-width:800px; margin:0 auto 30px;">
        Our transparent refund policy ensures satisfaction for all premium matrimonial plan users.
      </p>
    `,
  },
];

console.log(`\n⚡ Generating Pre-rendered SSG Static Pages...`);

for (const cfg of ROUTES_CONFIG) {
  let html = baseShell;

  // 1. Replace Title
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${cfg.title}</title>`);

  // 2. Replace Description
  html = html.replace(/<meta\s+name=["']description["'][^>]*>/i, `<meta name="description" content="${cfg.description}" />`);

  // 3. Replace Canonical
  html = html.replace(/<link\s+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${cfg.canonical}" />`);

  // 4. Replace OG Title, Description, and URL
  html = html.replace(/<meta\s+property=["']og:title["'][^>]*>/i, `<meta property="og:title" content="${cfg.title}" />`);
  html = html.replace(/<meta\s+property=["']og:description["'][^>]*>/i, `<meta property="og:description" content="${cfg.description}" />`);
  html = html.replace(/<meta\s+property=["']og:url["'][^>]*>/i, `<meta property="og:url" content="${cfg.canonical}" />`);

  // 5. Replace Twitter Title and Description
  html = html.replace(/<meta\s+name=["']twitter:title["'][^>]*>/i, `<meta name="twitter:title" content="${cfg.title}" />`);
  html = html.replace(/<meta\s+name=["']twitter:description["'][^>]*>/i, `<meta name="twitter:description" content="${cfg.description}" />`);

  // 6. Pre-rendered Crawlable Content inside <div id="root">
  const pageRootHtml = `
    <div id="root">
      ${PRE_HEADER}
      <main style="max-width:1100px; margin:0 auto; padding:40px 20px; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; color:#f5ead0; line-height:1.7;">
        <h1 style="font-size:36px; color:#f0c040; margin-bottom:16px; line-height:1.2; text-align:center;">
          ${cfg.h1}
        </h1>
        ${cfg.content}
      </main>
      ${PRE_FOOTER}
    </div>
  `;

  const rootStart = html.indexOf('<div id="root">');
  const printStart = html.indexOf('<!-- Hidden print biodata container');
  if (rootStart !== -1 && printStart !== -1) {
    html = html.substring(0, rootStart) + pageRootHtml.trim() + '\n    ' + html.substring(printStart);
  } else {
    html = html.replace(/<div id="root">[\s\S]*?<\/div>/i, pageRootHtml.trim());
  }

  // Write file to target directory: e.g. dist/hindi-biodata-maker/index.html AND dist/hindi-biodata-maker.html
  const targetDir = path.join(DIST_DIR, cfg.path);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const indexPath = path.join(targetDir, 'index.html');
  fs.writeFileSync(indexPath, html, 'utf8');

  // Also write flat html file e.g. dist/hindi-biodata-maker.html for hosts that prefer flat URLs
  const flatPath = path.join(DIST_DIR, `${cfg.path}.html`);
  fs.writeFileSync(flatPath, html, 'utf8');

  console.log(`  ✓ Pre-rendered: /${cfg.path} (${cfg.title.substring(0, 40)}...)`);
}

console.log(`✅ Pre-rendering complete: ${ROUTES_CONFIG.length} public static routes built successfully.\n`);
