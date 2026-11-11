import React from 'react';
import { getQuoteForPage } from '../../../utils/quotes';

/* ══════════════════════════════════════════════════════════════
   ROYAL MAHARAJA TEMPLATE
   Deep maroon, gold foil, palace-inspired borders.
   ══════════════════════════════════════════════════════════════ */

const FONT_CINZEL = "'Cinzel', 'Playfair Display', serif";
const FONT_CORMNT = "'Cormorant Garamond', serif";
const FONT_INTER = "Inter, sans-serif";

const C = {
  pageBg: 'linear-gradient(to bottom, #2b0000, #170000)',
  cardBg: 'linear-gradient(145deg, #1f0000, #0a0000)',
  goldMain: '#D4AF37',
  goldLight: '#F3E5AB',
  goldDark: '#AA8222',
  text: '#FDE4B3',
  textMuted: 'rgba(253, 228, 179, 0.7)',
  borderGold: 'rgba(212, 175, 55, 0.4)',
};

const generateBio = ({ fullName, occupation, city }) => {
  const name = fullName ? fullName.split(' ')[0] : 'The individual';
  const occup = occupation || 'professional';
  const place = city || 'India';
  return `${name} is a cultured, ambitious ${occup} based in ${place}. Grounded in deep family values, they carry a modern outlook with immense respect for tradition. Looking for a life partner to share a beautiful and meaningful journey together.`;
};

/* ─── Palace Arch SVG Background ──────────────────────────────── */
const PalaceArchBackground = () => (
  <div style={{ position: 'absolute', inset: '15px', border: `2px solid ${C.goldMain}`, borderRadius: '12px 12px 0 0', pointerEvents: 'none', zIndex: 1, overflow: 'hidden' }}>
    <svg width="100%" height="150" preserveAspectRatio="none" viewBox="0 0 100 20" style={{ position: 'absolute', top: 0, left: 0 }}>
      <path d="M 0 0 L 0 20 Q 25 0 50 20 Q 75 0 100 20 L 100 0 Z" fill="rgba(212, 175, 55, 0.1)" />
      <path d="M 0 20 Q 25 0 50 20 Q 75 0 100 20" fill="none" stroke={C.goldMain} strokeWidth="0.5" />
      {/* Decorative inner arches */}
      <path d="M 10 20 Q 25 5 40 20" fill="none" stroke={C.goldDark} strokeWidth="0.3" />
      <path d="M 60 20 Q 75 5 90 20" fill="none" stroke={C.goldDark} strokeWidth="0.3" />
    </svg>
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: C.goldMain }} />
  </div>
);

const SectionHeader = ({ icon, title }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', position: 'relative' }}>
    <div style={{ height: '1px', flex: 1, background: `linear-gradient(90deg, transparent, ${C.goldMain})` }} />
    <div style={{ padding: '0 15px', textAlign: 'center' }}>
      <span style={{ display: 'block', fontSize: '20px', marginBottom: '4px' }}>{icon}</span>
      <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: C.goldLight, letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: FONT_CINZEL }}>
        {title}
      </h2>
    </div>
    <div style={{ height: '1px', flex: 1, background: `linear-gradient(90deg, ${C.goldMain}, transparent)` }} />
  </div>
);

const InfoRow = ({ label, value, fullWidth = false }) => {
  if (!value) return null;
  return (
    <div style={{ marginBottom: '12px', gridColumn: fullWidth ? '1/-1' : undefined }}>
      <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', color: C.goldDark, fontWeight: '700', fontFamily: FONT_INTER, marginBottom: '2px' }}>
        {label}
      </div>
      <div style={{ fontSize: '14px', color: C.text, fontWeight: '500', fontFamily: FONT_CORMNT }}>
        {value}
      </div>
    </div>
  );
};

