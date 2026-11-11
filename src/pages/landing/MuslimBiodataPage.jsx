import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, CheckCircle, ChevronDown, ChevronRight, Heart, FileText, Download } from 'lucide-react';
import { useSEO } from '../../hooks/useSEO';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';

const MUSLIM_FAQS = [
  {
    q: 'What is a Muslim Marriage Biodata (Nikah Biodata)?',
    a: 'A Muslim marriage biodata is a respectful matrimonial profile prepared for finding a compatible spouse in accordance with Islamic values. It includes details such as religious practice (Namaz, Quran recitation, Roza), Maslak/Sect (Sunni, Shia, Hanafi, etc.), education, halal profession, family background, and marital expectations.',
  },
  {
    q: 'Does Aguaa provide Islamic headers like Bismillah on biodatas?',
    a: 'Yes, Aguaa offers dedicated Islamic templates with graceful Arabic calligraphy headers including "Bismillahir Rahmanir Raheem" and dignified geometric borders suitable for Islamic matrimonial introductions.',
  },
  {
    q: 'Can I include religious practice details like Namaz and Hijab/Beard?',
    a: 'Absolutely. Aguaa allows you to clearly specify religious inclinations, daily prayers (5 times Namaz), fasting in Ramadan, Quranic knowledge, and modest attire preferences so prospective families have complete clarity.',
  },
  {
    q: 'Is it free to download the Muslim matrimonial biodata PDF?',
    a: 'Yes, you can design and download high-resolution A4 print-ready PDFs completely free without any watermark. You can also share the profile directly via WhatsApp link.',
  },
];

