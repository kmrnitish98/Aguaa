import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Eye, X, Mail, Phone, Clock,
  Tag, User, CheckCircle, Search, RefreshCw,
  ChevronLeft, ChevronRight, AlertCircle, Trash2,
  Check, Clock3, MessageCircle, ShieldAlert
} from 'lucide-react';
import {
  adminGetEnquiries,
  adminUpdateEnquiryStatus,
  adminDeleteEnquiry,
} from '../../api/admin';

const STATUS_CONFIG = {
  New: {
    bg: 'rgba(212,160,23,0.15)',
    border: 'rgba(212,160,23,0.4)',
    color: '#f0c040',
    dot: '#f0c040',
  },
  Read: {
    bg: 'rgba(96,165,250,0.15)',
    border: 'rgba(96,165,250,0.35)',
    color: '#60a5fa',
    dot: '#60a5fa',
  },
  Replied: {
    bg: 'rgba(52,211,153,0.15)',
    border: 'rgba(52,211,153,0.35)',
    color: '#34d399',
    dot: '#34d399',
  },
  Closed: {
    bg: 'rgba(156,163,175,0.15)',
    border: 'rgba(156,163,175,0.3)',
    color: '#9ca3af',
    dot: '#9ca3af',
  },
};

const SUBJECT_COLORS = {
  'General Inquiry':  { bg: 'rgba(212,160,23,0.1)',  border: 'rgba(212,160,23,0.25)',  color: '#d4a017' },
  'Technical Support':{ bg: 'rgba(96,165,250,0.1)',  border: 'rgba(96,165,250,0.25)',  color: '#60a5fa' },
  'Billing':          { bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.25)', color: '#a78bfa' },
  'Report Issue':     { bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.25)', color: '#f87171' },
  'Partnership':      { bg: 'rgba(52,211,153,0.1)',  border: 'rgba(52,211,153,0.25)',  color: '#34d399' },
};

const timeAgo = (iso) => {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)   return 'Just now';
  if (mins < 60)  return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30)  return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
};

