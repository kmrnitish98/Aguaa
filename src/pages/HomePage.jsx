import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusCircle,
  Search,
  Sparkles,
  Heart,
  CheckCircle,
  Shield,
  Smartphone,
  FileText,
  Download,
  Star,
  ChevronDown,
  Users,
  ArrowRight,
  Mail,
  Share2,
  QrCode,
  Lock,
  ChevronLeft,
  ChevronRight,
  Check,
  Quote,
  MessageCircle,
  MapPin,
  Upload,
  X,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCards, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/pagination";

import { useQuery } from "@tanstack/react-query";
import { getPublicBiodatas } from "../api/biodata";
import { QUERY_KEYS } from "../constants/queryKeys";
import { CACHE } from "../constants/limits";
import BiodataCard from "../components/biodata/BiodataCard";
import Button from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";
import { useSEO } from "../hooks/useSEO";
import { FAQSchema } from "../components/seo/SchemaMarkup";

// —— Tiny CountUp hook: replaces react-countup (~15KB) ——
const useCountUp = (end, duration = 2000) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        let start = null;
        const step = (ts) => {
          if (!start) start = ts;
          const progress = Math.min((ts - start) / duration, 1);
          setCount(Math.floor(progress * end));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);
  return { count, ref };
};

// —— Shared animation variant (replaces data-aos="fade-up") ——
const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay },
  }),
};

// Constants
const BACKGROUND_VIDEOS = [
  "https://videos.pexels.com/video-files/34565055/14645159_1920_1080_25fps.mp4",
  "https://videos.pexels.com/video-files/16352543/16352543-hd_1920_1080_30fps.mp4",
  "https://videos.pexels.com/video-files/14299460/14299460-hd_1920_1080_25fps.mp4",
  "https://videos.pexels.com/video-files/29766220/12791760_3840_2160_25fps.mp4",
];

const BACKGROUND_POSTERS = [
  "/hero-poster.webp",
  "/hero-poster-2.webp",
  "/hero-poster-3.webp",
  "/hero-poster-4.webp",
];

const HERO_MEDIA = [
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1733759414886-6b3a5423ceb3?w=500&auto=format&fit=crop&q=60&fm=webp",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1600685912448-8bc35c141e18?w=500&auto=format&fit=crop&q=60&fm=webp",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1645856049928-d544f6b80ce2?w=500&auto=format&fit=crop&q=60&fm=webp",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1754782915842-aa4fca6c203a?w=500&auto=format&fit=crop&q=60&fm=webp",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1760080903792-874870c70902?w=500&auto=format&fit=crop&q=60&fm=webp",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1740418762511-b3927603599a?w=500&auto=format&fit=crop&q=60&fm=webp",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1754782915524-714d8534a5df?w=500&auto=format&fit=crop&q=60&fm=webp",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1703044412297-166a93480d1f?w=500&auto=format&fit=crop&q=60&fm=webp",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1703044412383-fa6b9884e802?w=500&auto=format&fit=crop&q=60&fm=webp",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1722952934708-749c22eb2e58?w=500&auto=format&fit=crop&q=60&fm=webp",
  },
];

