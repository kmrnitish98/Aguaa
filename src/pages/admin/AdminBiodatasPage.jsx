import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, FileText, Globe, Lock, Eye, Trash2,
  AlertTriangle, RefreshCw, ChevronLeft, ChevronRight,
  Filter, X, ExternalLink,
} from 'lucide-react';
import {
  adminGetBiodatas,
  adminToggleBiodataVisibility,
  adminDeleteBiodata,
} from '../../api/admin';
import { useToast } from '../../context/ToastContext';

const FILTERS = [
  { value: 'all',     label: 'All Profiles' },
  { value: 'public',  label: 'Public' },
  { value: 'private', label: 'Private' },
];

/* ── Age from DOB ── */
const calcAge = (dob) => {
  if (!dob) return null;
  const d = new Date(dob);
  if (isNaN(d)) return null;
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  if (today.getMonth() < d.getMonth() || (today.getMonth() === d.getMonth() && today.getDate() < d.getDate())) age--;
  return age > 0 ? age : null;
};

/* ═══════════════════════════════════════════════════════════════════
   BIODATAS PAGE
═══════════════════════════════════════════════════════════════════ */
const AdminBiodatasPage = () => {
  const toast = useToast();
  const [biodatas, setBiodatas]   = useState([]);
  const [total, setTotal]         = useState(0);
  const [page, setPage]           = useState(1);
  const [pages, setPages]         = useState(1);
  const [search, setSearch]       = useState('');
  const [inputVal, setInputVal]   = useState('');
  const [filter, setFilter]       = useState('all');
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [actionId, setActionId]   = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);

  const load = useCallback(async (pg = 1, q = search, f = filter) => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminGetBiodatas({ page: pg, limit: 20, search: q, filter: f });
      setBiodatas(data.biodatas || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
      setPage(pg);
    } catch (err) {
      setError(err.message || 'Failed to load biodatas');
    } finally {
      setLoading(false);
    }
  }, [search, filter]);

  useEffect(() => { load(1, '', 'all'); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(inputVal);
    load(1, inputVal, filter);
  };

  const handleFilterChange = (f) => {
    setFilter(f);
    load(1, search, f);
  };

  const handleToggleVisibility = async (id) => {
    setActionId(id);
    try {
      const res = await adminToggleBiodataVisibility(id);
      setBiodatas((prev) => prev.map((b) => b._id === id ? { ...b, isPublic: res.isPublic } : b));
      toast.success(res.isPublic ? 'Profile made public' : 'Profile made private');
    } catch (err) {
      toast.error(err.message || 'Failed to update visibility');
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id) => {
    setActionId(id);
    try {
      await adminDeleteBiodata(id);
      setBiodatas((prev) => prev.filter((b) => b._id !== id));
      setTotal((t) => t - 1);
      toast.success('Biodata deleted');
    } catch (err) {
      toast.error(err.message || 'Delete failed');
    } finally {
      setActionId(null);
      setConfirmDel(null);
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

  return (
    <div className="p-4 sm:p-6 lg:p-8 page-enter">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-1" style={{ color: 'rgba(212,160,23,0.6)' }}>
          Admin · Biodatas
        </p>
        <h1 className="text-2xl sm:text-3xl font-light text-white" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
          Manage <span className="text-gradient-gold">Biodatas</span>
        </h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(168,144,96,0.6)' }}>
          {total.toLocaleString()} biodata profile{total !== 1 ? 's' : ''} on the platform
        </p>
      </motion.div>

      {/* Search + Filter */}
      <div className="flex flex-wrap gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-0 max-w-xl">
          <div
            className="flex-1 flex items-center gap-2 px-4 rounded-xl"
            style={{ background: 'rgba(20,4,4,0.8)', border: '1px solid rgba(212,160,23,0.2)' }}
          >
            <Search className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(212,160,23,0.5)' }} />
            <input
              type="search"
              placeholder="Search by name, city, or religion…"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 bg-transparent py-2.5 text-sm text-white placeholder-yellow-900/40 focus:outline-none"
            />
            {inputVal && (
              <button type="button" onClick={() => { setInputVal(''); setSearch(''); load(1, '', filter); }}>
                <X className="w-3.5 h-3.5" style={{ color: 'rgba(168,144,96,0.6)' }} />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl text-sm font-medium"
            style={{ background: 'linear-gradient(135deg, #d4a017, #f0c040)', color: '#1a0800' }}
          >
            Search
          </button>
        </form>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: 'rgba(20,4,4,0.8)', border: '1px solid rgba(212,160,23,0.15)' }}>
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => handleFilterChange(f.value)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: filter === f.value ? 'linear-gradient(135deg, #d4a017, #f0c040)' : 'transparent',
                color: filter === f.value ? '#1a0800' : 'rgba(168,144,96,0.7)',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => load(page, search, filter)}
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)', color: '#d4a017' }}
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="mb-5 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
          style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)', color: '#f87171' }}>
          ⚠ {error}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-card rounded-2xl h-40 animate-pulse" style={{ background: 'rgba(20,5,5,0.6)' }} />
          ))}
        </div>
      ) : biodatas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FileText className="w-12 h-12 mb-4 opacity-20" style={{ color: '#d4a017' }} />
          <p className="text-base text-white" style={{ fontFamily: 'Cormorant Garamond, serif' }}>No biodatas found</p>
          <p className="text-xs mt-1" style={{ color: 'rgba(168,144,96,0.5)' }}>Try adjusting your search or filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {biodatas.map((b, i) => {
            const name    = b.personalInfo?.fullName || 'Unnamed';
            const city    = b.personalInfo?.city || '';
            const religion = b.personalInfo?.religion || '';
            const age     = calcAge(b.personalInfo?.dob);
            const owner   = b.userId;
            const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

            return (
              <motion.div
                key={b._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="glass-card rounded-2xl overflow-hidden card-lift group"
                style={{ border: '1px solid rgba(212,160,23,0.1)' }}
              >
                {/* Card header */}
                <div
                  className="flex items-center gap-3 p-4"
                  style={{ borderBottom: '1px solid rgba(212,160,23,0.07)' }}
                >
                  {/* Photo */}
                  {b.photoURL ? (
                    <img src={b.photoURL} alt={name} className="w-12 h-16 rounded-lg object-cover border border-yellow-700/25 flex-shrink-0" />
                  ) : (
                    <div
                      className="w-12 h-16 rounded-lg flex items-center justify-center flex-shrink-0 text-lg font-bold"
                      style={{ background: 'linear-gradient(135deg, #3d0808, #1a0505)', border: '1px solid rgba(212,160,23,0.2)', color: '#d4a017', fontFamily: 'Cormorant Garamond, serif' }}
                    >
                      {initials}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate" style={{ fontFamily: 'Playfair Display, serif' }}>
                      {name}
                    </p>
                    {city && <p className="text-xs truncate mt-0.5" style={{ color: 'rgba(168,144,96,0.7)' }}>{city}</p>}
                    {age && <p className="text-xs" style={{ color: 'rgba(168,144,96,0.6)' }}>{age} yrs</p>}
                    {religion && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full mt-1 inline-block"
                        style={{ background: 'rgba(212,160,23,0.1)', border: '1px solid rgba(212,160,23,0.2)', color: '#d4a017' }}>
                        {religion}
                      </span>
                    )}
                  </div>

                  {/* Visibility badge */}
                  <span
                    className="flex-shrink-0 flex items-center gap-1 text-[10px] px-2 py-1 rounded-full font-medium"
                    style={{
                      background: b.isPublic ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${b.isPublic ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.08)'}`,
                      color: b.isPublic ? '#4ade80' : '#6b7280',
                    }}
                  >
                    {b.isPublic ? <Globe className="w-2.5 h-2.5" /> : <Lock className="w-2.5 h-2.5" />}
                    {b.isPublic ? 'Public' : 'Private'}
                  </span>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-4 py-3 gap-2">
                  {/* Owner */}
                  <div className="flex items-center gap-1.5 min-w-0">
                    {owner?.avatar ? (
                      <img src={owner.avatar} alt="" className="w-4 h-4 rounded-full object-cover" />
                    ) : (
                      <div className="w-4 h-4 rounded-full flex items-center justify-center text-[8px]"
                        style={{ background: '#3d0808', color: '#d4a017' }}>
                        {owner?.name?.[0]?.toUpperCase() || '?'}
                      </div>
                    )}
                    <span className="text-[10px] truncate" style={{ color: 'rgba(168,144,96,0.6)' }}>
                      {owner?.name || 'Unknown user'}
                    </span>
                  </div>

                  <span className="text-[10px] flex-shrink-0" style={{ color: 'rgba(168,144,96,0.4)' }}>
                    {formatDate(b.createdAt)}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {/* View */}
                    <Link to={`/profile/${b._id}`} target="_blank" rel="noopener noreferrer">
                      <button
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                        style={{ background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.15)' }}
                        title="View profile"
                      >
                        <ExternalLink className="w-3.5 h-3.5" style={{ color: '#d4a017' }} />
                      </button>
                    </Link>

                    {/* Toggle visibility */}
                    <button
                      onClick={() => handleToggleVisibility(b._id)}
                      disabled={actionId === b._id}
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                      style={{
                        background: b.isPublic ? 'rgba(255,255,255,0.04)' : 'rgba(34,197,94,0.08)',
                        border: `1px solid ${b.isPublic ? 'rgba(255,255,255,0.08)' : 'rgba(34,197,94,0.2)'}`,
                      }}
                      title={b.isPublic ? 'Make private' : 'Make public'}
                    >
                      {b.isPublic
                        ? <Lock className="w-3.5 h-3.5" style={{ color: '#9ca3af' }} />
                        : <Globe className="w-3.5 h-3.5" style={{ color: '#4ade80' }} />
                      }
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => setConfirmDel(b._id)}
                      disabled={actionId === b._id}
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                      style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.15)' }}
                      title="Delete biodata"
                    >
                      <Trash2 className="w-3.5 h-3.5" style={{ color: '#f87171' }} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={() => load(page - 1, search, filter)}
            disabled={page === 1 || loading}
            className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-30"
            style={{ background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)', color: '#d4a017' }}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm" style={{ color: 'rgba(168,144,96,0.7)' }}>Page {page} of {pages}</span>
          <button
            onClick={() => load(page + 1, search, filter)}
            disabled={page === pages || loading}
            className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-30"
            style={{ background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)', color: '#d4a017' }}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Delete Confirm */}
      <AnimatePresence>
        {confirmDel && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={(e) => e.target === e.currentTarget && setConfirmDel(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="glass-card rounded-2xl p-6 max-w-sm w-full text-center"
              style={{ border: '1px solid rgba(220,38,38,0.3)' }}
            >
              <AlertTriangle className="w-10 h-10 mx-auto mb-3 text-red-400" />
              <h3 className="text-lg font-semibold text-white mb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Delete Biodata?</h3>
              <p className="text-sm mb-5" style={{ color: 'rgba(168,144,96,0.7)' }}>This permanently removes the biodata profile. Cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDel(null)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                  style={{ background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)', color: '#a89060' }}
                >Cancel</button>
                <button
                  onClick={() => handleDelete(confirmDel)}
                  disabled={!!actionId}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #dc2626, #ef4444)', color: 'white' }}
                >
                  {actionId ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminBiodatasPage;
