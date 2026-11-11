import { lazy, Suspense, useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import {
  Share2, Printer, Download, Check, ArrowLeft, Heart,
  MessageCircle, ShieldCheck, Sparkles, Quote, ChevronUp, AlertCircle,
  Lock, Clock, XCircle, Send
} from 'lucide-react';
import { createPortal } from 'react-dom';
import {
  apiGetBiodataById,
  apiGetBiodataPreview,
  apiGetBiodataRequestStatus,
  apiSendBiodataRequest
} from '../api/client';
import { generateProfileSlug, getProfileUrl } from '../utils/slug';
import HeroBanner from '../components/biodata/HeroBanner';
import PersonalInfoCard from '../components/biodata/PersonalInfoCard';
import EducationCard from '../components/biodata/EducationCard';
import FamilyCard from '../components/biodata/FamilyCard';
// Lazy-load PDF template — only needed on print, not on initial page load
const BiodataPDFTemplate = lazy(() => import('../components/biodata/BiodataPDFTemplate'));
const TemplateGaneshRoyal = lazy(() => import('../components/biodata/templates/TemplateGaneshRoyal'));
const TemplateOmClassic = lazy(() => import('../components/biodata/templates/TemplateOmClassic'));
const TemplateRoyalTexture = lazy(() => import('../components/biodata/templates/TemplateRoyalTexture'));
const TemplateModernPro = lazy(() => import('../components/biodata/templates/TemplateModernPro'));

const TemplateRoyalMaharaja = lazy(() => import('../components/biodata/templates/TemplateRoyalMaharaja'));
const TemplateModernMinimal = lazy(() => import('../components/biodata/templates/TemplateModernMinimal'));
const TemplateFloralWedding = lazy(() => import('../components/biodata/templates/TemplateFloralWedding'));
const TemplateTraditionalIndian = lazy(() => import('../components/biodata/templates/TemplateTraditionalIndian'));
const TemplatePremiumDark = lazy(() => import('../components/biodata/templates/TemplatePremiumDark'));
const TemplateRoyalBlueDiamond = lazy(() => import('../components/biodata/templates/TemplateRoyalBlueDiamond'));

const DynamicTemplate = ({ biodata }) => {
  const [searchParams] = useSearchParams();
  const rawTid = searchParams.get('theme') || biodata?.templateId || 'default';
  const tid = rawTid.trim();
  switch (tid) {
    case 'royal-gold':
    case 'RoyalMaharaja': return <TemplateRoyalMaharaja biodata={biodata} />;
    case 'elegant-minimal':
    case 'ModernMinimal': return <TemplateModernMinimal biodata={biodata} />;
    case 'floral-wedding':
    case 'FloralWedding': return <TemplateFloralWedding biodata={biodata} />;
    case 'modern-premium':
    case 'PremiumDark': return <TemplatePremiumDark biodata={biodata} />;
    case 'TraditionalIndian': return <TemplateTraditionalIndian biodata={biodata} />;
    case 'RoyalBlueDiamond': return <TemplateRoyalBlueDiamond biodata={biodata} />;
    case 'GaneshRoyal': return <TemplateGaneshRoyal biodata={biodata} />;
    case 'OmClassic': return <TemplateOmClassic biodata={biodata} />;
    case 'RoyalTexture': return <TemplateRoyalTexture biodata={biodata} />;
    case 'ModernPro': return <TemplateModernPro biodata={biodata} />;
    default: return <BiodataPDFTemplate biodata={biodata} />;
  }
};

import Card from '../components/ui/Card';
import Section from '../components/ui/Section';
import Loader from '../components/ui/Loader';
import Button from '../components/ui/Button';
import { PersonProfileSchema } from '../components/seo/SchemaMarkup';
import { useAuth } from '../hooks/useAuth';
import ThemeGalleryDrawer from '../components/biodata/ThemeGalleryDrawer';

/* ══════════════════════════════════════════════════════════════
   PREMIUM PDF ENGINE — Production-Ready, Mobile-Friendly
   ══════════════════════════════════════════════════════════════ */

/* ─── Scroll Progress Bar ─────────────────────────── */
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] sm:h-[3px] z-[60] origin-left print:hidden"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, #8b6010, #d4a017, #ffcc33, #d4a017, #8b6010)',
      }}
    />
  );
};

