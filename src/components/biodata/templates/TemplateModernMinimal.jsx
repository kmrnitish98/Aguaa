import React from 'react';
import { getQuoteForPage } from '../../../utils/quotes';

/* ══════════════════════════════════════════════════════════════
   MODERN MINIMAL TEMPLATE
   White background, black and gold accents, clean spacing.
   ══════════════════════════════════════════════════════════════ */

const FONT_TITLE = "'Inter', sans-serif";
const FONT_BODY = "'Inter', sans-serif";
const FONT_SERIF = "'Playfair Display', serif";

const C = {
  pageBg: '#FFFFFF',
  cardBg: '#FAFAFA',
  accent: '#000000',
  gold: '#D4AF37',
  text: '#111111',
  textMuted: '#555555',
  borderLight: '#EEEEEE',
};

const generateBio = ({ fullName, occupation, city }) => {
  const name = fullName ? fullName.split(' ')[0] : 'The individual';
  const occup = occupation || 'professional';
  const place = city || 'India';
  return `A modern, forward-thinking ${occup} living in ${place}. Values simplicity, honesty, and continuous growth. ${name} approaches life with a balanced mindset and seeks a partner who shares a passion for meaningful conversations and building a strong, progressive future together.`;
};

const SectionHeader = ({ title }) => (
  <div style={{ marginBottom: '24px', borderBottom: `2px solid ${C.accent}`, paddingBottom: '8px' }}>
    <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: C.accent, letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: FONT_TITLE }}>
      {title}
    </h2>
  </div>
);

const InfoRow = ({ label, value, fullWidth = false }) => {
  if (!value) return null;
  return (
    <div style={{ marginBottom: '16px', gridColumn: fullWidth ? '1/-1' : undefined }}>
      <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: C.textMuted, fontWeight: '600', fontFamily: FONT_BODY, marginBottom: '4px' }}>
        {label}
      </div>
      <div style={{ fontSize: '15px', color: C.text, fontWeight: '400', fontFamily: FONT_BODY, lineHeight: '1.4' }}>
        {value}
      </div>
    </div>
  );
};

const SectionCard = ({ children }) => (
  <div style={{ background: C.cardBg, border: `1px solid ${C.borderLight}`, padding: '30px', marginBottom: '30px' }}>
    {children}
  </div>
);

const A4Page = ({ children, pageIdx, totalPages }) => (
  <div className="pdf-page" style={{ width: '100%', margin: '0 auto', background: C.pageBg, color: C.text, position: 'relative', boxSizing: 'border-box', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact', pageBreakAfter: pageIdx < totalPages - 1 ? 'always' : 'auto', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '8px', background: C.accent }} />
    <div style={{ padding: '50px 40px 60px' }}>
      {children}
    </div>
    <div style={{ position: 'absolute', bottom: '20px', left: '40px', right: '40px', display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${C.borderLight}`, paddingTop: '10px', fontSize: '11px', color: C.textMuted, fontFamily: FONT_BODY }}>
      <span>MODERN MINIMAL</span>
      <span>PAGE {pageIdx + 1} OF {totalPages}</span>
    </div>
  </div>
);

const PhotoFrame = ({ src, name }) => (
  <div style={{ width: '100%', aspectRatio: '3/4', overflow: 'hidden', background: '#f5f5f5', filter: 'grayscale(10%)' }}>
    {src ? (
      <img src={src} alt={name || 'Profile'} crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    ) : (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', color: '#ccc', fontFamily: FONT_TITLE }}>
        {name ? name.charAt(0) : 'Profile'}
      </div>
    )}
  </div>
);

const QRPlaceholder = () => (
  <div style={{ border: `1px solid ${C.accent}`, width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ fontSize: '30px' }}>QR</div>
  </div>
);

const TemplateModernMinimal = React.forwardRef(({ biodata }, ref) => {
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
    <div ref={ref} className="print-container pdf-render-container" style={{ background: '#ffffff' }}>
      <A4Page pageIdx={0} totalPages={3}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '40px', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '48px', color: C.accent, fontFamily: FONT_SERIF, margin: '0 0 10px', lineHeight: '1.1' }}>
              {fullName || 'Biodata Profile'}
            </h1>
            <div style={{ fontSize: '16px', color: C.gold, fontFamily: FONT_BODY, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '20px' }}>
              {occupation} • {city}
            </div>
            <p style={{ fontSize: '15px', lineHeight: '1.6', color: C.textMuted, fontFamily: FONT_BODY, marginTop: '0' }}>
              {bio}
            </p>
          </div>
          <div>
            <PhotoFrame src={mainPhotoURL} name={fullName} />
          </div>
        </div>

        <SectionCard>
          <SectionHeader title="Personal Details" />
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
            <InfoRow label="City" value={city} />
          </div>
        </SectionCard>
      </A4Page>

      <A4Page pageIdx={1} totalPages={3}>
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
                    <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: C.textMuted, fontWeight: '600', fontFamily: FONT_BODY, marginBottom: '8px' }}>Siblings</div>
                    {siblingList.map((s, i) => (
                      <div key={i} style={{ fontSize: '15px', color: C.text, marginBottom: '4px' }}>• {s.name} {s.role && `(${s.role})`}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </SectionCard>
        )}
      </A4Page>

      <A4Page pageIdx={2} totalPages={3}>
        {hasPref && (
          <SectionCard>
            <SectionHeader title="Partner Preferences" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              <div>
                <InfoRow label="Expectations" value={partnerExpectations} />
                <InfoRow label="Preferred Location" value={preferredLocation} />
              </div>
              <div>
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
                <span style={{ fontSize: '10px', marginTop: '8px', color: C.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Scan</span>
              </div>
            </div>
          </SectionCard>
        )}
      </A4Page>
    </div>
  );
});

TemplateModernMinimal.displayName = 'TemplateModernMinimal';
export default TemplateModernMinimal;
