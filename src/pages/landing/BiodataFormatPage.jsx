import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, CheckCircle, ChevronDown, ChevronRight, Heart, FileText, User, UserCheck } from 'lucide-react';
import { useSEO } from '../../hooks/useSEO';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';

const FORMAT_FAQS = [
  {
    q: 'What is the ideal marriage biodata format for a boy?',
    a: 'For a boy, the biodata format highlights professional stability, educational pedigree, career growth, annual compensation, family lineage, and gotra. A professional photograph and clear details about native place, current city, and living arrangement are strongly recommended.',
  },
  {
    q: 'What is the ideal marriage biodata format for a girl?',
    a: 'For a girl, the biodata format elegantly balances education, career achievements, hobbies, culinary/artistic interests, and respectful family background. It typically includes height, birth details for horoscope matching, and contact details of father or elder brother.',
  },
  {
    q: 'How many pages should a marriage biodata be?',
    a: 'A marriage biodata should ideally be exactly 1 to 2 pages (A4 size). A single-page biodata is concise and easy to read on mobile screens or print, while a 2-page format allows room for comprehensive family trees and partner preferences.',
  },
  {
    q: 'Should horoscope (Kundali) details always be included in the biodata format?',
    a: 'In Hindu arranged marriages, especially in North India, including date, time, and city of birth along with Gotra, Rashi, and Manglik status speeds up initial family verification, as many families consult a pandit before proceeding.',
  },
];

