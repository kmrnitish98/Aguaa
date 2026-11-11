import React from 'react';
import { getQuoteForPage } from '../../../utils/quotes';

/* ══════════════════════════════════════════════════════════════
   TRADITIONAL INDIAN TEMPLATE
   Red, saffron, and gold theme. Mandala patterns. Temple-inspired.
   ══════════════════════════════════════════════════════════════ */

const FONT_TITLE = "'Cinzel', 'Playfair Display', serif";
const FONT_BODY = "'Cormorant Garamond', serif";
const FONT_SANS = "'Inter', sans-serif";

const C = {
  pageBg: '#FFFBF2',       // Warm cream
  cardBg: '#FFFFFF',       // Pure white for cards to contrast
  accentRed: '#8B0000',    // Deep traditional red
  accentSaffron: '#FF9933',// Saffron orange
  gold: '#D4AF37',         // Traditional gold
  text: '#331900',         // Deep brown/black
  textMuted: '#663300',
  borderGold: '#E6C27A',
};

const generateBio = ({ fullName, occupation, city }) => {
  const name = fullName ? fullName.split(' ')[0] : 'The individual';
  const occup = occupation || 'professional';
  const place = city || 'India';
  return `Raised with deep-rooted cultural values, ${name} is a dedicated ${occup} based in ${place}. With a profound respect for family traditions and a forward-looking approach to life, they seek a life partner to share the sacred bond of marriage, built on mutual trust, respect, and devotion.`;
};

/* ─── Mandala Watermark ─────────────────────────────────────── */
const MandalaWatermark = () => (
  <svg width="400" height="400" viewBox="0 0 400 400" fill="none" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.04, pointerEvents: 'none', zIndex: 0 }}>
    <circle cx="200" cy="200" r="180" stroke={C.accentRed} strokeWidth="2" />
    <circle cx="200" cy="200" r="170" stroke={C.accentSaffron} strokeWidth="1" />
    <circle cx="200" cy="200" r="120" stroke={C.gold} strokeWidth="3" />
    <circle cx="200" cy="200" r="80" stroke={C.accentRed} strokeWidth="2" />
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(a => {
      const r = a * Math.PI / 180;
      return (
        <path key={a} d={`M 200 200 L ${200 + 170 * Math.cos(r)} ${200 + 170 * Math.sin(r)}`} stroke={C.accentSaffron} strokeWidth="1" />
      );
    })}
    {[0, 45, 90, 135, 180, 225, 270, 315].map(a => {
      const r = a * Math.PI / 180;
      return (
        <circle key={a} cx={200 + 100 * Math.cos(r)} cy={200 + 100 * Math.sin(r)} r="15" fill={C.gold} opacity="0.5" />
      );
    })}
  </svg>
);

/* ─── Temple Bell Decoration ────────────────────────────────── */
const TempleBell = ({ style }) => (
  <svg width="30" height="60" viewBox="0 0 30 60" fill="none" style={{ position: 'absolute', ...style, zIndex: 2 }}>
    <line x1="15" y1="0" x2="15" y2="20" stroke={C.gold} strokeWidth="2" />
    <path d="M 5 35 Q 15 20 25 35 L 28 45 L 2 45 Z" fill={C.gold} />
    <circle cx="15" cy="48" r="3" fill={C.accentRed} />
  </svg>
);

const SectionHeader = ({ title }) => (
  <div style={{ textAlign: 'center', marginBottom: '20px', position: 'relative' }}>
    <div style={{ display: 'inline-block', padding: '5px 20px', borderTop: `2px solid ${C.accentRed}`, borderBottom: `2px solid ${C.accentRed}` }}>
      <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: C.accentRed, fontFamily: FONT_TITLE, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {title}
      </h2>
    </div>
  </div>
);

const InfoRow = ({ label, value, fullWidth = false }) => {
  if (!value) return null;
  return (
    <div style={{ marginBottom: '16px', gridColumn: fullWidth ? '1/-1' : undefined }}>
      <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: C.accentSaffron, fontWeight: 'bold', fontFamily: FONT_SANS, marginBottom: '2px' }}>
        {label}
      </div>
      <div style={{ fontSize: '16px', color: C.text, fontWeight: '600', fontFamily: FONT_BODY }}>
        {value}
      </div>
    </div>
  );
};

const SectionCard = ({ children }) => (
  <div style={{ background: C.cardBg, border: `2px solid ${C.borderGold}`, borderRadius: '12px', padding: '25px', marginBottom: '25px', position: 'relative', zIndex: 2, boxShadow: '0 4px 15px rgba(139,0,0,0.1)' }}>
    {children}
  </div>
);

const A4Page = ({ children, pageIdx, totalPages }) => (
  <div className="pdf-page" style={{ width: '100%', margin: '0 auto', background: C.pageBg, color: C.text, position: 'relative', boxSizing: 'border-box', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact', pageBreakAfter: pageIdx < totalPages - 1 ? 'always' : 'auto', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', inset: '15px', border: `4px solid ${C.accentRed}`, pointerEvents: 'none', zIndex: 1 }} />
    <div style={{ position: 'absolute', inset: '22px', border: `1px solid ${C.gold}`, pointerEvents: 'none', zIndex: 1 }} />
    
    <MandalaWatermark />
    
    <TempleBell style={{ top: 22, left: 40 }} />
    <TempleBell style={{ top: 22, right: 40 }} />
    
    <div style={{ position: 'relative', zIndex: 5, padding: '60px 45px 50px' }}>
      {children}
    </div>
    
    <div style={{ position: 'absolute', bottom: '25px', left: 0, right: 0, textAlign: 'center', zIndex: 5, fontSize: '12px', color: C.accentRed, fontFamily: FONT_TITLE, letterSpacing: '0.1em' }}>
      || शुभ विवाह || &nbsp;&nbsp;&nbsp; PAGE {pageIdx + 1} OF {totalPages} &nbsp;&nbsp;&nbsp; || शुभ विवाह ||
    </div>
  </div>
);