/* ─── Back to Top ─────────────────────────────────── */
const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const toggle = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', toggle, { passive: true });
    return () => window.removeEventListener('scroll', toggle);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 z-50 p-2.5 sm:p-3 rounded-full glass-premium border border-yellow-700/30 text-yellow-500 hover:text-yellow-400 hover:border-yellow-600/50 transition-all duration-300 print:hidden cursor-pointer"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

/* ─── Section Divider ─────────────────────────────── */
const SectionDivider = ({ icon = '✦', delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scaleX: 0 }}
    whileInView={{ opacity: 1, scaleX: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay }}
    className="flex items-center justify-center gap-3 sm:gap-4 py-2 sm:py-4"
  >
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-700/20 to-transparent" />
    <motion.span
      animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      className="text-yellow-700/50 text-xs sm:text-sm"
    >
      {icon}
    </motion.span>
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-700/20 to-transparent" />
  </motion.div>
);

/* ─── About Me Section ────────────────────────────── */
const AboutSection = ({ bio }) => {
  if (!bio) return null;
  return (
    <Card delay={0.05}>
      <Section icon={<Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />} title="About Me" accent="gold">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-sm sm:text-base md:text-lg text-gray-300/90 leading-relaxed sm:leading-loose font-light px-1 sm:px-2"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          {bio}
        </motion.p>
      </Section>
    </Card>
  );
};

/* ─── Elegant Quote Section ───────────────────────── */
const QuoteSection = () => (
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 1 }}
    className="text-center py-8 sm:py-12 relative"
  >
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="w-[50vw] max-w-[400px] h-32 rounded-full bg-yellow-700/5 blur-[60px]" />
    </div>
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-700/30 mx-auto mb-3 sm:mb-4 rotate-180" />
    </motion.div>
    <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
      <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-yellow-700/40" />
      <span className="text-yellow-700 text-base sm:text-xl animate-sparkle">✦</span>
      <div className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-yellow-700/40" />
    </div>
    <p
      className="text-gray-400/80 italic text-sm sm:text-base leading-relaxed max-w-sm sm:max-w-md mx-auto relative px-6"
      style={{ fontFamily: 'Cormorant Garamond, serif' }}
    >
      "Looking for an auspicious alliance built on mutual respect, love, and shared values."
    </p>
  </motion.div>
);

/* ─── Premium Footer ──────────────────────────────── */
const PremiumFooter = () => (
  <footer className="relative border-t border-red-900/20 py-8 sm:py-12 text-center print:hidden overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-t from-[#050000] to-transparent pointer-events-none" />
    <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6"
      >
        <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-yellow-700/30" />
        <span className="text-yellow-700/50 text-sm sm:text-base">❧</span>
        <div className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-yellow-700/30" />
      </motion.div>
      <p
        className="text-yellow-700/40 text-base sm:text-lg tracking-[0.15em] sm:tracking-[0.2em] mb-1 sm:mb-2"
        style={{ fontFamily: 'Cinzel, Playfair Display, serif' }}
      >
        ✦ BioData with Aguaa ✦
      </p>
      <div className="mt-3 flex flex-col items-center justify-center gap-1.5">
        <p className="text-gray-500/80 text-[10px] sm:text-xs tracking-widest uppercase font-medium">
          © {new Date().getFullYear()} Aguaa. Crafted with elegance & love.
        </p>
        <div className="flex items-center gap-2 text-[9px] sm:text-[10px] tracking-[0.2em] uppercase font-semibold">
          <span className="text-gray-600/60">Designed By</span>
          <span className="text-yellow-700/70">Nitish Kumar</span>
        </div>
      </div>
    </div>
  </footer>
);

