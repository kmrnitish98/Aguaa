import React, { useRef } from 'react';
import { getQuoteForPage } from '../../../utils/quotes';

/* ══════════════════════════════════════════════════════════════
   TEMPLATE 3: SACRED OM CLASSIC
   Theme: Minimal spiritual elegance, Om symbol
   Palette: Clean white and saffron
   ══════════════════════════════════════════════════════════════ */

const FONT_CINZEL = "'Cinzel', 'Playfair Display', Georgia, serif";
const FONT_CORMNT = "'Cormorant Garamond', 'Playfair Display', Georgia, serif";
const FONT_INTER  = "Inter, -apple-system, BlinkMacSystemFont, sans-serif";

const C = {
  pageBg: '#ffffff',
  primary: '#ff7722', // Saffron
  secondary: '#8b4513', // Saddle Brown for text readability
  textDark: '#333333',
  textMuted: '#777777',
  border: 'rgba(255, 119, 34, 0.3)',
};

const OmSymbol = () => (
  <svg width="45" height="45" viewBox="0 0 100 100" fill="none">
    <text x="50" y="65" fontSize="55" fill={C.primary} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold">ॐ</text>
  </svg>
);

const OmWatermark = () => (
  <svg width="400" height="400" viewBox="0 0 100 100" fill="none" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.03, pointerEvents: 'none' }}>
    <text x="50" y="70" fontSize="80" fill={C.primary} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold">ॐ</text>
  </svg>
);

const SectionHeader = ({ title }) => (
  <div style={{ marginBottom: '16px', borderBottom: `1px solid ${C.border}`, paddingBottom: '8px' }}>
    <h2 style={{ margin: 0, color: C.secondary, fontFamily: FONT_CINZEL, fontSize: '18px', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: '600' }}>
      {title}
    </h2>
  </div>
);

