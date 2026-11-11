import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const DISMISS_KEY = 'aguaa_mobile_cta_dismissed';

/**
 * MobileCTA — sticky bottom CTA bar for logged-out users on mobile.
 * Shown on all public pages. Dismissible (persisted in localStorage).
 * Hidden on md+ screens (desktop has nav CTAs).
 */
const MobileCTA = () => {
  const { currentUser, loading } = useAuth();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Don't show if dismissed or if user is logged in
    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (!dismissed && !loading && !currentUser) {
      // Small delay so it doesn't pop in immediately on page load
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, [loading, currentUser]);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, '1');
    setVisible(false);
  };

  // Hidden on desktop, hidden when logged in
  if (currentUser || loading) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0,  opacity: 1 }}
          exit={{    y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
          style={{
            background: 'rgba(10,2,0,0.94)',
            borderTop: '1px solid rgba(184,134,11,0.25)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 -8px 32px rgba(0,0,0,0.5)',
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
        >
          <div className="flex items-center gap-3 px-4 py-3">
            {/* Icon */}
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-yellow-900/30 border border-yellow-800/40 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-yellow-500" />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium leading-tight">
                Create your free biodata
              </p>
              <p className="text-amber-200/90 text-xs truncate">
                100% free · Print-ready · Private by default
              </p>
            </div>

            {/* CTA */}
            <Link
              to="/signup"
              onClick={dismiss}
              className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold ripple-container
                         bg-gradient-to-r from-yellow-700 to-yellow-500 text-black
                         hover:from-yellow-600 hover:to-yellow-400 transition-all
                         shadow-[0_0_16px_rgba(212,160,23,0.35)]
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
            >
              Get Started
            </Link>

            {/* Dismiss — 44x44px touch target with 28px visual indicator */}
            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss notification"
              className="flex-shrink-0 w-11 h-11 -mr-2 rounded-full flex items-center justify-center text-gray-300 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500"
            >
              <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileCTA;
