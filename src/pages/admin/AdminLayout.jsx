import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, FileText, Image, MessageSquare,
  Layout, Settings, LogOut, ChevronLeft, ChevronRight,
  Menu, X, Shield, Sparkles,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

/* ── Navigation items — each maps to an existing platform feature ── */
const NAV_ITEMS = [
  { to: '/admin',            icon: LayoutDashboard, label: 'Overview',    exact: true },
  { to: '/admin/users',      icon: Users,           label: 'Users',       exact: false },
  { to: '/admin/biodatas',   icon: FileText,        label: 'Biodatas',    exact: false },
  { to: '/admin/gallery',    icon: Image,           label: 'Gallery',     exact: false },
  { to: '/admin/messages',   icon: MessageSquare,   label: 'Messages',    exact: false },
  { to: '/admin/templates',  icon: Layout,          label: 'Templates',   exact: false },
  { to: '/admin/settings',   icon: Settings,        label: 'Settings',    exact: false },
];

/* ── Gold ornament divider ── */
const GoldDivider = () => (
  <div className="flex items-center gap-2 px-4 py-1">
    <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(212,160,23,0.3), transparent)' }} />
    <Sparkles className="w-3 h-3" style={{ color: 'rgba(212,160,23,0.5)' }} />
    <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(212,160,23,0.3), transparent)' }} />
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   ADMIN LAYOUT
═══════════════════════════════════════════════════════════════════ */
const AdminLayout = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile nav on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const SidebarContent = ({ isMobile = false }) => (
    <aside
      className="flex flex-col h-full"
      style={{
        background: 'linear-gradient(180deg, #0d0000 0%, #100000 60%, #0a0000 100%)',
        borderRight: '1px solid rgba(212,160,23,0.12)',
        width: isMobile ? '280px' : (collapsed ? '72px' : '240px'),
        transition: 'width 0.3s cubic-bezier(0.22,1,0.36,1)',
        minWidth: isMobile ? '280px' : (collapsed ? '72px' : '240px'),
        overflowX: 'hidden',
      }}
    >
      {/* ── Logo ── */}
      <div
        className="flex items-center gap-3 px-4 py-5 select-none"
        style={{ borderBottom: '1px solid rgba(212,160,23,0.1)' }}
      >
        <div
          className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #d4a017, #f0c040)', boxShadow: '0 0 16px rgba(212,160,23,0.4)' }}
        >
          <Shield className="w-4.5 h-4.5" style={{ color: '#1a0800' }} strokeWidth={2.5} />
        </div>

        <AnimatePresence>
          {(!collapsed || isMobile) && (
            <motion.div
              key="logo-text"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <p
                className="text-base font-bold leading-none"
                style={{ fontFamily: 'Cormorant Garamond, serif', color: '#f0c040' }}
              >
                Aguaa Admin
              </p>
              <p className="text-[10px] tracking-widest uppercase mt-0.5" style={{ color: 'rgba(212,160,23,0.5)' }}>
                Control Panel
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Nav Items ── */}
      <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden scrollbar-hidden">
        <GoldDivider />
        <div className="mt-2 px-2 space-y-0.5">
          {NAV_ITEMS.map(({ to, icon: Icon, label, exact }) => {
            const isActive = exact
              ? location.pathname === to
              : location.pathname.startsWith(to) && !(exact && location.pathname !== to);

            return (
              <NavLink
                key={to}
                to={to}
                end={exact}
                className="block"
              >
                {({ isActive: routerActive }) => {
                  const active = exact ? location.pathname === to : routerActive;
                  return (
                    <motion.div
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden"
                      style={{
                        background: active ? 'rgba(212,160,23,0.12)' : 'transparent',
                        border: active ? '1px solid rgba(212,160,23,0.2)' : '1px solid transparent',
                      }}
                      title={collapsed && !isMobile ? label : undefined}
                    >
                      {active && (
                        <motion.div
                          layoutId="nav-indicator"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
                          style={{ background: '#d4a017' }}
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}

                      <Icon
                        className="flex-shrink-0 w-4 h-4 transition-colors duration-200"
                        style={{ color: active ? '#f0c040' : 'rgba(168,144,96,0.7)' }}
                      />

                      <AnimatePresence>
                        {(!collapsed || isMobile) && (
                          <motion.span
                            key="label"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.15 }}
                            className="text-sm font-medium whitespace-nowrap"
                            style={{ color: active ? '#f0c040' : 'rgba(168,144,96,0.8)' }}
                          >
                            {label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                }}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* ── User + Logout ── */}
      <div style={{ borderTop: '1px solid rgba(212,160,23,0.1)' }} className="p-3">
        {/* User info */}
        {(!collapsed || isMobile) && (
          <div
            className="flex items-center gap-3 px-3 py-2.5 mb-2 rounded-xl"
            style={{ background: 'rgba(212,160,23,0.05)', border: '1px solid rgba(212,160,23,0.1)' }}
          >
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border border-yellow-700/40 flex-shrink-0"
              />
            ) : (
              <div
                className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
                style={{ background: 'linear-gradient(135deg, #5c0a0a, #2a0505)', color: '#f0c040' }}
              >
                {currentUser?.name?.[0]?.toUpperCase() || 'A'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{currentUser?.name || 'Admin'}</p>
              <p className="text-[10px] truncate" style={{ color: 'rgba(212,160,23,0.6)' }}>
                {currentUser?.email || ''}
              </p>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all duration-200 hover:bg-red-950/50 group"
          style={{ border: '1px solid transparent' }}
          title={collapsed && !isMobile ? 'Logout' : undefined}
        >
          <LogOut className="flex-shrink-0 w-4 h-4 text-red-500/60 group-hover:text-red-400 transition-colors" />
          {(!collapsed || isMobile) && (
            <span className="text-sm font-medium text-red-500/60 group-hover:text-red-400 transition-colors whitespace-nowrap">
              Sign Out
            </span>
          )}
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#080000' }}>

      {/* ── Desktop Sidebar ── */}
      <div className="hidden lg:flex flex-col flex-shrink-0" style={{ position: 'relative' }}>
        <SidebarContent />
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{
            background: '#0d0000',
            border: '1px solid rgba(212,160,23,0.35)',
            color: '#d4a017',
            boxShadow: '0 0 12px rgba(212,160,23,0.2)',
          }}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed
            ? <ChevronRight className="w-3 h-3" />
            : <ChevronLeft  className="w-3 h-3" />
          }
        </button>
      </div>

      {/* ── Mobile Drawer Overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 z-50 lg:hidden flex"
          >
            <SidebarContent isMobile />
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(212,160,23,0.1)', color: '#a89060' }}
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header
          className="flex-shrink-0 flex items-center gap-3 px-4 lg:px-6 py-3.5"
          style={{
            background: 'rgba(8,0,0,0.9)',
            borderBottom: '1px solid rgba(212,160,23,0.1)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            style={{ background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.15)', color: '#a89060' }}
            aria-label="Open navigation"
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Page title */}
          <div className="flex-1">
            <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'rgba(212,160,23,0.5)' }}>
              Aguaa Admin
            </p>
          </div>

          {/* Live badge */}
          <span className="badge-live text-xs text-emerald-400/70">Live</span>
        </header>

        {/* Page content */}
        <main
          className="flex-1 overflow-y-auto"
          style={{ background: 'linear-gradient(180deg, #0d0000 0%, #0a0000 100%)' }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
