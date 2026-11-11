/**
 * seo.js — Central SEO Configuration for Aguaa
 *
 * All per-page metadata and schema definitions.
 * Used by the useSEO hook to dynamically update head tags.
 *
 * Domain: https://www.myaguaa.in
 */

export const SITE = {
  name: 'Aguaa',
  tagline: 'Dil Se Rishta, Vishwas Se Shaadi',
  description: 'Free Marriage Biodata Maker & Shaadi Biodata Platform',
  url: 'https://www.myaguaa.in',
  logo: 'https://www.myaguaa.in/logo.webp',
  ogImage: 'https://www.myaguaa.in/og-banner.jpg',
  twitterHandle: '@aguaa_in',
  email: 'support@aguaa.in',
  phone: '',
  region: 'Bihar, Uttar Pradesh, Jharkhand, India',
};

/**
 * Per-route SEO metadata.
 * Each key maps to a URL path.
 * Unique title (50-60 chars) and unique description (150-160 chars) per indexable page.
 */
export const PAGE_SEO = {
  '/': {
    title: 'Free Marriage Biodata Maker | Shaadi Biodata - Aguaa',
    description:
      'Create beautiful marriage biodata in 5 mins. Free PDF download, WhatsApp sharing & verified profiles for Bihar, UP & Jharkhand. Make your shaadi biodata now!',
    canonical: 'https://www.myaguaa.in/',
    ogType: 'website',
    schema: 'home',
    noIndex: false,
  },
  '/hindi-biodata-maker': {
    title: 'Hindi Biodata Maker | शादी के लिए बायोडाटा - Aguaa',
    description:
      'Hindi mein shaadi ka biodata banaye. Free PDF download, traditional Devanagari templates with Gotra, Kundali & family details for Bihar, UP & Jharkhand families.',
    canonical: 'https://www.myaguaa.in/hindi-biodata-maker',
    ogType: 'website',
    schema: 'landing',
    noIndex: false,
    breadcrumb: [
      { name: 'Home', url: 'https://www.myaguaa.in/' },
      { name: 'Hindi Biodata Maker', url: 'https://www.myaguaa.in/hindi-biodata-maker' },
    ],
  },
  '/muslim-marriage-biodata': {
    title: 'Muslim Marriage Biodata Maker | Nikah Biodata - Aguaa',
    description:
      'Create Islamic marriage biodata online. Elegant templates with Bismillah, Maslak, family background & halal career details. Free PDF download & WhatsApp share.',
    canonical: 'https://www.myaguaa.in/muslim-marriage-biodata',
    ogType: 'website',
    schema: 'landing',
    noIndex: false,
    breadcrumb: [
      { name: 'Home', url: 'https://www.myaguaa.in/' },
      { name: 'Muslim Marriage Biodata', url: 'https://www.myaguaa.in/muslim-marriage-biodata' },
    ],
  },
  '/biodata-format-for-marriage': {
    title: 'Marriage Biodata Format for Boy & Girl | Free - Aguaa',
    description:
      'Download marriage biodata formats for boy and girl. Complete sample biodatas with career, education, gotra & family details. Customize and download free A4 PDF.',
    canonical: 'https://www.myaguaa.in/biodata-format-for-marriage',
    ogType: 'website',
    schema: 'landing',
    noIndex: false,
    breadcrumb: [
      { name: 'Home', url: 'https://www.myaguaa.in/' },
      { name: 'Biodata Formats', url: 'https://www.myaguaa.in/biodata-format-for-marriage' },
    ],
  },
  '/biodata-pdf-download': {
    title: 'Free Marriage Biodata PDF Download | Shaadi CV - Aguaa',
    description:
      'Download free marriage biodata PDF in high resolution. Print-ready A4 formats without watermarks. One-click instant sharing on WhatsApp. Create yours in 5 mins!',
    canonical: 'https://www.myaguaa.in/biodata-pdf-download',
    ogType: 'website',
    schema: 'landing',
    noIndex: false,
    breadcrumb: [
      { name: 'Home', url: 'https://www.myaguaa.in/' },
      { name: 'Biodata PDF Download', url: 'https://www.myaguaa.in/biodata-pdf-download' },
    ],
  },
  '/bihar-up-shaadi-biodata': {
    title: 'Bihar & UP Shaadi Biodata Maker | Rishta CV - Aguaa',
    description:
      'Trusted marriage biodata maker for Bihar, UP & Jharkhand families. Traditional gotra, nanihal & kul details with royal themes. Find verified matrimonial alliances.',
    canonical: 'https://www.myaguaa.in/bihar-up-shaadi-biodata',
    ogType: 'website',
    schema: 'landing',
    noIndex: false,
    breadcrumb: [
      { name: 'Home', url: 'https://www.myaguaa.in/' },
      { name: 'Bihar & UP Shaadi Biodata', url: 'https://www.myaguaa.in/bihar-up-shaadi-biodata' },
    ],
  },
  '/about': {
    title: 'About Aguaa — India\'s Trusted Marriage Mediator Platform',
    description:
      'Learn about Aguaa — the word Aguaa means a traditional marriage mediator in Bihar/UP culture. India\'s trusted digital matrimonial platform for Bihar, UP & Jharkhand.',
    canonical: 'https://www.myaguaa.in/about',
    ogType: 'website',
    schema: 'about',
    noIndex: false,
    breadcrumb: [
      { name: 'Home', url: 'https://www.myaguaa.in/' },
      { name: 'About', url: 'https://www.myaguaa.in/about' },
    ],
  },
  '/explore': {
    title: 'Explore Marriage Biodata Profiles — Shaadi Rishta | Aguaa',
    description:
      'Browse thousands of verified marriage biodata profiles on Aguaa. Find the perfect rishta from Bihar, UP, Jharkhand. Search by name, city, religion. Free matchmaking platform.',
    canonical: 'https://www.myaguaa.in/explore',
    ogType: 'website',
    schema: 'explore',
    noIndex: false,
    breadcrumb: [
      { name: 'Home', url: 'https://www.myaguaa.in/' },
      { name: 'Explore Profiles', url: 'https://www.myaguaa.in/explore' },
    ],
  },
  '/gallery': {
    title: 'Biodata Template Gallery — Premium Shaadi Designs | Aguaa',
    description:
      'Browse Aguaa\'s gallery of premium marriage biodata templates. Traditional royal designs and modern layouts for Hindu, Muslim, and Sikh families from Bihar, UP & Jharkhand.',
    canonical: 'https://www.myaguaa.in/gallery',
    ogType: 'website',
    schema: 'gallery',
    noIndex: false,
    breadcrumb: [
      { name: 'Home', url: 'https://www.myaguaa.in/' },
      { name: 'Biodata Templates', url: 'https://www.myaguaa.in/gallery' },
    ],
  },
  '/pricing': {
    title: 'Pricing Plans — Free & Premium Biodata | Aguaa',
    description:
      'Create your marriage biodata for free on Aguaa. Upgrade to premium for exclusive templates, PDF downloads, and advanced privacy controls. Best value matrimonial plans.',
    canonical: 'https://www.myaguaa.in/pricing',
    ogType: 'website',
    schema: 'pricing',
    noIndex: false,
    breadcrumb: [
      { name: 'Home', url: 'https://www.myaguaa.in/' },
      { name: 'Pricing', url: 'https://www.myaguaa.in/pricing' },
    ],
  },
  '/contact': {
    title: 'Contact Aguaa — Matrimonial Support | Reach Us',
    description:
      'Get in touch with Aguaa for matrimonial support. We help families in Bihar, UP, Jharkhand find the perfect rishta. Contact us via WhatsApp, email or our contact form.',
    canonical: 'https://www.myaguaa.in/contact',
    ogType: 'website',
    schema: 'contact',
    noIndex: false,
    breadcrumb: [
      { name: 'Home', url: 'https://www.myaguaa.in/' },
      { name: 'Contact', url: 'https://www.myaguaa.in/contact' },
    ],
  },
  '/privacy': {
    title: 'Privacy Policy — Aguaa | Your Data is Safe',
    description:
      'Aguaa privacy policy. We protect your personal information with bank-grade encryption. Learn how we handle your matrimonial data and biodata information.',
    canonical: 'https://www.myaguaa.in/privacy',
    ogType: 'website',
    schema: null,
    noIndex: false,
    breadcrumb: [
      { name: 'Home', url: 'https://www.myaguaa.in/' },
      { name: 'Privacy Policy', url: 'https://www.myaguaa.in/privacy' },
    ],
  },
  '/terms': {
    title: 'Terms of Service — Aguaa | Usage Guidelines',
    description:
      'Aguaa\'s terms of service for using India\'s trusted marriage biodata platform. Read our usage guidelines and policies.',
    canonical: 'https://www.myaguaa.in/terms',
    ogType: 'website',
    schema: null,
    noIndex: false,
    breadcrumb: [
      { name: 'Home', url: 'https://www.myaguaa.in/' },
      { name: 'Terms of Service', url: 'https://www.myaguaa.in/terms' },
    ],
  },
  '/refund': {
    title: 'Refund Policy — Aguaa | Fair & Transparent',
    description:
      'Aguaa\'s refund policy for premium matrimonial services. We offer fair and transparent refunds.',
    canonical: 'https://www.myaguaa.in/refund',
    ogType: 'website',
    schema: null,
    noIndex: false,
    breadcrumb: [
      { name: 'Home', url: 'https://www.myaguaa.in/' },
      { name: 'Refund Policy', url: 'https://www.myaguaa.in/refund' },
    ],
  },
  '/login': {
    title: 'Login — Aguaa | Access Your Marriage Biodata',
    description: 'Login to your Aguaa account to manage your marriage biodata and explore profiles.',
    canonical: 'https://www.myaguaa.in/login',
    ogType: 'website',
    schema: null,
    noIndex: true,
  },
  '/signup': {
    title: 'Sign Up Free — Aguaa | Create Marriage Biodata',
    description:
      'Create your free Aguaa account and start making your marriage biodata today. Join 10,000+ families on India\'s trusted matrimonial platform.',
    canonical: 'https://www.myaguaa.in/signup',
    ogType: 'website',
    schema: null,
    noIndex: true,
  },
  '/create': {
    title: 'Create Marriage Biodata — Aguaa',
    description: 'Create your professional marriage biodata on Aguaa.',
    canonical: 'https://www.myaguaa.in/create',
    schema: null,
    noIndex: true,
  },
  '/dashboard': {
    title: 'My Dashboard — Aguaa',
    description: 'Manage your marriage biodata on Aguaa.',
    canonical: 'https://www.myaguaa.in/dashboard',
    schema: null,
    noIndex: true,
  },
  '/edit': {
    title: 'Edit Marriage Biodata — Aguaa',
    description: 'Update your marriage biodata on Aguaa.',
    canonical: 'https://www.myaguaa.in/dashboard',
    schema: null,
    noIndex: true,
  },
  '/404': {
    title: 'Page Not Found | Aguaa',
    description: 'The page you are looking for does not exist on Aguaa.',
    canonical: 'https://www.myaguaa.in/',
    schema: null,
    noIndex: true,
  },
};

