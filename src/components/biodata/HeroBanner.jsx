import { motion } from 'framer-motion';
import { useState, useMemo, useRef } from 'react';
import {
  Share2,
  Printer,
  Download,
  Check,
  ShieldCheck,
  Sparkles,
  MapPin,
  GraduationCap,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Clock,
  XCircle,
  Send,
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import Button from '../ui/Button';
import { optimizeImage } from '../../utils/image';

/* ─── Age Calculator ─────────────────────────────── */
const calculateAge = (dob) => {
  if (!dob) return null;
  const birthDate = new Date(dob);
  if (isNaN(birthDate)) return null;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age > 0 ? age : null;
};

/* ─── Subtle Golden Particles (Lightweight & Royal) ─ */
const GoldenDust = () => {
  const particles = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: `${(i * 8.3 + 4) % 100}%`,
      top: `${(i * 13.7 + 10) % 100}%`,
      size: (i % 3) * 1.2 + 1.8,
      duration: 8 + (i % 5) * 2,
      delay: (i % 4) * 1.5,
      dx: ((i % 2 === 0 ? 1 : -1) * 35),
      dy: -70 - (i % 3) * 30,
    })), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10 print:hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            top: p.top,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: 0.25,
            '--duration': `${p.duration}s`,
            '--delay': `${p.delay}s`,
            '--dx': `${p.dx}px`,
            '--dy': `${p.dy}px`,
          }}
        />
      ))}
    </div>
  );
};

