import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusCircle, Trash2, Eye, Globe, Lock,
  AlertTriangle, LayoutDashboard, RefreshCw,
  Pencil, BarChart3, Palette, X,
  ShieldCheck, Check, Clock, Mail, Phone, Calendar
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useBiodata } from '../hooks/useBiodata';
import { useToast } from '../context/ToastContext';
import { getErrorMessage } from '../utils/apiError';
import { apiGetReceivedBiodataRequests, apiUpdateBiodataRequestStatus } from '../api/client';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import TrustBar from '../components/ui/TrustBar';
import { SkeletonDashboard } from '../components/ui/Skeleton';
import { getTemplateById } from '../constants/templates';
import { generateProfileSlug } from '../utils/slug';

/* ── Animated counter ─────────────────────────────────────────── */
const AnimatedCount = ({ value, suffix = '' }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!value) return;
    let start = 0;
    const step = Math.ceil(value / 20);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setDisplay(value); clearInterval(timer); }
      else setDisplay(start);
    }, 30);
    return () => clearInterval(timer);
  }, [value]);
  return <span aria-live="polite" aria-atomic="true">{display}{suffix}</span>;
};

/* ── Stat chip ────────────────────────────────────────────────── */
const StatChip = ({ icon: Icon, label, value, color }) => (
  <div
    className="stat-chip"
    role="status"
    aria-label={`${value} ${label} biodatas`}
  >
    <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${color}`} aria-hidden="true" />
    <span className="font-semibold text-white">
      <AnimatedCount value={value} />
    </span>
    <span className="text-gray-500" aria-hidden="true">{label}</span>
  </div>
);

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const { fetchByUser, remove, update, loading } = useBiodata();
  const toast = useToast();
  const [biodatas, setBiodatas]     = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  // Access Requests state
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [updatingRequestId, setUpdatingRequestId] = useState(null);

  const publicCount  = useMemo(() => biodatas.filter((b) => b.isPublic).length, [biodatas]);
  const privateCount = useMemo(() => biodatas.length - publicCount, [biodatas, publicCount]);
  const pendingRequestsCount = useMemo(() => requests.filter((r) => r.status === 'PENDING').length, [requests]);

  const loadBiodatas = () => {
    setFetchError(null);
    fetchByUser()
      .then(result => setBiodatas(Array.isArray(result) ? result : (result.data || [])))
      .catch((err) => {
        setFetchError(getErrorMessage(err, 'Failed to load your biodatas.'));
        setBiodatas([]);
      });
  };

  const loadRequests = () => {
    setLoadingRequests(true);
    apiGetReceivedBiodataRequests()
      .then((res) => {
        setRequests(Array.isArray(res) ? res : res?.data || []);
      })
      .catch(() => {
        setRequests([]);
      })
      .finally(() => setLoadingRequests(false));
  };

  useEffect(() => { loadBiodatas(); }, [fetchByUser]);
  useEffect(() => { loadRequests(); }, []);

  const handleTogglePublic = async (id, current) => {
    setTogglingId(id);
    setBiodatas((prev) =>
      prev.map((b) => (b._id === id ? { ...b, isPublic: !current } : b))
    );
    try {
      await update(id, { isPublic: !current });
      toast.success(current ? 'Biodata set to private.' : 'Biodata is now public!');
    } catch (err) {
      setBiodatas((prev) =>
        prev.map((b) => (b._id === id ? { ...b, isPublic: current } : b))
      );
      toast.error(getErrorMessage(err, 'Failed to update visibility.'));
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await remove(id);
      setBiodatas((prev) => prev.filter((b) => b._id !== id));
      toast.success('Biodata deleted successfully.');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to delete. Please try again.'));
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  const handleUpdateStatus = async (requestId, status) => {
    setUpdatingRequestId(requestId);
    try {
      await apiUpdateBiodataRequestStatus(requestId, status);
      setRequests((prev) =>
        prev.map((r) => (r._id === requestId ? { ...r, status } : r))
      );
      toast.success(status === 'ACCEPTED' ? 'Access request approved!' : 'Access request declined.');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to update request status.'));
    } finally {
      setUpdatingRequestId(null);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 page-enter">
      <div className="fixed inset-0 bg-gradient-to-br from-[#0d0000] via-[#150000] to-[#0d0000] -z-10" />

      <div className="max-w-5xl mx-auto">

        {/* ── Header ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          {/* Top row */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <LayoutDashboard className="w-5 h-5 text-yellow-600/80" />
                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-yellow-700/60">
                  Dashboard
                </p>
              </div>
              <h1
                className="text-3xl sm:text-4xl font-light text-white leading-tight"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Welcome back,{' '}
                <span className="text-gradient-gold">{currentUser?.name?.split(' ')[0] || 'User'}</span>
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Manage and publish your marriage profiles
              </p>
            </div>
            <Link to="/create" className="flex-shrink-0">
              <Button variant="gold" size="md">
                <PlusCircle className="w-4 h-4" />
                Create New
              </Button>
            </Link>
          </div>

          {/* Stat chips row */}
          {!loading && biodatas.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-2"
            >
              <StatChip icon={BarChart3} label="total"   value={biodatas.length} color="text-yellow-500" />
              <StatChip icon={Globe}     label="public"  value={publicCount}      color="text-emerald-400" />
              <StatChip icon={Lock}      label="private" value={privateCount}     color="text-gray-400" />
              <StatChip icon={ShieldCheck} label="pending req" value={pendingRequestsCount} color="text-amber-400" />
            </motion.div>
          )}
        </motion.div>

        {/* ── Trust bar (first-time users see it) ────────────── */}
        {!loading && biodatas.length === 0 && !fetchError && (
          <div className="mb-6">
            <TrustBar />
            <div className="sep-gold mt-4" />
          </div>
        )}

        {/* ── Fetch error ─────────────────────────────────────── */}
        <AnimatePresence>
          {fetchError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 flex items-start gap-3 px-4 py-4 rounded-2xl bg-red-950/50 border border-red-800/30 text-red-300 text-sm"
            >
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
              <div className="flex-1 text-sm leading-relaxed">{fetchError}</div>
              <button
                onClick={loadBiodatas}
                aria-label="Retry loading biodatas"
                className="flex items-center gap-1.5 text-yellow-500 hover:text-yellow-400 text-xs font-medium transition-colors flex-shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                Retry
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Skeleton ──────────────────────────────────────── */}
        {loading && <SkeletonDashboard />}

        {/* ── Empty state ─────────────────────────────────────── */}
        {!loading && !fetchError && biodatas.length === 0 && (
          <div className="glass-card rounded-3xl border border-yellow-900/15">
            <EmptyState
              emoji="💍"
              title="Your Journey Begins Here"
              description="Create a beautiful, print-ready marriage profile that reflects your true essence and family values."
              action={{ label: 'Create Your First Biodata', to: '/create', variant: 'gold' }}
              secondaryAction={{ label: 'Explore Profiles', to: '/explore', variant: 'ghost' }}
            />
          </div>
        )}

        {/* ── Biodata cards ───────────────────────────────────── */}
        {!loading && biodatas.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {biodatas.map((biodata, i) => {
              const name       = biodata.personalInfo?.fullName || 'Unnamed';
              const city       = biodata.personalInfo?.city || '';
              const education  = biodata.educationInfo?.highestQualification || '';
              const initials   = name.split(' ').filter(Boolean).map((n) => n[0]).join('').slice(0, 2).toUpperCase();
              const isToggling = togglingId === biodata._id;
              const isDeleting = deletingId === biodata._id;

              return (
                <motion.div
                  key={biodata._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                  className="glass-card card-lift rounded-2xl overflow-hidden border border-yellow-900/10"
                >
                  {/* ── Card header ── */}
                  <div className="flex items-center gap-4 p-5 sm:p-6 border-b border-red-900/15">
                    {/* Avatar */}
                    {biodata.photoURL ? (
                      <img
                        src={biodata.photoURL}
                        alt={name}
                        className="w-12 h-16 rounded-xl object-cover border-2 border-yellow-700/25 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-16 rounded-xl bg-gradient-to-br from-red-900 to-[#1a0000] border-2 border-yellow-800/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-bold text-yellow-600/80" style={{ fontFamily: 'Playfair Display, serif' }}>
                          {initials}
                        </span>
                      </div>
                    )}

                    {/* Name / meta */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-white truncate" style={{ fontFamily: 'Playfair Display, serif' }}>
                        {name}
                      </h3>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {[city, education].filter(Boolean).join(' · ') || 'No details yet'}
                      </p>
                    </div>

                    {/* Visibility badge */}
                    <span
                      className={`flex-shrink-0 flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full border font-medium transition-all duration-200
                        ${isToggling ? 'opacity-40' : ''}
                        ${biodata.isPublic
                          ? 'bg-emerald-900/20 border-emerald-800/30 text-emerald-400'
                          : 'bg-gray-900/40 border-gray-800/30 text-gray-500'
                        }`}
                    >
                      {biodata.isPublic ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                      <span className="hidden sm:inline">{biodata.isPublic ? 'Public' : 'Private'}</span>
                    </span>
                  </div>

                  {/* ── Choose Template & Preview Action ── */}
                  <div className="px-5 sm:px-6 py-2.5 bg-yellow-950/20 border-b border-yellow-900/15 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-[11px] uppercase tracking-wider text-yellow-600/80 font-medium">Design:</span>
                      <span className="text-xs text-yellow-300/90 font-medium truncate">
                        {getTemplateById(biodata.templateId).name}
                      </span>
                    </div>

                    <Link to={`/preview/${biodata._id}/${biodata.templateId || 'default'}`}>
                      <Button
                        variant="gold"
                        size="sm"
                        className="shadow-gold-glow !py-1 !px-2.5 sm:!px-3 text-xs font-medium"
                        aria-label={`Choose template or preview PDF for ${name}`}
                      >
                        <Palette className="w-3.5 h-3.5 mr-1.5 text-black flex-shrink-0" />
                        <span>Choose Template / Preview PDF</span>
                      </Button>
                    </Link>
                  </div>

                  {/* ── Actions ── */}
                  <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 gap-2">
                    {/* Left: view / edit / toggle */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Link to={`/profile/${generateProfileSlug(biodata) || biodata._id}`}>
                        <Button variant="ghost" size="sm" aria-label={`View profile for ${name}`}>
                          <Eye className="w-4 h-4" aria-hidden="true" />
                          <span className="hidden sm:inline">View</span>
                        </Button>
                      </Link>
                      <Link to={`/edit/${biodata._id}`}>
                        <Button variant="ghost" size="sm" aria-label={`Edit profile for ${name}`}>
                          <Pencil className="w-4 h-4" aria-hidden="true" />
                          <span className="hidden sm:inline">Edit</span>
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        loading={isToggling}
                        aria-label={biodata.isPublic ? `Make ${name} profile private` : `Make ${name} profile public`}
                        onClick={() => handleTogglePublic(biodata._id, biodata.isPublic)}
                      >
                        {!isToggling && (biodata.isPublic ? <Lock className="w-4 h-4" aria-hidden="true" /> : <Globe className="w-4 h-4" aria-hidden="true" />)}
                        <span className="hidden sm:inline">
                          {biodata.isPublic ? 'Make Private' : 'Make Public'}
                        </span>
                      </Button>
                    </div>

                    {/* Right: delete confirm */}
                    <AnimatePresence mode="wait">
                      {confirmDelete === biodata._id ? (
                        <motion.div
                          key="confirm"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="flex items-center gap-2"
                        >
                          <span className="text-red-400 text-xs hidden sm:flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" aria-hidden="true" /> Sure?
                          </span>
                          <Button
                            variant="danger"
                            size="sm"
                            loading={isDeleting}
                            aria-label={`Confirm delete ${name}`}
                            onClick={() => handleDelete(biodata._id)}
                          >
                            Delete
                          </Button>
                          <Button variant="ghost" size="sm" aria-label="Cancel delete" onClick={() => setConfirmDelete(null)}>
                            No
                          </Button>
                        </motion.div>
                      ) : (
                        <motion.div key="delete" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setConfirmDelete(biodata._id)}
                            className="text-red-800/70 hover:text-red-400"
                            aria-label={`Delete ${name}`}
                          >
                            <Trash2 className="w-4 h-4" aria-hidden="true" />
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ── Access Requests Management Section ──────────────── */}
        <div className="mt-14 border-t border-yellow-900/15 pt-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-yellow-500" />
              <h2
                className="text-xl sm:text-2xl font-light text-white"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Biodata Access Requests
              </h2>
              {pendingRequestsCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/70 border border-amber-600/50 text-amber-400">
                  {pendingRequestsCount} Pending
                </span>
              )}
            </div>
            <button
              onClick={loadRequests}
              disabled={loadingRequests}
              className="text-xs text-yellow-600 hover:text-yellow-400 flex items-center gap-1 transition-colors self-start sm:self-auto cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingRequests ? 'animate-spin' : ''}`} />
              Refresh Requests
            </button>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm mb-6">
            Review prospective suitors and families who have requested access to view your full biodata and direct contact information.
          </p>

          {loadingRequests ? (
            <div className="p-8 text-center text-gray-500 text-sm glass-card rounded-2xl">
              Loading requests...
            </div>
          ) : requests.length === 0 ? (
            <div className="glass-card rounded-2xl border border-yellow-900/10 p-8 text-center">
              <ShieldCheck className="w-10 h-10 text-yellow-700/40 mx-auto mb-3" />
              <h3 className="text-white text-base font-medium mb-1">No Access Requests Yet</h3>
              <p className="text-gray-500 text-xs sm:text-sm max-w-md mx-auto">
                When prospective matches view your public biodata and request to connect, their details will appear here for your review and approval.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((req) => {
                const requester = req.requesterId || {};
                const biodataTarget = req.biodataId || {};
                const biodataName = biodataTarget.personalInfo?.fullName || 'Your Biodata';
                const isUpdating = updatingRequestId === req._id;
                const reqDate = new Date(req.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                });

                return (
                  <motion.div
                    key={req._id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-2xl border border-yellow-900/15 p-5 sm:p-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      {/* Left: Requester details */}
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-950/60 to-red-950/60 border border-yellow-700/30 flex items-center justify-center text-yellow-500 font-bold text-sm">
                            {requester.name?.slice(0, 2).toUpperCase() || 'RQ'}
                          </div>
                          <div>
                            <h4 className="text-white font-semibold text-base">{requester.name || 'Anonymous User'}</h4>
                            <p className="text-xs text-yellow-600/80">
                              Requested profile: <span className="text-gray-300 font-medium">{biodataName}</span>
                            </p>
                          </div>
                        </div>

                        {/* Contact info pills */}
                        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-gray-400">
                          {requester.email && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/40 border border-yellow-900/20 text-gray-300">
                              <Mail className="w-3 h-3 text-yellow-600" />
                              {requester.email}
                            </span>
                          )}
                          {requester.mobile && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/40 border border-yellow-900/20 text-gray-300">
                              <Phone className="w-3 h-3 text-yellow-600" />
                              {requester.mobile}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/40 border border-yellow-900/20 text-gray-400">
                            <Calendar className="w-3 h-3 text-yellow-600" />
                            {reqDate}
                          </span>
                        </div>

                        {/* Message if present */}
                        {req.message && (
                          <div className="mt-2.5 p-3 rounded-xl bg-black/50 border border-yellow-900/20 text-xs text-gray-300 italic">
                            "{req.message}"
                          </div>
                        )}
                      </div>

                      {/* Right: Status badge & Actions */}
                      <div className="flex flex-col sm:items-end justify-between gap-3 flex-shrink-0">
                        {/* Status Badge */}
                        {req.status === 'PENDING' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-950/60 border border-amber-600/50 text-amber-400">
                            <Clock className="w-3.5 h-3.5" />
                            Pending Review
                          </span>
                        ) : req.status === 'ACCEPTED' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/60 border border-emerald-600/50 text-emerald-400">
                            <Check className="w-3.5 h-3.5" />
                            Access Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-950/60 border border-red-800/50 text-red-400">
                            <X className="w-3.5 h-3.5" />
                            Request Rejected
                          </span>
                        )}

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 mt-2">
                          {req.status === 'PENDING' ? (
                            <>
                              <Button
                                variant="gold"
                                size="sm"
                                loading={isUpdating}
                                onClick={() => handleUpdateStatus(req._id, 'ACCEPTED')}
                                className="!px-3 text-xs"
                              >
                                <Check className="w-3.5 h-3.5 mr-1" />
                                Accept
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                loading={isUpdating}
                                onClick={() => handleUpdateStatus(req._id, 'REJECTED')}
                                className="!px-3 text-xs text-red-400 hover:text-red-300 border border-red-800/30 hover:border-red-700/50"
                              >
                                <X className="w-3.5 h-3.5 mr-1" />
                                Reject
                              </Button>
                            </>
                          ) : req.status === 'ACCEPTED' ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              loading={isUpdating}
                              onClick={() => handleUpdateStatus(req._id, 'REJECTED')}
                              className="!px-3 text-xs text-red-400 hover:text-red-300 border border-red-800/30"
                            >
                              Revoke Access
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              loading={isUpdating}
                              onClick={() => handleUpdateStatus(req._id, 'ACCEPTED')}
                              className="!px-3 text-xs text-emerald-400 hover:text-emerald-300 border border-emerald-800/30"
                            >
                              Re-Accept
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