const BiodataFormatPage = () => {
  const { currentUser } = useAuth();
  useSEO('/biodata-format-for-marriage');
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
          <span className="text-[#f0c040] font-medium">Biodata Format for Marriage</span>
        </nav>

        {/* Hero Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1f1500] border border-[#d4a017]/40 text-[#f0c040] text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Complete Sample Formats & Templates
          </div>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-light text-white mb-4 leading-tight"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Marriage Biodata Format for Boy &amp; Girl — <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4a017] via-[#f0c040] to-[#b8860b]">Free Sample Formats</span>
          </h1>
          <p className="text-base sm:text-lg text-[#d4c0a0] max-w-3xl mx-auto leading-relaxed">
            Looking for the perfect wedding biodata format? Explore well-structured sample templates for grooms and brides. Customize your details online and download a watermark-free A4 PDF in minutes.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={currentUser ? '/create' : '/signup'}>
              <Button variant="gold" size="xl" className="min-h-[48px] px-8 text-base shadow-[0_0_25px_rgba(212,160,23,0.35)]">
                <Sparkles className="w-5 h-5 mr-2" />
                Choose Format &amp; Create Free
              </Button>
            </Link>
            <Link to="/gallery">
              <Button variant="outline" size="xl" className="min-h-[48px] px-8 text-base border-[#d4a017]/50 text-[#f0c040]">
                Browse All Formats
              </Button>
            </Link>
          </div>
        </header>

        {/* Section 1: Comparison - Boy vs Girl Format */}
        <section className="mb-12 grid md:grid-cols-2 gap-8">
          {/* Format for Boy */}
          <div className="bg-[#1a1100]/70 border border-[#d4a017]/25 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#d4a017]/20 flex items-center justify-center text-[#f0c040]">
                <User className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-light text-white" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Biodata Format for Boy (वर हेतु प्रारूप)
              </h2>
            </div>
            <p className="text-sm text-[#d4c0a0] mb-4 leading-relaxed">
              In a groom's biodata, families look closely at career stability, educational foundation, income, and family responsibilities:
            </p>
            <ul className="space-y-2.5 text-sm text-[#c8b898]">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#d4a017] mt-0.5 flex-shrink-0" />
                <span><strong>Personal:</strong> Full Name, DOB, Time &amp; City of Birth, Height, Complexion.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#d4a017] mt-0.5 flex-shrink-0" />
                <span><strong>Education:</strong> Highest degree (B.Tech, MS, MBA, MBBS, CA), Institute name.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#d4a017] mt-0.5 flex-shrink-0" />
                <span><strong>Occupation:</strong> Job Title, Company/Government Dept, Job Location, Annual Package (CTC).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#d4a017] mt-0.5 flex-shrink-0" />
                <span><strong>Family:</strong> Father's profession, Mother, Brothers &amp; Sisters, Native Town.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#d4a017] mt-0.5 flex-shrink-0" />
                <span><strong>Horoscope:</strong> Gotra, Kula, Rashi, Nakshatra, Manglik Status.</span>
              </li>
            </ul>
          </div>

          {/* Format for Girl */}
          <div className="bg-[#1a1100]/70 border border-[#d4a017]/25 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#d4a017]/20 flex items-center justify-center text-[#f0c040]">
                <UserCheck className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-light text-white" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Biodata Format for Girl (वधू हेतु प्रारूप)
              </h2>
            </div>
            <p className="text-sm text-[#d4c0a0] mb-4 leading-relaxed">
              In a bride's biodata, the format highlights educational elegance, career aspirations, graceful demeanor, and noble family background:
            </p>
            <ul className="space-y-2.5 text-sm text-[#c8b898]">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#d4a017] mt-0.5 flex-shrink-0" />
                <span><strong>Personal:</strong> Full Name, DOB, Time &amp; Place of Birth, Height, Complexion.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#d4a017] mt-0.5 flex-shrink-0" />
                <span><strong>Education &amp; Talent:</strong> Degree, Honors, Hobbies, Creative or Artistic interests.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#d4a017] mt-0.5 flex-shrink-0" />
                <span><strong>Profession:</strong> Working professional (IT, Teaching, Banking) or Home Manager.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#d4a017] mt-0.5 flex-shrink-0" />
                <span><strong>Family Values:</strong> Father, Mother, Sibling accomplishments, Nanihal background.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#d4a017] mt-0.5 flex-shrink-0" />
                <span><strong>Astrology:</strong> Gotra (Self &amp; Maternal), Rashi, Manglik status for matching.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Section 2: Complete Text Sample Preview */}
        <section className="mb-12 bg-[#1a1100]/70 border border-[#d4a017]/25 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
          <h2 className="text-2xl sm:text-3xl font-light text-[#f0c040] mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Standard Marriage Biodata Layout (Sample Text)
          </h2>
          <p className="text-[#d8c8b0] mb-6 text-sm leading-relaxed">
            Below is a structured text blueprint used in Aguaa's royal and modern biodata templates:
          </p>

          <div className="bg-[#0f0a00] border border-[#d4a017]/30 rounded-xl p-6 text-xs sm:text-sm font-mono text-[#d4c0a0] leading-relaxed overflow-x-auto">
            <div className="text-center text-[#f0c040] font-bold text-base mb-4">|| श्री गणेशाय नमः ||</div>
            <div className="text-center text-white text-lg font-bold mb-4">MARRIAGE BIODATA</div>
            <div className="border-b border-[#d4a017]/20 pb-3 mb-3">
              <strong className="text-[#f0c040]">PERSONAL DETAILS:</strong><br />
              • Full Name: Rahul Kumar Sharma<br />
              • Date of Birth: 14 October 1996 (Age: 29 yrs)<br />
              • Time of Birth: 07:15 AM<br />
              • Place of Birth: Patna, Bihar<br />
              • Height: 5 ft 10 in | Complexion: Fair | Blood Group: B+
            </div>
            <div className="border-b border-[#d4a017]/20 pb-3 mb-3">
              <strong className="text-[#f0c040]">EDUCATION &amp; PROFESSION:</strong><br />
              • Education: B.Tech in Computer Science (NIT Patna)<br />
              • Current Position: Senior Software Engineer<br />
              • Company: MNC, Bengaluru (Remote / Hybrid)<br />
              • Annual Income: ₹24,00,000 P.A.
            </div>
            <div className="border-b border-[#d4a017]/20 pb-3 mb-3">
              <strong className="text-[#f0c040]">FAMILY DETAILS:</strong><br />
              • Father: Shri Satish Sharma (Govt. Officer, Retd.)<br />
              • Mother: Smt. Sunita Sharma (Homemaker)<br />
              • Siblings: 1 Younger Brother (Working in Bank)<br />
              • Native Place: Sasaram, Bihar | Current: Patna, Bihar<br />
              • Nanihal (Maternal): Ara, Bihar
            </div>
            <div>
              <strong className="text-[#f0c040]">RELIGIOUS &amp; ASTROLOGY:</strong><br />
              • Religion: Hindu | Caste: Brahmin | Gotra: Kashyap<br />
              • Rashi: Tula (Libra) | Nakshatra: Swati | Manglik: No (Non-Manglik)<br />
              • Contact Person: Shri Satish Sharma (Father) — +91 98XXXXXXXX
            </div>
          </div>
        </section>

        {/* Section 3: FAQs */}
        <section className="mb-12 bg-[#1a1100]/70 border border-[#d4a017]/25 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
          <h2 className="text-2xl sm:text-3xl font-light text-[#f0c040] mb-6" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Frequently Asked Questions (Marriage Biodata Formats)
          </h2>
          <div className="space-y-4">
            {FORMAT_FAQS.map((faq, idx) => (
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
            Related Wedding Biodata Resources
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <Link to="/hindi-biodata-maker" className="p-3 rounded-lg bg-[#1a1100] border border-[#d4a017]/20 hover:border-[#f0c040] text-[#f0c040] flex items-center justify-between">
              <span>Hindi Biodata Maker</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link to="/biodata-pdf-download" className="p-3 rounded-lg bg-[#1a1100] border border-[#d4a017]/20 hover:border-[#f0c040] text-[#f0c040] flex items-center justify-between">
              <span>Biodata PDF Download</span>
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
            <Link to="/pricing" className="p-3 rounded-lg bg-[#1a1100] border border-[#d4a017]/20 hover:border-[#f0c040] text-[#f0c040] flex items-center justify-between">
              <span>Free &amp; Premium Plans</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Final CTA */}
        <div className="text-center bg-gradient-to-r from-[#201000] via-[#352000] to-[#201000] border border-[#d4a017]/40 rounded-3xl p-8 sm:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
          <Heart className="w-10 h-10 text-[#f0c040] mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-light text-white mb-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Ready to Format Your Marriage Biodata?
          </h2>
          <p className="text-[#d8c8b0] text-sm sm:text-base max-w-xl mx-auto mb-6">
            Pick from royal gold, traditional vermilion, or contemporary minimalist layouts. 100% free and easy to edit.
          </p>
          <Link to={currentUser ? '/create' : '/signup'}>
            <Button variant="gold" size="xl" className="min-h-[48px] px-8 text-base">
              Create Biodata from Format
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default BiodataFormatPage;