const SectionCard = ({ children }) => (
  <div style={{ background: C.cardBg, border: `1px solid ${C.borderGold}`, borderRadius: '8px', padding: '20px', marginBottom: '15px', position: 'relative', zIndex: 2, boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
    <div style={{ position: 'absolute', top: 4, left: 4, right: 4, bottom: 4, border: `1px solid rgba(212,175,55,0.15)`, borderRadius: '4px', pointerEvents: 'none' }} />
    {children}
  </div>
);

const A4Page = ({ children, pageIdx, totalPages }) => (
  <div className="pdf-page" style={{ width: '100%', margin: '0 auto', background: C.pageBg, color: C.text, position: 'relative', boxSizing: 'border-box', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact', pageBreakAfter: pageIdx < totalPages - 1 ? 'always' : 'auto', overflow: 'hidden' }}>
    <PalaceArchBackground />
    <div style={{ position: 'relative', zIndex: 5, padding: '40px 35px 60px' }}>
      {children}
    </div>
    <div style={{ position: 'absolute', bottom: '15px', left: 0, right: 0, textAlign: 'center', zIndex: 5, fontSize: '10px', color: C.goldDark, letterSpacing: '0.2em', fontFamily: FONT_CINZEL }}>
      PAGE {pageIdx + 1} OF {totalPages} ✦ ROYAL MAHARAJA
    </div>
  </div>
);

const PhotoFrame = ({ src, name }) => (
  <div style={{ position: 'relative', width: '100%', maxWidth: '200px', margin: '0 auto', aspectRatio: '3/4', borderRadius: '120px 120px 0 0', overflow: 'hidden', border: `3px solid ${C.goldMain}`, boxShadow: '0 10px 30px rgba(0,0,0,0.6)', background: '#110000' }}>
    {src ? (
      <img src={src} alt={name || 'Profile'} crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    ) : (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', color: C.goldDark, fontFamily: FONT_CINZEL }}>
        {name ? name.charAt(0) : '✦'}
      </div>
    )}
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '30px', background: `linear-gradient(to top, rgba(0,0,0,0.8), transparent)` }} />
  </div>
);

const QRPlaceholder = () => (
  <div style={{ border: `2px solid ${C.goldMain}`, padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', width: '90px', height: '90px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ fontSize: '30px' }}>💠</div>
  </div>
);

const TemplateRoyalMaharaja = React.forwardRef(({ biodata }, ref) => {
  if (!biodata) return null;

  const { personalInfo = {}, educationInfo = {}, familyInfo = {}, preferences = {} } = biodata;
  const mainPhotoURL = biodata.photoURL || personalInfo.photoURL || null;
  const { fullName, dob, height, weight, maritalStatus, city, religion, caste, gotra, zodiac, complexion, motherTongue } = personalInfo;
  const { highestQualification, college, passingYear, occupation, employer, annualIncome, additionalQualification } = educationInfo;
  const { fatherName, fatherOccupation, motherName, motherOccupation, siblings, nativePlace, familyType, familyStatus } = familyInfo;
  const { bio: rawBio, partnerExpectations, hobbies, preferredLocation, contactName, contactPhone, contactEmail } = preferences;

  const bio = rawBio || generateBio({ fullName, occupation, city });
  const siblingList = Array.isArray(siblings) ? siblings : typeof siblings === 'string' && siblings ? [{ name: siblings, role: '' }] : [];

  const hasEdu = !!(highestQualification || college || occupation || employer || annualIncome || passingYear || additionalQualification);
  const hasFamily = !!(fatherName || motherName || siblingList.length || nativePlace || familyType || familyStatus);
  const hasPref = !!(partnerExpectations || hobbies || preferredLocation);
  const hasContact = !!(contactName || contactPhone || contactEmail);

  return (
    <div ref={ref} className="print-container pdf-render-container" style={{ background: '#0a0000' }}>
      <A4Page pageIdx={0} totalPages={3}>
        <div style={{ textAlign: 'center', marginBottom: '30px', paddingTop: '30px' }}>
          <h1 style={{ fontSize: '42px', color: C.goldLight, fontFamily: FONT_CINZEL, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {fullName || 'Biodata'}
          </h1>
          <div style={{ fontSize: '14px', color: C.goldDark, fontFamily: FONT_INTER, letterSpacing: '0.3em', textTransform: 'uppercase' }}>
            Marriage Profile
          </div>
        </div>

        <div style={{ display: 'flex', gap: '30px', marginBottom: '20px' }}>
          <div style={{ flex: '1' }}>
            <SectionCard>
              <SectionHeader icon="👑" title="Personal Details" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <InfoRow label="Date of Birth" value={dob} />
                <InfoRow label="Height" value={height} />
                <InfoRow label="Weight" value={weight} />
                <InfoRow label="Marital Status" value={maritalStatus} />
                <InfoRow label="Religion" value={religion} />
                <InfoRow label="Caste" value={caste} />
                <InfoRow label="Gotra" value={gotra} />
                <InfoRow label="Zodiac" value={zodiac} />
                <InfoRow label="Complexion" value={complexion} />
                <InfoRow label="Mother Tongue" value={motherTongue} />
                <InfoRow label="City" value={city} />
              </div>
            </SectionCard>
          </div>
          <div style={{ flex: '0 0 220px' }}>
            <PhotoFrame src={mainPhotoURL} name={fullName} />
            <div style={{ textAlign: 'center', marginTop: '15px' }}>
              <div style={{ fontSize: '12px', color: C.goldLight, fontStyle: 'italic', fontFamily: FONT_CORMNT }}>
                ❝ {bio} ❞
              </div>
            </div>
          </div>
        </div>
      </A4Page>

      <A4Page pageIdx={1} totalPages={3}>
        <div style={{ paddingTop: '20px' }}>
          {hasEdu && (
            <SectionCard>
              <SectionHeader icon="🏛️" title="Education & Profession" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <div style={{ color: C.goldMain, fontWeight: 'bold', marginBottom: '8px', borderBottom: `1px solid ${C.borderGold}` }}>Education</div>
                  <InfoRow label="Highest Qualification" value={highestQualification} />
                  <InfoRow label="College" value={college} />
                  <InfoRow label="Passing Year" value={passingYear} />
                  <InfoRow label="Additional Qualification" value={additionalQualification} />
                </div>
                <div>
                  <div style={{ color: C.goldMain, fontWeight: 'bold', marginBottom: '8px', borderBottom: `1px solid ${C.borderGold}` }}>Profession</div>
                  <InfoRow label="Occupation" value={occupation} />
                  <InfoRow label="Employer" value={employer} />
                  <InfoRow label="Annual Income" value={annualIncome} />
                </div>
              </div>
            </SectionCard>
          )}

          {hasFamily && (
            <SectionCard>
              <SectionHeader icon="⚜️" title="Family Background" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  {fatherName && <InfoRow label="Father's Name" value={fatherName} />}
                  {fatherOccupation && <InfoRow label="Father's Occupation" value={fatherOccupation} />}
                  {motherName && <InfoRow label="Mother's Name" value={motherName} />}
                  {motherOccupation && <InfoRow label="Mother's Occupation" value={motherOccupation} />}
                  {siblingList.map((s, i) => (
                    <InfoRow key={i} label={`Sibling ${i + 1}`} value={s.name + (s.role ? ` (${s.role})` : '')} />
                  ))}
                </div>
                <div>
                  <InfoRow label="Native Place" value={nativePlace} />
                  <InfoRow label="Family Type" value={familyType} />
                  <InfoRow label="Family Status" value={familyStatus} />
                </div>
              </div>
            </SectionCard>
          )}
        </div>
      </A4Page>

      <A4Page pageIdx={2} totalPages={3}>
        <div style={{ paddingTop: '20px' }}>
          {hasPref && (
            <SectionCard>
              <SectionHeader icon="✨" title="Partner Preferences" />
              <InfoRow label="Expectations" value={partnerExpectations} fullWidth />
              <InfoRow label="Preferred Location" value={preferredLocation} fullWidth />
              <InfoRow label="Hobbies" value={Array.isArray(hobbies) ? hobbies.join(', ') : hobbies} fullWidth />
            </SectionCard>
          )}

          {hasContact && (
            <SectionCard>
              <SectionHeader icon="📜" title="Contact Details" />
              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                  <InfoRow label="Contact Person" value={contactName} />
                  <InfoRow label="Phone" value={contactPhone} />
                  <InfoRow label="Email" value={contactEmail} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <QRPlaceholder />
                  <div style={{ fontSize: '10px', marginTop: '5px', color: C.goldDark }}>SCAN PROFILE</div>
                </div>
              </div>
            </SectionCard>
          )}
        </div>
      </A4Page>
    </div>
  );
});

TemplateRoyalMaharaja.displayName = 'TemplateRoyalMaharaja';
export default TemplateRoyalMaharaja;
