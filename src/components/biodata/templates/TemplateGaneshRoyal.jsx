import React, { useRef } from 'react';
import { getQuoteForPage } from '../../../utils/quotes';

/* ══════════════════════════════════════════════════════════════
   TEMPLATE 2: DIVINE GANESH ROYAL
   Theme: Lord Ganesha inspired, Premium Hindu wedding aesthetics
   Palette: Deep maroon, ivory, and gold
   ══════════════════════════════════════════════════════════════ */

const FONT_CINZEL = "'Cinzel', 'Playfair Display', Georgia, serif";
const FONT_CORMNT = "'Cormorant Garamond', 'Playfair Display', Georgia, serif";
const FONT_INTER  = "Inter, -apple-system, BlinkMacSystemFont, sans-serif";

const C = {
  pageBg: '#fdfbf7', // Ivory
  cardBg: '#ffffff',
  primary: '#5c0a0a', // Deep Maroon
  gold: '#b8860b',
  goldLight: '#d4a017',
  textDark: '#2c1e16',
  textMuted: '#5c4d43',
  border: 'rgba(184, 134, 11, 0.25)',
};

const GaneshSymbol = () => (
  <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
    <path d="M50 15 C 65 15, 75 25, 75 40 C 75 55, 65 65, 50 65 C 35 65, 25 55, 25 40" stroke={C.gold} strokeWidth="2.5" fill="none" />
    <path d="M50 30 C 58 30, 62 35, 62 42" stroke={C.primary} strokeWidth="2" fill="none" />
    <path d="M50 45 C 55 45, 58 48, 58 53 C 58 65, 45 75, 40 85" stroke={C.gold} strokeWidth="3" strokeLinecap="round" fill="none" />
    <circle cx="42" cy="38" r="2.5" fill={C.primary} />
    <path d="M45 25 Q 50 20 55 25" stroke={C.primary} strokeWidth="2" fill="none" />
    <circle cx="50" cy="10" r="3" fill={C.goldLight} />
    <path d="M30 40 Q 20 50 30 60" stroke={C.gold} strokeWidth="1.5" fill="none" />
  </svg>
);

const CornerOrnament = ({ position }) => {
  const transforms = {
    TL: 'none',
    TR: 'scaleX(-1)',
    BL: 'scaleY(-1)',
    BR: 'scale(-1)'
  };
  return (
    <div style={{ position: 'absolute', top: position.includes('T') ? 10 : 'auto', bottom: position.includes('B') ? 10 : 'auto', left: position.includes('L') ? 10 : 'auto', right: position.includes('R') ? 10 : 'auto', transform: transforms[position], width: 60, height: 60, pointerEvents: 'none' }}>
      <svg viewBox="0 0 100 100" fill="none">
        <path d="M0 0 L 40 0 C 40 40, 0 40, 0 40 Z" fill={C.primary} opacity="0.05" />
        <path d="M0 0 L 100 0 C 100 10, 10 100, 0 100 Z" stroke={C.gold} strokeWidth="1" opacity="0.5" />
        <circle cx="15" cy="15" r="4" fill={C.gold} />
        <circle cx="30" cy="10" r="2" fill={C.primary} />
        <circle cx="10" cy="30" r="2" fill={C.primary} />
      </svg>
    </div>
  );
};