/* ═══════════════════════════════════════════════════════════════════
   MESSAGES / ENQUIRIES PAGE
═══════════════════════════════════════════════════════════════════ */
const AdminMessagesPage = () => {
  const [enquiries, setEnquiries]     = useState([]);
  const [counts, setCounts]           = useState({ total: 0, newCount: 0, readCount: 0, repliedCount: 0, closedCount: 0 });
  const [pagination, setPagination]   = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  const [selectedMsg, setSelectedMsg] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch]           = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPagination((p) => ({ ...p, page: 1 }));
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch enquiries from backend
  const fetchEnquiries = useCallback(async (page = pagination.page) => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminGetEnquiries({
        page,
        limit: pagination.limit,
        search: debouncedSearch,
        status: statusFilter,
      });

      setEnquiries(data.enquiries || []);
      if (data.pagination) setPagination(data.pagination);
      if (data.counts) setCounts(data.counts);
    } catch (err) {
      console.error('[AdminMessages] Fetch error:', err);
      setError(err.message || 'Failed to load contact enquiries.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, statusFilter, pagination.limit, pagination.page]);

  useEffect(() => {
    fetchEnquiries(pagination.page);
  }, [debouncedSearch, statusFilter, pagination.page]);

  // Open modal & auto-mark as Read if New
  const openMsg = async (msg) => {
    setSelectedMsg(msg);

    if (msg.status === 'New') {
      try {
        await adminUpdateEnquiryStatus(msg._id, 'Read');
        // Update local list
        setEnquiries((prev) =>
          prev.map((e) => (e._id === msg._id ? { ...e, status: 'Read' } : e))
        );
        setSelectedMsg((prev) => (prev ? { ...prev, status: 'Read' } : null));
        // Update counts
        setCounts((c) => ({
          ...c,
          newCount: Math.max(0, c.newCount - 1),
          readCount: c.readCount + 1,
        }));
      } catch (err) {
        console.error('[AdminMessages] Auto-mark read error:', err);
      }
    }
  };

  // Change enquiry status
  const handleUpdateStatus = async (id, newStatus) => {
    setStatusUpdating(true);
    try {
      const res = await adminUpdateEnquiryStatus(id, newStatus);
      const updated = res.enquiry;

      setEnquiries((prev) =>
        prev.map((e) => (e._id === id ? { ...e, status: newStatus } : e))
      );
      if (selectedMsg && selectedMsg._id === id) {
        setSelectedMsg((prev) => ({ ...prev, status: newStatus }));
      }

      // Refresh full counts
      fetchEnquiries(pagination.page);
    } catch (err) {
      console.error('[AdminMessages] Status update error:', err);
      alert(err.message || 'Failed to update status');
    } finally {
      setStatusUpdating(false);
    }
  };

  // Delete enquiry
  const handleDeleteEnquiry = async (id) => {
    try {
      await adminDeleteEnquiry(id);
      setSelectedMsg(null);
      setDeleteConfirmId(null);
      fetchEnquiries(pagination.page);
    } catch (err) {
      console.error('[AdminMessages] Delete error:', err);
      alert(err.message || 'Failed to delete enquiry');
    }
  };

  const subjectStyle = (subject) =>
    SUBJECT_COLORS[subject] || {
      bg: 'rgba(212,160,23,0.1)',
      border: 'rgba(212,160,23,0.25)',
      color: '#d4a017',
    };

  const statusStyle = (status) =>
    STATUS_CONFIG[status] || STATUS_CONFIG.New;

  return (
    <div className="p-4 sm:p-6 lg:p-8 page-enter">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-1" style={{ color: 'rgba(212,160,23,0.6)' }}>
            Admin · Communications
          </p>
          <h1 className="text-2xl sm:text-3xl font-light text-white" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Contact <span className="text-gradient-gold">Enquiries</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(168,144,96,0.6)' }}>
            {counts.total} total enquiries ·{' '}
            <span className={counts.newCount > 0 ? 'text-yellow-400 font-semibold' : ''}>
              {counts.newCount} new
            </span>
          </p>
        </div>

        {/* Refresh Button */}
        <button
          onClick={() => fetchEnquiries(pagination.page)}
          disabled={loading}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all"
          style={{
            background: 'rgba(212,160,23,0.08)',
            border: '1px solid rgba(212,160,23,0.25)',
            color: '#f0c040',
          }}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </motion.div>

      {/* Search and Status Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        {/* Search */}
        <div
          className="flex items-center gap-2 px-4 rounded-xl flex-1 min-w-0"
          style={{ background: 'rgba(20,4,4,0.8)', border: '1px solid rgba(212,160,23,0.2)' }}
        >
          <Search className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(212,160,23,0.5)' }} />
          <input
            type="search"
            placeholder="Search by name, email, subject or message…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent py-2.5 text-sm text-white placeholder-yellow-900/40 focus:outline-none"
          />
          {search && (
            <button onClick={() => setSearch('')}>
              <X className="w-3.5 h-3.5" style={{ color: 'rgba(168,144,96,0.6)' }} />
            </button>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hidden pb-1 sm:pb-0">
          {[
            { id: 'All', label: 'All', count: counts.total },
            { id: 'New', label: 'New', count: counts.newCount },
            { id: 'Read', label: 'Read', count: counts.readCount },
            { id: 'Replied', label: 'Replied', count: counts.repliedCount },
            { id: 'Closed', label: 'Closed', count: counts.closedCount },
          ].map(({ id, label, count }) => {
            const active = statusFilter === id;
            return (
              <button
                key={id}
                onClick={() => {
                  setStatusFilter(id);
                  setPagination((p) => ({ ...p, page: 1 }));
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap"
                style={{
                  background: active ? 'linear-gradient(135deg, #d4a017, #f0c040)' : 'rgba(20,4,4,0.5)',
                  borderColor: active ? '#d4a017' : 'rgba(212,160,23,0.2)',
                  color: active ? '#1a0800' : 'rgba(168,144,96,0.8)',
                  fontWeight: active ? 700 : 500,
                }}
              >
                <span>{label}</span>
                <span
                  className="px-1.5 py-0.2 rounded-full text-[10px]"
                  style={{
                    background: active ? 'rgba(0,0,0,0.2)' : 'rgba(212,160,23,0.15)',
                    color: active ? '#1a0800' : '#f0c040',
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-5 p-4 rounded-xl flex items-center gap-3" style={{ background: 'rgba(224,112,112,0.1)', border: '1px solid rgba(224,112,112,0.3)', color: '#fca5a5' }}>
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
          <p className="text-sm">{error}</p>
          <button onClick={() => fetchEnquiries(pagination.page)} className="ml-auto text-xs underline hover:text-white">Retry</button>
        </div>
      )}

      {/* Enquiries List */}
      <div className="space-y-3">
        {loading && enquiries.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <RefreshCw className="w-8 h-8 text-yellow-500/50 animate-spin mb-3" />
            <p className="text-sm text-yellow-500/60 font-medium">Loading contact enquiries…</p>
          </div>
        ) : enquiries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl glass-card">
            <MessageSquare className="w-12 h-12 mb-4 opacity-25" style={{ color: '#d4a017' }} />
            <p className="text-lg text-white" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              No contact enquiries found
            </p>
            <p className="text-xs mt-1" style={{ color: 'rgba(168,144,96,0.5)' }}>
              {search || statusFilter !== 'All' ? 'Try adjusting your search or filters' : 'New enquiries submitted from the contact form will appear here'}
            </p>
          </div>
        ) : (
          enquiries.map((msg, i) => {
            const sStyle = subjectStyle(msg.subject);
            const stStyle = statusStyle(msg.status);
            const isNew = msg.status === 'New';

            return (
              <motion.div
                key={msg._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.3) }}
                onClick={() => openMsg(msg)}
                className="glass-card card-lift rounded-2xl p-4 sm:p-5 cursor-pointer transition-all"
                style={{
                  border: `1px solid ${isNew ? 'rgba(212,160,23,0.35)' : 'rgba(212,160,23,0.1)'}`,
                  background: isNew ? 'rgba(212,160,23,0.05)' : 'rgba(15,4,4,0.4)',
                }}
              >
                <div className="flex items-start gap-3.5">
                  {/* Initial Avatar */}
                  <div
                    className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold mt-0.5"
                    style={{
                      background: isNew
                        ? 'linear-gradient(135deg, #7c1a1a, #380808)'
                        : 'linear-gradient(135deg, #300606, #1a0303)',
                      color: isNew ? '#f0c040' : '#d4a017',
                      border: isNew ? '1px solid rgba(240,192,64,0.4)' : '1px solid rgba(212,160,23,0.15)',
                      fontFamily: 'Cormorant Garamond, serif',
                    }}
                  >
                    {msg.name ? msg.name[0].toUpperCase() : 'U'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-sm font-semibold text-white">{msg.name}</span>
                      
                      {/* Status badge */}
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 flex-shrink-0"
                        style={{ background: stStyle.bg, border: `1px solid ${stStyle.border}`, color: stStyle.color }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: stStyle.dot }} />
                        {msg.status}
                      </span>

                      {/* Subject tag */}
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                        style={{ background: sStyle.bg, border: `1px solid ${sStyle.border}`, color: sStyle.color }}
                      >
                        {msg.subject}
                      </span>

                      <span className="text-[11px] ml-auto flex-shrink-0" style={{ color: 'rgba(168,144,96,0.6)' }}>
                        {timeAgo(msg.createdAt)}
                      </span>
                    </div>

                    <p className="text-xs mb-1.5" style={{ color: 'rgba(168,144,96,0.7)' }}>
                      {msg.email}
                      {msg.phone ? ` · ${msg.phone}` : ''}
                    </p>

                    <p
                      className="text-xs sm:text-sm line-clamp-2 leading-relaxed"
                      style={{ color: isNew ? '#f5ead0' : 'rgba(245,234,208,0.7)' }}
                    >
                      {msg.message}
                    </p>
                  </div>

                  <div className="flex-shrink-0 self-center hidden sm:block">
                    <Eye className="w-4 h-4 text-yellow-500/40 hover:text-yellow-400 transition-colors" />
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-yellow-900/20">
          <p className="text-xs" style={{ color: 'rgba(168,144,96,0.7)' }}>
            Showing{' '}
            <strong className="text-white">
              {(pagination.page - 1) * pagination.limit + 1}
            </strong>{' '}
            to{' '}
            <strong className="text-white">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </strong>{' '}
            of <strong className="text-white">{pagination.total}</strong> enquiries
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPagination((p) => ({ ...p, page: Math.max(1, p.page - 1) }))}
              disabled={pagination.page <= 1 || loading}
              className="p-2 rounded-lg border text-xs font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                borderColor: 'rgba(212,160,23,0.2)',
                background: 'rgba(20,4,4,0.6)',
                color: '#f0c040',
              }}
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs px-3 py-1 rounded-lg" style={{ background: 'rgba(212,160,23,0.1)', color: '#f0c040' }}>
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <button
              onClick={() => setPagination((p) => ({ ...p, page: Math.min(pagination.totalPages, p.page + 1) }))}
              disabled={pagination.page >= pagination.totalPages || loading}
              className="p-2 rounded-lg border text-xs font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                borderColor: 'rgba(212,160,23,0.2)',
                background: 'rgba(20,4,4,0.6)',
                color: '#f0c040',
              }}
              title="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Enquiry Detail Modal */}
      <AnimatePresence>
        {selectedMsg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
            onClick={(e) => e.target === e.currentTarget && setSelectedMsg(null)}
          >
            <motion.div
              initial={{ scale: 0.94, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 15 }}
              className="glass-premium rounded-2xl w-full max-w-xl max-h-[85vh] overflow-y-auto"
              style={{ border: '1px solid rgba(212,160,23,0.3)', background: '#0e0202' }}
            >
              {/* Modal header */}
              <div
                className="flex items-start justify-between p-5 sticky top-0 z-10"
                style={{
                  background: 'rgba(18,2,2,0.95)',
                  backdropFilter: 'blur(12px)',
                  borderBottom: '1px solid rgba(212,160,23,0.15)',
                }}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="text-lg font-semibold text-white" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                      {selectedMsg.name}
                    </p>
                    {(() => {
                      const sStyle = subjectStyle(selectedMsg.subject);
                      return (
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                          style={{ background: sStyle.bg, border: `1px solid ${sStyle.border}`, color: sStyle.color }}
                        >
                          {selectedMsg.subject}
                        </span>
                      );
                    })()}
                    {(() => {
                      const stStyle = statusStyle(selectedMsg.status);
                      return (
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1"
                          style={{ background: stStyle.bg, border: `1px solid ${stStyle.border}`, color: stStyle.color }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: stStyle.dot }} />
                          {selectedMsg.status}
                        </span>
                      );
                    })()}
                  </div>
                  <p className="text-xs" style={{ color: 'rgba(168,144,96,0.6)' }}>
                    Received: {new Date(selectedMsg.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedMsg(null)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
                  style={{ color: '#a89060' }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal body */}
              <div className="p-5 space-y-4">
                {/* Contact info cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { icon: Mail, label: 'Email', value: selectedMsg.email, href: `mailto:${selectedMsg.email}` },
                    ...(selectedMsg.phone ? [{ icon: Phone, label: 'Phone', value: selectedMsg.phone, href: `tel:${selectedMsg.phone}` }] : [{ icon: Phone, label: 'Phone', value: 'Not provided' }]),
                    { icon: Tag, label: 'Subject', value: selectedMsg.subject },
                    { icon: Clock, label: 'Relative Time', value: timeAgo(selectedMsg.createdAt) },
                  ].map(({ icon: Icon, label, value, href }) => (
                    <div
                      key={label}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl"
                      style={{ background: 'rgba(212,160,23,0.04)', border: '1px solid rgba(212,160,23,0.12)' }}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" style={{ color: '#d4a017' }} />
                      <div className="min-w-0">
                        <p className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: 'rgba(168,144,96,0.6)' }}>
                          {label}
                        </p>
                        {href ? (
                          <a href={href} className="text-xs text-white hover:text-yellow-400 transition-colors truncate block font-medium">
                            {value}
                          </a>
                        ) : (
                          <p className="text-xs text-white truncate font-medium">{value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message body */}
                <div
                  className="p-4 rounded-xl"
                  style={{ background: 'rgba(212,160,23,0.03)', border: '1px solid rgba(212,160,23,0.15)' }}
                >
                  <p className="text-xs uppercase tracking-widest mb-2 font-semibold" style={{ color: '#d4a017' }}>
                    Message Content
                  </p>
                  <p className="text-sm text-white/90 leading-relaxed whitespace-pre-wrap">
                    {selectedMsg.message}
                  </p>
                </div>

                {/* Status Change Selector */}
                <div className="p-3.5 rounded-xl" style={{ background: 'rgba(20,4,4,0.6)', border: '1px solid rgba(212,160,23,0.12)' }}>
                  <p className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: 'rgba(168,144,96,0.7)' }}>
                    Update Status
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {['New', 'Read', 'Replied', 'Closed'].map((st) => {
                      const isCurrent = selectedMsg.status === st;
                      const cfg = statusStyle(st);
                      return (
                        <button
                          key={st}
                          onClick={() => handleUpdateStatus(selectedMsg._id, st)}
                          disabled={statusUpdating || isCurrent}
                          className="py-1.5 px-2 rounded-lg text-xs font-medium border transition-all text-center disabled:opacity-50"
                          style={{
                            background: isCurrent ? cfg.bg : 'transparent',
                            borderColor: isCurrent ? cfg.border : 'rgba(212,160,23,0.15)',
                            color: isCurrent ? cfg.color : 'rgba(168,144,96,0.8)',
                            fontWeight: isCurrent ? 700 : 500,
                          }}
                        >
                          {st}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Reply Action CTA */}
                <a
                  href={`mailto:${selectedMsg.email}?subject=Re: ${encodeURIComponent(selectedMsg.subject)} — Aguaa Support`}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #d4a017, #f0c040)', color: '#1a0800' }}
                >
                  <Mail className="w-4 h-4" />
                  Reply via Email to {selectedMsg.name}
                </a>

                {/* Delete / Dismiss */}
                <div className="pt-2 flex items-center justify-between">
                  {deleteConfirmId === selectedMsg._id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-red-400">Confirm delete?</span>
                      <button
                        onClick={() => handleDeleteEnquiry(selectedMsg._id)}
                        className="px-2.5 py-1 rounded bg-red-600/30 border border-red-500/50 text-red-200 text-xs font-semibold hover:bg-red-600/50"
                      >
                        Yes, Delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-2 py-1 text-xs text-gray-400 hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(selectedMsg._id)}
                      className="flex items-center gap-1.5 text-xs text-red-400/60 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete Enquiry
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedMsg(null)}
                    className="text-xs text-yellow-600/70 hover:text-yellow-500 transition-colors"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminMessagesPage;
