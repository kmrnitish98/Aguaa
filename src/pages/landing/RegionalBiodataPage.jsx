import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, CheckCircle, ChevronDown, ChevronRight, Heart, MapPin, Shield, Users } from 'lucide-react';
import { useSEO } from '../../hooks/useSEO';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';

const REGIONAL_FAQS = [
  {
    q: 'What is the role of an "Aguaa" in Bihar and UP wedding culture?',
    a: 'In Bihar, Purvanchal (Eastern UP), and Jharkhand, an "Aguaa" (अगुआ) is the respected family mediator or matchmaker who introduces the bride and groom families. The Aguaa verifies family character, Gotra lineages, and social standing, facilitating a trustworthy union. Aguaa.in brings this venerable tradition into the digital age with modern security.',
  },
  {
    q: 'Why are Nanihal and ancestral village (पैतृक गांव) details crucial in Bihar & UP biodatas?',
    a: 'In North Indian matrimonial tradition, kinship exogamy requires verifying both the paternal Gotra and the maternal Gotra/Nanihal to ensure astrological and genealogical compatibility. Providing native village information allows families to conduct respectful background verification with mutual relatives.',
  },
  {
    q: 'Which districts and cities are primarily served by Aguaa?',
    a: 'Aguaa is widely used across Bihar (Patna, Gaya, Muzaffarpur, Bhagalpur, Darbhanga, Purnia, Sasaram, Ara, Siwan), Uttar Pradesh (Lucknow, Varanasi, Gorakhpur, Prayagraj, Kanpur, Ayodhya, Ballia, Deoria), Jharkhand (Ranchi, Jamshedpur, Dhanbad, Bokaro, Hazaribagh), and Delhi NCR.',
  },
  {
    q: 'Can I include Bhojpuri or Maithili family nuances in the biodata?',
    a: 'Yes, our platform supports Hindi, English, and regional terminology. You can specify traditional terms like "मूल", "डीह", "ननिहाल", "शाखा", and "कुल देवता" in your biodata.',
  },
];

