import React, { useRef } from 'react';
import { getQuoteForPage } from '../../../utils/quotes';

/* ══════════════════════════════════════════════════════════════
   TEMPLATE 4: ROYAL WEDDING TEXTURE
   Theme: Modern Indian wedding invitation, embossed paper
   Palette: Champagne gold, cream, rich brown
   ══════════════════════════════════════════════════════════════ */

const FONT_CINZEL = "'Cinzel', 'Playfair Display', Georgia, serif";
const FONT_CORMNT = "'Cormorant Garamond', 'Playfair Display', Georgia, serif";
const FONT_INTER  = "Inter, -apple-system, BlinkMacSystemFont, sans-serif";

const C = {
  pageBg: '#fbf9f6',
  primary: '#5d4037', // Rich Brown
  gold: '#d4af37', // Champagne Gold
  cardBg: '#ffffff',
  textMuted: '#8d6e63',
};

const TexturedBackground = () => (
  <div style={{
    position: 'absolute', inset: 0, pointerEvents: 'none',
    opacity: 0.4,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
  }} />
);

const LeafOrnament = () => (
  <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
    <path d="M20 2 C 25 2, 35 10, 38 18 C 30 18, 25 10, 20 2 Z" fill={C.gold} opacity="0.8" />
    <path d="M20 2 C 15 2, 5 10, 2 18 C 10 18, 15 10, 20 2 Z" fill={C.gold} opacity="0.8" />
  </svg>
);

const SectionHeader = ({ title }) => (
  <div style={{ textAlign: 'center', marginBottom: '20px' }}>
    <LeafOrnament />
    <h2 style={{ margin: '5px 0 0', color: C.primary, fontFamily: FONT_CINZEL, fontSize: '18px', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: '700' }}>
      {title}
    </h2>
  </div>
);

const InfoRow = ({ label, value }) => {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', marginBottom: '8px', alignItems: 'baseline' }}>
      <span style={{ width: '150px', flexShrink: 0, color: C.gold, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: FONT_CINZEL, fontWeight: '700' }}>
        {label}
      </span>
      <span style={{ color: C.primary, fontSize: '14px', fontFamily: FONT_CORMNT, fontStyle: 'italic', fontWeight: '600' }}>
        {value}
      </span>
    </div>
  );
};

const SubLabel = ({ text }) => (
  <div style={{ fontSize: '11px', color: C.gold, textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: '700', marginBottom: '10px', marginTop: '10px', fontFamily: FONT_CINZEL }}>
    {text}
  </div>
);