/**
 * Shared FAQ schema data (used across home + landing pages)
 * Validated Schema.org FAQPage definition
 */
export const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Aguaa?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Aguaa is India's trusted online marriage biodata maker. In Bihar, Uttar Pradesh, and Jharkhand culture, 'Aguaa' is the trusted matrimonial mediator who introduces bride and groom families. Aguaa digitizes this tradition, helping families create beautiful shaadi biodatas and find compatible rishtey.",
      },
    },
    {
      '@type': 'Question',
      name: 'Aguaa ka matlab kya hai? (What does Aguaa mean?)',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Aguaa ek Bhojpuri/Hindi shabd hai jo Bihar aur UP ki shaadi ki parampara mein ek vishesh bhumika ke liye use hota hai. Aguaa woh vyakti hota hai jo dulha aur dulhan ke parivaron ko milata hai aur shaadi karane mein madad karta hai — ek trusted marriage mediator. Aguaa.in yahi kaam digital roop mein karta hai.',
      },
    },
    {
      '@type': 'Question',
      name: 'How to create a free marriage biodata on Aguaa?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Creating a biodata on Aguaa takes just 5 minutes: 1) Sign up free, 2) Enter personal, family, education, and career details, 3) Upload a photo, 4) Select your preferred template (Ganesh Royal, Om Classic, Modern Minimal, etc.), 5) Download your PDF or share via WhatsApp.',
      },
    },
    {
      '@type': 'Question',
      name: 'Shaadi ke liye biodata mein kya likhna chahiye?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ek achhe shaadi biodata mein yeh cheezein honi chahiye: Personal Information (naam, umar, height, rang), Educational Qualification, Occupation & Income, Family Details (mata-pita, bhai-behen, nanihal), Religious & Gotra Information, Contact Details, aur ek acchi photo. Aguaa ka platform automatically yeh sab organize karta hai.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Aguaa free to use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Aguaa is completely free to create and share your basic marriage biodata. You can create a professional biodata, download it as PDF, and share it via WhatsApp at no cost. We also offer premium plans with exclusive royal templates and advanced privacy controls.',
      },
    },
    {
      '@type': 'Question',
      name: 'Kya Aguaa par biodata PDF mein download ho sakta hai?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Haan! Aguaa par aap apna shaadi biodata high-quality A4 PDF format mein ek click mein download kar sakte hain. Yeh PDF WhatsApp share karne ya print karne ke liye bilkul ready hoti hai.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Aguaa safe and secure for sharing personal information?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Aguaa takes your privacy very seriously. Your personal information is protected with bank-grade encryption. You control who sees your biodata — you can keep it private and share only a secure link with specific families, or make it public for wider reach. We never share your data with third parties.',
      },
    },
    {
      '@type': 'Question',
      name: 'What areas does Aguaa serve?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Aguaa primarily serves families in Bihar, Uttar Pradesh (UP), and Jharkhand — the heartland of Bhojpuri, Maithili, Magahi, and Hindi matrimonial culture. However, our platform is available across all of India and for the Indian diaspora worldwide.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I create a Muslim marriage biodata (Nikah biodata) on Aguaa?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Aguaa provides dedicated Muslim marriage biodata formats including Bismillah header, Maslak/Sect, religious practice, family values, and halal profession details.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I edit my biodata after creating it?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, you can log into your Aguaa dashboard anytime to update your biodata details, change your photo, or switch to a different template. All changes are reflected immediately and your shareable link remains the same.',
      },
    },
  ],
};

/**
 * Breadcrumb schema generator
 * @param {Array<{name: string, url: string}>} items
 */
export function generateBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
