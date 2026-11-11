import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, FileText, Globe, Lock, MessageSquare,
  TrendingUp, UserPlus, Eye, ArrowUpRight, RefreshCw,
  BarChart3, Image, Clock,
} from 'lucide-react';
import { adminGetStats, adminGetAnalytics } from '../../api/admin';

/* ── Animated counter ── */
const AnimatedCount = ({ value }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!value) return;
    let start = 0;
    const step = Math.ceil(value / 30);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setDisplay(value); clearInterval(timer); }
      else setDisplay(start);
    }, 20);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{display.toLocaleString()}</span>;
};

/* ── Stat card ── */
const StatCard = ({ icon: Icon, label, value, color, gradient, to }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -3 }}
    className="glass-card card-lift rounded-2xl p-5 relative overflow-hidden"
    style={{ border: `1px solid ${color}20` }}
  >
    {/* Background glow */}
    <div
      className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-15 blur-2xl"
      style={{ background: gradient }}
    />

    <div className="relative z-10">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
        style={{ background: `${color}18`, border: `1px solid ${color}30` }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>

      <p className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
        <AnimatedCount value={value ?? 0} />
      </p>

      <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'rgba(168,144,96,0.7)' }}>
        {label}
      </p>

      {to && (
        <Link
          to={to}
          className="mt-3 inline-flex items-center gap-1 text-xs transition-colors hover:text-yellow-400"
          style={{ color: 'rgba(212,160,23,0.7)' }}
        >
          View all <ArrowUpRight className="w-3 h-3" />
        </Link>
      )}
    </div>
  </motion.div>
);

/* ── Spark bar chart ── */
const SparkChart = ({ data }) => {
  if (!data?.length) return null;
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="flex items-end gap-1 h-16">
      {data.map((d, i) => (
        <motion.div
          key={d._id}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: i * 0.02, duration: 0.4 }}
          className="flex-1 rounded-t-sm origin-bottom"
          style={{
            height: `${Math.max(4, (d.count / max) * 100)}%`,
            background: `linear-gradient(to top, rgba(212,160,23,0.7), rgba(240,192,64,0.4))`,
            minWidth: '6px',
          }}
          title={`${d._id}: ${d.count}`}
        />
      ))}
    </div>
  );
};

