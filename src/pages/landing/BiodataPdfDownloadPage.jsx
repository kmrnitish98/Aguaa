import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Download, CheckCircle, ChevronDown, ChevronRight, Heart, FileText, Smartphone, Printer } from 'lucide-react';
import { useSEO } from '../../hooks/useSEO';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';

const PDF_FAQS = [
  {
    q: 'Is the marriage biodata PDF download completely free on Aguaa?',
    a: 'Yes! On Aguaa you can create your marriage biodata and download an A4 print-ready PDF completely free without watermarks. There are no surprise paywalls for your standard PDF copies.',
  },
  {
    q: 'Can I share the downloaded PDF directly on WhatsApp?',
    a: 'Absolutely. The downloaded PDF file is lightweight (under 250 KB) while retaining 300 DPI high-resolution typography and images, making it instant to send and open seamlessly on any mobile phone via WhatsApp.',
  },
  {
    q: 'Can I print the biodata on photo or bond paper?',
    a: 'Yes, Aguaa formats all PDF pages with standard international A4 dimensions (210mm × 297mm) and proper print bleed margins. You can print in color on photo paper, matte cardstock, or ivory bond paper with outstanding quality.',
  },
  {
    q: 'Will my biodata photo look sharp in the downloaded PDF?',
    a: 'Yes. Our rendering engine processes your uploaded photo with high fidelity and correct aspect ratio, preventing blurriness, stretching, or pixelation when printed or viewed on Retina screens.',
  },
];