const InfoRow = ({ label, value }) => {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', marginBottom: '8px', alignItems: 'baseline' }}>
      <span style={{ width: '150px', flexShrink: 0, color: C.secondary, fontSize: '11px', fontWeight: '600', fontFamily: FONT_INTER, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </span>
      <span style={{ color: C.textDark, fontSize: '13px', fontFamily: FONT_INTER, fontWeight: '400' }}>
        {value}
      </span>
    </div>
  );
};

const SubLabel = ({ text }) => (
  <div style={{ fontSize: '11px', color: C.secondary, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: '700', marginBottom: '10px', marginTop: '10px', fontFamily: FONT_INTER }}>
    {text}
  </div>
);

const Divider = () => (
  <div style={{ width: '100%', height: '1px', background: `linear-gradient(90deg, transparent, ${C.border}, transparent)`, margin: '15px 0' }} />
);

const PageFooter = ({ current, total, quote }) => (
  <div style={{ position:'absolute', bottom:'20px', left:0, right:0, textAlign:'center', zIndex:5 }}>
    {quote && (
      <div style={{ marginBottom: '15px', padding: '0 40px' }}>
        <p style={{ margin:0, fontSize:'13px', color: C.secondary, fontStyle:'italic', letterSpacing:'0.04em', fontFamily: FONT_CORMNT, lineHeight:'1.5' }}>
          ❝ {quote} ❞
        </p>
      </div>
    )}
    <div style={{ height:'1px', width:'55%', margin:'0 auto 8px', background:`linear-gradient(90deg, transparent, ${C.border}, transparent)` }}/>
    <span style={{ fontSize:'9px', color: C.textMuted, letterSpacing:'0.22em', textTransform:'uppercase', fontFamily: FONT_INTER }}>
      Page {current} of {total} · ✦ BioData ✦ · © {new Date().getFullYear()}
    </span>
  </div>
);

const A4Page = ({ children, name, pageIdx = 0, totalPages = 3, quote }) => (
  <div className="pdf-page" style={{ width: '100%', margin: '0 auto', background: C.pageBg, color: C.textDark, position: 'relative', overflow: 'hidden', fontFamily: FONT_INTER, boxSizing: 'border-box', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact', pageBreakAfter: pageIdx < totalPages - 1 ? 'always' : 'auto' }}>
    <div style={{ position: 'absolute', inset: '20px', border: `1px solid ${C.primary}`, pointerEvents: 'none', zIndex: 1 }} />
    <div style={{ position: 'absolute', inset: '24px', border: `0.5px solid ${C.primary}`, pointerEvents: 'none', zIndex: 1 }} />
    
    <OmWatermark />

    {pageIdx === 0 ? (
      <div style={{ textAlign: 'center', paddingTop: '40px', marginBottom: '20px', position: 'relative', zIndex: 3 }}>
        <OmSymbol />
        <h1 style={{ color: C.secondary, fontFamily: FONT_CINZEL, fontSize: '30px', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '10px 0 5px', fontWeight: '700' }}>
          {name || 'Biodata'}
        </h1>
        <div style={{ height: '2px', width: '60px', background: C.primary, margin: '0 auto' }} />
      </div>
    ) : (
      <div style={{ textAlign: 'center', paddingTop: '30px', position: 'relative', zIndex: 3 }}>
        <div style={{ fontSize: '10px', color: C.secondary, fontFamily: FONT_CINZEL, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          ✦ {name || 'Biodata'} · Continued ✦
        </div>
      </div>
    )}

    <div style={{ position: 'relative', zIndex: 3, padding: '20px 45px', paddingBottom: quote ? '100px' : '60px' }}>
      {children}
    </div>

    <PageFooter current={pageIdx + 1} total={totalPages} quote={quote} />
  </div>
);

const QRPlaceholder = ({ url }) => {
  const size = 80;
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'5px' }}>
      <div style={{ padding:'4px', background:'#fff', border:`1px solid ${C.primary}`, borderRadius:'6px' }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
          <rect width={size} height={size} fill="#fff"/>
          {Array.from({length: 81}).map((_, i) => (
            Math.random() > 0.4 ? <rect key={i} x={5 + (i%9)*7.7} y={5 + Math.floor(i/9)*7.7} width="7" height="7" fill={C.secondary} rx="1"/> : null
          ))}
        </svg>
      </div>
      <span style={{ fontSize:'8px', color:C.textMuted, textTransform:'uppercase', letterSpacing:'0.1em', fontFamily: FONT_INTER, textAlign:'center' }}>
        Scan Profile
      </span>
    </div>
  );
};

const TemplateOmClassic = React.forwardRef(({ biodata }, ref) => {
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
      <div style={{ display: 'flex', gap: '30px' }}>
        <div style={{ flex: 1 }}>
          <SectionHeader title="Personal Details" />
          <InfoRow label="Full Name" value={fullName} />
          <InfoRow label="Date of Birth" value={dob} />
          <InfoRow label="Height" value={height} />
          <InfoRow label="Weight" value={weight} />
          <InfoRow label="Marital Status" value={maritalStatus} />
          <InfoRow label="Religion" value={religion} />
          <InfoRow label="Caste" value={caste} />
          <InfoRow label="Gotra" value={gotra} />
          <InfoRow label="Zodiac Sign" value={zodiac} />
          <InfoRow label="Complexion" value={complexion} />
          <InfoRow label="Mother Tongue" value={motherTongue} />
          <InfoRow label="Current City" value={city} />
          {nativePlace && !fatherName && <InfoRow label="Native Place" value={nativePlace} />}
        </div>

        <div style={{ width: '220px', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {mainPhotoURL ? (
            <div style={{ padding: '6px', background: '#fff', border: `2px solid ${C.primary}`, borderRadius: '6px', width: '100%', aspectRatio: '3/4' }}>
              <img src={mainPhotoURL} alt="Profile" crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px', display: 'block' }} />
            </div>
          ) : (
            <div style={{ padding: '6px', background: '#fff', border: `2px solid ${C.primary}`, borderRadius: '6px', width: '100%', aspectRatio: '3/4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.primary, fontSize: '48px', fontFamily: FONT_CINZEL }}>
              {fullName ? fullName.charAt(0) : 'ॐ'}
            </div>
          )}
        </div>
      </div>

      {bio && (
        <div style={{ marginTop: '30px' }}>
          <SectionHeader title="About Me" />
          <p style={{ margin: 0, fontSize: '13px', color: C.textDark, lineHeight: '1.8', fontFamily: FONT_INTER }}>
            {bio}
          </p>
        </div>
      )}
    </>
  );

  const Page2Content = () => (
    <>
      <div style={{ marginBottom: '30px' }}>
        <SectionHeader title="Education & Profession" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <SubLabel text="Academic Background" />
            <InfoRow label="Highest Qualification" value={highestQualification} />
            <InfoRow label="College / University" value={college} />
            <InfoRow label="Passing Year" value={passingYear} />
            <InfoRow label="Additional Qualification" value={additionalQualification} />
          </div>
          <div>
            <SubLabel text="Professional Details" />
            <InfoRow label="Occupation" value={occupation} />
            <InfoRow label="Employer" value={employer} />
            <InfoRow label="Annual Income" value={annualIncome} />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <SectionHeader title="Family Background" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <InfoRow label="Father's Name" value={fatherName} />
            <InfoRow label="Father's Occupation" value={fatherOccupation} />
            <InfoRow label="Mother's Name" value={motherName} />
            <InfoRow label="Mother's Occupation" value={motherOccupation} />
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
      </div>

      <div>
        <SectionHeader title="Preferences & Contact" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <SubLabel text="Partner Expectations" />
            {partnerExpectations && <p style={{ fontSize: '12px', color: C.textDark, lineHeight: '1.6', fontFamily: FONT_INTER, margin: '0 0 10px 0' }}>{partnerExpectations}</p>}
            <InfoRow label="Preferred Location" value={preferredLocation} />
            <SubLabel text="Hobbies & Interests" />
            {hobbies && <p style={{ fontSize: '12px', color: C.textDark, lineHeight: '1.6', fontFamily: FONT_INTER, margin: 0 }}>{Array.isArray(hobbies) ? hobbies.join(', ') : hobbies}</p>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <SubLabel text="Contact Details" />
            <InfoRow label="Contact Person" value={contactName} />
            <InfoRow label="Phone Number" value={contactPhone} />
            <InfoRow label="Email Address" value={contactEmail} />
            <div style={{ marginTop: 'auto', alignSelf: 'flex-end' }}>
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
              <div key={i} style={{ borderRadius: '6px', overflow: 'hidden', border: `2px solid ${C.primary}`, aspectRatio: '4/5', padding: '4px' }}>
                <img src={photo} alt={`Gallery ${i+1}`} crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '250px', opacity: 0.6 }}>
            <Divider />
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>📸</div>
            <p style={{ fontFamily: FONT_CORMNT, fontStyle: 'italic', color: C.textDark, fontSize: '16px' }}>
              A picture is worth a thousand words...
            </p>
            <Divider />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px' }}>
        <QRPlaceholder url={typeof window !== 'undefined' ? window.location.href : ''} />
        <Divider />
        <p style={{ margin: 0, fontSize: '15px', color: C.secondary, fontStyle: 'italic', letterSpacing: '0.05em', fontFamily: FONT_CORMNT, lineHeight: '1.8', textAlign: 'center' }}>
          "Looking for an auspicious alliance built on mutual respect, love, and shared values."
        </p>
      </div>
    </>
  );

  return (
    <div ref={ref} className="print-container pdf-render-container" style={{ background: '#f5f5f5', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
      <A4Page name={fullName} pageIdx={0} totalPages={totalPages} quote={p1Quote}>
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

export default TemplateOmClassic;