const Divider = () => (
  <div style={{ width: '100%', height: '1px', background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`, margin: '15px 0', opacity: 0.5 }} />
);

const PageFooter = ({ current, total, quote }) => (
  <div style={{ position:'absolute', bottom:'20px', left:0, right:0, textAlign:'center', zIndex:5 }}>
    {quote && (
      <div style={{ marginBottom: '15px', padding: '0 40px' }}>
        <p style={{ margin:0, fontSize:'14px', color: C.primary, fontStyle:'italic', letterSpacing:'0.04em', fontFamily: FONT_CORMNT, lineHeight:'1.5' }}>
          ❝ {quote} ❞
        </p>
      </div>
    )}
    <div style={{ height:'1px', width:'40%', margin:'0 auto 8px', background:`linear-gradient(90deg, transparent, ${C.gold}, transparent)`, opacity: 0.5 }}/>
    <span style={{ fontSize:'9px', color: C.textMuted, letterSpacing:'0.22em', textTransform:'uppercase', fontFamily: FONT_CINZEL, fontWeight: '700' }}>
      Page {current} of {total} · ✦ BioData ✦ · © {new Date().getFullYear()}
    </span>
  </div>
);

const A4Page = ({ children, name, pageIdx = 0, totalPages = 3, quote }) => (
  <div className="pdf-page" style={{ width: '100%', margin: '0 auto', background: C.pageBg, color: C.primary, position: 'relative', overflow: 'hidden', fontFamily: FONT_INTER, boxSizing: 'border-box', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact', pageBreakAfter: pageIdx < totalPages - 1 ? 'always' : 'auto' }}>
    <TexturedBackground />
    
    <div style={{ position: 'absolute', inset: '20px', border: `2px solid ${C.gold}`, borderRadius: '15px', pointerEvents: 'none', zIndex: 1 }} />
    <div style={{ position: 'absolute', inset: '28px', border: `1px solid rgba(93, 64, 55, 0.2)`, borderRadius: '10px', pointerEvents: 'none', zIndex: 1 }} />

    {pageIdx === 0 ? (
      <div style={{ textAlign: 'center', paddingTop: '50px', marginBottom: '30px', position: 'relative', zIndex: 3 }}>
        <h1 style={{ color: C.primary, fontFamily: FONT_CINZEL, fontSize: '34px', textTransform: 'uppercase', letterSpacing: '0.25em', margin: '0' }}>
          {name || 'Biodata'}
        </h1>
        <div style={{ height: '1px', width: '100px', background: C.gold, margin: '15px auto' }} />
      </div>
    ) : (
      <div style={{ textAlign: 'center', paddingTop: '40px', position: 'relative', zIndex: 3 }}>
        <div style={{ fontSize: '10px', color: C.gold, fontFamily: FONT_CINZEL, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          ✦ {name || 'Biodata'} · Continued ✦
        </div>
      </div>
    )}

    <div style={{ position: 'relative', zIndex: 3, padding: '20px 50px', paddingBottom: quote ? '100px' : '60px' }}>
      {children}
    </div>

    <PageFooter current={pageIdx + 1} total={totalPages} quote={quote} />
  </div>
);

const QRPlaceholder = ({ url }) => {
  const size = 80;
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'5px' }}>
      <div style={{ padding:'4px', background:'#fff', border:`2px solid ${C.gold}`, borderRadius:'10px' }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
          <rect width={size} height={size} fill="#fff" rx="6" />
          {Array.from({length: 81}).map((_, i) => (
            Math.random() > 0.4 ? <rect key={i} x={5 + (i%9)*7.7} y={5 + Math.floor(i/9)*7.7} width="7" height="7" fill={C.primary} rx="1"/> : null
          ))}
        </svg>
      </div>
      <span style={{ fontSize:'9px', color:C.gold, textTransform:'uppercase', letterSpacing:'0.15em', fontFamily: FONT_CINZEL, fontWeight: '700', textAlign:'center' }}>
        Scan Profile
      </span>
    </div>
  );
};

const TemplateRoyalTexture = React.forwardRef(({ biodata }, ref) => {
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
            <div style={{ padding: '8px', background: '#fff', border: `1px solid rgba(93, 64, 55, 0.2)`, borderRadius: '15px', width: '100%', aspectRatio: '3/4', boxShadow: `0 10px 20px rgba(0,0,0,0.05)` }}>
              <img src={mainPhotoURL} alt="Profile" crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px', display: 'block' }} />
            </div>
          ) : (
            <div style={{ padding: '8px', background: '#fff', border: `1px solid rgba(93, 64, 55, 0.2)`, borderRadius: '15px', width: '100%', aspectRatio: '3/4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.gold, fontSize: '48px', fontFamily: FONT_CINZEL, boxShadow: `0 10px 20px rgba(0,0,0,0.05)` }}>
              {fullName ? fullName.charAt(0) : '✦'}
            </div>
          )}
        </div>
      </div>

      {bio && (
        <div style={{ marginTop: '20px', background: 'rgba(255,255,255,0.6)', border: `1px solid rgba(212, 175, 55, 0.3)`, padding: '20px', borderRadius: '12px' }}>
          <SectionHeader title="About Me" />
          <p style={{ margin: 0, fontSize: '13.5px', color: C.primary, lineHeight: '1.8', fontFamily: FONT_CORMNT, fontStyle: 'italic', textAlign: 'center' }}>
            {bio}
          </p>
        </div>
      )}
    </>
  );

  const Page2Content = () => (
    <>
      <div style={{ background: 'rgba(255,255,255,0.6)', border: `1px solid rgba(212, 175, 55, 0.3)`, padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
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

      <div style={{ background: 'rgba(255,255,255,0.6)', border: `1px solid rgba(212, 175, 55, 0.3)`, padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
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

      <div style={{ background: 'rgba(255,255,255,0.6)', border: `1px solid rgba(212, 175, 55, 0.3)`, padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
        <SectionHeader title="Preferences & Contact" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <SubLabel text="Partner Expectations" />
            {partnerExpectations && <p style={{ fontSize: '13px', color: C.primary, lineHeight: '1.6', fontFamily: FONT_CORMNT, margin: '0 0 10px 0', fontStyle: 'italic', fontWeight: '600' }}>{partnerExpectations}</p>}
            <InfoRow label="Preferred Location" value={preferredLocation} />
            <SubLabel text="Hobbies & Interests" />
            {hobbies && <p style={{ fontSize: '13px', color: C.primary, lineHeight: '1.6', fontFamily: FONT_CORMNT, margin: 0, fontStyle: 'italic', fontWeight: '600' }}>{Array.isArray(hobbies) ? hobbies.join(', ') : hobbies}</p>}
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
      <div style={{ background: 'rgba(255,255,255,0.6)', border: `1px solid rgba(212, 175, 55, 0.3)`, padding: '20px', borderRadius: '12px', minHeight: '350px', marginBottom: '20px' }}>
        <SectionHeader title="Photo Gallery" />
        {extraPhotos.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: extraPhotos.length >= 3 ? 'repeat(3, 1fr)' : `repeat(${extraPhotos.length}, 1fr)`, gap: '15px' }}>
            {extraPhotos.slice(0, 3).map((photo, i) => (
              <div key={i} style={{ borderRadius: '10px', overflow: 'hidden', border: `2px solid ${C.gold}`, aspectRatio: '4/5' }}>
                <img src={photo} alt={`Gallery ${i+1}`} crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '250px', opacity: 0.6 }}>
            <Divider />
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>📸</div>
            <p style={{ fontFamily: FONT_CORMNT, fontStyle: 'italic', color: C.primary, fontSize: '16px' }}>
              A picture is worth a thousand words...
            </p>
            <Divider />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px', background: 'rgba(255,255,255,0.6)', border: `1px solid rgba(212, 175, 55, 0.3)`, borderRadius: '12px' }}>
        <QRPlaceholder url={typeof window !== 'undefined' ? window.location.href : ''} />
        <Divider />
        <p style={{ margin: 0, fontSize: '15px', color: C.gold, fontStyle: 'italic', letterSpacing: '0.05em', fontFamily: FONT_CINZEL, lineHeight: '1.8', textAlign: 'center', fontWeight: '700' }}>
          "Looking for an auspicious alliance built on mutual respect, love, and shared values."
        </p>
      </div>
    </>
  );

  return (
    <div ref={ref} className="print-container pdf-render-container" style={{ background: '#f0ece1', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
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

export default TemplateRoyalTexture;
