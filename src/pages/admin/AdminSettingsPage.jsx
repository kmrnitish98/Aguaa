import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings, Mail, MapPin, Clock, Phone,
  Globe, Shield, CreditCard, Users, Save, CheckCircle,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

/* ── Settings are structured around what the actual site shows ──
   - Contact info (from ContactPage.jsx)
   - Trust bar stats (from TrustBar.jsx & HomePage.jsx)
   - Pricing plans display toggle (from PricingPage.jsx)
   - SEO meta fields (from useSEO hook)
   These are stored in localStorage as editable site config. ── */

const STORAGE_KEY = 'aguaa_site_settings';

const DEFAULTS = {
  contactEmail:   'support@aguaa.in',
  contactPhone:   '',
  officeHours:    'Mon – Sat  9 AM – 6 PM IST',
  address:        'Mumbai, Maharashtra, India',
  trustStats: {
    profilesCreated: '50,000+',
    happyFamilies:   '12,000+',
    cities:          '500+',
  },
  siteName:       'Aguaa Biodata',
  tagline:        'India\'s Premium Marriage Biodata Platform',
  metaDescription: 'Create beautiful, print-ready marriage biodata online. Free PDF download. Trusted by 50,000+ families across Bihar, UP, Jharkhand.',
};

/* ─── Inline editable field ─────────────────────────────────── */
const Field = ({ label, value, onChange, type = 'text', placeholder, multiline }) => (
  <div>
    <label className="block text-[10px] uppercase tracking-widest font-semibold mb-1.5" style={{ color: 'rgba(168,144,96,0.6)' }}>
      {label}
    </label>
    {multiline ? (
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent rounded-xl px-4 py-2.5 text-sm text-white resize-none focus:outline-none"
        style={{ background: 'rgba(212,160,23,0.04)', border: '1px solid rgba(212,160,23,0.18)' }}
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
        style={{ background: 'rgba(212,160,23,0.04)', border: '1px solid rgba(212,160,23,0.18)' }}
      />
    )}
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   SETTINGS PAGE
═══════════════════════════════════════════════════════════════════ */
const AdminSettingsPage = () => {
  const toast = useToast();
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { ...DEFAULTS, ...JSON.parse(stored) } : DEFAULTS;
    } catch { return DEFAULTS; }
  });
  const [saved, setSaved] = useState(false);

  const set = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }));
  const setTrust = (key, value) => setSettings((prev) => ({
    ...prev,
    trustStats: { ...prev.trustStats, [key]: value },
  }));

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setSaved(true);
    toast.success('Settings saved successfully');
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    setSettings(DEFAULTS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULTS));
    toast.success('Settings reset to defaults');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 page-enter">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-1" style={{ color: 'rgba(212,160,23,0.6)' }}>
            Admin · Settings
          </p>
          <h1 className="text-2xl sm:text-3xl font-light text-white" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Website <span className="text-gradient-gold">Settings</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(168,144,96,0.6)' }}>
            Manage site-wide configuration tied to existing platform features
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-2 rounded-xl text-xs font-medium transition-all"
            style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', color: '#f87171' }}
          >
            Reset Defaults
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{ background: 'linear-gradient(135deg, #d4a017, #f0c040)', color: '#1a0800' }}
          >
            {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </motion.div>

      <div className="max-w-3xl space-y-5">

        {/* ── Contact Information ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl overflow-hidden"
          style={{ border: '1px solid rgba(212,160,23,0.12)' }}
        >
          <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: '1px solid rgba(212,160,23,0.08)' }}>
            <Mail className="w-4 h-4" style={{ color: '#d4a017' }} />
            <p className="text-sm font-semibold text-white" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Contact Information
            </p>
            <p className="text-xs ml-auto" style={{ color: 'rgba(168,144,96,0.5)' }}>Used in ContactPage.jsx</p>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Support Email"
              value={settings.contactEmail}
              onChange={(v) => set('contactEmail', v)}
              type="email"
              placeholder="support@aguaa.in"
            />
            <Field
              label="Phone Number"
              value={settings.contactPhone}
              onChange={(v) => set('contactPhone', v)}
              type="tel"
              placeholder="+91 XXXXX XXXXX"
            />
            <Field
              label="Office Hours"
              value={settings.officeHours}
              onChange={(v) => set('officeHours', v)}
              placeholder="Mon – Sat 9 AM – 6 PM IST"
            />
            <Field
              label="Office Address"
              value={settings.address}
              onChange={(v) => set('address', v)}
              placeholder="City, State, Country"
            />
          </div>
        </motion.div>

        {/* ── Trust Bar Stats ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl overflow-hidden"
          style={{ border: '1px solid rgba(212,160,23,0.12)' }}
        >
          <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: '1px solid rgba(212,160,23,0.08)' }}>
            <Shield className="w-4 h-4" style={{ color: '#d4a017' }} />
            <p className="text-sm font-semibold text-white" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Trust Bar Statistics
            </p>
            <p className="text-xs ml-auto" style={{ color: 'rgba(168,144,96,0.5)' }}>Shown on Home & Explore pages</p>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field
              label="Profiles Created"
              value={settings.trustStats.profilesCreated}
              onChange={(v) => setTrust('profilesCreated', v)}
              placeholder="50,000+"
            />
            <Field
              label="Happy Families"
              value={settings.trustStats.happyFamilies}
              onChange={(v) => setTrust('happyFamilies', v)}
              placeholder="12,000+"
            />
            <Field
              label="Cities Covered"
              value={settings.trustStats.cities}
              onChange={(v) => setTrust('cities', v)}
              placeholder="500+"
            />
          </div>
          {/* Preview */}
          <div className="px-5 pb-5">
            <p className="text-[10px] uppercase tracking-widest mb-3" style={{ color: 'rgba(168,144,96,0.5)' }}>Preview</p>
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'Profiles Created', value: settings.trustStats.profilesCreated },
                { label: 'Happy Families', value: settings.trustStats.happyFamilies },
                { label: 'Cities', value: settings.trustStats.cities },
              ].map(({ label, value }) => (
                <div key={label} className="stat-chip">
                  <span className="font-bold text-white">{value}</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── SEO / Site Identity ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card rounded-2xl overflow-hidden"
          style={{ border: '1px solid rgba(212,160,23,0.12)' }}
        >
          <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: '1px solid rgba(212,160,23,0.08)' }}>
            <Globe className="w-4 h-4" style={{ color: '#d4a017' }} />
            <p className="text-sm font-semibold text-white" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              SEO & Site Identity
            </p>
            <p className="text-xs ml-auto" style={{ color: 'rgba(168,144,96,0.5)' }}>Used in useSEO hook</p>
          </div>
          <div className="p-5 space-y-4">
            <Field
              label="Site Name"
              value={settings.siteName}
              onChange={(v) => set('siteName', v)}
              placeholder="Aguaa Biodata"
            />
            <Field
              label="Tagline"
              value={settings.tagline}
              onChange={(v) => set('tagline', v)}
              placeholder="India's Premium Marriage Biodata Platform"
            />
            <Field
              label="Meta Description"
              value={settings.metaDescription}
              onChange={(v) => set('metaDescription', v)}
              placeholder="SEO meta description for the homepage…"
              multiline
            />
          </div>
        </motion.div>

        {/* ── Pricing Summary ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl overflow-hidden"
          style={{ border: '1px solid rgba(212,160,23,0.12)' }}
        >
          <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: '1px solid rgba(212,160,23,0.08)' }}>
            <CreditCard className="w-4 h-4" style={{ color: '#d4a017' }} />
            <p className="text-sm font-semibold text-white" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Pricing Plans Overview
            </p>
            <p className="text-xs ml-auto" style={{ color: 'rgba(168,144,96,0.5)' }}>Read from PricingPage.jsx</p>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { name: 'Free', price: '₹0', profiles: '1 Biodata', templates: 'Basic (5+)', color: '#a89060' },
              { name: 'Standard', price: '₹299/mo', profiles: '5 Biodatas', templates: 'Premium (20+)', color: '#d4a017', highlight: true },
              { name: 'Premium', price: '₹599/mo', profiles: 'Unlimited', templates: 'All (50+)', color: '#f0c040' },
            ].map((plan) => (
              <div
                key={plan.name}
                className="rounded-xl p-4"
                style={{
                  background: plan.highlight ? 'rgba(212,160,23,0.08)' : 'rgba(212,160,23,0.04)',
                  border: `1px solid ${plan.highlight ? 'rgba(212,160,23,0.3)' : 'rgba(212,160,23,0.1)'}`,
                }}
              >
                <p className="text-sm font-bold mb-1" style={{ color: plan.color, fontFamily: 'Cormorant Garamond, serif' }}>
                  {plan.name}
                </p>
                <p className="text-lg font-bold text-white mb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{plan.price}</p>
                <p className="text-xs" style={{ color: 'rgba(168,144,96,0.6)' }}>{plan.profiles}</p>
                <p className="text-xs" style={{ color: 'rgba(168,144,96,0.6)' }}>{plan.templates}</p>
                <p className="text-[10px] mt-2" style={{ color: 'rgba(168,144,96,0.4)' }}>
                  (Edit pricing in PricingPage.jsx)
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Save button bottom */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl text-sm font-medium"
            style={{ background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)', color: '#a89060' }}
          >
            Reset to Defaults
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold"
            style={{ background: 'linear-gradient(135deg, #d4a017, #f0c040)', color: '#1a0800' }}
          >
            {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? 'Settings Saved!' : 'Save All Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
