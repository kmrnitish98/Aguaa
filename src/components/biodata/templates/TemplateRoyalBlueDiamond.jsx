import React from 'react';
import { getQuoteForPage } from '../../../utils/quotes';

/* ══════════════════════════════════════════════════════════════
   ROYAL BLUE DIAMOND TEMPLATE
   Navy blue and silver palette, diamond texture, luxury brochure style.
   ══════════════════════════════════════════════════════════════ */

const FONT_SERIF = "'Playfair Display', serif";
const FONT_SANS = "'Inter', sans-serif";

const C = {
  pageBg: '#001122',
  cardBg: 'rgba(0, 31, 63, 0.6)',
  silverMain: '#C0C0C0',
  silverLight: '#E8E8E8',
  silverDark: '#8A8A8A',
  text: '#FFFFFF',
  textMuted: '#B0C4DE',
  border: 'rgba(192, 192, 192, 0.3)',
};

const generateBio = ({ fullName, occupation, city }) => {
  const name = fullName ? fullName.split(' ')[0] : 'The individual';
  const occup = occupation || 'professional';
  const place = city || 'India';
  return `A highly accomplished ${occup} living in ${place}. Known for a rare blend of intellect, grace, and sincerity, ${name} navigates both career and family life with elegance. Seeking a like-minded partner who values trust, deep connection, and building an extraordinary life together.`;
};

/* ─── Diamond Texture SVG ────────────────────────────────────── */
const DiamondTexture = () => (
  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', top: 0, left: 0, opacity: 0.05, pointerEvents: 'none', zIndex: 0 }}>
    <defs>
      <pattern id="diamondPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 40 20 L 20 40 L 0 20 Z" fill="none" stroke={C.silverMain} strokeWidth="1" />
        <circle cx="20" cy="20" r="1.5" fill={C.silverMain} />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#diamondPattern)" />
  </svg>
);

const SectionHeader = ({ title }) => (
  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '25px', gap: '15px' }}>
    <div style={{ width: '8px', height: '8px', transform: 'rotate(45deg)', background: C.silverMain }} />
    <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '400', color: C.silverLight, fontFamily: FONT_SERIF, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
      {title}
    </h2>
    <div style={{ height: '1px', flex: 1, background: `linear-gradient(90deg, ${C.border}, transparent)` }} />
  </div>
);

const InfoRow = ({ label, value, fullWidth = false }) => {
  if (!value) return null;
  return (
    <div style={{ marginBottom: '16px', gridColumn: fullWidth ? '1/-1' : undefined }}>
      <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: C.silverDark, fontFamily: FONT_SANS, fontWeight: '600', marginBottom: '4px' }}>
        {label}
      </div>
      <div style={{ fontSize: '15px', color: C.text, fontWeight: '400', fontFamily: FONT_SANS, letterSpacing: '0.02em', lineHeight: '1.4' }}>
        {value}
      </div>
    </div>
  );
};

const SectionCard = ({ children }) => (
  <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: '4px', padding: '35px', marginBottom: '25px', position: 'relative', zIndex: 2, backdropFilter: 'blur(8px)', boxShadow: '0 10px 25px rgba(0,0,0,0.4)' }}>
    {children}
  </div>
);