const RegionalBiodataPage = () => {
  const { currentUser } = useAuth();
  useSEO('/bihar-up-shaadi-biodata');
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-[#0f0a00] text-[#f5ead0] pt-24 pb-16 font-['DM_Sans',sans-serif]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-[#a89060]">
          <Link to="/" className="hover:text-[#f0c040] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#f0c040] font-medium">Bihar &amp; UP Shaadi Biodata</span>
        </nav>

        {/* Hero Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1f1500] border border-[#d4a017]/40 text-[#f0c040] text-xs font-semibold uppercase tracking-wider mb-4">
            <MapPin className="w-3.5 h-3.5" />
            Bihar, Uttar Pradesh &amp; Jharkhand Matrimony
          </div>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-light text-white mb-4 leading-tight"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Bihar, UP &amp; Jharkhand Shaadi Biodata Maker — <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4a017] via-[#f0c040] to-[#b8860b]">Aguaa</span>
          </h1>
          <p className="text-base sm:text-lg text-[#d4c0a0] max-w-3xl mx-auto leading-relaxed">
            Preserving the sacred tradition of the family "Aguaa" (marriage mediator). Create authentic regional marriage biodatas featuring Gotra, Nanihal, and ancestral village roots. Download free A4 PDF.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={currentUser ? '/create' : '/signup'}>
              <Button variant="gold" size="xl" className="min-h-[48px] px-8 text-base shadow-[0_0_25px_rgba(212,160,23,0.35)]">
                <Sparkles className="w-5 h-5 mr-2" />
                Create Regional Biodata Free
              </Button>
            </Link>
            <Link to="/explore">
              <Button variant="outline" size="xl" className="min-h-[48px] px-8 text-base border-[#d4a017]/50 text-[#f0c040]">
                Explore Verified Profiles
              </Button>
            </Link>
          </div>
        </header>

        {/* Section 1: The Cultural Heritage of Aguaa */}
        <section className="mb-12 bg-[#1a1100]/70 border border-[#d4a017]/25 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
          <h2 className="text-2xl sm:text-3xl font-light text-[#f0c040] mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            The Tradition of "Aguaa" in Bhojpuri, Maithili &amp; Awadhi Culture
          </h2>
          <p className="text-[#d8c8b0] leading-relaxed mb-4">
            Across North India—from the banks of the Ganges in Patna and Varanasi to the fertile plains of Gorakhpur and the heartland of Ranchi—weddings have always relied on an <strong>Aguaa (अगुआ)</strong>. An Aguaa is more than a matchmaker; they are an ambassador of goodwill who ensures that both families share compatible cultural values, honesty, and mutual respect.
          </p>
          <p className="text-[#d8c8b0] leading-relaxed mb-4">
            <strong>Aguaa.in</strong> modernizes this cherished tradition for the digital era. We replace impersonal corporate matchmaking algorithms with transparent family profiles that honor traditional North Indian values: <em>Dil Se Rishta, Vishwas Se Shaadi</em>.
          </p>
        </section>

        {/* Section 2: Regional Cultural Nuances Covered */}
        <section className="mb-12 bg-[#1a1100]/70 border border-[#d4a017]/25 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
          <h2 className="text-2xl sm:text-3xl font-light text-[#f0c040] mb-6" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Special Regional Matrimonial Fields Supported on Aguaa
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="border border-[#d4a017]/20 rounded-xl p-5 bg-[#0f0a00]/60">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#d4a017]" />
                1. Nanihal Details (ननिहाल - मातृकुल)
              </h3>
              <p className="text-sm text-[#c8b898] leading-relaxed">
                Maternal grandfather's village and maternal uncle's family background, essential for Gotra exclusion and familial pedigree check in Bihar &amp; UP.
              </p>
            </div>
            <div className="border border-[#d4a017]/20 rounded-xl p-5 bg-[#0f0a00]/60">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#d4a017]" />
                2. Ancestral Village &amp; Native Roots (पैतृक गांव)
              </h3>
              <p className="text-sm text-[#c8b898] leading-relaxed">
                Even when settled in metropolitan cities (Delhi, Bengaluru, Mumbai), families proudly mention their native district and ancestral village.
              </p>
            </div>
            <div className="border border-[#d4a017]/20 rounded-xl p-5 bg-[#0f0a00]/60">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#d4a017]" />
                3. Kul &amp; Gotra Matching (कुल एवं गोत्र)
              </h3>
              <p className="text-sm text-[#c8b898] leading-relaxed">
                Accurate Gotra, Mool, and astrological coordinates (Kundali, Rashi, Nakshatra, Manglik status) formatted cleanly for consultation with family pandits.
              </p>
            </div>
            <div className="border border-[#d4a017]/20 rounded-xl p-5 bg-[#0f0a00]/60">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#d4a017]" />
                4. Family Hierarchy &amp; Respect (पारिवारिक मर्यादा)
              </h3>
              <p className="text-sm text-[#c8b898] leading-relaxed">
                Clear distinction of elder and younger siblings, their marital alliances, parental occupations, and reputable family references.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Cities & Districts Covered */}
        <section className="mb-12 bg-[#1a1100]/70 border border-[#d4a017]/25 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
          <h2 className="text-2xl sm:text-3xl font-light text-[#f0c040] mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Connecting Matrimonial Alliances Across North India
          </h2>
          <p className="text-[#d8c8b0] text-sm sm:text-base leading-relaxed mb-6">
            Aguaa facilitates thousands of verified matrimonial biodatas across key hubs:
          </p>
          <div className="grid sm:grid-cols-3 gap-4 text-sm text-[#c8b898]">
            <div className="p-4 rounded-xl bg-[#0f0a00]/70 border border-[#d4a017]/20">
              <strong className="text-white block mb-2 font-medium">Bihar Hubs:</strong>
              Patna, Gaya, Muzaffarpur, Bhagalpur, Darbhanga, Sasaram, Ara, Siwan, Samastipur, Purnia, Begusarai, Chhapra.
            </div>
            <div className="p-4 rounded-xl bg-[#0f0a00]/70 border border-[#d4a017]/20">
              <strong className="text-white block mb-2 font-medium">Uttar Pradesh Hubs:</strong>
              Lucknow, Varanasi, Gorakhpur, Prayagraj, Kanpur, Ayodhya, Ballia, Deoria, Azamgarh, Ghazipur, Bareilly, Meerut.
            </div>
            <div className="p-4 rounded-xl bg-[#0f0a00]/70 border border-[#d4a017]/20">
              <strong className="text-white block mb-2 font-medium">Jharkhand Hubs:</strong>
              Ranchi, Jamshedpur, Dhanbad, Bokaro Steel City, Hazaribagh, Deoghar, Giridih, Ramgarh, Daltonganj.
            </div>
          </div>
        </section>

        {/* Section 4: FAQs */}
        <section className="mb-12 bg-[#1a1100]/70 border border-[#d4a017]/25 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
          <h2 className="text-2xl sm:text-3xl font-light text-[#f0c040] mb-6" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Frequently Asked Questions (Bihar, UP &amp; Jharkhand Shaadi Biodata)
          </h2>
          <div className="space-y-4">
            {REGIONAL_FAQS.map((faq, idx) => (
              <div key={idx} className="border border-[#d4a017]/20 rounded-xl overflow-hidden bg-[#0f0a00]/70">
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between text-base font-medium text-white hover:text-[#f0c040] transition-colors min-h-[48px]"
                  aria-expanded={openFaq === idx}
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-[#d4a017] transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-4 text-sm text-[#d4c0a0] leading-relaxed border-t border-[#d4a017]/10 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Internal Linking & Related Formats */}
        <section className="mb-12 border-t border-[#d4a017]/20 pt-8">
          <h3 className="text-xl font-light text-white mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Explore More Matrimonial Biodata Categories
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <Link to="/hindi-biodata-maker" className="p-3 rounded-lg bg-[#1a1100] border border-[#d4a017]/20 hover:border-[#f0c040] text-[#f0c040] flex items-center justify-between">
              <span>Hindi Biodata Maker</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link to="/biodata-format-for-marriage" className="p-3 rounded-lg bg-[#1a1100] border border-[#d4a017]/20 hover:border-[#f0c040] text-[#f0c040] flex items-center justify-between">
              <span>Biodata Format for Boy &amp; Girl</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link to="/biodata-pdf-download" className="p-3 rounded-lg bg-[#1a1100] border border-[#d4a017]/20 hover:border-[#f0c040] text-[#f0c040] flex items-center justify-between">
              <span>Free Biodata PDF Download</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link to="/muslim-marriage-biodata" className="p-3 rounded-lg bg-[#1a1100] border border-[#d4a017]/20 hover:border-[#f0c040] text-[#f0c040] flex items-center justify-between">
              <span>Muslim Nikah Biodata</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link to="/about" className="p-3 rounded-lg bg-[#1a1100] border border-[#d4a017]/20 hover:border-[#f0c040] text-[#f0c040] flex items-center justify-between">
              <span>About The Aguaa Tradition</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link to="/explore" className="p-3 rounded-lg bg-[#1a1100] border border-[#d4a017]/20 hover:border-[#f0c040] text-[#f0c040] flex items-center justify-between">
              <span>Verified Matrimonial Profiles</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Final CTA */}
        <div className="text-center bg-gradient-to-r from-[#201000] via-[#352000] to-[#201000] border border-[#d4a017]/40 rounded-3xl p-8 sm:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
          <Heart className="w-10 h-10 text-[#f0c040] mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-light text-white mb-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Find the Right Rishta with Your Digital Aguaa
          </h2>
          <p className="text-[#d8c8b0] text-sm sm:text-base max-w-xl mx-auto mb-6">
            Create an honorable, culturally aligned shaadi biodata for your family today. Free, fast, and completely secure.
          </p>
          <Link to={currentUser ? '/create' : '/signup'}>
            <Button variant="gold" size="xl" className="min-h-[48px] px-8 text-base">
              Create Biodata Now
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default RegionalBiodataPage;
