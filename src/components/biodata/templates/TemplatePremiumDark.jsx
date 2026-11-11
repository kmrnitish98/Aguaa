import React from 'react';
import { getQuoteForPage } from '../../../utils/quotes';

/* ══════════════════════════════════════════════════════════════
   PREMIUM DARK LUXURY TEMPLATE
   Black background, gold metallic accents, glassmorphism.
   ══════════════════════════════════════════════════════════════ */

const FONT_HEADING = "'Playfair Display', serif";
const FONT_BODY = "'Inter', sans-serif";

const C = {
  pageBg: '#050505',
  cardBg: 'rgba(255, 255, 255, 0.03)',
  gold: '#D4AF37',
  goldLight: '#F3E5AB',
  text: '#FFFFFF',
  textMuted: '#A0A0A0',
  border: 'rgba(212, 175, 55, 0.2)',
};

const generateBio = ({ fullName, occupation, city }) => {
  const name = fullName ? fullName.split(' ')[0] : 'The individual';
  const occup = occupation || 'professional';
  const place = city || 'India';
  return `A sophisticated and driven ${occup} based in ${place}. ${name} brings a perfect balance of ambition and empathy to everyday life. Focused on building a meaningful and luxurious future together, rooted in mutual respect, shared goals, and a deep appreciation for the finer things in life.`;
};

const SectionHeader = ({ title }) => (
  <div style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '15px' }}>
    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '400', color: C.gold, fontFamily: FONT_HEADING, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
      {title}
    </h2>
    <div style={{ height: '1px', flex: 1, background: `linear-gradient(90deg, ${C.border}, transparent)` }} />
  </div>
);

const InfoRow = ({ label, value, fullWidth = false }) => {
  if (!value) return null;
  return (
    <div style={{ marginBottom: '18px', gridColumn: fullWidth ? '1/-1' : undefined }}>
      <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', color: C.textMuted, fontFamily: FONT_BODY, marginBottom: '4px' }}>
        {label}
      </div>
      <div style={{ fontSize: '15px', color: C.text, fontWeight: '300', fontFamily: FONT_BODY, letterSpacing: '0.02em' }}>
        {value}
      </div>
    </div>
  );
};

const SectionCard = ({ children }) => (
  <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '30px', marginBottom: '25px', position: 'relative', zIndex: 2, backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
    <div style={{ position: 'absolute', top: 0, left: '20px', width: '40px', height: '1px', background: C.gold }} />
    {children}
  </div>
);

const A4Page = ({ children, pageIdx, totalPages }) => (
  <div className="pdf-page" style={{ width: '100%', margin: '0 auto', background: C.pageBg, color: C.text, position: 'relative', boxSizing: 'border-box', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact', pageBreakAfter: pageIdx < totalPages - 1 ? 'always' : 'auto', overflow: 'hidden' }}>
    {/* Ambient Glows */}
    <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
    <div style={{ position: 'absolute', bottom: '-100px', right: '-100px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(212,175,55,0.03) 0%, transparent 70%)', pointerEvents: 'none' }} />
    
    <div style={{ position: 'relative', zIndex: 5, padding: '50px 45px 60px' }}>
      {children}
    </div>
    
    <div style={{ position: 'absolute', bottom: '20px', left: '45px', right: '45px', display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${C.border}`, paddingTop: '15px', fontSize: '10px', color: C.textMuted, fontFamily: FONT_BODY, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
      <span>Premium Edition</span>
      <span>Page {pageIdx + 1} / {totalPages}</span>
    </div>
  </div>
);

const PhotoFrame = ({ src, name }) => (
  <div style={{ position: 'relative', width: '100%', aspectRatio: '4/5', borderRadius: '12px', overflow: 'hidden', border: `1px solid ${C.border}`, boxShadow: `0 20px 40px rgba(0,0,0,0.8)` }}>
    {src ? (
      <img src={src} alt={name || 'Profile'} crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    ) : (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '50px', color: C.gold, fontFamily: FONT_HEADING, background: '#111' }}>
        {name ? name.charAt(0) : 'P'}
      </div>
    )}
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)', pointerEvents: 'none' }} />
  </div>
);

const QRPlaceholder = () => (
  <div style={{ border: `1px solid ${C.gold}`, width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', background: 'rgba(212,175,55,0.05)' }}>
    <div style={{ fontSize: '30px', filter: 'grayscale(100%) brightness(200%)' }}>📱</div>
  </div>
);

const TemplatePremiumDark = React.forwardRef(({ biodata }, ref) => {
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
    <div ref={ref} className="print-container pdf-render-container" style={{ background: '#000000' }}>
      <A4Page pageIdx={0} totalPages={3}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: '40px', marginBottom: '40px', alignItems: 'center' }}>
          <div>
            <div style={{ width: '40px', height: '2px', background: C.gold, marginBottom: '20px' }} />
            <h1 style={{ fontSize: '52px', color: C.text, fontFamily: FONT_HEADING, margin: '0 0 15px', lineHeight: '1.1', fontWeight: 'normal' }}>
              {fullName || 'Biodata Profile'}
            </h1>
            <div style={{ fontSize: '14px', color: C.gold, fontFamily: FONT_BODY, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '25px' }}>
              Exclusive Matrimonial Profile
            </div>
            <p style={{ fontSize: '15px', lineHeight: '1.8', color: C.textMuted, fontFamily: FONT_BODY, fontWeight: '300' }}>
              {bio}
            </p>
          </div>
          <div>
            <PhotoFrame src={mainPhotoURL} name={fullName} />
          </div>
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
            <InfoRow label="Current City" value={city} />
          </div>
        </SectionCard>
      </A4Page>

      <A4Page pageIdx={1} totalPages={3}>
        <div style={{ paddingTop: '20px' }}>
          {hasEdu && (
            <SectionCard>
              <SectionHeader title="Professional & Academic" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: C.gold, fontFamily: FONT_BODY, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '15px' }}>Academics</div>
                  <InfoRow label="Highest Qualification" value={highestQualification} />
                  <InfoRow label="College" value={college} />
                  <InfoRow label="Passing Year" value={passingYear} />
                  <InfoRow label="Additional Qualification" value={additionalQualification} />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: C.gold, fontFamily: FONT_BODY, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '15px' }}>Career</div>
                  <InfoRow label="Occupation" value={occupation} />
                  <InfoRow label="Employer" value={employer} />
                  <InfoRow label="Annual Income" value={annualIncome} />
                </div>
              </div>
            </SectionCard>
          )}

          {hasFamily && (
            <SectionCard>
              <SectionHeader title="Heritage & Family" />
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
                      <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', color: C.textMuted, fontFamily: FONT_BODY, marginBottom: '8px' }}>Siblings</div>
                      {siblingList.map((s, i) => (
                        <div key={i} style={{ fontSize: '15px', color: C.text, marginBottom: '4px', fontWeight: '300' }}>• {s.name} {s.role && `(${s.role})`}</div>
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
                  <span style={{ fontSize: '10px', marginTop: '12px', color: C.gold, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Scan</span>
                </div>
              </div>
            </SectionCard>
          )}
        </div>
      </A4Page>
    </div>
  );
});

TemplatePremiumDark.displayName = 'TemplatePremiumDark';
export default TemplatePremiumDark;
