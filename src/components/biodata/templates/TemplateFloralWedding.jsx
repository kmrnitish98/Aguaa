import React from 'react';
import { getQuoteForPage } from '../../../utils/quotes';

/* ══════════════════════════════════════════════════════════════
   FLORAL WEDDING TEMPLATE
   Soft cream background, floral illustrations, pastel pink, peach.
   ══════════════════════════════════════════════════════════════ */

const FONT_SERIF = "'Playfair Display', serif";
const FONT_BODY = "'Cormorant Garamond', serif";
const FONT_INTER = "'Inter', sans-serif";

const C = {
  pageBg: '#FCF8F5',
  cardBg: 'rgba(255, 255, 255, 0.7)',
  accent: '#D49B90', // Peach/Pink
  leaf: '#A3B19B',   // Sage Green
  text: '#5A4C46',   // Warm dark brown
  textMuted: '#8A7B75',
  border: 'rgba(212, 155, 144, 0.3)',
};

const generateBio = ({ fullName, occupation, city }) => {
  const name = fullName ? fullName.split(' ')[0] : 'The individual';
  const occup = occupation || 'professional';
  const place = city || 'India';
  return `A kind-hearted and passionate ${occup} currently residing in ${place}. ${name} believes in the beauty of small moments, family bonds, and a life filled with love and laughter. Seeking a companion to share a beautiful story, support each other's dreams, and build a warm, loving home.`;
};

/* ─── Floral Corner SVG ─────────────────────────────────────── */
const FloralCornerSVG = ({ style = {} }) => (
  <svg width="150" height="150" viewBox="0 0 150 150" fill="none" style={{ position: 'absolute', zIndex: 1, ...style }}>
    {/* Vines */}
    <path d="M 0 50 Q 50 40 80 0" stroke={C.leaf} strokeWidth="1.5" fill="none" />
    <path d="M 50 0 Q 40 50 0 80" stroke={C.leaf} strokeWidth="1.5" fill="none" />
    
    {/* Leaves */}
    <path d="M 20 40 Q 30 30 40 40 Q 30 50 20 40 Z" fill={C.leaf} opacity="0.6" />
    <path d="M 40 20 Q 50 30 40 40 Q 30 30 40 20 Z" fill={C.leaf} opacity="0.6" />
    <path d="M 60 10 Q 70 20 60 30 Q 50 20 60 10 Z" fill={C.leaf} opacity="0.4" />
    <path d="M 10 60 Q 20 70 30 60 Q 20 50 10 60 Z" fill={C.leaf} opacity="0.4" />

    {/* Flowers */}
    <circle cx="45" cy="45" r="12" fill={C.accent} opacity="0.8" />
    <circle cx="45" cy="45" r="6" fill="#FCECE8" />
    
    <circle cx="20" cy="15" r="8" fill={C.accent} opacity="0.6" />
    <circle cx="15" cy="20" r="8" fill={C.accent} opacity="0.6" />
  </svg>
);

const FloralDivider = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', margin: '20px 0' }}>
    <div style={{ height: '1px', flex: 1, background: `linear-gradient(90deg, transparent, ${C.border})` }} />
    <svg width="30" height="15" viewBox="0 0 30 15" fill="none">
      <path d="M 15 0 C 20 10 30 10 30 15 C 20 15 15 10 15 0 Z" fill={C.leaf} opacity="0.6" />
      <path d="M 15 0 C 10 10 0 10 0 15 C 10 15 15 10 15 0 Z" fill={C.leaf} opacity="0.6" />
      <circle cx="15" cy="10" r="4" fill={C.accent} opacity="0.9" />
    </svg>
    <div style={{ height: '1px', flex: 1, background: `linear-gradient(90deg, ${C.border}, transparent)` }} />
  </div>
);

const SectionHeader = ({ title }) => (
  <div style={{ textAlign: 'center', marginBottom: '20px' }}>
    <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '500', color: C.accent, fontFamily: FONT_SERIF, fontStyle: 'italic' }}>
      {title}
    </h2>
    <div style={{ fontSize: '12px', color: C.leaf, letterSpacing: '0.15em', marginTop: '4px' }}>❧ ❦ ☙</div>
  </div>
);

const InfoRow = ({ label, value, fullWidth = false }) => {
  if (!value) return null;
  return (
    <div style={{ marginBottom: '16px', gridColumn: fullWidth ? '1/-1' : undefined }}>
      <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: C.textMuted, fontFamily: FONT_INTER, marginBottom: '2px' }}>
        {label}
      </div>
      <div style={{ fontSize: '16px', color: C.text, fontWeight: '500', fontFamily: FONT_BODY }}>
        {value}
      </div>
    </div>
  );
};

const SectionCard = ({ children }) => (
  <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '30px', marginBottom: '25px', position: 'relative', zIndex: 2, boxShadow: '0 4px 20px rgba(212,155,144,0.1)', backdropFilter: 'blur(4px)' }}>
    {children}
  </div>
);