const BiodataPdfDownloadPage = () => {
  const { currentUser } = useAuth();
  useSEO('/biodata-pdf-download');
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
          <span className="text-[#f0c040] font-medium">Biodata PDF Download</span>
        </nav>

        {/* Hero Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1f1500] border border-[#d4a017]/40 text-[#f0c040] text-xs font-semibold uppercase tracking-wider mb-4">
            <Download className="w-3.5 h-3.5" />
            Instant High-Resolution A4 PDF Generation
          </div>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-light text-white mb-4 leading-tight"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Free Marriage Biodata PDF Download — <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4a017] via-[#f0c040] to-[#b8860b]">Print-Ready Quality</span>
          </h1>
          <p className="text-base sm:text-lg text-[#d4c0a0] max-w-3xl mx-auto leading-relaxed">
            Download your matrimonial biodata in crystal-clear A4 PDF format without watermarks. Perfect for WhatsApp sharing, family review, and high-quality color printing.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={currentUser ? '/create' : '/signup'}>
              <Button variant="gold" size="xl" className="min-h-[48px] px-8 text-base shadow-[0_0_25px_rgba(212,160,23,0.35)]">
                <Download className="w-5 h-5 mr-2" />
                Create &amp; Download PDF (Free)
              </Button>
            </Link>
            <Link to="/gallery">
              <Button variant="outline" size="xl" className="min-h-[48px] px-8 text-base border-[#d4a017]/50 text-[#f0c040]">
                Preview PDF Templates
              </Button>
            </Link>
          </div>
        </header>

        {/* Section 1: Why PDF Format is Superior */}
        <section className="mb-12 bg-[#1a1100]/70 border border-[#d4a017]/25 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
          <h2 className="text-2xl sm:text-3xl font-light text-[#f0c040] mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Why PDF is the Gold Standard for Shaadi Biodata
          </h2>
          <p className="text-[#d8c8b0] leading-relaxed mb-4">
            When introducing your son or daughter to prospective in-laws, formatting matters. Sending unformatted text messages or generic Word documents can result in misaligned paragraphs, distorted images, or missing fonts when opened on different devices.
          </p>
          <p className="text-[#d8c8b0] leading-relaxed mb-4">
            An <strong>A4 PDF marriage biodata</strong> locks your typography, gold borders, photo placement, and cultural symbols in place. Whether viewed on an iPhone, Android smartphone, tablet, or printed on ivory paper, your biodata looks impeccable, dignified, and professional every single time.
          </p>
        </section>

        {/* Section 2: Key Features of Aguaa PDF Downloads */}
        <section className="mb-12 grid sm:grid-cols-3 gap-6">
          <div className="bg-[#1a1100]/70 border border-[#d4a017]/25 rounded-2xl p-6 backdrop-blur-sm text-center">
            <Printer className="w-10 h-10 text-[#f0c040] mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Print-Ready A4 Precision</h3>
            <p className="text-xs sm:text-sm text-[#c8b898] leading-relaxed">
              Standard 210 × 297mm dimensions with exact margins. No accidental blank pages or cropped text during physical printing.
            </p>
          </div>
          <div className="bg-[#1a1100]/70 border border-[#d4a017]/25 rounded-2xl p-6 backdrop-blur-sm text-center">
            <Smartphone className="w-10 h-10 text-[#f0c040] mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">WhatsApp Optimized</h3>
            <p className="text-xs sm:text-sm text-[#c8b898] leading-relaxed">
              Compact file size (~200 KB) for instant downloads on 4G/5G mobile connections without consuming data.
            </p>
          </div>
          <div className="bg-[#1a1100]/70 border border-[#d4a017]/25 rounded-2xl p-6 backdrop-blur-sm text-center">
            <Sparkles className="w-10 h-10 text-[#f0c040] mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Zero Watermarks</h3>
            <p className="text-xs sm:text-sm text-[#c8b898] leading-relaxed">
              Clean, royal presentation with no obtrusive branding across your personal family information.
            </p>
          </div>
        </section>

        {/* Section 3: Step-by-Step PDF Generation Guide */}
        <section className="mb-12 bg-[#1a1100]/70 border border-[#d4a017]/25 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
          <h2 className="text-2xl sm:text-3xl font-light text-[#f0c040] mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            How to Download Your Marriage Biodata PDF in 3 Easy Steps
          </h2>
          <ol className="space-y-4 text-[#d8c8b0] list-decimal list-inside leading-relaxed">
            <li><strong>Fill Your Details:</strong> Enter your educational background, job position, family details, and astrology info into our quick builder form.</li>
            <li><strong>Select an Elegant Layout:</strong> Choose from traditional Hindu royal templates (Ganesh, Om), Islamic Nikah themes, or sleek modern minimalist styles.</li>
            <li><strong>Click "Download PDF":</strong> Your browser generates an instant, high-definition PDF ready to save, email, or share via WhatsApp.</li>
          </ol>
        </section>

        {/* Section 4: FAQs */}
        <section className="mb-12 bg-[#1a1100]/70 border border-[#d4a017]/25 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
          <h2 className="text-2xl sm:text-3xl font-light text-[#f0c040] mb-6" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Frequently Asked Questions (Biodata PDF Download)
          </h2>
          <div className="space-y-4">
            {PDF_FAQS.map((faq, idx) => (
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
            <Link to="/muslim-marriage-biodata" className="p-3 rounded-lg bg-[#1a1100] border border-[#d4a017]/20 hover:border-[#f0c040] text-[#f0c040] flex items-center justify-between">
              <span>Muslim Nikah Biodata</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link to="/bihar-up-shaadi-biodata" className="p-3 rounded-lg bg-[#1a1100] border border-[#d4a017]/20 hover:border-[#f0c040] text-[#f0c040] flex items-center justify-between">
              <span>Bihar &amp; UP Shaadi Biodata</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link to="/gallery" className="p-3 rounded-lg bg-[#1a1100] border border-[#d4a017]/20 hover:border-[#f0c040] text-[#f0c040] flex items-center justify-between">
              <span>Royal Template Gallery</span>
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
            Download Your Marriage Biodata PDF Free
          </h2>
          <p className="text-[#d8c8b0] text-sm sm:text-base max-w-xl mx-auto mb-6">
            Get your high-definition A4 matrimonial PDF in under 5 minutes. No subscriptions or hidden fees.
          </p>
          <Link to={currentUser ? '/create' : '/signup'}>
            <Button variant="gold" size="xl" className="min-h-[48px] px-8 text-base">
              Start Free PDF Creation
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default BiodataPdfDownloadPage;