const PhotoFrame = ({ src, name }) => (
  <div style={{ position: 'relative', width: '200px', margin: '0 auto', aspectRatio: '3/4', borderRadius: '100px 100px 10px 10px', overflow: 'hidden', border: `4px solid ${C.accentRed}`, boxShadow: `0 0 0 4px ${C.gold}, 0 10px 20px rgba(0,0,0,0.2)`, background: '#FFF' }}>
    {src ? (
      <img src={src} alt={name || 'Profile'} crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    ) : (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '50px', color: C.gold, fontFamily: FONT_TITLE }}>
        {name ? name.charAt(0) : 'ॐ'}
      </div>
    )}
  </div>
);

const QRPlaceholder = () => (
  <div style={{ border: `2px solid ${C.accentSaffron}`, padding: '10px', borderRadius: '8px', width: '80px', height: '80px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFF' }}>
    <div style={{ fontSize: '30px', color: C.accentRed }}>卐</div>
  </div>
);

const TemplateTraditionalIndian = React.forwardRef(({ biodata }, ref) => {
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
    <div ref={ref} className="print-container pdf-render-container" style={{ background: '#f0e6d2' }}>
      <A4Page pageIdx={0} totalPages={3}>
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <div style={{ fontSize: '30px', color: C.accentRed, marginBottom: '10px' }}>॥ श्री गणेशाय नमः ॥</div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '30px', marginBottom: '30px', alignItems: 'center' }}>
          <div>
            <PhotoFrame src={mainPhotoURL} name={fullName} />
          </div>
          <div>
            <h1 style={{ fontSize: '46px', color: C.accentRed, fontFamily: FONT_TITLE, margin: '0 0 10px', lineHeight: '1.1' }}>
              {fullName || 'Biodata'}
            </h1>
            <div style={{ fontSize: '18px', color: C.accentSaffron, fontFamily: FONT_BODY, fontStyle: 'italic', marginBottom: '15px' }}>
              {city ? `Residing in ${city}` : 'Marriage Biodata'}
            </div>
            <p style={{ fontSize: '16px', lineHeight: '1.6', color: C.textMuted, fontFamily: FONT_BODY }}>
              "{bio}"
            </p>
          </div>
        </div>

        <SectionCard>
          <SectionHeader title="Personal Details" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
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
          </div>
        </SectionCard>
      </A4Page>

      <A4Page pageIdx={1} totalPages={3}>
        <div style={{ paddingTop: '20px' }}>
          {hasFamily && (
            <SectionCard>
              <SectionHeader title="Family Background" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                <div>
                  {fatherName && <InfoRow label="Father's Name" value={fatherName} />}
                  {fatherOccupation && <InfoRow label="Father's Occupation" value={fatherOccupation} />}
                  {motherName && <InfoRow label="Mother's Name" value={motherName} />}
                  {motherOccupation && <InfoRow label="Mother's Occupation" value={motherOccupation} />}
                </div>
                <div>
                  <InfoRow label="Native Place" value={nativePlace} />
                  <InfoRow label="Family Type" value={familyType} />
                  <InfoRow label="Family Status" value={familyStatus} />
                  {siblingList.length > 0 && (
                    <div style={{ marginTop: '16px' }}>
                      <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: C.accentSaffron, fontWeight: 'bold', fontFamily: FONT_SANS, marginBottom: '8px' }}>Siblings</div>
                      {siblingList.map((s, i) => (
                        <div key={i} style={{ fontSize: '16px', color: C.text, marginBottom: '4px', fontFamily: FONT_BODY }}>• {s.name} {s.role && `(${s.role})`}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </SectionCard>
          )}

          {hasEdu && (
            <SectionCard>
              <SectionHeader title="Education & Profession" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                <div>
                  <InfoRow label="Highest Qualification" value={highestQualification} />
                  <InfoRow label="College" value={college} />
                  <InfoRow label="Passing Year" value={passingYear} />
                  <InfoRow label="Additional Qualification" value={additionalQualification} />
                </div>
                <div>
                  <InfoRow label="Occupation" value={occupation} />
                  <InfoRow label="Employer" value={employer} />
                  <InfoRow label="Annual Income" value={annualIncome} />
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
              <SectionHeader title="Partner Preferences" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                <InfoRow label="Expectations" value={partnerExpectations} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <InfoRow label="Preferred Location" value={preferredLocation} />
                  <InfoRow label="Hobbies" value={Array.isArray(hobbies) ? hobbies.join(', ') : hobbies} />
                </div>
              </div>
            </SectionCard>
          )}

          {hasContact && (
            <SectionCard>
              <SectionHeader title="Contact Information" />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <InfoRow label="Contact Person" value={contactName} />
                  <InfoRow label="Phone Number" value={contactPhone} />
                  <InfoRow label="Email Address" value={contactEmail} fullWidth />
                </div>
                <div style={{ marginLeft: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <QRPlaceholder />
                  <span style={{ fontSize: '10px', marginTop: '10px', color: C.accentSaffron, letterSpacing: '0.1em', fontWeight: 'bold' }}>SCAN</span>
                </div>
              </div>
            </SectionCard>
          )}
        </div>
      </A4Page>
    </div>
  );
});

TemplateTraditionalIndian.displayName = 'TemplateTraditionalIndian';
export default TemplateTraditionalIndian;