const SectionHeader = ({ title }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', position: 'relative' }}>
    <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, transparent, ${C.border})` }} />
    <h2 style={{ margin: '0 15px', color: C.primary, fontFamily: FONT_CINZEL, fontSize: '18px', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: '600' }}>
      {title}
    </h2>
    <div style={{ flex: 1, height: '1px', background: `linear-gradient(270deg, transparent, ${C.border})` }} />
  </div>
);

const InfoRow = ({ label, value }) => {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', marginBottom: '8px', alignItems: 'baseline' }}>
      <span style={{ width: '150px', flexShrink: 0, color: C.primary, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '600', fontFamily: FONT_INTER }}>
        {label}
      </span>
      <span style={{ color: C.textDark, fontSize: '13px', fontFamily: FONT_CORMNT, fontWeight: '500' }}>
        : &nbsp;&nbsp;{value}
      </span>
    </div>
  );
};

const SubLabel = ({ text }) => (
  <div style={{ fontSize: '11px', color: C.primary, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: '700', marginBottom: '10px', marginTop: '10px', fontFamily: FONT_INTER }}>
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
        <p style={{ margin:0, fontSize:'13px', color: C.primary, fontStyle:'italic', letterSpacing:'0.04em', fontFamily: FONT_CORMNT, lineHeight:'1.5' }}>
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
    <div style={{ position: 'absolute', inset: '15px', border: `2px solid ${C.primary}`, pointerEvents: 'none', zIndex: 1 }} />
    <div style={{ position: 'absolute', inset: '20px', border: `1px solid ${C.gold}`, pointerEvents: 'none', zIndex: 1 }} />
    
    <div style={{ zIndex: 2 }}>
      <CornerOrnament position="TL" />
      <CornerOrnament position="TR" />
      <CornerOrnament position="BL" />
      <CornerOrnament position="BR" />
    </div>

    {pageIdx === 0 ? (
      <div style={{ textAlign: 'center', paddingTop: '40px', marginBottom: '20px', position: 'relative', zIndex: 3 }}>
        <div style={{ display: 'inline-block', marginBottom: '10px' }}>
          <GaneshSymbol />
        </div>
        <h1 style={{ color: C.primary, fontFamily: FONT_CINZEL, fontSize: '32px', textTransform: 'uppercase', letterSpacing: '0.2em', margin: '0 0 5px', fontWeight: '700' }}>
          {name || 'Biodata'}
        </h1>
        <div style={{ fontSize: '12px', color: C.gold, fontFamily: FONT_CORMNT, fontStyle: 'italic', letterSpacing: '0.1em' }}>
          || Shree Ganeshay Namah ||
        </div>
      </div>
    ) : (
      <div style={{ textAlign: 'center', paddingTop: '30px', position: 'relative', zIndex: 3 }}>
        <div style={{ fontSize: '10px', color: C.gold, fontFamily: FONT_CINZEL, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          ✦ {name || 'Biodata'} · Continued ✦
        </div>
      </div>
    )}

    <div style={{ position: 'relative', zIndex: 3, padding: '20px 40px', paddingBottom: quote ? '100px' : '60px' }}>
      {children}
    </div>

    <PageFooter current={pageIdx + 1} total={totalPages} quote={quote} />
  </div>
);

const QRPlaceholder = ({ url }) => {
  const size = 80;
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'5px' }}>
      <div style={{ padding:'4px', background:'#fff', border:`1px solid ${C.gold}`, borderRadius:'6px' }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
          <rect width={size} height={size} fill="#fff"/>
          {Array.from({length: 81}).map((_, i) => (
            Math.random() > 0.4 ? <rect key={i} x={5 + (i%9)*7.7} y={5 + Math.floor(i/9)*7.7} width="7" height="7" fill={C.primary} rx="1"/> : null
          ))}
        </svg>
      </div>
      <span style={{ fontSize:'8px', color:C.textMuted, textTransform:'uppercase', letterSpacing:'0.1em', fontFamily: FONT_INTER, textAlign:'center' }}>
        Scan Profile
      </span>
    </div>
  );
};

const TemplateGaneshRoyal = React.forwardRef(({ biodata }, ref) => {
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
            <div style={{ padding: '8px', background: '#fff', border: `1px solid ${C.gold}`, borderRadius: '8px', boxShadow: `0 10px 25px rgba(92, 10, 10, 0.15)`, width: '100%', aspectRatio: '3/4' }}>
              <img src={mainPhotoURL} alt="Profile" crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px', display: 'block' }} />
            </div>
          ) : (
            <div style={{ padding: '8px', border: `1px solid ${C.gold}`, borderRadius: '8px', width: '100%', aspectRatio: '3/4', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.primary, color: C.gold, fontSize: '48px', fontFamily: FONT_CINZEL }}>
              {fullName ? fullName.charAt(0) : '✦'}
            </div>
          )}
        </div>
      </div>

      {bio && (
        <div style={{ marginTop: '25px', background: '#fff', border: `1px solid ${C.border}`, padding: '20px', borderRadius: '8px' }}>
          <SectionHeader title="About Me" />
          <p style={{ margin: 0, fontSize: '13px', color: C.textDark, lineHeight: '1.8', fontFamily: FONT_CORMNT, fontStyle: 'italic', textAlign: 'center' }}>
            {bio}
          </p>
        </div>
      )}
    </>
  );

  const Page2Content = () => (
    <>
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
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

      <div style={{ background: '#fff', border: `1px solid ${C.border}`, padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
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

      <div style={{ background: '#fff', border: `1px solid ${C.border}`, padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
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
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, padding: '20px', borderRadius: '8px', minHeight: '350px', marginBottom: '20px' }}>
        <SectionHeader title="Photo Gallery" />
        {extraPhotos.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: extraPhotos.length >= 3 ? 'repeat(3, 1fr)' : `repeat(${extraPhotos.length}, 1fr)`, gap: '15px' }}>
            {extraPhotos.slice(0, 3).map((photo, i) => (
              <div key={i} style={{ borderRadius: '8px', overflow: 'hidden', border: `1px solid ${C.gold}`, aspectRatio: '4/5' }}>
                <img src={photo} alt={`Gallery ${i+1}`} crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px', background: '#fff', border: `1px solid ${C.border}`, borderRadius: '8px' }}>
        <QRPlaceholder url={typeof window !== 'undefined' ? window.location.href : ''} />
        <Divider />
        <p style={{ margin: 0, fontSize: '15px', color: C.primary, fontStyle: 'italic', letterSpacing: '0.05em', fontFamily: FONT_CORMNT, lineHeight: '1.8', textAlign: 'center' }}>
          "Looking for an auspicious alliance built on mutual respect, love, and shared values."
        </p>
      </div>
    </>
  );

  return (
    <div ref={ref} className="print-container pdf-render-container" style={{ background: '#e0d8c8', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
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

export default TemplateGaneshRoyal;
