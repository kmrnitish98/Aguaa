import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout, FileDown, Eye, Globe, Lock } from 'lucide-react';

/* ── Sample biodata for template preview — matches the Biodata model schema ── */
const SAMPLE_BIODATA = {
  isPublic: true,
  photoURL: '',
  personalInfo: {
    fullName: 'Arjun Kumar Sharma',
    dob: '1997-03-15',
    height: "5'10\"",
    weight: '72 kg',
    maritalStatus: 'Unmarried',
    city: 'Patna',
    religion: 'Hindu',
    caste: 'Brahmin',
    gotra: 'Kashyap',
    zodiac: 'Pisces',
    complexion: 'Fair',
    motherTongue: 'Hindi',
    languagesKnown: ['Hindi', 'English', 'Bhojpuri'],
  },
  educationInfo: {
    highestQualification: 'B.Tech (Computer Science)',
    college: 'NIT Patna',
    passingYear: '2019',
    occupation: 'Software Engineer',
    employer: 'TCS, Bangalore',
    annualIncome: '₹12 LPA',
    careerDescription: 'Working as a Senior Software Engineer with expertise in full-stack development. Passionate about building scalable applications.',
  },
  familyInfo: {
    fatherName: 'Ramesh Kumar Sharma',
    fatherOccupation: 'Government Officer (Retired)',
    motherName: 'Sunita Sharma',
    motherOccupation: 'Homemaker',
    nativePlace: 'Bhagalpur, Bihar',
    familyType: 'Joint Family',
    familyStatus: 'Middle Class',
    brothersCount: 1,
    sistersCount: 1,
    familyValues: ['Respect', 'Education', 'Tradition'],
    familyDescription: 'We are a close-knit family with strong values and traditions. Education and respect for elders are our core principles.',
  },
  preferences: {
    bio: 'A simple, family-oriented person looking for a life partner who values family bonds and has a positive outlook on life.',
    partnerExpectations: 'Looking for an educated, family-oriented girl from a good family background. Should be kind, understanding and have a positive approach to life.',
    hobbies: ['Reading', 'Travelling', 'Cooking', 'Cricket'],
    contactName: 'Ramesh Kumar Sharma (Father)',
    contactPhone: '+91 98765 43210',
    contactEmail: 'ramesh.sharma@email.com',
  },
};

