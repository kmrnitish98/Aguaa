import React, { useRef } from 'react';
import { getQuoteForPage } from '../../../utils/quotes';

/* ══════════════════════════════════════════════════════════════
   TEMPLATE 5: MODERN PREMIUM PROFESSIONAL
   Theme: Contemporary, luxury corporate meets wedding
   Palette: White, charcoal, gold, soft cream
   ══════════════════════════════════════════════════════════════ */

const FONT_SANS = "Inter, -apple-system, BlinkMacSystemFont, sans-serif";
const FONT_SERIF = "'Playfair Display', Georgia, serif";
const FONT_CORMNT = "'Cormorant Garamond', 'Playfair Display', Georgia, serif";

const C = {
  pageBg: '#ffffff',
  primary: '#1c1c1e', // Charcoal
  gold: '#cba135',
  lightGray: '#f5f5f7',
  textMuted: '#6e6e73',
  border: '#e5e5ea',
};

const SectionHeader = ({ title }) => (
  <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
    <div style={{ width: '4px', height: '18px', background: C.gold, marginRight: '12px' }} />
    <h2 style={{ margin: 0, color: C.primary, fontFamily: FONT_SANS, fontSize: '16px', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: '700' }}>
      {title}
    </h2>
  </div>
);

const InfoBox = ({ label, value }) => {
  if (!value) return null;
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ color: C.textMuted, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px', fontFamily: FONT_SANS, fontWeight: '600' }}>
        {label}
      </div>
      <div style={{ color: C.primary, fontSize: '14px', fontFamily: FONT_SANS, fontWeight: '500', lineHeight: '1.5' }}>
        {value}
      </div>
    </div>
  );
};

const SubLabel = ({ text }) => (
  <div style={{ fontSize: '12px', color: C.gold, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: '700', marginBottom: '12px', marginTop: '16px', fontFamily: FONT_SANS }}>
    {text}
  </div>
);

const Divider = () => (
  <div style={{ width: '100%', height: '1px', background: C.border, margin: '20px 0' }} />
);

const PageFooter = ({ current, total, quote }) => (
  <div style={{ position:'absolute', bottom:'20px', left:'40px', right:'40px', zIndex:5 }}>
    {quote && (
      <div style={{ marginBottom: '15px', textAlign: 'center' }}>
        <p style={{ margin:0, fontSize:'13px', color: C.primary, fontStyle:'italic', letterSpacing:'0.04em', fontFamily: FONT_CORMNT, lineHeight:'1.5' }}>
          ❝ {quote} ❞
        </p>
      </div>
    )}
    <div style={{ borderTop: `1px solid ${C.lightGray}`, paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ color: C.textMuted, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: FONT_SANS }}>
        Page {current} of {total}
      </span>
      <span style={{ color: C.gold, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: FONT_SANS, fontWeight: '700' }}>
        ✦ BioData ✦
      </span>
    </div>
  </div>
);

const A4Page = ({ children, name, occupation, pageIdx = 0, totalPages = 3, quote }) => (
  <div className="pdf-page" style={{ width: '100%', margin: '0 auto', background: C.pageBg, color: C.primary, position: 'relative', overflow: 'hidden', fontFamily: FONT_SANS, boxSizing: 'border-box', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact', pageBreakAfter: pageIdx < totalPages - 1 ? 'always' : 'auto' }}>
    
    {pageIdx === 0 ? (
      <div style={{ padding: '40px 40px 0' }}>
        <div style={{ borderBottom: `2px solid ${C.lightGray}`, paddingBottom: '20px', marginBottom: '30px' }}>
          <h1 style={{ margin: '0 0 8px', color: C.primary, fontFamily: FONT_SERIF, fontSize: '38px', fontWeight: '700', letterSpacing: '-0.02em' }}>
            {name || 'Biodata'}
          </h1>
          <div style={{ color: C.gold, fontFamily: FONT_SANS, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: '600' }}>
            {occupation || 'Professional Profile'}
          </div>
        </div>
      </div>
    ) : (
      <div style={{ padding: '30px 40px 0', borderBottom: `1px solid ${C.lightGray}`, marginBottom: '30px' }}>
        <div style={{ fontSize: '11px', color: C.textMuted, fontFamily: FONT_SANS, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '15px' }}>
          {name || 'Biodata'} <span style={{ color: C.gold }}>|</span> Continued
        </div>
      </div>
    )}

    <div style={{ position: 'relative', zIndex: 3, padding: '0 40px', paddingBottom: quote ? '120px' : '80px' }}>
      {children}
    </div>

    <PageFooter current={pageIdx + 1} total={totalPages} quote={quote} />
  </div>
);

const QRPlaceholder = ({ url }) => {
  const size = 80;
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'8px' }}>
      <div style={{ padding:'6px', background:'#fff', border:`1px solid ${C.border}`, borderRadius:'8px' }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
          <rect width={size} height={size} fill="#fff" rx="4" />
          {Array.from({length: 81}).map((_, i) => (
            Math.random() > 0.4 ? <rect key={i} x={5 + (i%9)*7.7} y={5 + Math.floor(i/9)*7.7} width="7" height="7" fill={C.primary} rx="1"/> : null
          ))}
        </svg>
      </div>
      <span style={{ fontSize:'9px', color:C.textMuted, textTransform:'uppercase', letterSpacing:'0.1em', fontFamily: FONT_SANS, fontWeight: '600', textAlign:'center' }}>
        Scan Profile
      </span>
    </div>
  );
};