/* ─── Decorative Gold Frame Corners ───────────────── */
const FrameCorners = () => (
  <>
    <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none w-5 h-5 border-t-[1.5px] border-l-[1.5px] border-[#d4a017]/70 rounded-tl-sm" />
    <div className="absolute top-2.5 right-2.5 z-20 pointer-events-none w-5 h-5 border-t-[1.5px] border-r-[1.5px] border-[#d4a017]/70 rounded-tr-sm" />
    <div className="absolute bottom-2.5 left-2.5 z-20 pointer-events-none w-5 h-5 border-b-[1.5px] border-l-[1.5px] border-[#d4a017]/70 rounded-bl-sm" />
    <div className="absolute bottom-2.5 right-2.5 z-20 pointer-events-none w-5 h-5 border-b-[1.5px] border-r-[1.5px] border-[#d4a017]/70 rounded-br-sm" />
  </>
);

/* ─── HeroBanner Component ─────────────────────────── */
const HeroBanner = ({
  biodata = {},
  personalInfo = {},
  educationInfo = {},
  preferences = {},
  name,
  tagline,
  photoURL,
  photos = [],
  onShare,
  onPrint,
  onDownload,
  pdfLoading,
  copied,
  onThemeGallery,
  accessApproved = false,
  requestStatus = 'NONE',
  onRequestAccess,
  isOwner = false,
}) => {
  const pInfo = personalInfo || biodata?.personalInfo || {};
  const eInfo = educationInfo || biodata?.educationInfo || {};
  const prefs = preferences || biodata?.preferences || {};

  const candidateName = name || pInfo.fullName || 'Biodata Profile';
  const caste = pInfo.caste?.trim() || '';
  const religion = pInfo.religion?.trim() || '';
  const casteReligionText = [caste, religion].filter(Boolean).join(' • ');

  const age = calculateAge(pInfo.dob) || pInfo.age || null;
  const location = [pInfo.city, pInfo.state].filter(Boolean).join(', ');
  const education = eInfo.highestQualification || '';
  const occupation = eInfo.occupation || '';

  const introText =
    prefs.bio ||
    prefs.aboutMe ||
    prefs.partnerExpectations ||
    tagline ||
    '';

  const isVerified = Boolean(biodata?.isVerified || biodata?.verified);
  const isPublic = Boolean(biodata?.isPublic);

  const rawImages = photos.length > 0 ? photos : photoURL ? [photoURL] : [];
  const images = rawImages.map((img) => optimizeImage(img, 900));

  const [activeIndex, setActiveIndex] = useState(0);
  const desktopSwiperRef = useRef(null);
  const mobileSwiperRef = useRef(null);

  const initials = candidateName
    ? candidateName
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '✦';

  // ── Render Profile Badge ──
  const renderBadge = () => {
    if (isVerified) {
      return (
        <div
          className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase text-emerald-300 shadow-sm"
          style={{
            background: 'rgba(6, 26, 14, 0.75)',
            border: '1px solid rgba(52, 211, 153, 0.4)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Verified Profile</span>
        </div>
      );
    }
    if (isPublic) {
      return (
        <div
          className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase text-yellow-300/95 shadow-sm"
          style={{
            background: 'rgba(26, 12, 0, 0.75)',
            border: '1px solid rgba(212, 160, 23, 0.4)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
          <span>Public Profile</span>
        </div>
      );
    }
    return null;
  };

  // ── Render Detail Chips ──
  const renderDetailChips = (centerAlign = false) => {
    const hasAny = Boolean(age || location || education || occupation);
    if (!hasAny) return null;

    return (
      <div
        className={`flex flex-wrap items-center gap-2 ${
          centerAlign ? 'justify-center' : 'justify-center lg:justify-start'
        }`}
      >
        {age && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#1a0800]/80 border border-yellow-800/40 text-yellow-100 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#d4a017] flex-shrink-0" />
            <span>{age} Years</span>
          </span>
        )}
        {location && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#1a0800]/80 border border-yellow-800/40 text-yellow-100 shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-[#d4a017] flex-shrink-0" />
            <span className="truncate max-w-[200px] sm:max-w-none">{location}</span>
          </span>
        )}
        {education && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#1a0800]/80 border border-yellow-800/40 text-yellow-100 shadow-sm">
            <GraduationCap className="w-3.5 h-3.5 text-[#d4a017] flex-shrink-0" />
            <span className="truncate max-w-[200px] sm:max-w-none">{education}</span>
          </span>
        )}
        {occupation && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#1a0800]/80 border border-yellow-800/40 text-yellow-100 shadow-sm">
            <Briefcase className="w-3.5 h-3.5 text-[#d4a017] flex-shrink-0" />
            <span className="truncate max-w-[180px] sm:max-w-none">{occupation}</span>
          </span>
        )}
      </div>
    );
  };

  // ── Render Action Buttons ──
  const renderActionButtons = (centerAlign = false) => (
    <div
      className={`flex flex-wrap items-center gap-2.5 sm:gap-3 w-full print:hidden ${
        centerAlign ? 'justify-center' : 'justify-center lg:justify-start'
      }`}
    >
      {/* Share Profile Action */}
      <Button
        id="btn-share-profile"
        onClick={onShare}
        variant="ghost"
        className="glass-premium text-xs sm:text-sm font-medium border-yellow-800/40 text-yellow-400 hover:text-yellow-300 min-w-[120px] transition-all"
      >
        {copied ? (
          <Check className="w-4 h-4 text-emerald-400 mr-1.5" />
        ) : (
          <Share2 className="w-4 h-4 mr-1.5" />
        )}
        <span>{copied ? 'Link Copied!' : 'Share Profile'}</span>
      </Button>

      {/* Access / Request Action State */}
      {!accessApproved && !isOwner && (
        <>
          {requestStatus === 'NONE' && (
            <Button
              id="btn-request-access"
              onClick={onRequestAccess}
              variant="gold"
              className="text-xs sm:text-sm font-semibold shadow-gold-glow min-w-[160px]"
            >
              <Send className="w-4 h-4 mr-1.5" />
              <span>Send Access Request</span>
            </Button>
          )}

          {requestStatus === 'PENDING' && (
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-950/70 border border-amber-600/50 text-amber-300 text-xs sm:text-sm font-medium shadow-sm">
              <Clock className="w-4 h-4 animate-pulse text-amber-400" />
              <span>Request Pending</span>
            </div>
          )}

          {requestStatus === 'REJECTED' && (
            <Button
              id="btn-re-request-access"
              onClick={onRequestAccess}
              variant="outline"
              className="text-xs sm:text-sm border-red-800/60 text-red-300 hover:text-red-200 bg-red-950/40"
            >
              <XCircle className="w-4 h-4 mr-1.5 text-red-400" />
              <span>Request Declined · Retry</span>
            </Button>
          )}
        </>
      )}

      {/* Actions available when access is approved */}
      {accessApproved && (
        <>
          {onPrint && (
            <Button
              id="btn-print-profile"
              onClick={onPrint}
              variant="ghost"
              className="glass-premium text-xs sm:text-sm text-yellow-400 hover:text-yellow-300 border-yellow-800/40"
            >
              <Printer className="w-4 h-4 mr-1.5" />
              <span>Print</span>
            </Button>
          )}
          {onDownload && (
            <Button
              id="btn-download-pdf"
              onClick={onDownload}
              variant="gold"
              loading={pdfLoading}
              className="shadow-gold-glow text-xs sm:text-sm font-semibold"
            >
              <Download className="w-4 h-4 mr-1.5" />
              <span>Download PDF</span>
            </Button>
          )}
        </>
      )}

      {/* Owner Theme Gallery Action */}
      {isOwner && onThemeGallery && (
        <Button
          id="btn-theme-gallery"
          onClick={onThemeGallery}
          variant="ghost"
          className="glass-premium text-xs sm:text-sm text-yellow-400 border-yellow-700/50 hover:border-yellow-500/80"
        >
          <span className="text-base mr-1">🎨</span>
          <span>Theme Gallery</span>
        </Button>
      )}
    </div>
  );

  // ── Render Gallery Card ──
  const renderPhotoGallery = (swiperRefHandle, isDesktopView = false) => (
    <div className={`w-full ${isDesktopView ? 'max-w-[340px] xl:max-w-[390px]' : 'max-w-[280px] sm:max-w-[320px]'} mx-auto`}>
      {/* Royal Gold Frame */}
      <div
        className="relative aspect-[4/5] rounded-2xl overflow-hidden p-2 group"
        style={{
          background: 'linear-gradient(135deg, rgba(28, 8, 4, 0.95), rgba(14, 3, 2, 0.9))',
          border: '1.5px solid rgba(212, 160, 23, 0.42)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 35px rgba(212, 160, 23, 0.1)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <FrameCorners />

        {images.length > 0 ? (
          <Swiper
            modules={[EffectFade, Autoplay]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            observer={true}
            observeParents={true}
            onSwiper={(s) => { swiperRefHandle.current = s; }}
            onSlideChange={(s) => setActiveIndex(s.activeIndex)}
            className="w-full h-full rounded-xl overflow-hidden bg-[#050100]"
          >
            {images.map((img, i) => (
              <SwiperSlide key={i} className="overflow-hidden">
                <div className="w-full h-full relative">
                  <img
                    src={img}
                    alt={`${candidateName} portrait ${i + 1}`}
                    className="w-full h-full object-cover object-center"
                    loading={i === 0 ? 'eager' : 'lazy'}
                  />
                  {/* Subtle royal vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080000]/80 via-transparent to-black/10 pointer-events-none" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          /* Monogram fallback when no photo is uploaded */
          <div
            className="w-full h-full rounded-xl flex items-center justify-center relative overflow-hidden"
            style={{
              background: 'radial-gradient(circle at center, #2e0606 0%, #080000 100%)',
            }}
          >
            <div
              className="absolute inset-0 opacity-25"
              style={{
                backgroundImage: 'radial-gradient(circle at center, rgba(212,160,23,0.5) 0%, transparent 70%)',
              }}
            />
            <span
              className="relative text-6xl sm:text-7xl font-bold select-none text-yellow-500/80 drop-shadow-2xl"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              {initials}
            </span>
          </div>
        )}
      </div>

      {/* Gallery Controls & Counter (Positioned cleanly below the photo frame) */}
      {images.length > 1 && (
        <div className="flex items-center justify-center gap-3 mt-3.5">
          <button
            type="button"
            onClick={() => swiperRefHandle.current?.slidePrev()}
            className="w-8 h-8 rounded-full bg-black/60 border border-yellow-700/40 text-yellow-500 hover:text-yellow-300 hover:border-yellow-500/80 flex items-center justify-center transition-all shadow-sm active:scale-95"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-yellow-600/90 font-medium tracking-wider px-1 select-none tabular-nums">
            {activeIndex + 1} of {images.length}
          </span>
          <button
            type="button"
            onClick={() => swiperRefHandle.current?.slideNext()}
            className="w-8 h-8 rounded-full bg-black/60 border border-yellow-700/40 text-yellow-500 hover:text-yellow-300 hover:border-yellow-500/80 flex items-center justify-center transition-all shadow-sm active:scale-95"
            aria-label="Next photo"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div
      className="relative w-full min-h-[90svh] lg:min-h-[92svh] bg-[#080000] overflow-hidden flex items-center py-16 sm:py-20 lg:py-16 print:hidden"
      style={{ maxWidth: '100vw' }}
    >
      {/* ── Background: Deep Maroon & Obsidian Royal Silk ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 85% 75% at 50% 40%, rgba(55,8,8,0.55) 0%, #080000 100%)',
          }}
        />
        {/* Subtle diagonal micro-texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, rgba(212,160,23,0.6) 0px, transparent 1px, transparent 16px)',
          }}
        />
        <div
          className="absolute top-1/3 left-1/4 w-[40vw] h-[40vw] max-w-[450px] max-h-[450px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(160,25,25,0.12) 0%, transparent 70%)',
            filter: 'blur(70px)',
          }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-[35vw] h-[35vw] max-w-[400px] max-h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(212,160,23,0.08) 0%, transparent 70%)',
            filter: 'blur(70px)',
          }}
        />
      </div>

      {/* ── Golden Dust Ambiance ── */}
      <GoldenDust />

      {/* ── Content Container ── */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">

        {/* ══════════════════════════════════════════════════════════
            DESKTOP HERO LAYOUT (1024px and above)
            Two-column layout: Left Profile Info, Right Photo Gallery
            ══════════════════════════════════════════════════════════ */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-16 items-center">
          {/* Left Column – Profile Information (Span 7) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-4 xl:space-y-5">
            {/* 1. Verified/Public Profile Badge */}
            {renderBadge()}

            {/* 2. Candidate Full Name */}
            <div>
              <h1
                className="text-4xl lg:text-5xl xl:text-6xl font-light text-white leading-[1.12] tracking-[0.02em] break-words"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                {candidateName}
              </h1>

              {/* 3. Caste and Religion */}
              {casteReligionText && (
                <p className="mt-2 text-sm lg:text-base text-yellow-500/90 font-medium tracking-wider uppercase">
                  {casteReligionText}
                </p>
              )}
            </div>

            {/* Subtle Gold Ornament Separator */}
            <div className="flex items-center gap-3 w-32 py-0.5">
              <div className="h-px flex-1 bg-gradient-to-r from-yellow-700/60 to-transparent" />
              <span className="text-yellow-600 text-xs select-none">✦</span>
              <div className="h-px flex-1 bg-gradient-to-l from-yellow-700/60 to-transparent" />
            </div>

            {/* 4, 5, 6. Age, Location / City, Education */}
            {renderDetailChips(false)}

            {/* 7. Introduction or Partner Preference */}
            {introText && (
              <p
                className="text-base lg:text-lg text-yellow-100/75 italic font-light leading-relaxed max-w-xl pt-1"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                &ldquo;{introText}&rdquo;
              </p>
            )}

            {/* 8, 9. Share Profile & Access/Request Actions */}
            <div className="pt-2 w-full">
              {renderActionButtons(false)}
            </div>
          </div>

          {/* Right Column – Photo Gallery (Span 5) */}
          <div className="lg:col-span-5 flex justify-center">
            {renderPhotoGallery(desktopSwiperRef, true)}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            MOBILE AND TABLET LAYOUT (Below 1024px)
            Single-column layout in exact specified order:
            1. Badge
            2. Photo gallery
            3. Candidate name
            4. Caste and religion
            5. Age, location and education
            6. Profile introduction
            7. Share & Request action
            ══════════════════════════════════════════════════════════ */}
        <div className="flex flex-col lg:hidden items-center text-center w-full max-w-md mx-auto space-y-4 sm:space-y-5">
          {/* 1. Profile Badge */}
          {renderBadge()}

          {/* 2. Main Profile Photo Gallery */}
          <div className="w-full py-1">
            {renderPhotoGallery(mobileSwiperRef, false)}
          </div>

          {/* 3. Candidate Name */}
          <div className="w-full px-2">
            <h1
              className="text-2xl sm:text-3xl md:text-4xl font-light text-white leading-tight tracking-[0.02em] break-words text-center"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              {candidateName}
            </h1>

            {/* 4. Caste and Religion */}
            {casteReligionText && (
              <p className="mt-1.5 text-xs sm:text-sm text-yellow-500/90 font-medium tracking-wider uppercase text-center">
                {casteReligionText}
              </p>
            )}
          </div>

          {/* Gold Ornament Divider */}
          <div className="flex items-center justify-center gap-2.5 w-28 py-0.5">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-yellow-700/50" />
            <span className="text-yellow-600 text-xs select-none">✦</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-yellow-700/50" />
          </div>

          {/* 5. Age, Location, Education */}
          <div className="w-full px-2">
            {renderDetailChips(true)}
          </div>

          {/* 6. Profile Introduction */}
          {introText && (
            <p
              className="text-sm sm:text-base text-yellow-100/75 italic font-light leading-relaxed max-w-sm px-2 text-center"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              &ldquo;{introText}&rdquo;
            </p>
          )}

          {/* 7. Share and Existing Biodata Request Action */}
          <div className="w-full pt-1">
            {renderActionButtons(true)}
          </div>
        </div>

      </div>

      {/* Bottom Subtle Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 bg-gradient-to-t from-[#080000] to-transparent z-15 pointer-events-none" />

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-0.5 pointer-events-none"
      >
        <span className="text-[9px] text-yellow-600/50 uppercase tracking-[0.25em] font-medium">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-3.5 h-3.5 text-yellow-600/40" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroBanner;