/* ─── PDF Loading Overlay ─────────────────────────── */
const PdfLoadingOverlay = ({ visible, stage }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm print:hidden"
      >
        <div className="flex flex-col items-center gap-5">
          {/* Spinning ring */}
          <div className="relative w-16 h-16">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full border-2 border-yellow-700/25 border-t-yellow-500"
            />
            <div className="absolute inset-3 rounded-full border border-yellow-700/15" />
            <div className="absolute inset-0 flex items-center justify-center text-yellow-600/70 text-lg">✦</div>
          </div>
          <div className="text-center space-y-1">
            <p className="text-yellow-500 text-lg font-light tracking-widest"
              style={{ fontFamily: 'Cinzel, Playfair Display, serif' }}>
              Generating PDF
            </p>
            <p className="text-gray-400 text-xs tracking-wider">{stage || 'Preparing your biodata…'}</p>
          </div>
          {/* Progress dots */}
          <div className="flex gap-1.5">
            {[0,1,2].map(i => (
              <motion.div key={i}
                className="w-1.5 h-1.5 rounded-full bg-yellow-600/50"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

/* ─── Error Toast ─────────────────────────────────── */
const ErrorToast = ({ message, onClose }) => (
  <AnimatePresence>
    {message && (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-5 py-3 rounded-xl glass-premium border border-red-800/40 shadow-luxury"
      >
        <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
        <p className="text-sm text-gray-200">{message}</p>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-300 ml-2">✕</button>
      </motion.div>
    )}
  </AnimatePresence>
);

/* ═══════════════════════════════════════════════════ */
/* ─── PROFILE PAGE ─────────────────────────────────── */
/* ═══════════════════════════════════════════════════ */

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [biodata, setBiodata]       = useState(null);
  const [loading, setLoading]       = useState(true);
  const [notFound, setNotFound]     = useState(false);
  const [accessApproved, setAccessApproved] = useState(false);
  const [requestStatus, setRequestStatus]   = useState('NONE'); // NONE | PENDING | ACCEPTED | REJECTED
  const [requestMessage, setRequestMessage] = useState('');
  const [sendingRequest, setSendingRequest] = useState(false);
  const [requestError, setRequestError]     = useState('');
  const [requestSuccess, setRequestSuccess] = useState('');
  const [copied, setCopied]         = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfStage, setPdfStage]     = useState('');
  const [pdfError, setPdfError]     = useState('');
  const [isThemeDrawerOpen, setIsThemeDrawerOpen] = useState(false);
  const profileRef = useRef(null);
  const { currentUser: user, loading: authLoading } = useAuth();

  // Redirect unauthenticated visitors to login flow preserving intended biodata destination
  useEffect(() => {
    if (!authLoading && !user) {
      navigate(`/login?redirect=${encodeURIComponent(`/profile/${id}`)}`, { replace: true });
    }
  }, [authLoading, user, id, navigate]);

  useEffect(() => {
    if (authLoading || !user) return;

    let isMounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const fullData = await apiGetBiodataById(id);
        if (!isMounted) return;
        if (fullData) {
          setBiodata(fullData);
          setAccessApproved(true);
          setRequestStatus('ACCEPTED');
        } else {
          setNotFound(true);
        }
      } catch (err) {
        if (!isMounted) return;
        const errStatus = err?.status || err?.response?.status;
        if (errStatus === 403) {
          // Access restricted: fetch safe preview without contact details & check request status
          try {
            const [previewData, statusRes] = await Promise.all([
              apiGetBiodataPreview(id),
              apiGetBiodataRequestStatus(id).catch(() => null),
            ]);
            if (!isMounted) return;
            if (previewData) {
              setBiodata(previewData);
              setAccessApproved(false);
              setRequestStatus(statusRes?.status || err?.data?.status || 'NONE');
            } else {
              setNotFound(true);
            }
          } catch {
            if (isMounted) setNotFound(true);
          }
        } else {
          setNotFound(true);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [id, user, authLoading]);

  const handleSendRequest = async (e) => {
    e?.preventDefault?.();
    if (sendingRequest) return;
    setSendingRequest(true);
    setRequestError('');
    setRequestSuccess('');
    try {
      await apiSendBiodataRequest(biodata?._id || id, requestMessage);
      setRequestStatus('PENDING');
      setRequestSuccess('Access request sent successfully! You will be able to view full biodata once the owner approves.');
      setRequestMessage('');
    } catch (err) {
      const msg = err?.data?.message || err?.message || 'Failed to send access request. Please try again.';
      setRequestError(msg);
    } finally {
      setSendingRequest(false);
    }
  };

  // ── Sync URL slug seamlessly if visitor opened an old ObjectId link ───────────
  useEffect(() => {
    if (!biodata) return;
    const slug = generateProfileSlug(biodata);
    if (slug && id !== slug && window.history?.replaceState) {
      window.history.replaceState(null, '', `/profile/${slug}${window.location.search}`);
    }
  }, [biodata, id]);

  // ── Dynamic SEO: update <title> and <canonical> when profile data loads ──
  useEffect(() => {
    if (!biodata) return;
    const name = biodata?.personalInfo?.fullName;
    const city = biodata?.personalInfo?.city || '';
    const age  = biodata?.personalInfo?.age  || '';
    const slug = generateProfileSlug(biodata) || id;

    // Unique title per profile
    document.title = name
      ? `${name}'s Marriage Biodata${city ? ` | ${city}` : ''} | Aguaa`
      : 'Marriage Biodata Profile | Aguaa';

    // Unique canonical per profile — critical for preventing duplicate content
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = getProfileUrl(biodata);

    // OG tags for social sharing (WhatsApp, Facebook)
    const setMeta = (attr, name, content) => {
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };
    const ogTitle = name
      ? `${name}'s Marriage Biodata${age ? ` (${age} yrs)` : ''}${city ? ` | ${city}` : ''} | Aguaa`
      : 'Marriage Biodata Profile | Aguaa';
    const ogDesc = [
      `View ${name || 'this'}'s verified marriage biodata on Aguaa`,
      age  ? `(${age} years)` : '',
      city ? `from ${city}` : '',
      '— Dil Se Rishta, Vishwas Se Shaadi.',
    ].filter(Boolean).join(' ');
    const ogImg = biodata.photoURL || 'https://www.myaguaa.in/og-banner.png';

    setMeta('property', 'og:title',       ogTitle);
    setMeta('property', 'og:description', ogDesc);
    setMeta('property', 'og:url',         getProfileUrl(biodata));
    setMeta('property', 'og:type',        'profile');
    setMeta('property', 'og:image',       ogImg);
    setMeta('name',     'twitter:title',       ogTitle);
    setMeta('name',     'twitter:description', ogDesc);
    setMeta('name',     'twitter:image',       ogImg);

    // Restore generic title on unmount
    return () => {
      document.title = 'Aguaa — Free Marriage Biodata Maker | Shaadi Biodata | Bihar UP Jharkhand';
    };
  }, [biodata, id]);

  // ── Preload active biodata template chunk to ensure zero latency during print/download ──
  useEffect(() => {
    if (!biodata) return;
    const tid = searchParams.get('theme') || biodata.templateId || 'default';
    switch (tid) {
      case 'royal-gold':
      case 'RoyalMaharaja': import('../components/biodata/templates/TemplateRoyalMaharaja'); break;
      case 'elegant-minimal':
      case 'ModernMinimal': import('../components/biodata/templates/TemplateModernMinimal'); break;
      case 'floral-wedding':
      case 'FloralWedding': import('../components/biodata/templates/TemplateFloralWedding'); break;
      case 'modern-premium':
      case 'PremiumDark': import('../components/biodata/templates/TemplatePremiumDark'); break;
      case 'RoyalBlueDiamond': import('../components/biodata/templates/TemplateRoyalBlueDiamond'); break;
      case 'GaneshRoyal': import('../components/biodata/templates/TemplateGaneshRoyal'); break;
      case 'OmClassic': import('../components/biodata/templates/TemplateOmClassic'); break;
      case 'RoyalTexture': import('../components/biodata/templates/TemplateRoyalTexture'); break;
      case 'ModernPro': import('../components/biodata/templates/TemplateModernPro'); break;
      default: import('../components/biodata/BiodataPDFTemplate'); break;
    }
  }, [biodata, searchParams]);

  const handleCopyLink = useCallback(() => {
    const profileUrl = biodata ? getProfileUrl(biodata) : `${(window?.location?.origin || 'https://www.myaguaa.in').replace(/\/+$/, '')}/profile/${id}`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(profileUrl).catch(() => {});
    }
    const message = `Check out this biodata created on Aguaa:\n${profileUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [biodata, id]);

  const handleRequestAccessClick = useCallback(() => {
    const el = document.getElementById('access-request-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const textarea = el.querySelector('textarea');
      if (textarea) {
        setTimeout(() => textarea.focus(), 350);
      }
    }
  }, []);

  const handlePrint = useCallback(async () => {
    try {
      setPdfLoading(true);
      setPdfStage('Preparing biodata for printing…');
      // Buffer to allow the browser to paint the portal DOM, SVGs, and fonts
      await new Promise((resolve) => setTimeout(resolve, 200));
      setPdfLoading(false);
      window.print();
    } catch {
      setPdfLoading(false);
      window.print();
    }
  }, []);

  /* ─── Premium HD Multi-Page PDF Generation ──────── */
  const handleDownloadPDF = useCallback(async () => {
    try {
      setPdfLoading(true);
      setPdfStage('Preparing high-resolution print PDF…');
      // Buffer to allow the browser to paint the portal DOM, SVGs, and fonts
      await new Promise((resolve) => setTimeout(resolve, 250));
      setPdfLoading(false);
      window.print();
    } catch {
      setPdfLoading(false);
      window.print();
    }
  }, []);

  /* ─── Loading & Not Found States ────────────────── */
  if (loading) return <Loader message="Loading Biodata…" />;

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-red-900/40 mx-auto mb-4" />
          <h1
            className="text-2xl sm:text-3xl text-white font-light mb-2"
            style={{ fontFamily: 'Cinzel, Playfair Display, serif' }}
          >
            Biodata Not Found
          </h1>
          <p className="text-gray-400 mb-6 text-sm sm:text-base">
            This profile may have been removed or marked private.
          </p>
          <Link to="/">
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const { personalInfo = {}, educationInfo = {}, familyInfo = {}, preferences = {} } = biodata;
  const photoURL = biodata.photoURL || personalInfo.photoURL || null;
  const isOwner = user && (user._id === biodata.userId || user.id === biodata.userId);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <div className="min-h-screen noise-overlay relative">

      {/* ── Person Profile JSON-LD Schema ────────────── */}
      <PersonProfileSchema biodata={biodata} />

      {/* ─── Overlays ───────────────────────────────── */}
      <PdfLoadingOverlay visible={pdfLoading} stage={pdfStage} />
      <ErrorToast message={pdfError} onClose={() => setPdfError('')} />

      {/* ─── Scroll Progress ─────────────────────────── */}
      <ScrollProgress />
      <BackToTop />

      {/* ─── Premium Silk Weave Background ──────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0 print:hidden overflow-hidden">
        {/* Base Gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #120500 0%, #1e0b00 50%, #120500 100%)",
          }}
        />
        {/* Diagonal Gold Stripes */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "repeating-linear-gradient(45deg, #d4a017 0px, #d4a017 1px, transparent 1px, transparent 40px)",
          }}
        />
        {/* Diagonal Maroon Stripes (cross-weave) */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "repeating-linear-gradient(-45deg, #8b0000 0px, #8b0000 1px, transparent 1px, transparent 60px)",
          }}
        />
        
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,#d4a017_0%,transparent_70%)] opacity-[0.08] translate-x-1/3 -translate-y-1/3 rounded-full" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[radial-gradient(circle,#8b0000_0%,transparent_70%)] opacity-[0.06] -translate-x-1/3 translate-y-1/3 rounded-full" />
        
        {/* Soft edge fading lines */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-600/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-600/30 to-transparent" />
      </div>

      {/* ─── Theme Gallery Drawer (Owner Only) ────────── */}
      {isOwner && (
        <ThemeGalleryDrawer 
          biodata={biodata} 
          setBiodata={setBiodata} 
          DynamicTemplate={DynamicTemplate} 
          isOpen={isThemeDrawerOpen}
          setIsOpen={setIsThemeDrawerOpen}
        />
      )}

      {/* ─── Fixed Back Button ───────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="fixed top-6 left-4 sm:left-6 z-50 print:hidden"
      >
        <Link to="/">
          <Button variant="ghost" size="sm" className="glass-premium rounded-full !px-3 shadow-luxury backdrop-blur-md bg-black/20">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline ml-1 text-xs">Back</span>
          </Button>
        </Link>
      </motion.div>

      {/* ─── Main Viewable Content ───────────────────── */}
      <div ref={profileRef} className="relative z-10">

        {/* Hero Banner */}
        <HeroBanner
          biodata={biodata}
          personalInfo={personalInfo}
          educationInfo={educationInfo}
          preferences={preferences}
          name={personalInfo.fullName}
          tagline={preferences.bio || preferences.aboutMe || preferences.partnerExpectations || 'Seeking a loving and caring life partner.'}
          photoURL={photoURL}
          photos={
            (biodata?.photos?.length > 0)
              ? biodata.photos.map(p => p?.url || p)
              : photoURL ? [photoURL] : []
          }
          onShare={handleCopyLink}
          onPrint={accessApproved ? handlePrint : undefined}
          onDownload={accessApproved ? handleDownloadPDF : undefined}
          pdfLoading={pdfLoading}
          copied={copied}
          onThemeGallery={isOwner ? () => navigate(`/preview/${biodata._id}/${biodata.templateId || 'default'}`) : undefined}
          accessApproved={accessApproved}
          requestStatus={requestStatus}
          onRequestAccess={handleRequestAccessClick}
          isOwner={isOwner}
        />

        {/* Detail Cards */}
        <motion.main
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="max-w-4xl 3xl:max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 space-y-4 sm:space-y-6 lg:space-y-8"
        >
          {/* About Me */}
          <motion.div variants={itemVariants}>
            <AboutSection bio={preferences.bio} />
          </motion.div>

          <SectionDivider icon="❧" />

          {/* Personal Information */}
          <motion.div variants={itemVariants}>
            <PersonalInfoCard data={personalInfo} />
          </motion.div>

          <SectionDivider icon="✦" delay={0.1} />

          {/* Education */}
          <motion.div variants={itemVariants}>
            <EducationCard data={educationInfo} />
          </motion.div>

          {/* If access is NOT approved: Privacy Gate Card */}
          {!accessApproved ? (
            <>
              <SectionDivider icon="✦" delay={0.2} />

              <motion.div id="access-request-section" variants={itemVariants}>
                <Card delay={0.25}>
                  <Section
                    icon={<ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
                    title="Biodata Access & Privacy Protection"
                    accent="gold"
                  >
                    <div className="space-y-4">
                      {requestStatus === 'NONE' && (
                        <div className="space-y-4">
                          <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-light">
                            The candidate's family has protected this biodata. Family background, contact numbers, and printable biodata are confidential.
                            Please send an access request to connect with this profile.
                          </p>

                          <div className="space-y-2">
                            <label className="block text-xs font-medium text-yellow-600/80 uppercase tracking-wider">
                              Introduce Yourself / Family (Optional)
                            </label>
                            <textarea
                              rows={3}
                              value={requestMessage}
                              onChange={(e) => setRequestMessage(e.target.value)}
                              placeholder="e.g. Namaste, we came across your biodata and would like to connect for a prospective marriage alliance..."
                              className="w-full px-4 py-3 rounded-xl bg-black/60 border border-yellow-700/30 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-yellow-500 transition-colors"
                            />
                          </div>

                          {requestError && (
                            <p className="text-xs text-red-400 flex items-center gap-1.5">
                              <AlertCircle className="w-4 h-4 flex-shrink-0" />
                              {requestError}
                            </p>
                          )}

                          <Button
                            variant="gold"
                            size="md"
                            loading={sendingRequest}
                            onClick={handleSendRequest}
                            className="w-full sm:w-auto"
                          >
                            <Send className="w-4 h-4 mr-1.5" />
                            Send Access Request
                          </Button>
                        </div>
                      )}

                      {requestStatus === 'PENDING' && (
                        <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/40 border border-amber-600/40 space-y-3">
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/60 border border-amber-500/50 text-amber-300 text-xs font-semibold">
                            <Clock className="w-3.5 h-3.5 animate-pulse" />
                            <span>Request Pending</span>
                          </div>
                          <h4 className="text-base sm:text-lg font-semibold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                            Your Access Request is Awaiting Approval
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                            Your request has been delivered to the biodata owner. Once they review and accept your request, you will automatically unlock complete biodata access, family details, and contact numbers.
                          </p>
                          {requestSuccess && (
                            <p className="text-xs text-emerald-400 font-medium">{requestSuccess}</p>
                          )}
                        </div>
                      )}

                      {requestStatus === 'REJECTED' && (
                        <div className="p-4 sm:p-5 rounded-2xl bg-red-950/40 border border-red-800/40 space-y-3">
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-900/60 border border-red-700/50 text-red-300 text-xs font-semibold">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Request Rejected</span>
                          </div>
                          <h4 className="text-base sm:text-lg font-semibold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                            Access Request Declined
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                            The profile owner has declined this access request. If you wish to send an updated note, you can submit a new request below.
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => { setRequestStatus('NONE'); setRequestError(''); setRequestSuccess(''); }}
                            className="border border-yellow-700/30 text-yellow-400 hover:text-yellow-300 text-xs"
                          >
                            Send New Request
                          </Button>
                        </div>
                      )}
                    </div>
                  </Section>
                </Card>
              </motion.div>

              {/* Locked placeholder for Family & Contact */}
              <motion.div variants={itemVariants}>
                <div className="p-6 sm:p-8 rounded-2xl bg-black/40 border border-yellow-700/20 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-yellow-950/50 border border-yellow-700/30 flex items-center justify-center mx-auto text-yellow-500">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h4 className="text-white font-serif text-lg tracking-wide">Family & Contact Details Locked</h4>
                  <p className="text-gray-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                    Personal phone number, email address, family background, and PDF printing are strictly confidential to ensure privacy for candidates and their families.
                  </p>
                </div>
              </motion.div>
            </>
          ) : (
            <>
              <SectionDivider icon="❧" delay={0.2} />

              {/* Family */}
              <motion.div variants={itemVariants}>
                <FamilyCard data={familyInfo} />
              </motion.div>

              <SectionDivider icon="✦" delay={0.3} />

              {/* Preferences */}
              {(preferences.partnerExpectations || preferences.hobbies || preferences.preferredLocation) && (
                <motion.div variants={itemVariants}>
                  <Card delay={0.4}>
                    <Section
                      icon={<Heart className="w-4 h-4 sm:w-5 sm:h-5" />}
                      title="Preferences"
                      accent="gold"
                    >
                      <div className="space-y-4 sm:space-y-5">
                        {preferences.partnerExpectations && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                          >
                            <p className="text-[10px] sm:text-xs text-yellow-600/70 uppercase tracking-[0.15em] sm:tracking-widest font-medium mb-1">
                              Partner Expectations
                            </p>
                            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                              {preferences.partnerExpectations}
                            </p>
                          </motion.div>
                        )}
                        {preferences.hobbies && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                          >
                            <p className="text-[10px] sm:text-xs text-yellow-600/70 uppercase tracking-[0.15em] sm:tracking-widest font-medium mb-1">
                              Hobbies & Interests
                            </p>
                            <p className="text-sm sm:text-base text-gray-300">{Array.isArray(preferences.hobbies) ? preferences.hobbies.join(', ') : preferences.hobbies}</p>
                          </motion.div>
                        )}
                        {preferences.preferredLocation && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                          >
                            <p className="text-[10px] sm:text-xs text-yellow-600/70 uppercase tracking-[0.15em] sm:tracking-widest font-medium mb-1">
                              Preferred Location
                            </p>
                            <p className="text-sm sm:text-base text-gray-300">{preferences.preferredLocation}</p>
                          </motion.div>
                        )}
                      </div>
                    </Section>
                  </Card>
                </motion.div>
              )}

              <SectionDivider icon="✦" delay={0.4} />

              {/* Contact */}
              {preferences.contactName && (
                <motion.div variants={itemVariants}>
                  <Card delay={0.5}>
                    <Section
                      icon={<MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />}
                      title="Contact Information"
                      accent="red"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4 }}
                        >
                          <p className="text-[10px] sm:text-xs text-yellow-600/70 uppercase tracking-[0.15em] sm:tracking-widest font-medium mb-1">
                            Contact Person
                          </p>
                          <p className="text-white font-semibold text-sm sm:text-base">
                            {preferences.contactName}
                          </p>
                        </motion.div>
                        {preferences.contactPhone && (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                          >
                            <p className="text-[10px] sm:text-xs text-yellow-600/70 uppercase tracking-[0.15em] sm:tracking-widest font-medium mb-1">
                              Phone
                            </p>
                            <a
                              href={`tel:${preferences.contactPhone}`}
                              className="text-yellow-400 hover:text-yellow-300 transition-colors duration-300 font-medium text-sm sm:text-base"
                            >
                              {preferences.contactPhone}
                            </a>
                          </motion.div>
                        )}
                        {preferences.contactEmail && (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            className="sm:col-span-2"
                          >
                            <p className="text-[10px] sm:text-xs text-yellow-600/70 uppercase tracking-[0.15em] sm:tracking-widest font-medium mb-1">
                              Email
                            </p>
                            <a
                              href={`mailto:${preferences.contactEmail}`}
                              className="text-yellow-400 hover:text-yellow-300 transition-colors duration-300 text-sm sm:text-base break-all"
                            >
                              {preferences.contactEmail}
                            </a>
                          </motion.div>
                        )}
                      </div>
                    </Section>
                  </Card>
                </motion.div>
              )}
            </>
          )}

          {/* Closing Quote */}
          <QuoteSection />
        </motion.main>
      </div>

      {/* ─── Premium Footer ──────────────────────────── */}
      <PremiumFooter />

      {/* ─── Print Portal — targets #print-biodata-root in index.html (Owner/Approved only) ── */}
      {typeof document !== 'undefined' && Boolean(biodata) && accessApproved && (() => {
        const printRoot = document.getElementById('print-biodata-root');
        return printRoot ? createPortal(
          <Suspense fallback={null}>
            <DynamicTemplate biodata={biodata} />
          </Suspense>,
          printRoot
        ) : null;
      })()}
    </div>
  );
};

export default ProfilePage;
