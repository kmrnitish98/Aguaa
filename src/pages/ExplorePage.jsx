import { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Heart,
  AlertTriangle,
  RefreshCw,
  SlidersHorizontal,
  Users,
  ChevronLeft,
  ChevronRight,
  X,
  RotateCcw,
} from 'lucide-react';

import { apiGetPublicBiodatas, apiGetSentBiodataRequests } from '../api/client';
import BiodataCard from '../components/biodata/BiodataCard';
import Button from '../components/ui/Button';
import TrustBar from '../components/ui/TrustBar';
import EmptyState from '../components/ui/EmptyState';
import { SkeletonCard } from '../components/ui/Skeleton';
import { useSEO } from '../hooks/useSEO';
import { useAuth } from '../hooks/useAuth';
import { useDebounce } from '../hooks/useDebounce';
import { PAGINATION, TIMEOUTS } from '../constants/limits';

const fadeUpVariant = {
  hidden:  { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

const ExplorePage = () => {
  useSEO('/explore');
  const { currentUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL query params on mount
  const initialPage = Math.max(parseInt(searchParams.get('page'), 10) || 1, 1);
  const initialSearch = searchParams.get('search') || searchParams.get('q') || '';
  const initialCaste = searchParams.get('caste') || '';
  const initialLocation = searchParams.get('location') || '';

  // Filter and search states
  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState(initialSearch);

  // Applied filter values that drive the API and URL
  const [appliedCaste, setAppliedCaste] = useState(initialCaste);
  const [appliedLocation, setAppliedLocation] = useState(initialLocation);

  // Form inputs inside the Filters panel
  const [drawerCaste, setDrawerCaste] = useState(initialCaste);
  const [drawerLocation, setDrawerLocation] = useState(initialLocation);
  const [showFilters, setShowFilters] = useState(false);

  // Debounced search (350ms) to avoid excessive API requests
  const debouncedSearch = useDebounce(search, TIMEOUTS.SEARCH_DEBOUNCE_MS);

  // Data & pagination states
  const [biodatas, setBiodatas] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: initialPage,
    totalPages: 1,
    totalProfiles: 0,
    limit: PAGINATION.EXPLORE_PAGE_SIZE,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sentRequestsMap, setSentRequestsMap] = useState({});

  const searchRef = useRef(null);
  const gridRef = useRef(null);

  // Count active filters (Caste and Location)
  const activeFilterCount = [
    Boolean(appliedCaste.trim()),
    Boolean(appliedLocation.trim()),
  ].filter(Boolean).length;

  // Check if any filter or search is active for badges and empty state
  const hasActiveIndicators = Boolean(
    debouncedSearch.trim() ||
    appliedCaste.trim() ||
    appliedLocation.trim()
  );

  // Sync state from URL search params (e.g. browser back/forward navigation)
  useEffect(() => {
    const urlPage = Math.max(parseInt(searchParams.get('page'), 10) || 1, 1);
    const urlSearch = searchParams.get('search') || searchParams.get('q') || '';
    const urlCaste = searchParams.get('caste') || '';
    const urlLocation = searchParams.get('location') || '';

    if (urlPage !== page) setPage(urlPage);
    if (urlSearch !== search) setSearch(urlSearch);
    if (urlCaste !== appliedCaste) {
      setAppliedCaste(urlCaste);
      setDrawerCaste(urlCaste);
    }
    if (urlLocation !== appliedLocation) {
      setAppliedLocation(urlLocation);
      setDrawerLocation(urlLocation);
    }
  }, [searchParams]);

  // Sync URL search params whenever page, debounced search, or applied filters change
  useEffect(() => {
    const nextParams = {};
    if (page > 1) nextParams.page = String(page);
    if (debouncedSearch.trim()) nextParams.search = debouncedSearch.trim();
    if (appliedCaste.trim()) nextParams.caste = appliedCaste.trim();
    if (appliedLocation.trim()) nextParams.location = appliedLocation.trim();

    const currentSearch = searchParams.get('search') || searchParams.get('q') || '';
    const currentCaste = searchParams.get('caste') || '';
    const currentLocation = searchParams.get('location') || '';
    const currentPage = parseInt(searchParams.get('page'), 10) || 1;

    const hasChanged =
      (nextParams.search || '') !== currentSearch ||
      (nextParams.caste || '') !== currentCaste ||
      (nextParams.location || '') !== currentLocation ||
      (parseInt(nextParams.page, 10) || 1) !== currentPage;

    if (hasChanged) {
      setSearchParams(nextParams, { replace: true });
    }
  }, [page, debouncedSearch, appliedCaste, appliedLocation, searchParams, setSearchParams]);

  // Apply filters from the panel
  const handleApplyFilters = () => {
    setAppliedCaste(drawerCaste.trim());
    setAppliedLocation(drawerLocation.trim());
    setPage(1);
    setShowFilters(false);
  };

  // Clear filters in panel and reset
  const handleClearFilters = () => {
    setDrawerCaste('');
    setDrawerLocation('');
    setAppliedCaste('');
    setAppliedLocation('');
    setPage(1);
    setShowFilters(false);
  };

  // Clear all filters and search
  const handleClearAll = useCallback(() => {
    setSearch('');
    setDrawerCaste('');
    setDrawerLocation('');
    setAppliedCaste('');
    setAppliedLocation('');
    setPage(1);
  }, []);

  // Fetch paginated public biodatas from server
  const fetchBiodatas = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiGetPublicBiodatas({
        page,
        limit: PAGINATION.EXPLORE_PAGE_SIZE,
        search: debouncedSearch.trim() || undefined,
        caste: appliedCaste.trim() || undefined,
        location: appliedLocation.trim() || undefined,
      });

      const list = result.biodatas || result.data || [];
      const pag = result.pagination || {
        currentPage: page,
        totalPages: Math.ceil((result.total || list.length) / PAGINATION.EXPLORE_PAGE_SIZE) || 1,
        totalProfiles: result.total || list.length,
        limit: PAGINATION.EXPLORE_PAGE_SIZE,
      };

      setBiodatas(list);
      setPagination(pag);

      // Handle invalid page gracefully
      if (pag.totalPages > 0 && page > pag.totalPages) {
        setPage(pag.totalPages);
      }
    } catch (err) {
      console.error('[ExplorePage] fetch error:', err);
      setError('Could not connect. Please check your connection and try again.');
      setBiodatas([]);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, appliedCaste, appliedLocation]);

  useEffect(() => {
    fetchBiodatas();
  }, [fetchBiodatas]);

  // Fetch access requests map for logged in user
  useEffect(() => {
    if (!currentUser) {
      setSentRequestsMap({});
      return;
    }
    apiGetSentBiodataRequests()
      .then((res) => {
        const map = {};
        const list = Array.isArray(res) ? res : res?.data || [];
        list.forEach((item) => {
          const bId = item.biodataId?._id || item.biodataId;
          if (bId) map[bId] = item.status;
        });
        setSentRequestsMap(map);
      })
      .catch(() => {});
  }, [currentUser]);

  // Handle page navigation
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages || newPage === page) return;
    setPage(newPage);
    if (gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 200, behavior: 'smooth' });
    }
  };

  // Helper for numbered pagination buttons
  const getPageNumbers = (current, total) => {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    if (current <= 4) {
      return [1, 2, 3, 4, 5, '...', total];
    }
    if (current >= total - 3) {
      return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
    }
    return [1, '...', current - 1, current, current + 1, '...', total];
  };

  // Calculate range e.g. "Showing 1–12 of 1,000 profiles"
  const totalProfiles = pagination.totalProfiles || 0;
  const currentPage = pagination.currentPage || page;
  const limit = pagination.limit || PAGINATION.EXPLORE_PAGE_SIZE;
  const totalPages = pagination.totalPages || 1;
  const startCount = totalProfiles === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endCount = Math.min(currentPage * limit, totalProfiles);

  return (
    <div className="min-h-screen pt-24 pb-20 page-enter" style={{ background: 'linear-gradient(180deg,#0e0500 0%,#120600 60%,#0d0400 100%)' }}>

      {/* ── Ambient BG ─────────────────────────────────────────── */}
      <div className="fixed inset-0 -z-10 opacity-[0.055] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100'%3E%3Cpath d='M28 66L0 50V16L28 0l28 16v34zm0-18L8 36V20L28 8l20 12v16z' fill='none' stroke='%23d4a017' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: '56px 100px',
        }} />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] -translate-y-1/2 opacity-[0.09] -z-10 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #d4a017 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Page Header ──────────────────────────────────────── */}
        <motion.div
          className="text-center mb-10"
          variants={fadeUpVariant}
          initial="hidden"
          animate="visible"
        >
          {/* Eyebrow */}
          <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.25em] uppercase text-yellow-600/80 mb-4">
            <span className="w-5 h-px bg-yellow-700/60" />
            Discover Rishta
            <span className="w-5 h-px bg-yellow-700/60" />
          </p>

          <h1
            className="text-4xl sm:text-5xl font-light text-white mb-4 leading-tight"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Explore Marriage{' '}
            <span className="italic text-gradient-gold">Biodata Profiles</span>
          </h1>

          <p className="text-sm text-yellow-700/60 max-w-lg mx-auto mb-2 leading-relaxed">
            Bihar, UP, Jharkhand ke verified matrimonial profiles browse kare — free mein.
          </p>

          {/* Live count badge */}
          {!loading && !error && (
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="badge-live inline-flex items-center text-xs text-emerald-400/80 mt-1"
            >
              <span className="font-semibold text-emerald-300">{totalProfiles.toLocaleString()}</span>
              &nbsp;profiles available right now
            </motion.p>
          )}
        </motion.div>

        {/* ── Trust bar ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <TrustBar />
          <div className="sep-gold mt-6" />
        </motion.div>

        {/* ── Simplified Search + Filters Row ──────────────────── */}
        <motion.div
          className="max-w-3xl mx-auto mb-10"
          variants={fadeUpVariant}
          initial="hidden"
          animate="visible"
          custom={0.1}
        >
          {/* Search Bar + Filters Button side-by-side */}
          <div className="flex items-center gap-2.5 sm:gap-3 mb-3">
            {/* Search input container */}
            <div role="search" aria-label="Search marriage profiles" className="relative flex-1 group">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-800/25 to-red-900/20 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
              <div
                className="relative flex items-center rounded-2xl px-4 py-1 transition-all duration-300"
                style={{
                  background: 'rgba(20,8,0,0.85)',
                  border: '1px solid rgba(212,160,23,0.35)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <Search className="w-5 h-5 text-yellow-600 flex-shrink-0 mr-3" />
                <input
                  ref={searchRef}
                  id="explore-search"
                  type="search"
                  placeholder="Search by candidate name, city or state…"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  aria-label="Search profiles by name, city or state"
                  className="flex-1 bg-transparent border-none text-white py-3.5 focus:outline-none placeholder-yellow-900/60 text-sm"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch('');
                      setPage(1);
                    }}
                    className="text-gray-500 hover:text-gray-300 transition-colors text-lg leading-none p-1 mr-1"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Filters Button immediately beside search bar on right */}
            <button
              type="button"
              onClick={() => {
                // When opening, ensure drawer fields match current applied values
                if (!showFilters) {
                  setDrawerCaste(appliedCaste);
                  setDrawerLocation(appliedLocation);
                }
                setShowFilters((prev) => !prev);
              }}
              className={`flex items-center gap-2 px-4 sm:px-5 py-3.5 rounded-2xl text-sm font-medium border transition-all duration-200 flex-shrink-0 shadow-sm ${
                showFilters || activeFilterCount > 0
                  ? 'bg-[#d4a017] text-[#0f0a00] border-[#d4a017] shadow-[0_0_15px_rgba(212,160,23,0.35)]'
                  : 'bg-[#1f1500]/80 text-yellow-500 border-yellow-800/40 hover:border-yellow-600/70 hover:text-yellow-300'
              }`}
              aria-label="Toggle filter options"
              aria-expanded={showFilters}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold ${
                  showFilters || activeFilterCount > 0
                    ? 'bg-[#0f0a00] text-[#f0c040]'
                    : 'bg-[#d4a017] text-[#0f0a00]'
                }`}>
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Clean Filters Panel (Contains ONLY Caste and Location) */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden mb-4"
              >
                <div className="p-5 sm:p-6 rounded-2xl bg-[#1a0a00]/95 border border-yellow-800/40 backdrop-blur-xl shadow-2xl">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-yellow-900/30">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4 text-[#d4a017]" />
                      <h3 className="text-sm font-semibold text-white tracking-wide">
                        Filter Profiles
                      </h3>
                      {activeFilterCount > 0 && (
                        <span className="text-[11px] text-yellow-600 font-medium">
                          ({activeFilterCount} active)
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowFilters(false)}
                      className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors"
                      aria-label="Close filters panel"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleApplyFilters();
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Caste Filter */}
                      <div>
                        <label htmlFor="filter-caste" className="block text-yellow-600/90 mb-1.5 font-medium uppercase tracking-wider text-[11px]">
                          Caste
                        </label>
                        <input
                          id="filter-caste"
                          type="text"
                          placeholder="e.g. Brahmin, Rajput, Yadav, Shah"
                          value={drawerCaste}
                          onChange={(e) => setDrawerCaste(e.target.value)}
                          className="w-full bg-[#0f0500] border border-yellow-800/50 rounded-xl px-3.5 py-2.5 text-white placeholder-yellow-900/60 focus:outline-none focus:border-[#d4a017] transition-colors text-sm"
                        />
                      </div>

                      {/* Location Filter */}
                      <div>
                        <label htmlFor="filter-location" className="block text-yellow-600/90 mb-1.5 font-medium uppercase tracking-wider text-[11px]">
                          Location / City
                        </label>
                        <input
                          id="filter-location"
                          type="text"
                          placeholder="e.g. Patna, Sasaram, Delhi, Bihar"
                          value={drawerLocation}
                          onChange={(e) => setDrawerLocation(e.target.value)}
                          className="w-full bg-[#0f0500] border border-yellow-800/50 rounded-xl px-3.5 py-2.5 text-white placeholder-yellow-900/60 focus:outline-none focus:border-[#d4a017] transition-colors text-sm"
                        />
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleClearFilters}
                        className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border border-yellow-900/40 text-yellow-600 hover:text-yellow-400 hover:border-yellow-700/60 transition-colors"
                      >
                        Clear Filters
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#d4a017] text-[#0f0a00] hover:bg-[#f0c040] shadow-[0_0_15px_rgba(212,160,23,0.35)] transition-all"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Filter Indicators */}
          {hasActiveIndicators && (
            <div className="flex flex-wrap items-center gap-2 pt-1 mb-2">
              <span className="text-[11px] text-yellow-600/75 uppercase tracking-wider font-medium mr-1">
                Active:
              </span>
              {debouncedSearch.trim() && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-yellow-950/60 border border-yellow-800/50 text-yellow-300">
                  <span>Search: &quot;{debouncedSearch.trim()}&quot;</span>
                  <button
                    type="button"
                    onClick={() => { setSearch(''); setPage(1); }}
                    className="hover:text-white p-0.5"
                    aria-label="Remove search filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {appliedCaste.trim() && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-yellow-950/60 border border-yellow-800/50 text-yellow-300">
                  <span>Caste: {appliedCaste.trim()}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setAppliedCaste('');
                      setDrawerCaste('');
                      setPage(1);
                    }}
                    className="hover:text-white p-0.5"
                    aria-label="Remove caste filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {appliedLocation.trim() && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-yellow-950/60 border border-yellow-800/50 text-yellow-300">
                  <span>Location: {appliedLocation.trim()}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setAppliedLocation('');
                      setDrawerLocation('');
                      setPage(1);
                    }}
                    className="hover:text-white p-0.5"
                    aria-label="Remove location filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs text-yellow-600 hover:text-yellow-400 transition-colors ml-auto pl-2 whitespace-nowrap flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Clear All
              </button>
            </div>
          )}
        </motion.div>

        {/* ── Content ──────────────────────────────────────────── */}
        <div ref={gridRef} className="scroll-mt-28">
          <AnimatePresence mode="wait">

            {/* Loading skeleton (12 cards) */}
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {Array.from({ length: PAGINATION.EXPLORE_PAGE_SIZE }, (_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </motion.div>
            )}

            {/* Error state */}
            {!loading && error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="max-w-md mx-auto glass-card rounded-3xl p-8 border border-red-900/30 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-red-950/60 border border-red-800/40 flex items-center justify-center">
                  <AlertTriangle className="w-7 h-7 text-red-400" />
                </div>
                <p className="text-white font-medium mb-2 text-sm">Connection Failed</p>
                <p className="text-gray-500 text-xs mb-6 leading-relaxed">{error}</p>
                <Button variant="outline" size="sm" onClick={fetchBiodatas}>
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </Button>
              </motion.div>
            )}

            {/* Empty / no results */}
            {!loading && !error && biodatas.length === 0 && (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <EmptyState
                  icon={Heart}
                  title={hasActiveIndicators ? 'No Profiles Found' : 'Be the First!'}
                  description={
                    hasActiveIndicators
                      ? 'No public profiles match your selected search or filter criteria. Try adjusting or clearing your filters.'
                      : 'No public profiles yet. Create a beautiful biodata and help others find their perfect match.'
                  }
                  action={
                    hasActiveIndicators
                      ? { label: 'Clear All Filters', onClick: handleClearAll, variant: 'gold' }
                      : { label: 'Create the First Profile', to: '/create', variant: 'gold' }
                  }
                />
              </motion.div>
            )}

            {/* Profile grid & pagination */}
            {!loading && !error && biodatas.length > 0 && (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Result count */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                  <p
                    className="text-xs text-yellow-700/80 flex items-center gap-1.5"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    <Users className="w-3.5 h-3.5 text-yellow-600 flex-shrink-0" aria-hidden="true" />
                    <span>
                      Showing <span className="text-yellow-500 font-semibold">{startCount}–{endCount}</span> of{' '}
                      <span className="text-yellow-500 font-semibold">{totalProfiles.toLocaleString()}</span> profiles
                    </span>
                    {debouncedSearch.trim() && (
                      <span className="truncate max-w-[200px]">
                        &nbsp;matching <span className="text-yellow-400">&quot;{debouncedSearch.trim()}&quot;</span>
                      </span>
                    )}
                  </p>
                  {hasActiveIndicators && (
                    <button
                      type="button"
                      onClick={handleClearAll}
                      aria-label="Clear active filters"
                      className="text-xs text-yellow-600/70 hover:text-yellow-400 transition-colors self-start sm:self-auto"
                    >
                      Clear all filters ×
                    </button>
                  )}
                </div>

                <div
                  role="feed"
                  aria-label="Marriage biodata profiles"
                  aria-busy={loading}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6"
                >
                  {biodatas.map((biodata, idx) => (
                    <motion.div
                      key={biodata._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(idx * 0.04, 0.32), duration: 0.45 }}
                    >
                      <BiodataCard biodata={biodata} requestStatus={sentRequestsMap[biodata._id]} />
                    </motion.div>
                  ))}
                </div>

                {/* Numbered Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-12 mb-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1 || loading}
                      aria-label="Previous page"
                      className="border-yellow-800/40 text-yellow-600/80 hover:text-yellow-400 disabled:opacity-40"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Previous
                    </Button>

                    <div className="flex items-center gap-1.5 mx-1">
                      {getPageNumbers(currentPage, totalPages).map((p, idx) =>
                        p === '...' ? (
                          <span key={`ell-${idx}`} className="px-2 text-yellow-700/50 text-sm">
                            …
                          </span>
                        ) : (
                          <button
                            key={`pg-${p}`}
                            type="button"
                            onClick={() => handlePageChange(p)}
                            disabled={loading}
                            aria-label={`Page ${p}`}
                            aria-current={currentPage === p ? 'page' : undefined}
                            className={`w-9 h-9 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                              currentPage === p
                                ? 'bg-[#d4a017] text-[#0f0a00] font-semibold shadow-[0_0_12px_rgba(212,160,23,0.4)]'
                                : 'border border-yellow-800/30 text-yellow-600/80 hover:border-yellow-700 hover:text-yellow-400 bg-[#1f1500]/60'
                            }`}
                          >
                            {p}
                          </button>
                        )
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages || loading}
                      aria-label="Next page"
                      className="border-yellow-800/40 text-yellow-600/80 hover:text-yellow-400 disabled:opacity-40"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                )}

                {/* Bottom CTA — conversion nudge */}
                {!loading && biodatas.length >= 4 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="mt-16 text-center glass-card rounded-3xl border border-yellow-900/15 py-10 px-6"
                  >
                    <p className="text-yellow-700/50 text-xs uppercase tracking-widest mb-3">Your Profile</p>
                    <h2 className="text-2xl font-light text-white mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Don&apos;t see your match?
                    </h2>
                    <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
                      Create your own biodata and let the right person find you. Free, beautiful, print-ready.
                    </p>
                    <Link to="/create">
                      <Button variant="gold" size="md">Create Your Biodata Free</Button>
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
