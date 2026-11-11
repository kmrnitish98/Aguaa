import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Users, Trash2, AlertTriangle, RefreshCw,
  UserCheck, UserX, ChevronLeft, ChevronRight, X,
} from 'lucide-react';
import { adminGetUsers, adminToggleUserDisable, adminDeleteUser } from '../../api/admin';
import { useToast } from '../../context/ToastContext';

/* ── Empty ── */
const Empty = ({ search }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <Users className="w-12 h-12 mb-4 opacity-20" style={{ color: '#d4a017' }} />
    <p className="text-base text-white mb-1" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
      {search ? 'No users found' : 'No users yet'}
    </p>
    <p className="text-xs" style={{ color: 'rgba(168,144,96,0.5)' }}>
      {search ? `No results for "${search}"` : 'Users will appear here once they sign up'}
    </p>
  </div>
);

/* ── Auth type badge ── */
const AuthBadge = ({ user }) => (
  <span
    className="text-[10px] px-2 py-0.5 rounded-full font-medium"
    style={{
      background: user.googleId ? 'rgba(66,133,244,0.12)' : 'rgba(212,160,23,0.08)',
      border: `1px solid ${user.googleId ? 'rgba(66,133,244,0.3)' : 'rgba(212,160,23,0.2)'}`,
      color: user.googleId ? '#93c5fd' : '#d4a017',
    }}
  >
    {user.googleId ? 'Google' : 'Email'}
  </span>
);

