import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ChevronRight, Shield, Lock, Sparkles, Mail, Share2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0a0500] pt-16 pb-10 border-t border-[#d4a017]/20 relative overflow-hidden font-['DM_Sans',sans-serif]">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4a017]/50 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 group inline-flex">
              <Heart className="w-7 h-7 text-[#d4a017] fill-current group-hover:text-[#f0c040] transition-colors" />
              <span
                className="text-2xl font-bold text-white tracking-wider group-hover:text-[#f5ead0] transition-colors"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Aguaa
              </span>
            </Link>
            <p className="text-[#a89060] text-sm leading-relaxed mb-5 font-light">
              India's trusted marriage biodata maker. Serving families in Bihar, Uttar Pradesh, and Jharkhand with dignified, print-ready matrimonial biodatas.
            </p>
            <p className="text-xs text-[#d4af37] italic font-medium">
              "Dil Se Rishta, Vishwas Se Shaadi"
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-medium mb-4 uppercase tracking-wider text-xs">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-[#a89060] hover:text-[#f0c040] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#d4a017]" /> Home
                </Link>
              </li>
              <li>
                <Link to="/explore" className="text-[#a89060] hover:text-[#f0c040] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#d4a017]" /> Explore Verified Profiles
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-[#a89060] hover:text-[#f0c040] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#d4a017]" /> Biodata Templates Gallery
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-[#a89060] hover:text-[#f0c040] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#d4a017]" /> Free &amp; Premium Plans
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-[#a89060] hover:text-[#f0c040] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#d4a017]" /> About Aguaa Platform
                </Link>
              </li>
            </ul>
          </div>

          {/* Biodata Formats & Guides (Crucial for Internal Linking) */}
          <div>
            <h4 className="text-white font-medium mb-4 uppercase tracking-wider text-xs">
              Biodata Formats &amp; Guides
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/hindi-biodata-maker" className="text-[#a89060] hover:text-[#f0c040] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#d4a017]" /> Hindi Biodata Maker (हिंदी)
                </Link>
              </li>
              <li>
                <Link to="/biodata-format-for-marriage" className="text-[#a89060] hover:text-[#f0c040] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#d4a017]" /> Biodata Format for Boy &amp; Girl
                </Link>
              </li>
              <li>
                <Link to="/biodata-pdf-download" className="text-[#a89060] hover:text-[#f0c040] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#d4a017]" /> Biodata PDF Download (Free)
                </Link>
              </li>
              <li>
                <Link to="/muslim-marriage-biodata" className="text-[#a89060] hover:text-[#f0c040] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#d4a017]" /> Muslim Marriage Biodata (Nikah)
                </Link>
              </li>
              <li>
                <Link to="/bihar-up-shaadi-biodata" className="text-[#a89060] hover:text-[#f0c040] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#d4a017]" /> Bihar &amp; UP Shaadi Biodata
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h4 className="text-white font-medium mb-4 uppercase tracking-wider text-xs">
              Trust &amp; Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/privacy" className="text-[#a89060] hover:text-[#f0c040] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#d4a017]" /> Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-[#a89060] hover:text-[#f0c040] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#d4a017]" /> Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/refund" className="text-[#a89060] hover:text-[#f0c040] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#d4a017]" /> Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-[#a89060] hover:text-[#f0c040] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#d4a017]" /> Contact &amp; Support
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#d4a017]/20 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#a89060]">
          <p>© {new Date().getFullYear()} Aguaa (https://www.myaguaa.in). All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-[#d4a017]" /> Bank-Grade Privacy
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-[#d4a017]" /> 256-Bit SSL Encrypted
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