/* ── Recent user row ── */
const UserRow = ({ user }) => {
  const initials = user.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'U';
  return (
    <div className="flex items-center gap-3 py-2.5" style={{ borderBottom: '1px solid rgba(212,160,23,0.07)' }}>
      {user.avatar ? (
        <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-yellow-700/30 flex-shrink-0" />
      ) : (
        <div
          className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
          style={{ background: 'linear-gradient(135deg, #5c0a0a, #2a0505)', color: '#f0c040' }}
        >
          {initials}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white font-medium truncate">{user.name}</p>
        <p className="text-xs truncate" style={{ color: 'rgba(168,144,96,0.6)' }}>{user.email}</p>
      </div>
      <span
        className="text-[10px] px-2 py-0.5 rounded-full flex-shrink-0"
        style={{
          background: user.googleId ? 'rgba(66,133,244,0.12)' : 'rgba(212,160,23,0.08)',
          border: `1px solid ${user.googleId ? 'rgba(66,133,244,0.25)' : 'rgba(212,160,23,0.2)'}`,
          color: user.googleId ? '#93c5fd' : '#d4a017',
        }}
      >
        {user.googleId ? 'Google' : 'Email'}
      </span>
    </div>
  );
};

/* ── Recent biodata row ── */
const BiodataRow = ({ biodata }) => (
  <div className="flex items-center gap-3 py-2.5" style={{ borderBottom: '1px solid rgba(212,160,23,0.07)' }}>
    {biodata.photoURL ? (
      <img src={biodata.photoURL} alt="" className="w-8 h-8 rounded-lg object-cover border border-yellow-700/30 flex-shrink-0" />
    ) : (
      <div
        className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold"
        style={{ background: 'linear-gradient(135deg, #3d0808, #1a0505)', color: '#d4a017' }}
      >
        💍
      </div>
    )}
    <div className="flex-1 min-w-0">
      <p className="text-sm text-white font-medium truncate">{biodata.personalInfo?.fullName || 'Unnamed'}</p>
      <p className="text-xs truncate" style={{ color: 'rgba(168,144,96,0.6)' }}>{biodata.personalInfo?.city || '—'}</p>
    </div>
    <span
      className="text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 flex items-center gap-1"
      style={{
        background: biodata.isPublic ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${biodata.isPublic ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.08)'}`,
        color: biodata.isPublic ? '#4ade80' : '#6b7280',
      }}
    >
      {biodata.isPublic ? <Globe className="w-2.5 h-2.5" /> : <Lock className="w-2.5 h-2.5" />}
      {biodata.isPublic ? 'Public' : 'Private'}
    </span>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   DASHBOARD PAGE
═══════════════════════════════════════════════════════════════════ */
const AdminDashboardPage = () => {
  const [stats, setStats]         = useState(null);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [s, a] = await Promise.all([adminGetStats(), adminGetAnalytics()]);
      setStats(s);
      setAnalytics(Array.isArray(a) ? a : []);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 page-enter">

      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-7 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-1" style={{ color: 'rgba(212,160,23,0.6)' }}>
            Admin Panel
          </p>
          <h1
            className="text-2xl sm:text-3xl font-light text-white"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Platform <span className="text-gradient-gold">Overview</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(168,144,96,0.6)' }}>
            Real-time stats from the Aguaa Biodata platform
          </p>
        </div>

        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all disabled:opacity-50"
          style={{
            background: 'rgba(212,160,23,0.08)',
            border: '1px solid rgba(212,160,23,0.2)',
            color: '#d4a017',
          }}
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </motion.div>

      {error && (
        <div
          className="mb-6 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
          style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)', color: '#f87171' }}
        >
          ⚠ {error}
        </div>
      )}

      {loading && !stats ? (
        /* Skeleton */
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-5 h-32 animate-pulse" style={{ background: 'rgba(20,5,5,0.6)' }} />
          ))}
        </div>
      ) : stats && (
        <>
          {/* ── Stat Cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={Users} label="Total Users" value={stats.totalUsers}
              color="#d4a017" gradient="radial-gradient(circle, #d4a017, transparent)"
              to="/admin/users"
            />
            <StatCard
              icon={FileText} label="Total Biodatas" value={stats.totalBiodatas}
              color="#f0c040" gradient="radial-gradient(circle, #f0c040, transparent)"
              to="/admin/biodatas"
            />
            <StatCard
              icon={Globe} label="Public Profiles" value={stats.publicBiodatas}
              color="#4ade80" gradient="radial-gradient(circle, #4ade80, transparent)"
              to="/admin/biodatas?filter=public"
            />
            <StatCard
              icon={Lock} label="Private Profiles" value={stats.privateBiodatas}
              color="#9ca3af" gradient="radial-gradient(circle, #9ca3af, transparent)"
              to="/admin/biodatas?filter=private"
            />
            <StatCard
              icon={UserPlus} label="Email Signups" value={stats.emailUsers}
              color="#a78bfa" gradient="radial-gradient(circle, #a78bfa, transparent)"
            />
            <StatCard
              icon={Eye} label="Google OAuth" value={stats.googleUsers}
              color="#60a5fa" gradient="radial-gradient(circle, #60a5fa, transparent)"
            />
            <StatCard
              icon={MessageSquare} label="Contact Enquiries" value={stats.totalEnquiries ?? 0}
              sub={stats.newEnquiries > 0 ? `${stats.newEnquiries} new` : undefined}
              color="#34d399" gradient="radial-gradient(circle, #34d399, transparent)"
              to="/admin/messages"
            />
          </div>

          {/* ── Chart + Recent ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Biodata chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 glass-card rounded-2xl p-5"
              style={{ border: '1px solid rgba(212,160,23,0.1)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p
                    className="text-base font-semibold text-white"
                    style={{ fontFamily: 'Cormorant Garamond, serif' }}
                  >
                    Biodatas Created
                  </p>
                  <p className="text-xs" style={{ color: 'rgba(168,144,96,0.6)' }}>Last 30 days</p>
                </div>
                <BarChart3 className="w-4 h-4" style={{ color: 'rgba(212,160,23,0.4)' }} />
              </div>

              {analytics.length > 0 ? (
                <>
                  <SparkChart data={analytics} />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px]" style={{ color: 'rgba(168,144,96,0.5)' }}>
                      {analytics[0]?._id}
                    </span>
                    <span className="text-[10px]" style={{ color: 'rgba(168,144,96,0.5)' }}>
                      {analytics[analytics.length - 1]?._id}
                    </span>
                  </div>
                  <p className="text-sm mt-3 text-white font-medium">
                    {analytics.reduce((s, d) => s + d.count, 0)}{' '}
                    <span style={{ color: 'rgba(168,144,96,0.7)' }}>biodatas created this period</span>
                  </p>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-20 text-center">
                  <TrendingUp className="w-8 h-8 mb-2" style={{ color: 'rgba(212,160,23,0.2)' }} />
                  <p className="text-xs" style={{ color: 'rgba(168,144,96,0.4)' }}>No activity data yet</p>
                </div>
              )}
            </motion.div>

            {/* Recent Users */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card rounded-2xl p-5"
              style={{ border: '1px solid rgba(212,160,23,0.1)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-base font-semibold text-white" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  Recent Users
                </p>
                <Link to="/admin/users" className="text-xs transition-colors hover:text-yellow-400" style={{ color: 'rgba(212,160,23,0.7)' }}>
                  View all →
                </Link>
              </div>
              <div>
                {stats.recentUsers?.map((u) => (
                  <UserRow key={u._id} user={u} />
                ))}
                {!stats.recentUsers?.length && (
                  <p className="text-xs text-center py-4" style={{ color: 'rgba(168,144,96,0.4)' }}>No users yet</p>
                )}
              </div>
            </motion.div>
          </div>

          {/* ── Recent Biodatas ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-5 glass-card rounded-2xl p-5"
            style={{ border: '1px solid rgba(212,160,23,0.1)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-base font-semibold text-white" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Recent Biodatas
              </p>
              <Link to="/admin/biodatas" className="text-xs transition-colors hover:text-yellow-400" style={{ color: 'rgba(212,160,23,0.7)' }}>
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6">
              {stats.recentBiodatas?.map((b) => (
                <BiodataRow key={b._id} biodata={b} />
              ))}
            </div>
            {!stats.recentBiodatas?.length && (
              <p className="text-xs text-center py-4" style={{ color: 'rgba(168,144,96,0.4)' }}>No biodatas yet</p>
            )}
          </motion.div>

          {/* ── Quick Links ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {[
              { to: '/admin/gallery',   icon: Image,          label: 'Gallery',   sub: 'Manage photos' },
              { to: '/admin/messages',  icon: MessageSquare,  label: 'Messages',  sub: 'Contact forms' },
              { to: '/admin/templates', icon: BarChart3,      label: 'Templates', sub: 'PDF preview' },
              { to: '/admin/settings',  icon: Clock,          label: 'Settings',  sub: 'Site config' },
            ].map(({ to, icon: Icon, label, sub }) => (
              <Link key={to} to={to}>
                <motion.div
                  whileHover={{ y: -3, borderColor: 'rgba(212,160,23,0.3)' }}
                  className="glass-card rounded-xl p-4 flex items-center gap-3 transition-all duration-200 cursor-pointer"
                  style={{ border: '1px solid rgba(212,160,23,0.1)' }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(212,160,23,0.08)' }}
                  >
                    <Icon className="w-4 h-4" style={{ color: '#d4a017' }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{label}</p>
                    <p className="text-[10px]" style={{ color: 'rgba(168,144,96,0.6)' }}>{sub}</p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default AdminDashboardPage;