/* ═══════════════════════════════════════════════════════════════════
   USERS PAGE
═══════════════════════════════════════════════════════════════════ */
const AdminUsersPage = () => {
  const toast = useToast();
  const [users, setUsers]         = useState([]);
  const [total, setTotal]         = useState(0);
  const [page, setPage]           = useState(1);
  const [pages, setPages]         = useState(1);
  const [search, setSearch]       = useState('');
  const [inputVal, setInputVal]   = useState('');
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [actionId, setActionId]   = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);

  const load = useCallback(async (pg = page, q = search) => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminGetUsers({ page: pg, limit: 20, search: q });
      setUsers(data.users || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
      setPage(pg);
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { load(1, ''); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(inputVal);
    load(1, inputVal);
  };

  const handleToggleDisable = async (id) => {
    setActionId(id);
    try {
      const res = await adminToggleUserDisable(id);
      setUsers((prev) => prev.map((u) => u._id === id ? { ...u, isDisabled: res.isDisabled } : u));
      toast.success(res.isDisabled ? 'User disabled' : 'User enabled');
    } catch (err) {
      toast.error(err.message || 'Action failed');
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id) => {
    setActionId(id);
    try {
      await adminDeleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      setTotal((t) => t - 1);
      toast.success('User deleted');
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
          Admin · Users
        </p>
        <h1 className="text-2xl sm:text-3xl font-light text-white" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
          Manage <span className="text-gradient-gold">Users</span>
        </h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(168,144,96,0.6)' }}>
          {total.toLocaleString()} registered user{total !== 1 ? 's' : ''} on Aguaa
        </p>
      </motion.div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6 max-w-xl">
        <div
          className="flex-1 flex items-center gap-2 px-4 rounded-xl"
          style={{
            background: 'rgba(20,4,4,0.8)',
            border: '1px solid rgba(212,160,23,0.2)',
          }}
        >
          <Search className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(212,160,23,0.5)' }} />
          <input
            type="search"
            placeholder="Search by name or email…"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="flex-1 bg-transparent py-2.5 text-sm text-white placeholder-yellow-900/40 focus:outline-none"
          />
          {inputVal && (
            <button type="button" onClick={() => { setInputVal(''); setSearch(''); load(1, ''); }}>
              <X className="w-3.5 h-3.5" style={{ color: 'rgba(168,144,96,0.6)' }} />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ background: 'linear-gradient(135deg, #d4a017, #f0c040)', color: '#1a0800' }}
        >
          Search
        </button>
        <button
          type="button"
          onClick={() => load(page, search)}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
          style={{ background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)', color: '#d4a017' }}
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="mb-5 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
          style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)', color: '#f87171' }}>
          ⚠ {error}
        </div>
      )}

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl overflow-hidden"
        style={{ border: '1px solid rgba(212,160,23,0.1)' }}
      >
        {/* Table header */}
        <div
          className="grid text-[10px] font-semibold uppercase tracking-widest px-5 py-3"
          style={{
            gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 1fr auto',
            color: 'rgba(168,144,96,0.6)',
            background: 'rgba(212,160,23,0.04)',
            borderBottom: '1px solid rgba(212,160,23,0.08)',
          }}
        >
          <span>Name</span>
          <span>Email</span>
          <span>Auth</span>
          <span>Joined</span>
          <span>Biodatas</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {loading ? (
          <div className="p-8 flex justify-center">
            <RefreshCw className="w-5 h-5 animate-spin" style={{ color: 'rgba(212,160,23,0.5)' }} />
          </div>
        ) : users.length === 0 ? (
          <Empty search={search} />
        ) : (
          <div>
            {users.map((user, i) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="grid items-center px-5 py-3.5 group"
                style={{
                  gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 1fr auto',
                  borderBottom: '1px solid rgba(212,160,23,0.05)',
                  background: user.isDisabled ? 'rgba(220,38,38,0.04)' : 'transparent',
                }}
              >
                {/* Name */}
                <div className="flex items-center gap-2.5 min-w-0">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover border border-yellow-700/30 flex-shrink-0" />
                  ) : (
                    <div
                      className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold"
                      style={{ background: 'linear-gradient(135deg, #5c0a0a, #2a0505)', color: '#f0c040' }}
                    >
                      {user.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <span className="text-sm text-white truncate">{user.name}</span>
                </div>

                {/* Email */}
                <span className="text-sm truncate pr-2" style={{ color: 'rgba(168,144,96,0.8)' }}>{user.email}</span>

                {/* Auth */}
                <div><AuthBadge user={user} /></div>

                {/* Joined */}
                <span className="text-xs" style={{ color: 'rgba(168,144,96,0.6)' }}>{formatDate(user.createdAt)}</span>

                {/* Biodatas */}
                <span className="text-sm text-white font-medium">{user.biodataCount ?? 0}</span>

                {/* Status */}
                <div>
                  {user.isAdmin ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(212,160,23,0.15)', border: '1px solid rgba(212,160,23,0.3)', color: '#d4a017' }}>
                      Admin
                    </span>
                  ) : user.isDisabled ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.25)', color: '#f87171' }}>
                      Disabled
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: '#4ade80' }}>
                      Active
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!user.isAdmin && (
                    <>
                      {/* Disable/Enable */}
                      <button
                        onClick={() => handleToggleDisable(user._id)}
                        disabled={actionId === user._id}
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                        style={{
                          background: user.isDisabled ? 'rgba(34,197,94,0.12)' : 'rgba(212,160,23,0.1)',
                          border: `1px solid ${user.isDisabled ? 'rgba(34,197,94,0.25)' : 'rgba(212,160,23,0.2)'}`,
                        }}
                        title={user.isDisabled ? 'Enable user' : 'Disable user'}
                      >
                        {user.isDisabled
                          ? <UserCheck className="w-3.5 h-3.5" style={{ color: '#4ade80' }} />
                          : <UserX className="w-3.5 h-3.5" style={{ color: '#d4a017' }} />
                        }
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => setConfirmDel(user._id)}
                        disabled={actionId === user._id}
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                        style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)' }}
                        title="Delete user"
                      >
                        <Trash2 className="w-3.5 h-3.5" style={{ color: '#f87171' }} />
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-5">
          <button
            onClick={() => load(page - 1, search)}
            disabled={page === 1 || loading}
            className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-30 transition-all"
            style={{ background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)', color: '#d4a017' }}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm" style={{ color: 'rgba(168,144,96,0.7)' }}>
            Page {page} of {pages}
          </span>
          <button
            onClick={() => load(page + 1, search)}
            disabled={page === pages || loading}
            className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-30 transition-all"
            style={{ background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)', color: '#d4a017' }}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Delete Confirm Modal */}
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
              <h3 className="text-lg font-semibold text-white mb-1" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Delete User?
              </h3>
              <p className="text-sm mb-5" style={{ color: 'rgba(168,144,96,0.7)' }}>
                This will permanently delete the user and all their biodatas. This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDel(null)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{ background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)', color: '#a89060' }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(confirmDel)}
                  disabled={!!actionId}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #dc2626, #ef4444)', color: 'white' }}
                >
                  {actionId ? 'Deleting…' : 'Delete User'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminUsersPage;