const A4Page = ({ children, pageIdx, totalPages }) => (
  <div className="pdf-page" style={{ width: '100%', margin: '0 auto', background: C.pageBg, color: C.text, position: 'relative', boxSizing: 'border-box', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact', pageBreakAfter: pageIdx < totalPages - 1 ? 'always' : 'auto', overflow: 'hidden' }}>
    <DiamondTexture />
    
    <div style={{ position: 'absolute', inset: '10px', border: `1px solid ${C.border}`, pointerEvents: 'none', zIndex: 1 }} />
    <div style={{ position: 'absolute', inset: '14px', border: `1px solid rgba(192,192,192,0.1)`, pointerEvents: 'none', zIndex: 1 }} />
    
    <div style={{ position: 'relative', zIndex: 5, padding: '50px 45px 60px' }}>
      {children}
    </div>
    
    <div style={{ position: 'absolute', bottom: '25px', left: '45px', right: '45px', display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: C.silverDark, fontFamily: FONT_SANS, letterSpacing: '0.2em', textTransform: 'uppercase', zIndex: 5 }}>
      <span>Royal Blue Collection</span>
      <span>Page {pageIdx + 1} of {totalPages}</span>
    </div>
  </div>
);

const PhotoFrame = ({ src, name }) => (
  <div style={{ position: 'relative', width: '220px', margin: '0 auto', aspectRatio: '3/4', overflow: 'hidden', border: `1px solid ${C.silverLight}`, boxShadow: `0 0 0 6px ${C.pageBg}, 0 0 0 7px ${C.silverDark}, 0 20px 40px rgba(0,0,0,0.8)` }}>
    {src ? (
      <img src={src} alt={name || 'Profile'} crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    ) : (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '50px', color: C.silverMain, fontFamily: FONT_SERIF, background: '#002244' }}>
        {name ? name.charAt(0) : 'R'}
      </div>
    )}
  </div>
);

const QRPlaceholder = () => (
  <div style={{ border: `1px solid ${C.silverDark}`, width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(192,192,192,0.05)' }}>
    <div style={{ fontSize: '30px', filter: 'grayscale(100%)' }}>💠</div>
  </div>
);

const TemplateRoyalBlueDiamond = React.forwardRef(({ biodata }, ref) => {
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
    <div ref={ref} className="print-container pdf-render-container" style={{ background: '#000814' }}>
      <A4Page pageIdx={0} totalPages={3}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <PhotoFrame src={mainPhotoURL} name={fullName} />
          <h1 style={{ fontSize: '42px', color: C.silverLight, fontFamily: FONT_SERIF, margin: '30px 0 10px', fontWeight: '400', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {fullName || 'Biodata Profile'}
          </h1>
          <div style={{ height: '1px', width: '100px', background: C.silverMain, margin: '0 auto 15px' }} />
          <div style={{ fontSize: '14px', color: C.textMuted, fontFamily: FONT_SANS, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            {occupation} • {city}
          </div>
        </div>

        <div style={{ marginBottom: '40px', padding: '0 30px', textAlign: 'center' }}>
          <p style={{ fontSize: '15px', lineHeight: '1.8', color: C.textMuted, fontFamily: FONT_SANS, fontWeight: '300' }}>
            "{bio}"
          </p>
        </div>

        <SectionCard>
          <SectionHeader title="Personal Overview" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
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
              <SectionHeader title="Academic & Professional" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
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

          {hasFamily && (
            <SectionCard>
              <SectionHeader title="Family Details" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
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
                      <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: C.silverDark, fontFamily: FONT_SANS, fontWeight: '600', marginBottom: '8px' }}>Siblings</div>
                      {siblingList.map((s, i) => (
                        <div key={i} style={{ fontSize: '15px', color: C.text, marginBottom: '4px', fontWeight: '400', fontFamily: FONT_SANS }}>• {s.name} {s.role && `(${s.role})`}</div>
                      ))}
                    </div>
                  )}
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                  <InfoRow label="Preferred Location" value={preferredLocation} />
                  <InfoRow label="Hobbies & Interests" value={Array.isArray(hobbies) ? hobbies.join(', ') : hobbies} />
                </div>
              </div>
            </SectionCard>
          )}

          {hasContact && (
            <SectionCard>
              <SectionHeader title="Contact Information" />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', flex: 1 }}>
                  <InfoRow label="Contact Person" value={contactName} />
                  <InfoRow label="Phone Number" value={contactPhone} />
                  <InfoRow label="Email Address" value={contactEmail} fullWidth />
                </div>
                <div style={{ marginLeft: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <QRPlaceholder />
                  <span style={{ fontSize: '10px', marginTop: '12px', color: C.silverMain, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Scan Code</span>
                </div>
              </div>
            </SectionCard>
          )}
        </div>
      </A4Page>
    </div>
  );
});

TemplateRoyalBlueDiamond.displayName = 'TemplateRoyalBlueDiamond';
export default TemplateRoyalBlueDiamond;