const TemplateModernPro = React.forwardRef(({ biodata }, ref) => {
  if (!biodata) return null;

  const { personalInfo = {}, educationInfo = {}, familyInfo = {}, preferences = {} } = biodata;
  const mainPhotoURL = biodata.photoURL || personalInfo.photoURL || null;
  const extraPhotos  = Array.isArray(biodata.photos) ? biodata.photos.map(p => p?.url || p).filter(Boolean) : [];
  
  const { fullName, dob, height, weight, maritalStatus, city, religion, caste, gotra, zodiac, complexion, motherTongue } = personalInfo;
  const { highestQualification, college, passingYear, occupation, employer, annualIncome, additionalQualification } = educationInfo;
  const { fatherName, fatherOccupation, motherName, motherOccupation, siblings, nativePlace, familyType, familyStatus } = familyInfo;
  const { bio: rawBio, partnerExpectations, hobbies, preferredLocation, contactName, contactPhone, contactEmail } = preferences;

  const bio = rawBio || `${fullName ? fullName.split(' ')[0] : 'The individual'} is a warm-hearted, family-oriented professional based in ${city || 'India'}, who beautifully balances modern aspirations with deep traditional values.`;

  const siblingList = Array.isArray(siblings) ? siblings : typeof siblings === 'string' && siblings ? [{ name: siblings, role: '' }] : [];

  const totalPages = 3;
  const p1Quote = getQuoteForPage(1, fullName);
  const p2Quote = getQuoteForPage(2, fullName);
  const p3Quote = getQuoteForPage(3, fullName);

  const Page1Content = () => (
    <>
      <div style={{ display: 'flex', gap: '40px' }}>
        <div style={{ flex: 1 }}>
          <SectionHeader title="Personal Details" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'x' }}>
            <div>
              <InfoBox label="Full Name" value={fullName} />
              <InfoBox label="Date of Birth" value={dob} />
              <InfoBox label="Height" value={height} />
              <InfoBox label="Weight" value={weight} />
              <InfoBox label="Marital Status" value={maritalStatus} />
              <InfoBox label="Mother Tongue" value={motherTongue} />
            </div>
            <div>
              <InfoBox label="Religion" value={religion} />
              <InfoBox label="Caste" value={caste} />
              <InfoBox label="Gotra" value={gotra} />
              <InfoBox label="Zodiac Sign" value={zodiac} />
              <InfoBox label="Complexion" value={complexion} />
              <InfoBox label="Current City" value={city} />
            </div>
          </div>
          {nativePlace && !fatherName && <InfoBox label="Native Place" value={nativePlace} />}
        </div>

        <div style={{ width: '200px', flexShrink: 0 }}>
          {mainPhotoURL ? (
            <img src={mainPhotoURL} alt="Profile" crossOrigin="anonymous" style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', borderRadius: '12px', boxShadow: `0 8px 24px rgba(0,0,0,0.08)` }} />
          ) : (
            <div style={{ width: '100%', aspectRatio: '3/4', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.lightGray, color: C.textMuted, fontSize: '48px', fontFamily: FONT_SERIF, borderRadius: '12px' }}>
              {fullName ? fullName.charAt(0) : 'P'}
            </div>
          )}
        </div>
      </div>

      {bio && (
        <div style={{ marginTop: '30px', background: C.lightGray, padding: '24px', borderRadius: '12px' }}>
          <SectionHeader title="About Me" />
          <p style={{ margin: 0, fontSize: '14px', color: C.primary, lineHeight: '1.7', fontFamily: FONT_SANS }}>
            {bio}
          </p>
        </div>
      )}
    </>
  );

  const Page2Content = () => (
    <>
      <div style={{ marginBottom: '40px' }}>
        <SectionHeader title="Education & Profession" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          <div>
            <SubLabel text="Academic Background" />
            <InfoBox label="Highest Qualification" value={highestQualification} />
            <InfoBox label="College / University" value={college} />
            <InfoBox label="Passing Year" value={passingYear} />
            <InfoBox label="Additional Qualification" value={additionalQualification} />
          </div>
          <div>
            <SubLabel text="Professional Details" />
            <InfoBox label="Occupation" value={occupation} />
            <InfoBox label="Current Employer" value={employer} />
            <InfoBox label="Annual Income" value={annualIncome} />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <SectionHeader title="Family Background" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          <div>
            <InfoBox label="Father's Name" value={fatherName} />
            <InfoBox label="Father's Occupation" value={fatherOccupation} />
            <InfoBox label="Mother's Name" value={motherName} />
            <InfoBox label="Mother's Occupation" value={motherOccupation} />
            {siblingList.map((s, i) => (
              <InfoBox key={i} label={`Sibling ${i + 1}`} value={s.name + (s.role ? ` (${s.role})` : '')} />
            ))}
          </div>
          <div>
            <InfoBox label="Native Place" value={nativePlace} />
            <InfoBox label="Family Type" value={familyType} />
            <InfoBox label="Family Status" value={familyStatus} />
          </div>
        </div>
      </div>

      <div>
        <SectionHeader title="Preferences & Contact" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          <div>
            <SubLabel text="Partner Expectations" />
            {partnerExpectations && <p style={{ fontSize: '13px', color: C.primary, lineHeight: '1.6', fontFamily: FONT_SANS, margin: '0 0 16px 0' }}>{partnerExpectations}</p>}
            <InfoBox label="Preferred Location" value={preferredLocation} />
            
            <SubLabel text="Hobbies & Interests" />
            {hobbies && <p style={{ fontSize: '13px', color: C.primary, lineHeight: '1.6', fontFamily: FONT_SANS, margin: 0 }}>{Array.isArray(hobbies) ? hobbies.join(', ') : hobbies}</p>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <SubLabel text="Contact Details" />
            <InfoBox label="Contact Person" value={contactName} />
            <InfoBox label="Phone Number" value={contactPhone} />
            <InfoBox label="Email Address" value={contactEmail} />
            <div style={{ marginTop: 'auto', alignSelf: 'flex-end', paddingTop: '20px' }}>
              <QRPlaceholder url={typeof window !== 'undefined' ? window.location.href : ''} />
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const Page3Content = () => (
    <>
      <div style={{ minHeight: '350px', marginBottom: '30px' }}>
        <SectionHeader title="Photo Gallery" />
        {extraPhotos.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: extraPhotos.length >= 3 ? 'repeat(3, 1fr)' : `repeat(${extraPhotos.length}, 1fr)`, gap: '20px' }}>
            {extraPhotos.slice(0, 3).map((photo, i) => (
              <div key={i} style={{ borderRadius: '12px', overflow: 'hidden', aspectRatio: '4/5', boxShadow: `0 4px 15px rgba(0,0,0,0.06)` }}>
                <img src={photo} alt={`Gallery ${i+1}`} crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '250px', background: C.lightGray, borderRadius: '12px' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>📸</div>
            <p style={{ fontFamily: FONT_SANS, color: C.textMuted, fontSize: '14px', fontWeight: '500' }}>
              No gallery photos uploaded
            </p>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px', background: C.lightGray, borderRadius: '12px' }}>
        <QRPlaceholder url={typeof window !== 'undefined' ? window.location.href : ''} />
        <div style={{ width: '40px', height: '2px', background: C.gold, margin: '20px 0' }} />
        <p style={{ margin: 0, fontSize: '15px', color: C.primary, fontStyle: 'italic', letterSpacing: '0.02em', fontFamily: FONT_SERIF, lineHeight: '1.8', textAlign: 'center' }}>
          "Looking for an auspicious alliance built on mutual respect, love, and shared values."
        </p>
      </div>
    </>
  );

  return (
    <div ref={ref} className="print-container pdf-render-container" style={{ background: '#f5f5f7', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
      <A4Page name={fullName} occupation={occupation} pageIdx={0} totalPages={totalPages} quote={p1Quote}>
        <Page1Content />
      </A4Page>
      <A4Page name={fullName} pageIdx={1} totalPages={totalPages} quote={p2Quote}>
        <Page2Content />
      </A4Page>
      <A4Page name={fullName} pageIdx={2} totalPages={totalPages} quote={p3Quote}>
        <Page3Content />
      </A4Page>
    </div>
  );
});

export default TemplateModernPro;