const A4Page = ({ children, pageIdx, totalPages }) => (
  <div className="pdf-page" style={{ width: '100%', margin: '0 auto', background: C.pageBg, color: C.text, position: 'relative', boxSizing: 'border-box', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact', pageBreakAfter: pageIdx < totalPages - 1 ? 'always' : 'auto', overflow: 'hidden' }}>
    <FloralCornerSVG style={{ top: 0, left: 0 }} />
    <FloralCornerSVG style={{ top: 0, right: 0, transform: 'scaleX(-1)' }} />
    <FloralCornerSVG style={{ bottom: 0, left: 0, transform: 'scaleY(-1)' }} />
    <FloralCornerSVG style={{ bottom: 0, right: 0, transform: 'scale(-1)' }} />
    
    <div style={{ position: 'absolute', inset: '20px', border: `1px solid ${C.border}`, borderRadius: '24px', pointerEvents: 'none', zIndex: 1 }} />
    
    <div style={{ position: 'relative', zIndex: 5, padding: '50px 45px 60px' }}>
      {children}
    </div>
    
    <div style={{ position: 'absolute', bottom: '30px', left: 0, right: 0, textAlign: 'center', zIndex: 5, fontSize: '12px', color: C.textMuted, fontFamily: FONT_BODY, fontStyle: 'italic' }}>
      Page {pageIdx + 1} of {totalPages}
    </div>
  </div>
);

const PhotoFrame = ({ src, name }) => (
  <div style={{ position: 'relative', width: '220px', margin: '0 auto', aspectRatio: '1/1', borderRadius: '50%', overflow: 'hidden', border: `4px solid #fff`, boxShadow: '0 8px 30px rgba(212,155,144,0.3)', background: '#FCECE8' }}>
    {src ? (
      <img src={src} alt={name || 'Profile'} crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    ) : (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '50px', color: C.accent, fontFamily: FONT_SERIF }}>
        {name ? name.charAt(0) : '❀'}
      </div>
    )}
  </div>
);

const QRPlaceholder = () => (
  <div style={{ border: `1px dashed ${C.accent}`, padding: '10px', borderRadius: '12px', width: '90px', height: '90px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
    <div style={{ fontSize: '30px', opacity: 0.5 }}>📱</div>
  </div>
);

const TemplateFloralWedding = React.forwardRef(({ biodata }, ref) => {
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
    <div ref={ref} className="print-container pdf-render-container" style={{ background: '#f5f5f5' }}>
      <A4Page pageIdx={0} totalPages={3}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <PhotoFrame src={mainPhotoURL} name={fullName} />
          <h1 style={{ fontSize: '42px', color: C.text, fontFamily: FONT_SERIF, margin: '20px 0 5px', fontWeight: 'normal' }}>
            {fullName || 'Biodata'}
          </h1>
          <div style={{ fontSize: '15px', color: C.accent, fontFamily: FONT_BODY, fontStyle: 'italic' }}>
            {city ? `From ${city}` : 'Marriage Profile'}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '30px', padding: '0 20px' }}>
          <p style={{ fontSize: '16px', lineHeight: '1.8', color: C.textMuted, fontFamily: FONT_BODY, fontStyle: 'italic' }}>
            "{bio}"
          </p>
        </div>

        <FloralDivider />

        <SectionCard>
          <SectionHeader title="Personal Details" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
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
          {hasEdu && (
            <SectionCard>
              <SectionHeader title="Education & Profession" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                <div>
                  <div style={{ fontSize: '18px', color: C.accent, fontFamily: FONT_SERIF, fontStyle: 'italic', marginBottom: '15px' }}>Education</div>
                  <InfoRow label="Highest Qualification" value={highestQualification} />
                  <InfoRow label="College" value={college} />
                  <InfoRow label="Passing Year" value={passingYear} />
                  <InfoRow label="Additional Qualification" value={additionalQualification} />
                </div>
                <div>
                  <div style={{ fontSize: '18px', color: C.accent, fontFamily: FONT_SERIF, fontStyle: 'italic', marginBottom: '15px' }}>Profession</div>
                  <InfoRow label="Occupation" value={occupation} />
                  <InfoRow label="Employer" value={employer} />
                  <InfoRow label="Annual Income" value={annualIncome} />
                </div>
              </div>
            </SectionCard>
          )}

          <FloralDivider />

          {hasFamily && (
            <SectionCard>
              <SectionHeader title="Family Background" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
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
              <SectionHeader title="Partner Preferences" />
              <div style={{ marginBottom: '20px' }}>
                <InfoRow label="Expectations" value={partnerExpectations} fullWidth />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <InfoRow label="Preferred Location" value={preferredLocation} />
                <InfoRow label="Hobbies" value={Array.isArray(hobbies) ? hobbies.join(', ') : hobbies} />
              </div>
            </SectionCard>
          )}

          <FloralDivider />

          {hasContact && (
            <SectionCard>
              <SectionHeader title="Contact Information" />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <InfoRow label="Contact Person" value={contactName} />
                  <InfoRow label="Phone" value={contactPhone} />
                  <InfoRow label="Email" value={contactEmail} fullWidth />
                </div>
                <div style={{ textAlign: 'center', marginLeft: '30px' }}>
                  <QRPlaceholder />
                  <div style={{ fontSize: '10px', marginTop: '10px', color: C.leaf, letterSpacing: '0.1em' }}>SCAN PROFILE</div>
                </div>
              </div>
            </SectionCard>
          )}
        </div>
      </A4Page>
    </div>
  );
});

TemplateFloralWedding.displayName = 'TemplateFloralWedding';
export default TemplateFloralWedding;