const HomePage = () => {
  const { currentUser } = useAuth();
  useSEO("/");
  const [search, setSearch] = useState("");
  const [activeBg, setActiveBg] = useState(0);
  const [activeFaq, setActiveFaq] = useState(null);
  const galleryLimit = 8;

  // ── Public biodatas — React Query (homepage limits to 8 latest profiles) ──
  const {
    data: biodataResult,
    isLoading: loading,
    isError,
    error: queryError,
    refetch: refetchBiodatas,
  } = useQuery({
    queryKey: QUERY_KEYS.biodata.public({
      page: 1,
      limit: 8,
      search: "",
      filter: "All",
    }),
    queryFn: ({ signal }) => getPublicBiodatas({ page: 1, limit: 8, signal }),
    staleTime: CACHE.PUBLIC_BIODATAS_STALE_MS,
    gcTime: CACHE.GC_TIME_MS,
  });

  const error = isError
    ? queryError?.message || "Failed to load biodata profiles."
    : null;

  // Normalise: getPublicBiodatas returns { biodatas, data, ... } or plain array
  const biodatas = Array.isArray(biodataResult)
    ? biodataResult
    : (biodataResult?.biodatas ?? biodataResult?.data ?? []);

  // CountUp refs
  const { count: countFamilies, ref: refFamilies } = useCountUp(10, 2500);
  const { count: countRating, ref: refRating } = useCountUp(49, 2500);
  const { count: countVerified, ref: refVerified } = useCountUp(100, 2500);

  // Memoised particle positions — stable across re-renders
  const particles = useMemo(
    () =>
      Array.from({ length: 15 }, (_, i) => ({
        id: i,
        x: (i * 137.5) % 100, // deterministic spread via golden-angle
        y: (i * 97.3) % 100,
        opacity: 0.3 + (i % 4) * 0.12,
        duration: 6 + (i % 5),
        yMove: -80 - (i % 5) * 30,
      })),
    [],
  );

  // ── Responsive desktop check for Hero background videos (Tailwind lg breakpoint: 1024px) ──
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(min-width: 1024px)").matches;
    }
    return false;
  });

  const videoRefs = useRef([]);

  // Listen for viewport changes across mobile/tablet (< 1024px) and desktop (>= 1024px)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const handleMediaChange = (e) => {
      setIsDesktop(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleMediaChange);
    } else {
      mediaQuery.addListener(handleMediaChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleMediaChange);
      } else {
        mediaQuery.removeListener(handleMediaChange);
      }
    };
  }, []);

  // Desktop only: 5s interval to rotate active accordion panel while all 4 videos play
  useEffect(() => {
    if (!isDesktop) return;
    const interval = setInterval(() => {
      setActiveBg((prev) => (prev + 1) % BACKGROUND_VIDEOS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isDesktop]);

  // Synchronize video playback on desktop
  useEffect(() => {
    if (!isDesktop) return;
    videoRefs.current.forEach((video) => {
      if (!video) return;
      video.muted = true;
      video.loop = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    });
  }, [isDesktop, activeBg]);

  // Cleanup on unmount
  useEffect(() => {
    const currentVideos = videoRefs.current;
    return () => {
      currentVideos.forEach((video) => {
        if (video) {
          video.pause();
        }
      });
    };
  }, []);

  // Slide navigation handlers for mobile/tablet carousel
  const goToNextSlide = useCallback(() => {
    setActiveBg((prev) => (prev + 1) % BACKGROUND_VIDEOS.length);
  }, []);

  const goToPrevSlide = useCallback(() => {
    setActiveBg(
      (prev) =>
        (prev - 1 + BACKGROUND_VIDEOS.length) % BACKGROUND_VIDEOS.length,
    );
  }, []);

  const goToSlide = useCallback((index) => {
    setActiveBg(index);
  }, []);



  // Touch swipe support for mobile/tablet carousel
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length > 0) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    if (!e.changedTouches || e.changedTouches.length === 0) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchStartX.current - touchEndX;
    const deltaY = touchStartY.current - touchEndY;

    // Minimum swipe threshold 40px and horizontal movement must dominate
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
      if (deltaX > 0) {
        goToNextSlide();
      } else {
        goToPrevSlide();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const filtered = biodatas.filter((b) => {
    const name = b.personalInfo?.fullName?.toLowerCase() || "";
    const city = b.personalInfo?.city?.toLowerCase() || "";
    const q = search.toLowerCase();

    return name.includes(q) || city.includes(q);
  });

  return (
    <div className="min-h-screen bg-[#0f0a00] text-[#f5ead0] overflow-hidden font-['Inter',sans-serif] selection:bg-[#d4a017]/30 selection:text-[#f0c040]">
      {/* Schema Markup for Rich Results */}

      {/* WhatsApp Floating Button — disabled until a real support number is configured */}

      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-screen flex items-center pt-8 pb-[56px] lg:pb-[96px] lg:pt-16 overflow-hidden">
        {/* ================= HERO BACKGROUND: RESPONSIVE VIDEO PRESENTATION ================= */}
        {isDesktop ? (
          /* Desktop (1024px+): Original 4-Column Accordion (all 4 videos simultaneous) */
          <div className="absolute inset-0 z-0 flex w-full h-full overflow-hidden opacity-90">
            {BACKGROUND_VIDEOS.map((src, i) => (
              <div
                key={i}
                className={`relative h-full transition-all duration-1000 ease-[cubic-bezier(0.25,0.1,0.25,1)] cursor-default overflow-hidden border-r border-[#d4a017]/10 last:border-r-0 ${activeBg === i ? "flex-[2] md:flex-[3]" : "flex-1"} hover:flex-[2.5]`}
                onMouseEnter={() => {
                  if (isDesktop) setActiveBg(i);
                }}
              >
                <video
                  ref={(el) => (videoRefs.current[i] = el)}
                  src={src}
                  poster={BACKGROUND_POSTERS[i]}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="absolute inset-0 w-full h-full object-cover scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0a00]/90 via-[#0f0a00]/40 to-[#0f0a00]/80" />
              </div>
            ))}
          </div>
        ) : (
          /* Mobile & Tablet (< 1024px): Single-Slide Full-Width Responsive Poster Carousel (No heavy video downloads) */
          <div
            className="absolute inset-0 z-0 w-full h-full overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Sliding Track with smooth horizontal transition */}
            <div
              className="flex h-full w-full transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${activeBg * 100}%)` }}
            >
              {BACKGROUND_POSTERS.map((posterSrc, i) => (
                <div
                  key={i}
                  className="w-full h-full flex-shrink-0 relative overflow-hidden"
                >
                  <img
                    src={posterSrc}
                    alt=""
                    aria-hidden="true"
                    loading={i === 0 ? "eager" : "lazy"}
                    fetchPriority={i === 0 ? "high" : "low"}
                    decoding={i === 0 ? "sync" : "async"}
                    width="960"
                    height="540"
                    className="absolute inset-0 w-full h-full object-cover scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0a00]/90 via-[#0f0a00]/40 to-[#0f0a00]/80 pointer-events-none" />
                </div>
              ))}
            </div>

            {/* Tablet Side Controls (visible on tablet screens 768px-1023px) */}
            <button
              type="button"
              onClick={goToPrevSlide}
              aria-label="Previous slide"
              className="hidden md:flex lg:hidden absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#0f0a00]/70 backdrop-blur-md border border-[#d4a017]/30 text-[#d4a017] items-center justify-center opacity-80 hover:opacity-100 transition-all active:scale-95 pointer-events-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a017]"
            >
              <ChevronLeft className="w-6 h-6" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={goToNextSlide}
              aria-label="Next slide"
              className="hidden md:flex lg:hidden absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#0f0a00]/70 backdrop-blur-md border border-[#d4a017]/30 text-[#d4a017] items-center justify-center opacity-80 hover:opacity-100 transition-all active:scale-95 pointer-events-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a017]"
            >
              <ChevronRight className="w-6 h-6" aria-hidden="true" />
            </button>

            {/* Bottom Control Bar: Prev/Next + Pagination Dots */}
            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-[#0f0a00]/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#d4a017]/25 pointer-events-auto shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              <button
                type="button"
                onClick={goToPrevSlide}
                aria-label="Previous slide"
                className="p-1 rounded-full text-[#d4a017]/80 hover:text-[#d4a017] hover:bg-[#d4a017]/10 transition-colors active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a017]"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              </button>

              <div className="flex items-center gap-1.5 px-1">
                {BACKGROUND_POSTERS.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => goToSlide(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a017] ${
                      activeBg === i
                        ? "w-6 bg-[#d4a017] shadow-[0_0_8px_rgba(212,160,23,0.6)]"
                        : "w-2 bg-[#d4a017]/30 hover:bg-[#d4a017]/60"
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={goToNextSlide}
                aria-label="Next slide"
                className="p-1 rounded-full text-[#d4a017]/80 hover:text-[#d4a017] hover:bg-[#d4a017]/10 transition-colors active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a017]"
              >
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* Hardware-accelerated background particles on GPU compositor */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute w-1 h-1 bg-[#d4a017] rounded-full hero-particle"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                opacity: p.opacity,
                "--particle-opacity": p.opacity,
                "--y-move": `${p.yMove}px`,
                "--particle-duration": `${p.duration}s`,
                animationDelay: `${(p.id % 5) * 0.3}s`,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1f1500]/80 border border-[#d4a017]/40 text-[#f0c040] text-sm mb-6 backdrop-blur-md shadow-[0_0_20px_rgba(212,160,23,0.2)]">
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                <span className="tracking-wide uppercase font-medium text-xs">
                  Premium Wedding Biodata
                </span>
              </div>

              {/* Primary H1: Instant paint without delayed opacity for optimal LCP */}
              <h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white mb-3 leading-[1.1]"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Create Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4a017] via-[#f0c040] to-[#b8860b] font-medium drop-shadow-sm">
                  Shaadi Biodata
                </span>{" "}
              </h1>

              {/* Subtitle */}
              <p
                className="text-base sm:text-lg font-light text-[#f0c040] mb-4 tracking-wide"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                India's Trusted Marriage Biodata Platform for Bihar, UP &amp;
                Jharkhand Families
              </p>

              <p className="text-lg text-[#f0f0f0] mb-4 max-w-xl mx-auto font-bold lg:mx-0 leading-relaxed">
                “Shaadi ke liye professional biodata banaye — fast, secure &amp;
                beautiful. Har parivaar ka bharosemand digital Aguaa.”
              </p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
              >
                <Link to={currentUser ? "/create" : "/signup"}>
                  <Button
                    variant="gold"
                    size="xl"
                    className="px-4 py-3 lg:px-4 lg:py-4 md:px-4 md:py-3 sm:w-auto text-lg shadow-[0_0_30px_rgba(212,160,23,0.3)] hover:shadow-[0_0_40px_rgba(212,160,23,0.5)] transition-shadow"
                    aria-label="Create your marriage biodata on Aguaa"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Create Biodata
                  </Button>
                </Link>
                <Link to="/explore">
                  <Button
                    variant="outline"
                    size="xl"
                    className="px-4 py-3 lg:px-4 lg:py-4 md:px-3 md:py-3 sm:w-auto text-lg border-[#d4a017]/50 hover:bg-[#1f1500] text-[#f0c040]"
                  >
                    Explore Profiles
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="flex items-center justify-center lg:justify-start gap-8 border-t border-[#d4a017]/20 pt-6"
              >
                <div className="flex flex-col" ref={refFamilies}>
                  <span className="text-2xl font-bold text-white">
                    {countFamilies}K+
                  </span>
                  <span className="text-xs text-[#a89060] uppercase tracking-wider">
                    Families Trusted
                  </span>
                </div>
                <div className="w-px h-10 bg-[#d4a017]/20" />
                <div className="flex flex-col" ref={refRating}>
                  <div className="flex items-center gap-1 text-[#f0c040] text-2xl font-bold">
                    {(countRating / 10).toFixed(1)}{" "}
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                  <span className="text-xs text-[#a89060] uppercase tracking-wider">
                    User Rating
                  </span>
                </div>
                <div className="w-px h-10 bg-[#d4a017]/20" />
                <div className="flex flex-col" ref={refVerified}>
                  <span className="text-2xl font-bold text-white flex items-center gap-1">
                    <Shield className="w-5 h-5 text-amber-500" />{" "}
                    {countVerified}%
                  </span>
                  <span className="text-xs text-[#a89060] uppercase tracking-wider">
                    Verified
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Right Content - Cinematic Cards (Desktop Only — Avoids heavy Swiper initialization & image downloads on mobile) */}
            {isDesktop && (
              <motion.div
                className="relative hidden lg:block h-[550px] w-full"
                variants={fadeUpVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                custom={0.4}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <Swiper
                    effect={"cards"}
                    grabCursor={true}
                    modules={[EffectCards, Autoplay]}
                    autoplay={{
                      delay: 4000,
                      disableOnInteraction: false,
                    }}
                    className="w-[320px] h-[480px]"
                  >
                    {HERO_MEDIA.map((media, idx) => (
                      <SwiperSlide
                        key={idx}
                        className="rounded-2xl overflow-hidden border border-[#d4a017]/30 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                      >
                        <div className="relative w-full h-full group">
                          <img
                            src={media.src}
                            alt={`Indian wedding marriage biodata couple - beautiful matrimonial profile ${idx + 1}`}
                            loading={idx === 0 ? "eager" : "lazy"}
                            fetchPriority={idx === 0 ? "high" : "auto"}
                            width="320"
                            height="480"
                            decoding="async"
                            className="w-full h-full object-cover transition-transform duration-[10000ms] group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0a00]/90 via-[#0f0a00]/20 to-transparent" />
                          <div className="absolute bottom-6 left-6 right-6">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                              <span className="text-xs text-white/80 uppercase tracking-wider">
                                Premium Match
                              </span>
                            </div>
                            <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-[#d4a017]"
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{
                                  duration: 4,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute top-10 -left-10 bg-[#1a1000]/80 backdrop-blur-xl border border-[#d4a017]/30 p-4 rounded-2xl flex items-center gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                >
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-[#f5ead0] font-medium text-sm">
                      Verified Profile
                    </p>
                    <p className="text-xs text-[#a89060]">Just matched!</p>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [10, -10, 10] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute bottom-20 -right-10 bg-[#1a1000]/80 backdrop-blur-xl border border-[#d4a017]/30 p-4 rounded-2xl flex items-center gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                >
                  <div className="w-12 h-12 rounded-full bg-[#d4a017]/20 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-[#d4a017] fill-current" />
                  </div>
                  <div>
                    <p className="text-[#f5ead0] font-medium text-sm">
                      Perfect Match
                    </p>
                    <p className="text-xs text-[#a89060]">99% Compatibility</p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-[#a89060] uppercase tracking-widest">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="w-5 h-5 text-[#d4a017]" />
          </motion.div>
        </motion.div>
      </section>

      {/* ================= SECTION 1: WHY CHOOSE US ================= */}
      <section className="py-[56px] lg:py-[96px] relative overflow-hidden">
        {/* BG: Diagonal gold silk stripes + deep maroon base */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "linear-gradient(135deg, #120500 0%, #1e0b00 50%, #120500 100%)",
          }}
        />
        <div
          className="absolute inset-0 z-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #d4a017 0px, #d4a017 1px, transparent 1px, transparent 40px)",
          }}
        />
        <div
          className="absolute inset-0 z-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, #8b0000 0px, #8b0000 1px, transparent 1px, transparent 60px)",
          }}
        />
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-10 z-0"
          style={{
            background: "radial-gradient(circle, #d4a017 0%, transparent 70%)",
            transform: "translate(30%,-30%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-8 z-0"
          style={{
            background: "radial-gradient(circle, #8b0000 0%, transparent 70%)",
            transform: "translate(-30%, 30%)",
          }}
        />
        <div
          className="absolute top-0 left-0 right-0 h-px z-0"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(212,160,23,0.4), transparent)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-px z-0"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(212,160,23,0.4), transparent)",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-16"
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <p className="text-sm font-medium text-[#d4a017] tracking-widest uppercase mb-3">
              Why Choose Aguaa?
            </p>
            <h2
              className="text-4xl md:text-5xl font-light text-white mb-6"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              India&apos;s Most Trusted{" "}
              <span className="text-[#f0c040] italic">Shaadi Biodata</span>{" "}
              Platform
            </h2>
            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {[
                { icon: "🔒", label: "SSL Secured" },
                { icon: "✅", label: "100% Verified Profiles" },
                { icon: "⚡", label: "Instant PDF Download" },
                { icon: "🛡️", label: "Privacy Protected" },
                { icon: "📱", label: "Mobile Friendly" },
                { icon: "🆓", label: "Free to Start" },
              ].map(({ icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-[#d4a017]/30 text-[#a89060] bg-[#1f1500]/80"
                >
                  <span>{icon}</span>
                  {label}
                </span>
              ))}
            </div>
            <div className="mt-6 flex justify-center items-center gap-3">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#d4a017]/50" />
              <Heart className="w-4 h-4 text-[#d4a017]" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#d4a017]/50" />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: "Verified Profiles",
                desc: "Every profile undergoes strict manual verification for your safety and peace of mind.",
              },
              {
                icon: Sparkles,
                title: "Easy Biodata Creation",
                desc: "Intuitive builder makes creating your royal biodata a breeze within minutes.",
              },
              {
                icon: Lock,
                title: "Secure Sharing",
                desc: "Control who sees your biodata with advanced privacy settings and secure links.",
              },
              {
                icon: Smartphone,
                title: "Mobile Friendly",
                desc: "Beautifully responsive design that looks perfect on any device, anywhere.",
              },
              {
                icon: FileText,
                title: "Premium Templates",
                desc: "Choose from our exclusive collection of royal Indian design themes.",
              },
              {
                icon: Download,
                title: "Fast PDF Download",
                desc: "Generate high-quality PDF biodatas instantly with a single click.",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={fadeUpVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                custom={idx * 0.1}
              >
                <div className="group relative p-8 rounded-3xl bg-[#1f1500] border-t-2 border-[#d4a017] border-x border-b border-[#d4a017]/20 hover:border-[#f0c040]/80 transition-all duration-300 hover:bg-[#2a1e08] hover:-translate-y-1 shadow-lg hover:shadow-[0_10px_40px_rgba(212,160,23,0.15)]">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#d4a017]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                  <feature.icon className="w-12 h-12 text-[#d4a017] mb-6 group-hover:scale-110 group-hover:text-[#f0c040] transition-all drop-shadow-md" />
                  <h3 className="text-xl font-medium text-[#f5ead0] mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-[#a89060] leading-relaxed text-sm">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SECTION 2: HOW IT WORKS ================= */}
      <section className="py-[56px] lg:py-[96px] relative overflow-hidden">
        {/* BG: Dot-grid constellation + dark navy-charcoal */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "linear-gradient(160deg, #060206 0%, #0a0510 50%, #080308 100%)",
          }}
        />
        <div
          className="absolute inset-0 z-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(212,160,23,0.6) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div
          className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(139,0,0,0.5) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            backgroundPosition: "16px 16px",
          }}
        />
        <div className="absolute inset-0 z-0 opacity-30 bg-[radial-gradient(ellipse_at_center,rgba(212,160,23,0.12)_0%,transparent_65%)]" />
        <div
          className="absolute top-0 left-0 right-0 h-px z-0"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(212,160,23,0.3), transparent)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-px z-0"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(212,160,23,0.3), transparent)",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-20"
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <p className="text-sm font-medium text-[#d4a017] tracking-widest uppercase mb-3">
              Simple Process
            </p>
            <h2
              className="text-4xl md:text-5xl font-light text-white"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              How It <span className="text-[#f0c040] italic">Works</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Animated Connecting Line */}
            <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-transparent via-[#d4a017]/20 to-transparent z-0 overflow-hidden">
              <motion.div
                className="h-full w-1/3 bg-gradient-to-r from-transparent via-[#f0c040] to-transparent"
                animate={{ x: ["-100%", "300%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            </div>

            {[
              {
                icon: Users,
                title: "1. Create Profile",
                desc: "Sign up and enter your basic details securely.",
              },
              {
                icon: Heart,
                title: "2. Add Details",
                desc: "Fill in family, education, and lifestyle information.",
              },
              {
                icon: Sparkles,
                title: "3. Choose Theme",
                desc: "Select from our premium royal templates.",
              },
              {
                icon: Share2,
                title: "4. Share & Connect",
                desc: "Download PDF or share your unique profile link.",
              },
            ].map((step, idx) => (
              <motion.div
                key={idx}
                variants={fadeUpVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                custom={idx * 0.15}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 rounded-full bg-[#1f1500] border-2 border-[#d4a017]/50 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(212,160,23,0.2)] backdrop-blur-md relative group hover:border-[#f0c040] transition-colors">
                  <step.icon className="w-10 h-10 text-[#d4a017] group-hover:scale-110 transition-transform" />
                  <div
                    className="absolute -inset-4 text-6xl text-[#d4a017]/20 font-bold -z-10 flex items-center justify-center"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                  >
                    {idx + 1}
                  </div>
                </div>
                <h3 className="text-xl font-medium text-[#f5ead0] mb-2">
                  {step.title}
                </h3>
                <p className="text-[#a89060] text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= EXPLORE PROFILES ================= */}
      <section
        id="explore"
        className="py-[56px] lg:py-[96px] relative overflow-hidden"
      >
        {/* BG: Indian textile / honeycomb weave pattern */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "linear-gradient(180deg, #0e0500 0%, #1a0900 40%, #120600 100%)",
          }}
        />
        <div
          className="absolute inset-0 z-0 opacity-[0.055]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100'%3E%3Cpath d='M28 66L0 50V16L28 0l28 16v34zm0-18L8 36V20L28 8l20 12v16z' fill='none' stroke='%23d4a017' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: "56px 100px",
          }}
        />
        <div
          className="absolute top-0 left-1/2 w-[700px] h-[400px] -translate-x-1/2 -translate-y-1/2 opacity-10 z-0"
          style={{
            background: "radial-gradient(ellipse, #d4a017 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[300px] h-[300px] opacity-8 z-0"
          style={{
            background: "radial-gradient(circle, #8b0000 0%, transparent 70%)",
            transform: "translate(-30%,30%)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-[300px] h-[300px] opacity-8 z-0"
          style={{
            background: "radial-gradient(circle, #8b0000 0%, transparent 70%)",
            transform: "translate(30%,30%)",
          }}
        />
        <div
          className="absolute top-0 left-0 right-0 h-px z-0"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(212,160,23,0.35), transparent)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-px z-0"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(212,160,23,0.35), transparent)",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-12"
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <p className="text-sm font-medium text-[#d4a017] tracking-widest uppercase mb-3">
              Discover
            </p>
            <h2
              className="text-4xl md:text-5xl font-light text-white mb-8"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Explore <span className="text-[#f0c040] italic">Profiles</span>
            </h2>

            <div className="max-w-2xl mx-auto">
              <div className="w-full relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#d4a017] to-[#f0c040] rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative flex items-center bg-[#1f1500] border border-[#d4a017]/50 rounded-full p-2 backdrop-blur-md">
                  <Search
                    className="w-6 h-6 text-[#d4a017] ml-4 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <label htmlFor="homepage-profile-search" className="sr-only">
                    Search verified profiles by name or city
                  </label>
                  <input
                    id="homepage-profile-search"
                    type="text"
                    aria-label="Search verified profiles by name or city"
                    placeholder="Search by name or city..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-transparent border-none text-[#f5ead0] px-4 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a017] rounded-full placeholder-[#c8b080] text-lg"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-[#1f1500] border-t-[#d4a017] rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-[#1f1500] border border-amber-900/50 rounded-3xl max-w-md mx-auto">
              <p className="text-amber-500 mb-4">{error}</p>
              <Button variant="outline" onClick={() => refetchBiodatas()}>
                Retry
              </Button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 bg-[#1f1500] border border-[#d4a017]/20 rounded-3xl">
              <Heart className="w-16 h-16 text-[#d4a017]/50 mx-auto mb-4" />
              <p className="text-[#a89060] mb-6 text-lg">
                No profiles found matching your search.
              </p>
              {!search && (
                <Link to="/create">
                  <Button variant="gold" size="lg">
                    Create the First Profile
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="flex overflow-x-auto gap-5 pb-8 snap-x no-scrollbar px-4 -mx-4 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-4">
                {filtered.slice(0, 8).map((biodata, idx) => (
                  <motion.div
                    key={biodata._id}
                    variants={fadeUpVariant}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    custom={idx * 0.08}
                    className="min-w-[220px] lg:min-w-0 snap-center"
                  >
                    <BiodataCard biodata={biodata} />
                  </motion.div>
                ))}
              </div>

              {/* Explore All Profiles Action */}
              <div className="mt-8 text-center">
                <Link to="/explore">
                  <Button
                    variant="gold"
                    size="lg"
                    className="px-8 py-3.5 text-base shadow-[0_0_25px_rgba(212,160,23,0.3)] hover:shadow-[0_0_35px_rgba(212,160,23,0.5)] transition-all inline-flex items-center gap-2"
                  >
                    <span>View More</span>
                    <ArrowRight className="w-5 h-5 ml-1" />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ================= SECTION 4: SUCCESS STORIES ================= */}
      <section className="py-[56px] lg:py-[96px] relative overflow-hidden">
        {/* BG: Starburst radial lines + deep forest-black */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "linear-gradient(135deg, #020202 0%, #0d0800 50%, #040204 100%)",
          }}
        />
        <div
          className="absolute inset-0 z-0 opacity-[0.07]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cline x1='50' y1='50' x2='50' y2='0' stroke='%23d4a017' stroke-width='0.5'/%3E%3Cline x1='50' y1='50' x2='100' y2='0' stroke='%23d4a017' stroke-width='0.5'/%3E%3Cline x1='50' y1='50' x2='100' y2='50' stroke='%23d4a017' stroke-width='0.5'/%3E%3Cline x1='50' y1='50' x2='100' y2='100' stroke='%23d4a017' stroke-width='0.5'/%3E%3Cline x1='50' y1='50' x2='50' y2='100' stroke='%23d4a017' stroke-width='0.5'/%3E%3Cline x1='50' y1='50' x2='0' y2='100' stroke='%23d4a017' stroke-width='0.5'/%3E%3Cline x1='50' y1='50' x2='0' y2='50' stroke='%23d4a017' stroke-width='0.5'/%3E%3Cline x1='50' y1='50' x2='0' y2='0' stroke='%23d4a017' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: "100px 100px",
          }}
        />
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-10 z-0"
          style={{
            background: "radial-gradient(circle, #d4a017 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-8 z-0"
          style={{
            background: "radial-gradient(circle, #8b0000 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute top-0 left-0 right-0 h-px z-0"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(212,160,23,0.4), transparent)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-px z-0"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(212,160,23,0.4), transparent)",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-16"
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <p className="text-sm font-medium text-[#d4a017] tracking-widest uppercase mb-3">
              Testimonials
            </p>
            <h2
              className="text-4xl md:text-5xl font-light text-white"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Success <span className="text-[#f0c040] italic">Stories</span>
            </h2>
          </motion.div>

          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000 }}
            className="pb-16"
          >
            {[
              {
                name: "Rahul & Priya",
                loc: "Mumbai",
                text: "Found my perfect match within weeks. The biodata format was elegant and truly appreciated by both families.",
              },
              {
                name: "Amit & Sneha",
                loc: "Delhi",
                text: "The premium templates made a huge difference. Very professional and easy to share securely on WhatsApp.",
              },
              {
                name: "Vikram & Anjali",
                loc: "Bangalore",
                text: "Beautiful UI and seamless experience. We love how our biodata turned out. Highly recommended platform!",
              },
              {
                name: "Karan & Riya",
                loc: "Pune",
                text: "Secure, private, and exceptionally well-designed. The best matrimony biodata maker out there by far.",
              },
            ].map((review, idx) => (
              <SwiperSlide key={idx}>
                <div className="bg-[#2a1e08] border border-[#d4a017]/30 hover:border-[#f0c040]/60 transition-colors p-8 rounded-3xl h-full flex flex-col shadow-lg relative group overflow-hidden">
                  <Quote className="absolute top-6 right-6 w-16 h-16 text-[#d4a017]/10 group-hover:scale-110 group-hover:text-[#d4a017]/20 transition-all" />
                  <div className="flex text-[#f0c040] mb-6 relative z-10">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-current drop-shadow-sm"
                      />
                    ))}
                  </div>
                  <p className="text-[#f5ead0] italic mb-8 flex-grow text-lg relative z-10">
                    "{review.text}"
                  </p>
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-14 h-14 rounded-full bg-[#1a1000] border-2 border-[#d4a017] flex items-center justify-center font-bold text-[#f0c040] text-xl shadow-md">
                      {review.name[0]}
                    </div>
                    <div>
                      <h3 className="text-white font-medium text-lg">
                        {review.name}
                      </h3>
                      <p className="text-sm text-[#a89060]">{review.loc}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* ================= SECTION 5: GALLERY SECTION ================= */}
      <section className="py-[56px] lg:py-[96px] relative overflow-hidden">
        {/* ── Rich Background ── */}
        <div className="absolute inset-0 z-0">
          {/* Deep layered gradient */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(160deg, #0d0500 0%, #1a0800 30%, #0f0300 60%, #1f0e00 100%)",
            }}
          />
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `linear-gradient(rgba(212,160,23,0.8) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(212,160,23,0.8) 1px, transparent 1px)`,
              backgroundSize: "48px 48px",
            }}
          />
          {/* Radial glow orbs */}
          <div
            className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full opacity-10"
            style={{
              background:
                "radial-gradient(circle, #d4a017 0%, transparent 70%)",
              transform: "translate(-50%,-50%)",
            }}
          />
          <div
            className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full opacity-8"
            style={{
              background:
                "radial-gradient(circle, #8b0000 0%, transparent 70%)",
              transform: "translate(50%,50%)",
            }}
          />
          <div
            className="absolute top-1/2 right-0 w-[300px] h-[600px] rounded-full opacity-6"
            style={{
              background:
                "radial-gradient(circle, #d4a017 0%, transparent 70%)",
            }}
          />
          {/* Top & bottom gold line */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(212,160,23,0.5), transparent)",
            }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(212,160,23,0.5), transparent)",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* ── Section Header ── */}
          <motion.div
            className="text-center mb-14"
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <div
                className="h-px w-10"
                style={{
                  background: "linear-gradient(to right, transparent, #d4a017)",
                }}
              />
              <span
                className="text-xs font-semibold tracking-[4px] uppercase"
                style={{ color: "#d4a017" }}
              >
                Inspiration
              </span>
              <div
                className="h-px w-10"
                style={{
                  background: "linear-gradient(to left, transparent, #d4a017)",
                }}
              />
            </div>
            <h2
              className="text-4xl md:text-6xl font-light text-white mb-4"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Wedding{" "}
              <span className="italic font-medium" style={{ color: "#f0c040" }}>
                Gallery
              </span>
            </h2>
            <p className="text-sm text-[#a89060] max-w-md mx-auto leading-relaxed">
              Curated moments of love, tradition & celebration from real Indian
              weddings
            </p>
            {/* Category pills */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {["All", "Ceremony", "Portraits", "Mehendi", "Reception"].map(
                (cat, i) => (
                  <button
                    key={cat}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${
                      i === 0
                        ? "border-[#d4a017] text-[#1a0800] shadow-[0_0_12px_rgba(212,160,23,0.4)]"
                        : "border-[#d4a017]/30 text-[#a89060] hover:border-[#d4a017]/70 hover:text-[#f0c040]"
                    }`}
                    style={
                      i === 0
                        ? {
                            background:
                              "linear-gradient(135deg, #d4a017, #f0c040)",
                          }
                        : { background: "rgba(212,160,23,0.05)" }
                    }
                  >
                    {cat}
                  </button>
                ),
              )}
            </div>
          </motion.div>

          {/* ── Pinterest Masonry Grid ── */}
          <div
            className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4"
            style={{ columnFill: "balance" }}
          >
            {[
              {
                ...HERO_MEDIA[0],
                tag: "Ceremony",
                likes: 284,
                photographer: "Ravi Studios",
              },
              {
                ...HERO_MEDIA[1],
                tag: "Portraits",
                likes: 431,
                photographer: "Akash Lens",
              },
              {
                ...HERO_MEDIA[2],
                tag: "Reception",
                likes: 197,
                photographer: "Mehta Clicks",
              },
              {
                ...HERO_MEDIA[3],
                tag: "Mehendi",
                likes: 312,
                photographer: "Golden Hour",
              },
              {
                ...HERO_MEDIA[4],
                tag: "Ceremony",
                likes: 528,
                photographer: "Ravi Studios",
              },
              {
                ...HERO_MEDIA[5],
                tag: "Portraits",
                likes: 164,
                photographer: "Akash Lens",
              },
              {
                ...HERO_MEDIA[6],
                tag: "Reception",
                likes: 391,
                photographer: "Mehta Clicks",
              },
              {
                ...HERO_MEDIA[7],
                tag: "Mehendi",
                likes: 247,
                photographer: "Golden Hour",
              },
              {
                ...HERO_MEDIA[8],
                tag: "Ceremony",
                likes: 183,
                photographer: "Ravi Studios",
              },
              {
                ...HERO_MEDIA[9],
                tag: "Portraits",
                likes: 462,
                photographer: "Akash Lens",
              },
            ]
              .slice(0, galleryLimit)
              .map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeUpVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  custom={idx * 0.05}
                  className="relative overflow-hidden rounded-2xl group break-inside-avoid mb-4 cursor-pointer"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.25 }}
                  style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}
                >
                  {/* Image */}
                  <img
                    src={item.src}
                    alt={`Indian ${item.tag.toLowerCase()} wedding photo — Aguaa matrimonial gallery`}
                    loading="lazy"
                    decoding="async"
                    width="400"
                    height="500"
                    className="w-full h-auto object-cover block transition-transform duration-700 group-hover:scale-[1.06]"
                  />

                  {/* Always-visible tag badge (top-left) */}
                  <div className="absolute top-3 left-3 z-10">
                    <span
                      className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md"
                      style={{
                        background: "rgba(212,160,23,0.85)",
                        color: "#1a0800",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                      }}
                    >
                      {item.tag}
                    </span>
                  </div>

                  {/* Save / Pin button (top-right) — Pinterest style */}
                  <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                    <button
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md transition-all hover:scale-105"
                      style={{
                        background: "linear-gradient(135deg, #d4a017, #f0c040)",
                        color: "#1a0800",
                        boxShadow: "0 4px 12px rgba(212,160,23,0.5)",
                      }}
                    >
                      <Heart className="w-3 h-3 fill-current" />
                      Save
                    </button>
                  </div>

                  {/* Bottom overlay — fades in on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-400"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(10,4,0,0.92) 0%, rgba(10,4,0,0.4) 40%, transparent 70%)",
                    }}
                  ></div>

                  {/* Bottom info bar */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                    <div className="flex items-center justify-between">
                      <div>
                        <p
                          className="text-white text-xs font-semibold truncate"
                          style={{
                            fontFamily: "Cormorant Garamond, serif",
                            fontSize: "13px",
                          }}
                        >
                          Beautiful Moments
                        </p>
                        <p
                          className="text-[10px] mt-0.5"
                          style={{ color: "#a89060" }}
                        >
                          📷 {item.photographer}
                        </p>
                      </div>
                      <div
                        className="flex items-center gap-1 text-[10px]"
                        style={{ color: "#f0c040" }}
                      >
                        <Heart className="w-3 h-3 fill-current" />
                        <span className="font-semibold">{item.likes}</span>
                      </div>
                    </div>
                  </div>

                  {/* Subtle gold border on hover */}
                  <div className="absolute inset-0 rounded-2xl pointer-events-none border border-transparent group-hover:border-[#d4a017]/50 transition-colors duration-400" />
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      {/* ================= GEO: AI SEARCH CONTENT BLOCK ================= */}
      {/* This section is optimized for ChatGPT, Gemini, Perplexity, Google AI Overview */}
      <section
        className="py-12 relative overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #080206 0%, #0c0208 100%)",
        }}
        aria-label="About Aguaa — AI-optimized content"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            {/* Block 1: What is Aguaa? */}
            <motion.div
              className="rounded-2xl p-8 border border-[#d4a017]/20"
              style={{ background: "rgba(212,160,23,0.04)" }}
              variants={fadeUpVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <h2
                className="text-2xl font-semibold text-white mb-3"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                What is Aguaa? / Aguaa Kya Hai?
              </h2>
              <p className="text-[#a89060] leading-relaxed text-sm mb-3">
                <strong className="text-[#f0c040]">Aguaa</strong> is a
                traditional word from Bihar and UP culture meaning a trusted{" "}
                <em>marriage mediator</em> — someone who connects the
                bride&apos;s and groom&apos;s families for a successful marriage
                (shaadi).
              </p>
              <p className="text-[#a89060] leading-relaxed text-sm">
                <strong className="text-[#f0c040]">Aguaa.in</strong> is
                India&apos;s digital Aguaa — an online matrimonial biodata
                platform built specifically for families in{" "}
                <strong>Bihar, UP, and Jharkhand</strong>. Create beautiful
                marriage biodatas, explore profiles, and find the perfect
                rishta.
              </p>
            </motion.div>

            {/* Block 2: How to make shaadi biodata */}
            <motion.div
              className="rounded-2xl p-8 border border-[#d4a017]/20"
              style={{ background: "rgba(212,160,23,0.04)" }}
              variants={fadeUpVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              custom={0.15}
            >
              <h2
                className="text-2xl font-semibold text-white mb-3"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Shaadi Biodata Kaise Banaye?
              </h2>
              <p className="text-[#a89060] leading-relaxed text-sm mb-3">
                Aguaa par{" "}
                <strong className="text-[#f0c040]">
                  marriage biodata banana
                </strong>{" "}
                bilkul aasaan hai. Sirf 3 simple steps mein:
              </p>
              <ol className="space-y-2">
                {[
                  {
                    step: "1",
                    text: "Free account banaye aur personal details bhare",
                  },
                  {
                    step: "2",
                    text: "Photo upload kare aur premium template choose kare",
                  },
                  {
                    step: "3",
                    text: "PDF download kare ya WhatsApp par share kare",
                  },
                ].map(({ step, text }) => (
                  <li
                    key={step}
                    className="flex items-start gap-3 text-sm text-[#a89060]"
                  >
                    <span
                      className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-[#0f0a00]"
                      style={{
                        background: "linear-gradient(135deg, #d4a017, #f0c040)",
                      }}
                    >
                      {step}
                    </span>
                    {text}
                  </li>
                ))}
              </ol>
            </motion.div>
          </div>

          {/* Trust + Keywords Row */}
          <motion.div
            className="mt-8 text-center"
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <p className="text-xs text-[#a89060] leading-relaxed max-w-3xl mx-auto">
              Aguaa is the best matrimonial biodata maker for{" "}
              <a href="/explore" className="text-[#d4a017] hover:underline">
                Bihar matrimonial
              </a>
              ,{" "}
              <a href="/explore" className="text-[#d4a017] hover:underline">
                UP matrimonial
              </a>
              ,{" "}
              <a href="/explore" className="text-[#d4a017] hover:underline">
                Jharkhand matrimonial
              </a>
              , shaadi biodata maker, marriage profile creator, rishta karane
              wala platform, dulha dulhan biodata, विवाह बायोडाटा, शादी के लिए
              बायोडाटा।
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================= SECTION 7: FAQ SECTION ================= */}
      <section className="py-[56px] lg:py-[96px] relative overflow-hidden">
        {/* BG: Vintage paper texture — concentric arcs + aged sepia */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "linear-gradient(180deg, #080308 0%, #0c0508 50%, #080206 100%)",
          }}
        />
        <div
          className="absolute inset-0 z-0 opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Ccircle cx='100' cy='100' r='30' fill='none' stroke='%23d4a017' stroke-width='0.6'/%3E%3Ccircle cx='100' cy='100' r='60' fill='none' stroke='%23d4a017' stroke-width='0.4'/%3E%3Ccircle cx='100' cy='100' r='90' fill='none' stroke='%23d4a017' stroke-width='0.3'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
          }}
        />
        <div
          className="absolute top-0 left-0 w-[500px] h-[500px] opacity-8 z-0"
          style={{
            background: "radial-gradient(circle, #4a1500 0%, transparent 70%)",
            transform: "translate(-40%,-40%)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-[500px] h-[500px] opacity-8 z-0"
          style={{
            background: "radial-gradient(circle, #4a1500 0%, transparent 70%)",
            transform: "translate(40%,40%)",
          }}
        />
        <div
          className="absolute inset-0 z-0 opacity-10"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(212,160,23,0.08) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-0 left-0 right-0 h-px z-0"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(212,160,23,0.3), transparent)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-px z-0"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(212,160,23,0.3), transparent)",
          }}
        />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-16"
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <p className="text-sm font-medium text-[#d4a017] tracking-widest uppercase mb-3">
              Got Questions?
            </p>
            <h2
              className="text-4xl md:text-5xl font-light text-white mb-4"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Shaadi Biodata —{" "}
              <span className="text-[#f0c040] italic">Sawal Jawab</span>
            </h2>
            <p className="text-[#c8b080] text-sm max-w-xl mx-auto">
              Marriage biodata ke baare mein aapke saare sawalo ke jawab yahan
              milenge.
            </p>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                q: "What is Aguaa? / Aguaa kya hai?",
                a: "Aguaa India ka trusted online marriage biodata platform hai. 'Aguaa' shabd Bihar aur UP ki shaadi ki parampara se aaya hai — jiska matlab hai ek trusted marriage mediator jo dulha aur dulhan ke parivaron ko milata hai. Aguaa.in yahi kaam digital tarike se karta hai.",
              },
              {
                q: "How to create a marriage biodata? / Biodata kaise banaye?",
                a: "Aguaa par biodata banana bahut aasaan hai: 1) Free mein sign up karo, 2) Apni personal, family aur educational details bharo, 3) Photo upload karo, 4) Premium template choose karo, 5) PDF download karo ya WhatsApp par share karo. Poora process sirf 10 minutes leta hai!",
              },
              {
                q: "Is Aguaa free to use? / Kya yeh free hai?",
                a: "Haan! Aguaa par basic marriage biodata banana, download karna aur share karna bilkul free hai. Hum premium plans bhi offer karte hain jisme exclusive royal templates, advanced privacy controls, aur profile analytics milte hain.",
              },
              {
                q: "Shaadi ke liye biodata mein kya likhna chahiye?",
                a: "Ek acche shaadi biodata mein: Personal Info (naam, umar, height), Education & Occupation, Family Details (mata-pita, bhai-behen), Religious/Caste Info, Photo, aur Contact Details honi chahiye. Aguaa ka platform in sab cheezein automatically organize karta hai.",
              },
              {
                q: "Can I download my biodata as PDF?",
                a: "Absolutely! Once created, you can download your biodata in high-resolution PDF format with one click — perfect for WhatsApp sharing or printing. Premium users get additional PDF customization options.",
              },
              {
                q: "Is my profile secure and private?",
                a: "Your privacy is our top priority. Your data is protected with bank-grade encryption. You control visibility — keep it private (share only via secure link) or make it public. We never share your data with third parties.",
              },
              {
                q: "Bihar, UP, Jharkhand mein Aguaa kaise kaam karta hai?",
                a: "Aguaa specially Bihar, UP aur Jharkhand ke parivaron ke liye banaya gaya hai. Aap apna biodata Hindi ya English mein bana sakte hain, apne region ke hisaab se customize kar sakte hain, aur local families se connect kar sakte hain.",
              },
              {
                q: "Can I edit my biodata after creating it?",
                a: "Yes, log into your Aguaa dashboard anytime to update details, change photos, or switch templates. Changes reflect immediately and your shareable link stays the same.",
              },
              {
                q: "Does Aguaa offer customer support?",
                a: "Yes! Our dedicated support team is available via WhatsApp and email. We help you every step of the matrimonial journey — from biodata creation to finding the perfect rishta.",
              },
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                variants={fadeUpVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                custom={idx * 0.04}
                className={`bg-[#1f1500] border-l-4 border-[#d4a017] rounded-r-xl rounded-bl-xl border-y border-r border-[#d4a017]/20 transition-all duration-300 ${
                  activeFaq === idx
                    ? "shadow-md shadow-[#d4a017]/10"
                    : "hover:bg-[#2a1e08]"
                }`}
              >
                <button
                  type="button"
                  id={`faq-btn-${idx}`}
                  aria-expanded={activeFaq === idx}
                  aria-controls={`faq-answer-${idx}`}
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full text-left flex items-center justify-between p-5 font-medium text-[#f5ead0] text-[15px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a017] focus-visible:ring-inset rounded-r-xl cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span
                    className={`transition-transform duration-300 ml-4 flex-shrink-0 ${
                      activeFaq === idx
                        ? "rotate-180 text-[#f0c040]"
                        : "text-[#c8b080]"
                    }`}
                  >
                    <ChevronDown className="w-5 h-5" aria-hidden="true" />
                  </span>
                </button>
                <div
                  id={`faq-answer-${idx}`}
                  role="region"
                  aria-labelledby={`faq-btn-${idx}`}
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    activeFaq === idx
                      ? "max-h-48 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="p-5 pt-0 text-[#c8b080] leading-relaxed text-[15px]">
                    <div className="w-full h-px bg-[#d4a017]/10 mb-4" />
                    {faq.a}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SECTION 8: FINAL CTA ================= */}
      <section className="py-[56px] lg:py-[96px] relative overflow-hidden">
        {/* BG: Aurora / colour-shift gradient mesh */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "linear-gradient(135deg, #0d0500 0%, #1a0800 25%, #0a0010 50%, #1a0800 75%, #0d0500 100%)",
          }}
        />
        <div
          className="absolute inset-0 z-0 opacity-20"
          style={{
            background:
              "radial-gradient(ellipse at 20% 50%, rgba(212,160,23,0.3) 0%, transparent 50%)",
          }}
        />
        <div
          className="absolute inset-0 z-0 opacity-15"
          style={{
            background:
              "radial-gradient(ellipse at 80% 50%, rgba(139,0,0,0.4) 0%, transparent 50%)",
          }}
        />
        <div
          className="absolute inset-0 z-0 opacity-10"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(180,100,0,0.3) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0 z-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(60deg, #d4a017 0px, #d4a017 1px, transparent 1px, transparent 50px)",
          }}
        />
        <div
          className="absolute top-0 left-0 right-0 h-px z-0"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(212,160,23,0.5), transparent)",
          }}
        />

        <motion.div
          className="max-w-5xl mx-auto px-4 relative z-10 text-center bg-[#1f1500]/60 backdrop-blur-xl border border-[#d4a017]/30 rounded-[3rem] py-20 shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-gradient-to-br from-[#d4a017] to-[#f0c040] rounded-full blur-2xl opacity-30" />
          <Sparkles className="w-12 h-12 text-[#f0c040] mx-auto mb-6 relative z-10" />

          <h2
            className="text-4xl md:text-6xl font-light text-white mb-6 leading-tight"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Start Creating Your <br />
            <span className="text-[#f0c040] italic font-medium">
              Premium Biodata
            </span>{" "}
            Today
          </h2>
          <p className="text-xl text-[#a89060] mb-10 max-w-2xl mx-auto font-light">
            Join thousands of families who found their perfect match using our
            beautiful, modern matrimony platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={currentUser ? "/create" : "/signup"}>
              <Button
                variant="gold"
                size="xl"
                className="px-2 py-2 md:px-3 md:py-2 lg:px-3 lg:py-2 sm:w-auto text-lg shadow-[0_0_30px_rgba(212,160,23,0.3)] hover:shadow-[0_0_40px_rgba(212,160,23,0.5)] transition-all scale-105 hover:scale-110"
              >
                Create Now
              </Button>
            </Link>
            <Link to="/explore">
              <Button
                variant="outline"
                size="xl"
                className="px-2 py-2 md:px-3 md:py-2 lg:px-3 lg:py-2 sm:w-auto text-lg border-[#d4a017]/50 text-[#f0c040] hover:bg-[#2a1e08]"
              >
                Explore Templates
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ================= SECTION 8: SEO CONTENT & BIODATA CATEGORIES ================= */}
      <section className="py-16 bg-[#120a00] border-t border-[#d4a017]/20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-[#d4a017] text-xs uppercase tracking-widest font-semibold border border-[#d4a017]/30 px-3 py-1 rounded-full bg-[#1a0e00]">
              Matrimonial Resources &amp; Guides
            </span>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-light text-white mt-4 mb-4"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Popular Marriage Biodata{" "}
              <span className="text-[#f0c040] italic">
                Formats &amp; Categories
              </span>
            </h2>
            <p className="text-[#a89060] text-base leading-relaxed">
              Explore specialized biodata templates, regional matchmaking
              traditions, and downloadable formats designed for Indian families
              across communities.
            </p>
          </div>

          {/* 5 Landing Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {/* Card 1: Hindi Biodata */}
            <Link
              to="/hindi-biodata-maker"
              className="group bg-[#1a1000] border border-[#d4a017]/25 rounded-2xl p-6 hover:border-[#f0c040] transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(212,160,23,0.15)] flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#d4a017]/15 flex items-center justify-center text-[#f0c040] mb-4 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3
                  className="text-xl font-medium text-white mb-2 group-hover:text-[#f0c040] transition-colors"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  Hindi Biodata Maker (हिंदी)
                </h3>
                <p className="text-sm text-[#a89060] leading-relaxed mb-4">
                  शादी के लिए हिंदी में सुंदर बायोडाटा बनाएं। कुल, गोत्र,
                  ननिहाल, और मांगलिक विवरण से सुसज्जित पारंपरिक देवनागरी
                  प्रारूप।
                </p>
              </div>
              <span className="text-xs text-[#d4af37] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                हिंदी बायोडाटा बनाएं <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            {/* Card 2: Biodata Format for Boy & Girl */}
            <Link
              to="/biodata-format-for-marriage"
              className="group bg-[#1a1000] border border-[#d4a017]/25 rounded-2xl p-6 hover:border-[#f0c040] transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(212,160,23,0.15)] flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#d4a017]/15 flex items-center justify-center text-[#f0c040] mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <h3
                  className="text-xl font-medium text-white mb-2 group-hover:text-[#f0c040] transition-colors"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  Biodata Format for Boy &amp; Girl
                </h3>
                <p className="text-sm text-[#a89060] leading-relaxed mb-4">
                  Tailored marriage biodata formats emphasizing career and
                  education for grooms, and grace and family background for
                  brides.
                </p>
              </div>
              <span className="text-xs text-[#d4af37] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Explore Sample Formats <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            {/* Card 3: Free PDF Download */}
            <Link
              to="/biodata-pdf-download"
              className="group bg-[#1a1000] border border-[#d4a017]/25 rounded-2xl p-6 hover:border-[#f0c040] transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(212,160,23,0.15)] flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#d4a017]/15 flex items-center justify-center text-[#f0c040] mb-4 group-hover:scale-110 transition-transform">
                  <Download className="w-6 h-6" />
                </div>
                <h3
                  className="text-xl font-medium text-white mb-2 group-hover:text-[#f0c040] transition-colors"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  Free Biodata PDF Download
                </h3>
                <p className="text-sm text-[#a89060] leading-relaxed mb-4">
                  High-definition A4 PDF downloads without watermarks. One-click
                  instant sharing on WhatsApp and print-ready quality.
                </p>
              </div>
              <span className="text-xs text-[#d4af37] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Download PDF Free <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            {/* Card 4: Muslim Marriage Biodata */}
            <Link
              to="/muslim-marriage-biodata"
              className="group bg-[#1a1000] border border-[#d4a017]/25 rounded-2xl p-6 hover:border-[#f0c040] transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(212,160,23,0.15)] flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#d4a017]/15 flex items-center justify-center text-[#f0c040] mb-4 group-hover:scale-110 transition-transform">
                  <Heart className="w-6 h-6" />
                </div>
                <h3
                  className="text-xl font-medium text-white mb-2 group-hover:text-[#f0c040] transition-colors"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  Muslim Marriage Biodata (Nikah)
                </h3>
                <p className="text-sm text-[#a89060] leading-relaxed mb-4">
                  Islamic matrimonial biodatas with Bismillah calligraphy,
                  Maslak, religious practice, and family background details.
                </p>
              </div>
              <span className="text-xs text-[#d4af37] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Create Nikah Biodata <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            {/* Card 5: Bihar & UP Shaadi Biodata */}
            <Link
              to="/bihar-up-shaadi-biodata"
              className="group bg-[#1a1000] border border-[#d4a017]/25 rounded-2xl p-6 hover:border-[#f0c040] transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(212,160,23,0.15)] flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#d4a017]/15 flex items-center justify-center text-[#f0c040] mb-4 group-hover:scale-110 transition-transform">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3
                  className="text-xl font-medium text-white mb-2 group-hover:text-[#f0c040] transition-colors"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  Bihar, UP &amp; Jharkhand Shaadi
                </h3>
                <p className="text-sm text-[#a89060] leading-relaxed mb-4">
                  Honoring the cultural mediator "Aguaa" with Gotra, Nanihal,
                  and ancestral village roots across Patna, Lucknow, and Ranchi.
                </p>
              </div>
              <span className="text-xs text-[#d4af37] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Regional Matchmaking <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            {/* Card 6: Gallery */}
            <Link
              to="/gallery"
              className="group bg-[#1a1000] border border-[#d4a017]/25 rounded-2xl p-6 hover:border-[#f0c040] transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(212,160,23,0.15)] flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#d4a017]/15 flex items-center justify-center text-[#f0c040] mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <h3
                  className="text-xl font-medium text-white mb-2 group-hover:text-[#f0c040] transition-colors"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  Royal Biodata Template Gallery
                </h3>
                <p className="text-sm text-[#a89060] leading-relaxed mb-4">
                  Browse Ganesh Royal, Om Classic, Royal Maharaja, and Modern
                  Minimal designs created by professional typographers.
                </p>
              </div>
              <span className="text-xs text-[#d4af37] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                View All Designs <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>

          {/* Deep Content Section (600-800+ Words for Organic Google Rankings) */}
          <div className="bg-[#180e00]/80 border border-[#d4a017]/25 rounded-3xl p-8 sm:p-12 mb-12">
            <h2
              className="text-2xl sm:text-3xl font-light text-white mb-6"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              What is a Marriage Biodata &amp; Why Does Quality Matter? (विवाह
              बायोडाटा क्या है?)
            </h2>
            <p className="text-[#d8c8b0] text-sm sm:text-base leading-relaxed mb-6 font-light">
              In Indian matrimonial culture, a <strong>marriage biodata</strong>{" "}
              is far more than a resume; it is the sacred initial introduction
              between two families. An arranged marriage proposal begins when
              parents or mediators exchange this document. A well-crafted
              matrimonial profile highlights an individual’s personal virtues,
              career accomplishments, educational pedigree, ancestral heritage,
              and astrological compatibility.
            </p>
            <p className="text-[#d8c8b0] text-sm sm:text-base leading-relaxed mb-8 font-light">
              A sloppy, poorly formatted Word document or plain text WhatsApp
              message can create an unfavorable first impression, whereas a
              beautifully designed, dignified biodata conveys seriousness,
              family prestige, and pride in one’s heritage.
            </p>

            <h3
              className="text-xl sm:text-2xl font-light text-[#f0c040] mb-4"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              How to Create a Shaadi Biodata Online in 5 Minutes
            </h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8 text-sm">
              <div className="border border-[#d4a017]/20 p-4 rounded-xl bg-[#0f0a00]/50">
                <span className="text-[#f0c040] font-bold text-lg block mb-1">
                  01. Details
                </span>
                <p className="text-[#c8b898]">
                  Fill in personal details, educational qualifications, job
                  title, and annual income.
                </p>
              </div>
              <div className="border border-[#d4a017]/20 p-4 rounded-xl bg-[#0f0a00]/50">
                <span className="text-[#f0c040] font-bold text-lg block mb-1">
                  02. Family &amp; Gotra
                </span>
                <p className="text-[#c8b898]">
                  Add parents' profession, sibling status, maternal uncle
                  (ननिहाल), and Gotra/Kundali info.
                </p>
              </div>
              <div className="border border-[#d4a017]/20 p-4 rounded-xl bg-[#0f0a00]/50">
                <span className="text-[#f0c040] font-bold text-lg block mb-1">
                  03. Royal Theme
                </span>
                <p className="text-[#c8b898]">
                  Choose from auspicious Ganesh, Om, Islamic Nikah, or
                  contemporary minimalist layouts.
                </p>
              </div>
              <div className="border border-[#d4a017]/20 p-4 rounded-xl bg-[#0f0a00]/50">
                <span className="text-[#f0c040] font-bold text-lg block mb-1">
                  04. Instant PDF
                </span>
                <p className="text-[#c8b898]">
                  Download watermark-free A4 PDF in 300 DPI print quality and
                  share on WhatsApp.
                </p>
              </div>
            </div>

            <h3
              className="text-xl sm:text-2xl font-light text-[#f0c040] mb-4"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Why North Indian Families in Bihar, UP &amp; Jharkhand Trust Aguaa
            </h3>
            <p className="text-[#d8c8b0] text-sm sm:text-base leading-relaxed font-light">
              Traditional dating and commercial matrimony portals often
              prioritize superficial swiping over family reputation. Aguaa
              honors the time-tested institution of the <strong>Aguaa</strong>
              —the trusted neighborhood mediator. Our platform empowers families
              with bank-grade privacy controls, phone number masking, verified
              profile badges, and high-fidelity PDF downloads. Whether you
              reside in Patna, Lucknow, Varanasi, Ranchi, or Delhi NCR, Aguaa
              helps you present your marriage biodata with honor and confidence.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