const MuslimBiodataPage = () => {
  const { currentUser } = useAuth();
  useSEO('/muslim-marriage-biodata');
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
          <span className="text-[#f0c040] font-medium">Muslim Marriage Biodata</span>
        </nav>

        {/* Hero Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1f1500] border border-[#d4a017]/40 text-[#f0c040] text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Islamic Nikah Matrimonial Profiles
          </div>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-light text-white mb-4 leading-tight"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Muslim Marriage Biodata Maker — <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4a017] via-[#f0c040] to-[#b8860b]">Nikah Biodata Format</span>
          </h1>
          <p className="text-base sm:text-lg text-[#d4c0a0] max-w-3xl mx-auto leading-relaxed">
            Create an elegant, dignified Muslim marriage biodata online with Islamic headers, religious practice details, and family values. Download print-ready A4 PDF for free and share on WhatsApp.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={currentUser ? '/create' : '/signup'}>
              <Button variant="gold" size="xl" className="min-h-[48px] px-8 text-base shadow-[0_0_25px_rgba(212,160,23,0.35)]">
                <Sparkles className="w-5 h-5 mr-2" />
                Create Nikah Biodata Free
              </Button>
            </Link>
            <Link to="/gallery">
              <Button variant="outline" size="xl" className="min-h-[48px] px-8 text-base border-[#d4a017]/50 text-[#f0c040]">
                View Muslim Templates
              </Button>
            </Link>
          </div>
        </header>

        {/* Section 1: Significance of Islamic Matrimonial Biodata */}
        <section className="mb-12 bg-[#1a1100]/70 border border-[#d4a017]/25 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
          <h2 className="text-2xl sm:text-3xl font-light text-[#f0c040] mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            The Importance of a Dignified Muslim Marriage Biodata
          </h2>
          <p className="text-[#d8c8b0] leading-relaxed mb-4">
            In Islam, marriage (<em>Nikah</em>) is considered half of one's Deen. Finding a compatible life partner who shares the same Islamic morals, devotion, and life outlook is a blessed obligation. When families exchange a marriage biodata, it serves as the respectful first point of mutual introduction.
          </p>
          <p className="text-[#d8c8b0] leading-relaxed mb-4">
            Unlike western CVs, a <strong>Muslim matrimonial biodata</strong> emphasizes piety, halal livelihood, noble lineage, and moral integrity alongside secular educational qualifications and professional achievements. Aguaa provides refined, privacy-oriented templates specifically crafted for Muslim brides and grooms across India.
          </p>
        </section>

        {/* Section 2: Essential Sections in Nikah Biodata */}
        <section className="mb-12 bg-[#1a1100]/70 border border-[#d4a017]/25 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
          <h2 className="text-2xl sm:text-3xl font-light text-[#f0c040] mb-6" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Essential Sections for an Islamic Marriage Biodata
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="border border-[#d4a017]/20 rounded-xl p-5 bg-[#0f0a00]/60">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#d4a017]" />
                1. Religious & Deen Details (दीन एवं मज़हबी विवरण)
              </h3>
              <p className="text-sm text-[#c8b898] leading-relaxed">
                Maslak / Sect (Hanafi, Shafi'i, Ahle-Hadith, Shia, etc.), 5 times Namaz regularity, Quran recitation, Roza, Hajj/Umrah, and Islamic lifestyle habits.
              </p>
            </div>
            <div className="border border-[#d4a017]/20 rounded-xl p-5 bg-[#0f0a00]/60">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#d4a017]" />
                2. Personal Information (व्यक्तिगत विवरण)
              </h3>
              <p className="text-sm text-[#c8b898] leading-relaxed">
                Full name, date of birth, age, height, complexion, mother tongue (Urdu, Hindi, English, etc.), marital status, and physical health.
              </p>
            </div>
            <div className="border border-[#d4a017]/20 rounded-xl p-5 bg-[#0f0a00]/60">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#d4a017]" />
                3. Education & Halal Profession (तालीम व रोज़गार)
              </h3>
              <p className="text-sm text-[#c8b898] leading-relaxed">
                Secular education (Engineering, Medicine, Commerce, Law) alongside Islamic education if any, current profession, employer, and annual income.
              </p>
            </div>
            <div className="border border-[#d4a017]/20 rounded-xl p-5 bg-[#0f0a00]/60">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#d4a017]" />
                4. Family Background & Native Roots (खानदानी पृष्ठभूमि)
              </h3>
              <p className="text-sm text-[#c8b898] leading-relaxed">
                Father's name and occupation, mother's background, brothers and sisters (with marital status), ancestral home (Watan), and guardian's contact details.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: How to Build in 5 Minutes */}
        <section className="mb-12 bg-[#1a1100]/70 border border-[#d4a017]/25 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
          <h2 className="text-2xl sm:text-3xl font-light text-[#f0c040] mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            How to Make Your Muslim Marriage Biodata on Aguaa
          </h2>
          <ol className="space-y-4 text-[#d8c8b0] list-decimal list-inside leading-relaxed">
            <li><strong>Sign Up Free:</strong> Create an account with your email or mobile number in seconds.</li>
            <li><strong>Fill Biodata Form:</strong> Enter personal, educational, religious practice, and family background details.</li>
            <li><strong>Choose Islamic Template:</strong> Select an aesthetic template featuring Bismillah calligraphy and elegant emerald or gold borders.</li>
            <li><strong>Review & Privacy Setting:</strong> Set your profile to private (accessible only via personal link) or public as desired.</li>
            <li><strong>Download PDF & Share:</strong> Download a crystal-clear A4 PDF ready for family distribution or send directly on WhatsApp.</li>
          </ol>
        </section>

        {/* Section 4: FAQs */}
        <section className="mb-12 bg-[#1a1100]/70 border border-[#d4a017]/25 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
          <h2 className="text-2xl sm:text-3xl font-light text-[#f0c040] mb-6" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Frequently Asked Questions (Muslim Matrimonial Biodata)
          </h2>
          <div className="space-y-4">
            {MUSLIM_FAQS.map((faq, idx) => (
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
            Explore Related Marriage Biodata Formats & Guides
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <Link to="/biodata-format-for-marriage" className="p-3 rounded-lg bg-[#1a1100] border border-[#d4a017]/20 hover:border-[#f0c040] text-[#f0c040] flex items-center justify-between">
              <span>Biodata Format for Boy & Girl</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link to="/biodata-pdf-download" className="p-3 rounded-lg bg-[#1a1100] border border-[#d4a017]/20 hover:border-[#f0c040] text-[#f0c040] flex items-center justify-between">
              <span>Free Biodata PDF Download</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link to="/hindi-biodata-maker" className="p-3 rounded-lg bg-[#1a1100] border border-[#d4a017]/20 hover:border-[#f0c040] text-[#f0c040] flex items-center justify-between">
              <span>Hindi Biodata Maker</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link to="/bihar-up-shaadi-biodata" className="p-3 rounded-lg bg-[#1a1100] border border-[#d4a017]/20 hover:border-[#f0c040] text-[#f0c040] flex items-center justify-between">
              <span>Bihar & UP Shaadi Biodata</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link to="/gallery" className="p-3 rounded-lg bg-[#1a1100] border border-[#d4a017]/20 hover:border-[#f0c040] text-[#f0c040] flex items-center justify-between">
              <span>Premium Biodata Templates</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link to="/explore" className="p-3 rounded-lg bg-[#1a1100] border border-[#d4a017]/20 hover:border-[#f0c040] text-[#f0c040] flex items-center justify-between">
              <span>Explore Verified Profiles</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Final CTA */}
        <div className="text-center bg-gradient-to-r from-[#201000] via-[#352000] to-[#201000] border border-[#d4a017]/40 rounded-3xl p-8 sm:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
          <Heart className="w-10 h-10 text-[#f0c040] mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-light text-white mb-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Create Your Muslim Marriage Biodata Today
          </h2>
          <p className="text-[#d8c8b0] text-sm sm:text-base max-w-xl mx-auto mb-6">
            Join thousands of families who trust Aguaa for respectful, dignified matrimonial introductions. Free and watermark-free PDF.
          </p>
          <Link to={currentUser ? '/create' : '/signup'}>
            <Button variant="gold" size="xl" className="min-h-[48px] px-8 text-base">
              Get Started Free (Nikah Biodata)
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default MuslimBiodataPage;