/* ═══════════════════════════════════════════════════════════════════
   TEMPLATES PAGE
═══════════════════════════════════════════════════════════════════ */
const AdminTemplatesPage = () => {
  const [showPreview, setShowPreview] = useState(false);

  const age = (() => {
    const d = new Date(SAMPLE_BIODATA.personalInfo.dob);
    const today = new Date();
    let a = today.getFullYear() - d.getFullYear();
    if (today.getMonth() < d.getMonth() || (today.getMonth() === d.getMonth() && today.getDate() < d.getDate())) a--;
    return a;
  })();

  return (
    <div className="p-4 sm:p-6 lg:p-8 page-enter">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-1" style={{ color: 'rgba(212,160,23,0.6)' }}>
          Admin · Templates
        </p>
        <h1 className="text-2xl sm:text-3xl font-light text-white" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
          Biodata <span className="text-gradient-gold">Templates</span>
        </h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(168,144,96,0.6)' }}>
          Preview the PDF templates used across the platform
        </p>
      </motion.div>

      {/* Template card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl overflow-hidden max-w-3xl"
        style={{ border: '1px solid rgba(212,160,23,0.15)' }}
      >
        {/* Card header */}
        <div className="flex items-center gap-4 p-5" style={{ borderBottom: '1px solid rgba(212,160,23,0.08)' }}>
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, rgba(212,160,23,0.2), rgba(240,192,64,0.1))', border: '1px solid rgba(212,160,23,0.3)' }}
          >
            <Layout className="w-6 h-6" style={{ color: '#d4a017' }} />
          </div>
          <div className="flex-1">
            <p className="text-base font-semibold text-white" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Premium Luxury Template
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(168,144,96,0.6)' }}>
              Dark maroon · Gold accents · A4 PDF · Print-ready · Bilingual (English / Hindi)
            </p>
          </div>
          <div className="flex-shrink-0 flex items-center gap-2">
            <span className="text-[10px] px-2.5 py-1 rounded-full font-medium"
              style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: '#4ade80' }}>
              Active
            </span>
          </div>
        </div>

        {/* Template info */}
        <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Format', value: 'A4 Portrait' },
            { label: 'Sections', value: '4 (Personal, Education, Family, Contact)' },
            { label: 'Photo Upload', value: 'Cloudinary CDN' },
            { label: 'Print', value: 'Browser Print API' },
          ].map(({ label, value }) => (
            <div key={label} className="px-3 py-2.5 rounded-xl" style={{ background: 'rgba(212,160,23,0.04)', border: '1px solid rgba(212,160,23,0.08)' }}>
              <p className="text-[9px] uppercase tracking-widest mb-1" style={{ color: 'rgba(168,144,96,0.5)' }}>{label}</p>
              <p className="text-xs text-white font-medium">{value}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="px-5 pb-5 flex gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{
              background: showPreview ? 'rgba(212,160,23,0.15)' : 'rgba(212,160,23,0.08)',
              border: `1px solid ${showPreview ? 'rgba(212,160,23,0.4)' : 'rgba(212,160,23,0.2)'}`,
              color: '#d4a017',
            }}
          >
            <Eye className="w-4 h-4" />
            {showPreview ? 'Hide Preview' : 'Preview with Sample Data'}
          </button>
        </div>

        {/* Sample data preview */}
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-5 mb-5 rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, #1a0a00, #2a1200)',
              border: '1px solid rgba(212,160,23,0.35)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
            }}
          >
            {/* Mini preview header */}
            <div
              className="px-6 py-5 text-center"
              style={{ borderBottom: '2px solid rgba(212,160,23,0.3)', background: 'linear-gradient(135deg, #5c0a0a 0%, #8b1a1a 40%, #3d0808 100%)' }}
            >
              <p className="text-[10px] tracking-[0.3em] uppercase font-semibold mb-2" style={{ color: 'rgba(240,192,64,0.7)' }}>
                ॐ Marriage Biodata ॐ
              </p>
              <h2 className="text-2xl font-light text-white mb-1" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                {SAMPLE_BIODATA.personalInfo.fullName}
              </h2>
              <div className="flex items-center justify-center gap-4 mt-2">
                <span className="text-[11px] px-3 py-1 rounded-full" style={{ background: 'rgba(212,160,23,0.2)', color: '#f0c040' }}>
                  {age} Years
                </span>
                <span className="text-[11px] px-3 py-1 rounded-full" style={{ background: 'rgba(212,160,23,0.2)', color: '#f0c040' }}>
                  {SAMPLE_BIODATA.personalInfo.religion} · {SAMPLE_BIODATA.personalInfo.caste}
                </span>
                <span className="text-[11px] px-3 py-1 rounded-full" style={{ background: 'rgba(212,160,23,0.2)', color: '#f0c040' }}>
                  {SAMPLE_BIODATA.personalInfo.city}
                </span>
              </div>
            </div>

            {/* Sections preview */}
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Personal */}
              <div className="rounded-xl p-4" style={{ background: 'rgba(212,160,23,0.04)', border: '1px solid rgba(212,160,23,0.12)' }}>
                <p className="text-[10px] uppercase tracking-widest font-semibold mb-3" style={{ color: '#d4a017' }}>
                  Personal Information
                </p>
                {[
                  ['DOB', `${SAMPLE_BIODATA.personalInfo.dob} (${age} yrs)`],
                  ['Height', SAMPLE_BIODATA.personalInfo.height],
                  ['Marital Status', SAMPLE_BIODATA.personalInfo.maritalStatus],
                  ['Zodiac', SAMPLE_BIODATA.personalInfo.zodiac],
                  ['Languages', SAMPLE_BIODATA.personalInfo.languagesKnown.join(', ')],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-2 mb-1.5">
                    <span className="text-[11px] w-28 flex-shrink-0" style={{ color: 'rgba(168,144,96,0.6)' }}>{k}</span>
                    <span className="text-[11px] text-white/90">{v}</span>
                  </div>
                ))}
              </div>

              {/* Education */}
              <div className="rounded-xl p-4" style={{ background: 'rgba(212,160,23,0.04)', border: '1px solid rgba(212,160,23,0.12)' }}>
                <p className="text-[10px] uppercase tracking-widest font-semibold mb-3" style={{ color: '#d4a017' }}>
                  Education & Career
                </p>
                {[
                  ['Qualification', SAMPLE_BIODATA.educationInfo.highestQualification],
                  ['College', SAMPLE_BIODATA.educationInfo.college],
                  ['Occupation', SAMPLE_BIODATA.educationInfo.occupation],
                  ['Employer', SAMPLE_BIODATA.educationInfo.employer],
                  ['Income', SAMPLE_BIODATA.educationInfo.annualIncome],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-2 mb-1.5">
                    <span className="text-[11px] w-28 flex-shrink-0" style={{ color: 'rgba(168,144,96,0.6)' }}>{k}</span>
                    <span className="text-[11px] text-white/90">{v}</span>
                  </div>
                ))}
              </div>

              {/* Family */}
              <div className="rounded-xl p-4" style={{ background: 'rgba(212,160,23,0.04)', border: '1px solid rgba(212,160,23,0.12)' }}>
                <p className="text-[10px] uppercase tracking-widest font-semibold mb-3" style={{ color: '#d4a017' }}>
                  Family Details
                </p>
                {[
                  ['Father', SAMPLE_BIODATA.familyInfo.fatherName],
                  ['Mother', SAMPLE_BIODATA.familyInfo.motherName],
                  ['Native', SAMPLE_BIODATA.familyInfo.nativePlace],
                  ['Family Type', SAMPLE_BIODATA.familyInfo.familyType],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-2 mb-1.5">
                    <span className="text-[11px] w-28 flex-shrink-0" style={{ color: 'rgba(168,144,96,0.6)' }}>{k}</span>
                    <span className="text-[11px] text-white/90">{v}</span>
                  </div>
                ))}
              </div>

              {/* Contact */}
              <div className="rounded-xl p-4" style={{ background: 'rgba(212,160,23,0.04)', border: '1px solid rgba(212,160,23,0.12)' }}>
                <p className="text-[10px] uppercase tracking-widest font-semibold mb-3" style={{ color: '#d4a017' }}>
                  Contact Details
                </p>
                {[
                  ['Contact Person', SAMPLE_BIODATA.preferences.contactName],
                  ['Phone', SAMPLE_BIODATA.preferences.contactPhone],
                  ['Email', SAMPLE_BIODATA.preferences.contactEmail],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-2 mb-1.5">
                    <span className="text-[11px] w-28 flex-shrink-0" style={{ color: 'rgba(168,144,96,0.6)' }}>{k}</span>
                    <span className="text-[11px] text-white/90">{v}</span>
                  </div>
                ))}
                <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(212,160,23,0.1)' }}>
                  <p className="text-[10px] mb-1" style={{ color: 'rgba(168,144,96,0.6)' }}>Hobbies</p>
                  <div className="flex flex-wrap gap-1">
                    {SAMPLE_BIODATA.preferences.hobbies.map((h) => (
                      <span key={h} className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(212,160,23,0.1)', border: '1px solid rgba(212,160,23,0.2)', color: '#d4a017' }}>
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 pb-4">
              <p className="text-[10px] text-center" style={{ color: 'rgba(168,144,96,0.4)' }}>
                ✦ This is a preview using sample data — actual PDFs are generated using the user's real biodata ✦
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Info note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-5 max-w-3xl px-4 py-3 rounded-xl text-sm"
        style={{ background: 'rgba(212,160,23,0.04)', border: '1px solid rgba(212,160,23,0.12)', color: 'rgba(168,144,96,0.7)' }}
      >
        <p className="font-semibold text-white mb-1">About PDF Generation</p>
        The platform uses <code className="text-yellow-600/80 text-xs">BiodataPDFTemplate.jsx</code> to render the biodata, then the browser's native print API to save as PDF. Photos are served from Cloudinary. Templates are print-optimised with <code className="text-yellow-600/80 text-xs">-webkit-print-color-adjust: exact</code>.
      </motion.div>
    </div>
  );
};

export default AdminTemplatesPage;
