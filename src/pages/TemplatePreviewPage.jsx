import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Download,
  Check,
  AlertCircle,
  Palette,
  Eye,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';
import { apiGetBiodataById, apiUpdateBiodata } from '../api/client';
import {
  OFFICIAL_TEMPLATES,
  TEMPLATE_COMPONENTS,
  resolveTemplateId,
  getTemplateById,
  getAdjacentTemplate,
} from '../constants/templates';
import Button from '../components/ui/Button';

/* ─── PDF Loading Overlay ────────────────────────────────────── */
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
            <p
              className="text-yellow-500 text-lg font-light tracking-widest uppercase"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Preparing High-Resolution PDF
            </p>
            <p className="text-gray-400 text-xs tracking-wider">{stage || 'Formatting print pages…'}</p>
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

/* ─── Skeleton Loader for Preview Canvas ──────────────────────── */
const TemplateCanvasSkeleton = () => (
  <div className="w-[794px] h-[1123px] bg-[#140000]/60 border border-yellow-900/20 rounded-md flex flex-col items-center justify-center gap-4 animate-pulse">
    <div className="w-12 h-12 rounded-full border-2 border-yellow-700/40 border-t-yellow-500 animate-spin" />
    <span className="text-xs text-yellow-600/70 uppercase tracking-widest font-medium">
      Rendering Template…
    </span>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   TEMPLATE PREVIEW PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════ */
const TemplatePreviewPage = () => {
  const { biodataId, templateId: urlTemplateId } = useParams();
  const navigate = useNavigate();
  const { currentUser: user, loading: authLoading } = useAuth();
  const toast = useToast();

  const [biodata, setBiodata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savedTemplateId, setSavedTemplateId] = useState('default');
  const [selectedTemplateId, setSelectedTemplateId] = useState('default');
  const [isSaving, setIsSaving] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfStage, setPdfStage] = useState('');

  // Scaling state for accurate responsive A4 display
  const previewViewportRef = useRef(null);
  const templateContentRef = useRef(null);
  const [previewScale, setPreviewScale] = useState(1);
  const [contentHeight, setContentHeight] = useState(1123);

  // ── Load Biodata ──
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      if (!biodataId) return;
      setLoading(true);
      setError('');
      try {
        const data = await apiGetBiodataById(biodataId);
        if (!isMounted) return;
        if (!data) {
          setError('Biodata profile not found.');
          return;
        }

        // Ownership verification: user must own this biodata
        if (user && data.userId) {
          const ownerId = String(data.userId._id || data.userId);
          const currentUserId = String(user._id || user.id);
          if (ownerId !== currentUserId && user?.role !== 'admin') {
            setError('You do not have permission to customize templates for this biodata.');
            return;
          }
        }

        setBiodata(data);
        const resolvedSaved = resolveTemplateId(data.templateId);
        setSavedTemplateId(resolvedSaved);

        // If URL specifies a templateId, use it; otherwise use saved template
        const resolvedInitial = urlTemplateId
          ? resolveTemplateId(urlTemplateId)
          : resolvedSaved;
        setSelectedTemplateId(resolvedInitial);
      } catch (err) {
        if (!isMounted) return;
        const msg = err?.data?.message || err?.message || 'Failed to load biodata profile.';
        setError(msg);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (!authLoading) {
      loadData();
    }
    return () => { isMounted = false; };
  }, [biodataId, urlTemplateId, user, authLoading]);

  // ── Dynamic Responsive Scale Calculation ──
  useEffect(() => {
    const handleResize = () => {
      if (!previewViewportRef.current) return;
      const availableWidth = previewViewportRef.current.clientWidth - 32; // 16px padding on each side
      const a4Width = 794; // standard 210mm @ 96 DPI
      const scale = Math.min(1.0, Math.max(0.32, availableWidth / a4Width));
      setPreviewScale(scale);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ── Content Height Observer ──
  useEffect(() => {
    if (!templateContentRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.height > 0) {
          setContentHeight(entry.contentRect.height);
        }
      }
    });
    observer.observe(templateContentRef.current);
    return () => observer.disconnect();
  }, [selectedTemplateId, biodata]);

  // Active template metadata
  const activeTemplate = getTemplateById(selectedTemplateId);
  const ActiveTemplateComponent =
    TEMPLATE_COMPONENTS[activeTemplate.id] || TEMPLATE_COMPONENTS['default'];

  const isCurrentActiveSaved = savedTemplateId === selectedTemplateId;

  // ── Template Switch Handler ──
  const handleSelectTemplate = useCallback(
    (newTemplateId) => {
      const resolved = resolveTemplateId(newTemplateId);
      if (resolved === selectedTemplateId) return;
      setSelectedTemplateId(resolved);
      // Update URL safely with replace so navigation history remains clean
      navigate(`/preview/${biodataId}/${resolved}`, { replace: true });
    },
    [biodataId, selectedTemplateId, navigate]
  );

  // ── Previous / Next Navigation with wrap-around ──
  const handlePrevTemplate = useCallback(() => {
    const prev = getAdjacentTemplate(selectedTemplateId, 'prev');
    handleSelectTemplate(prev.id);
  }, [selectedTemplateId, handleSelectTemplate]);

  const handleNextTemplate = useCallback(() => {
    const next = getAdjacentTemplate(selectedTemplateId, 'next');
    handleSelectTemplate(next.id);
  }, [selectedTemplateId, handleSelectTemplate]);

  // ── Set as Active Template ──
  const handleSetActiveTemplate = async () => {
    if (isCurrentActiveSaved || isSaving) return;
    setIsSaving(true);
    try {
      await apiUpdateBiodata(biodataId, { templateId: selectedTemplateId });
      setSavedTemplateId(selectedTemplateId);
      setBiodata((prev) => (prev ? { ...prev, templateId: selectedTemplateId } : prev));
      if (toast?.success) {
        toast.success(`Design set to "${activeTemplate.name}"!`);
      }
    } catch (err) {
      const msg = err?.data?.message || err?.message || 'Failed to update template.';
      if (toast?.error) {
        toast.error(msg);
      } else {
        alert(msg);
      }
    } finally {
      setIsSaving(false);
    }
  };

  // ── PDF Print / Download Integration ──
  const handleDownloadPDF = useCallback(async () => {
    try {
      setPdfLoading(true);
      setPdfStage(`Preparing ${activeTemplate.name} high-resolution PDF…`);
      // Buffer to ensure DOM paint and webfont caching are complete before print dialog
      await new Promise((resolve) => setTimeout(resolve, 250));
      setPdfLoading(false);
      window.print();
    } catch {
      setPdfLoading(false);
      window.print();
    }
  }, [activeTemplate.name]);

  // ── Keyboard Arrow Navigation ──
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft') handlePrevTemplate();
      if (e.key === 'ArrowRight') handleNextTemplate();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrevTemplate, handleNextTemplate]);

  /* ─── Loading State ─────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#190604] flex flex-col items-center justify-center p-6 pt-14 text-center">
        <div className="w-12 h-12 border-4 border-yellow-600/30 border-t-yellow-500 rounded-full animate-spin mb-4" />
        <h2 className="text-xl font-light text-white font-serif tracking-wider">
          Loading Template Preview…
        </h2>
        <p className="text-xs text-gray-400 mt-1">Fetching candidate record & templates</p>
      </div>
    );
  }

  /* ─── Error State ──────────────────────────────────────────── */
  if (error || !biodata) {
    return (
      <div className="min-h-screen bg-[#190604] flex flex-col items-center justify-center p-6 pt-14 text-center">
        <div className="max-w-md p-8 rounded-2xl bg-[#240a07] border border-yellow-900/35 shadow-2xl space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-2xl text-white font-serif font-light">Cannot Access Preview</h2>
          <p className="text-sm text-gray-400 leading-relaxed">{error || 'Biodata profile not found.'}</p>
          <div className="pt-2">
            <Link to="/dashboard">
              <Button variant="gold" size="sm">
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Back to My Biodatas
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const candidateName = biodata?.personalInfo?.fullName || 'Candidate Biodata';

  return (
    <div className="min-h-screen text-white flex flex-col relative overflow-x-clip pt-14 bg-[#190604]">
      {/* ─── Premium Ambient Background ────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden print:hidden">
        {/* Deep Black-Maroon Base Gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, #190604 0%, #130403 35%, #0e0202 70%, #080101 100%)",
          }}
        />
        {/* Subtle Diagonal Gold Texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "repeating-linear-gradient(45deg, #d4a017 0px, #d4a017 1px, transparent 1px, transparent 40px)",
          }}
        />
        {/* Soft Ambient Warmth */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[radial-gradient(circle,#d4a017_0%,transparent_70%)] opacity-[0.07] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,#7a0b0b_0%,transparent_70%)] opacity-[0.06] rounded-full blur-3xl" />
      </div>

      {/* PDF Preparation Overlay */}
      <PdfLoadingOverlay visible={pdfLoading} stage={pdfStage} />

      {/* ─── TOP CONTROL BAR (Sticky Header below Main Navbar) ──────────────────── */}
      <header
        className="sticky top-14 z-30 border-t border-yellow-900/25 border-b border-yellow-900/25 shadow-[0_6px_24px_rgba(0,0,0,0.5)] px-4 sm:px-6 py-2 sm:py-2.5 print:hidden"
        style={{
          background: 'rgba(25, 6, 4, 0.96)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-2.5 sm:gap-4">
          {/* Left: Back & Breadcrumb */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-start">
            <Link to="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-yellow-400 !px-2.5 sm:!px-3 text-xs border border-yellow-900/30 bg-yellow-950/20 hover:bg-yellow-900/40 rounded-xl"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">My Biodatas</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </Link>

            <div className="h-5 w-px bg-yellow-900/30 hidden sm:block" />

            <div className="truncate">
              <p className="text-xs text-yellow-600/90 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-yellow-500" />
                <span>Template Preview</span>
              </p>
              <h1 className="text-sm sm:text-base font-medium text-white truncate max-w-[220px] sm:max-w-xs md:max-w-md font-serif">
                {candidateName}
              </h1>
            </div>
          </div>

          {/* Center: Template Switcher Controls */}
          <div
            className="flex items-center gap-2 sm:gap-3 px-3 py-1.5 rounded-full border border-yellow-800/35 shadow-inner"
            style={{ background: 'rgba(32, 8, 5, 0.85)' }}
          >
            <button
              onClick={handlePrevTemplate}
              aria-label="Previous Template"
              className="w-8 h-8 rounded-full bg-yellow-950/60 hover:bg-yellow-900/80 border border-yellow-700/40 text-yellow-400 hover:text-yellow-200 flex items-center justify-center transition-all active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="text-center min-w-[170px] sm:min-w-[210px] px-1">
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-xs sm:text-sm font-semibold text-yellow-300 tracking-wide font-serif">
                  {activeTemplate.name}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-600/50 text-emerald-300">
                  Free
                </span>
              </div>
              <p className="text-[10px] text-yellow-200/60 truncate max-w-[190px] sm:max-w-[230px] mx-auto font-light">
                {activeTemplate.tagline}
              </p>
            </div>

            <button
              onClick={handleNextTemplate}
              aria-label="Next Template"
              className="w-8 h-8 rounded-full bg-yellow-950/60 hover:bg-yellow-900/80 border border-yellow-700/40 text-yellow-400 hover:text-yellow-200 flex items-center justify-center transition-all active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right: Actions (Set Active & Download PDF) */}
          <div className="flex items-center gap-2 sm:gap-2.5 w-full lg:w-auto justify-end">
            <Button
              onClick={handleSetActiveTemplate}
              disabled={isCurrentActiveSaved || isSaving}
              variant={isCurrentActiveSaved ? 'ghost' : 'gold'}
              size="sm"
              loading={isSaving}
              className={`text-xs font-semibold !px-3.5 rounded-xl transition-all ${
                isCurrentActiveSaved
                  ? '!bg-emerald-950/50 border !border-emerald-600/50 !text-emerald-300 cursor-default'
                  : 'shadow-gold-glow'
              }`}
            >
              <Check className="w-3.5 h-3.5 mr-1" />
              <span>{isCurrentActiveSaved ? 'Active Design' : 'Set as Active'}</span>
            </Button>

            <Button
              onClick={handleDownloadPDF}
              variant="outline"
              size="sm"
              className="text-xs font-semibold !px-3.5 border-yellow-700/50 text-yellow-400 hover:text-yellow-300 hover:border-yellow-500 bg-yellow-950/20 hover:bg-yellow-900/40 rounded-xl"
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              <span>Download PDF</span>
            </Button>
          </div>
        </div>
      </header>

      {/* ─── MAIN PREVIEW CANVAS AREA ─────────────────────────── */}
      <main
        ref={previewViewportRef}
        className="flex-1 w-full flex flex-col items-center justify-start py-3 sm:py-4 px-2 sm:px-4 overflow-x-hidden print:hidden"
      >
        {/* Canvas Status pill */}
        <div className="flex items-center gap-2 mb-2 sm:mb-3 text-[11px] text-gray-400 font-mono tracking-wider bg-black/40 px-3 py-1 rounded-full border border-yellow-900/25">
          <Eye className="w-3 h-3 text-yellow-500" />
          <span>Accurate A4 Preview</span>
          <span>·</span>
          <span className="text-yellow-500/90">{Math.round(previewScale * 100)}% Scale</span>
        </div>

        {/* Scaled Preview Wrapper Container */}
        <div
          className="relative transition-all duration-150 ease-out"
          style={{
            width: `${Math.round(794 * previewScale)}px`,
            height: `${Math.round(contentHeight * previewScale)}px`,
          }}
        >
          <div
            ref={templateContentRef}
            className="shadow-[0_20px_70px_rgba(0,0,0,0.95)] border border-yellow-900/30 rounded-sm overflow-hidden"
            style={{
              width: '794px',
              transform: `scale(${previewScale})`,
              transformOrigin: 'top left',
            }}
          >
            <Suspense fallback={<TemplateCanvasSkeleton />}>
              <ActiveTemplateComponent biodata={biodata} />
            </Suspense>
          </div>
        </div>
      </main>

      {/* ─── BOTTOM THUMBNAIL SELECTOR STRIP ─────────────────── */}
      <footer
        className="sticky bottom-0 z-40 border-t border-yellow-900/25 py-2.5 sm:py-3 px-4 print:hidden shadow-[0_-8px_30px_rgba(0,0,0,0.6)]"
        style={{
          background: 'rgba(25, 6, 4, 0.96)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[11px] uppercase tracking-widest text-yellow-600/80 font-semibold">
              Official Templates ({OFFICIAL_TEMPLATES.length})
            </span>
            <span className="text-[11px] text-gray-400 hidden sm:inline">
              Use arrow keys <kbd className="px-1 py-0.5 rounded bg-black/60 border border-yellow-900/40 text-[10px]">←</kbd> <kbd className="px-1 py-0.5 rounded bg-black/60 border border-yellow-900/40 text-[10px]">→</kbd> to switch
            </span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4 overflow-x-auto pb-1 scrollbar-thin snap-x">
            {OFFICIAL_TEMPLATES.map((tmpl) => {
              const isSelected = tmpl.id === selectedTemplateId;
              const isSavedActive = tmpl.id === savedTemplateId;

              return (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => handleSelectTemplate(tmpl.id)}
                  className={`snap-center flex-shrink-0 w-36 sm:w-44 p-2.5 rounded-xl text-left border transition-all duration-200 relative group overflow-hidden ${
                    isSelected
                      ? 'border-yellow-400 bg-yellow-950/40 shadow-[0_0_18px_rgba(212,160,23,0.35)] scale-[1.02]'
                      : 'border-yellow-900/30 bg-[#220805]/85 hover:border-yellow-700/60 hover:bg-[#2e0b07]/95'
                  }`}
                >
                  {/* Top Swatch / Gradient Header */}
                  <div
                    className={`h-9 sm:h-11 w-full rounded-lg bg-gradient-to-r ${tmpl.gradient} border border-yellow-700/30 mb-2 relative overflow-hidden flex items-center justify-between px-2`}
                  >
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/60 text-yellow-300 backdrop-blur-sm">
                      {tmpl.badge}
                    </span>

                    {isSavedActive && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/60 text-emerald-300">
                        Active
                      </span>
                    )}
                  </div>

                  {/* Name and Tagline */}
                  <p className="text-xs font-semibold text-white truncate group-hover:text-yellow-300 transition-colors">
                    {tmpl.name}
                  </p>
                  <p className="text-[10px] text-gray-400 truncate mt-0.5">
                    {tmpl.tagline}
                  </p>

                  {/* Free badge */}
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-[10px] text-emerald-400 font-medium">Free</span>
                    {isSelected && (
                      <span className="text-[10px] text-yellow-400 font-semibold flex items-center gap-0.5">
                        <Check className="w-3 h-3 text-yellow-400" /> Previewing
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </footer>

      {/* ─── PRINT PORTAL CONTAINER ──────────────────────────── */}
      {/* Target for browser print: renders the selected template into #print-biodata-root */}
      {typeof document !== 'undefined' && Boolean(biodata) && (() => {
        const printRoot = document.getElementById('print-biodata-root');
        if (!printRoot) return null;
        return createPortal(
          <Suspense fallback={null}>
            <ActiveTemplateComponent biodata={biodata} />
          </Suspense>,
          printRoot
        );
      })()}
    </div>
  );
};

export default TemplatePreviewPage;
