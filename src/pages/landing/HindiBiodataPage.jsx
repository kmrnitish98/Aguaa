import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, FileText, Download, CheckCircle, Shield, ChevronDown, ChevronRight, Heart, ArrowRight } from 'lucide-react';
import { useSEO } from '../../hooks/useSEO';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';

const HINDI_FAQS = [
  {
    q: 'हिंदी में शादी का बायोडाटा कैसे बनाएं? (How to create biodata in Hindi?)',
    a: 'Aguaa पर हिंदी में बायोडाटा बनाना बहुत आसान है। बस "बायोडाटा बनाएं" पर क्लिक करें, अपनी व्यक्तिगत, शैक्षणिक, पारिवारिक और कुंडली की जानकारी हिंदी या हिंग्लिश में भरें, अपना फोटो अपलोड करें, और अपनी पसंद का रॉयल टेम्प्लेट चुनकर तुरंत PDF डाउनलोड करें।',
  },
  {
    q: 'क्या हिंदी बायोडाटा में गोत्र, ननिहाल और मांगलिक विवरण शामिल होता है?',
    a: 'हाँ, Aguaa के सभी पारंपरिक हिंदी टेम्प्लेट्स में कुल, गोत्र, ननिहाल (मामा का गांव/परिवार), राशि, नक्षत्र, गण और मांगलिक स्थिति जैसे महत्वपूर्ण सांस्कृतिक विवरण विशेष रूप से दिए गए हैं।',
  },
  {
    q: 'क्या हिंदी बायोडाटा PDF फ्री में डाउनलोड हो सकता है?',
    a: 'जी हाँ, Aguaa पर हिंदी शादी बायोडाटा हाई-क्वालिटी A4 PDF फॉर्मेट में बिल्कुल मुफ्त डाउनलोड किया जा सकता है। इसे आप सीधे WhatsApp पर शेयर कर सकते हैं या प्रिंट निकाल सकते हैं।',
  },
  {
    q: 'क्या मैं अंग्रेजी और हिंदी दोनों भाषाओं को मिलाकर बायोडाटा बना सकता हूँ?',
    a: 'हाँ, हमारा सिस्टम द्विभाषी (Bilingual / Hinglish) सपोर्ट करता है। आप नाम और शिक्षा अंग्रेजी में और पारिवारिक या धार्मिक विवरण हिंदी में आसानी से लिख सकते हैं।',
  },
];

const HindiBiodataPage = () => {
  const { currentUser } = useAuth();
  useSEO('/hindi-biodata-maker');
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
          <span className="text-[#f0c040] font-medium">Hindi Biodata Maker</span>
        </nav>

        {/* Hero Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1f1500] border border-[#d4a017]/40 text-[#f0c040] text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            100% Free Hindi Marriage Biodata Creator
          </div>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-light text-white mb-4 leading-tight"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Hindi Biodata Maker — <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4a017] via-[#f0c040] to-[#b8860b]">शादी के लिए बायोडाटा</span> बनाएं
          </h1>
          <p className="text-base sm:text-lg text-[#d4c0a0] max-w-3xl mx-auto leading-relaxed">
            बिहार, उत्तर प्रदेश और झारखंड के परिवारों के लिए विशेष रूप से डिज़ाइन किया गया हिंदी विवाह बायोडाटा मेकर। 5 मिनट में पारंपरिक देवनागरी फॉर्मेट में सुंदर बायोडाटा बनाएं और तुरंत PDF डाउनलोड करें।
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={currentUser ? '/create' : '/signup'}>
              <Button variant="gold" size="xl" className="min-h-[48px] px-8 text-base shadow-[0_0_25px_rgba(212,160,23,0.35)]">
                <Sparkles className="w-5 h-5 mr-2" />
                हिंदी में बायोडाटा बनाएं (Free)
              </Button>
            </Link>
            <Link to="/gallery">
              <Button variant="outline" size="xl" className="min-h-[48px] px-8 text-base border-[#d4a017]/50 text-[#f0c040]">
                टेम्प्लेट डिज़ाइन देखें
              </Button>
            </Link>
          </div>
        </header>

        {/* Section 1: Overview & Importance of Hindi Biodata */}
        <section className="mb-12 bg-[#1a1100]/70 border border-[#d4a017]/25 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
          <h2 className="text-2xl sm:text-3xl font-light text-[#f0c040] mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            हिंदी में शादी का बायोडाटा क्यों ज़रूरी है? (Significance of Hindi Marriage Biodata)
          </h2>
          <p className="text-[#d8c8b0] leading-relaxed mb-4">
            भारतीय समाज में शादी सिर्फ दो इंसानों का नहीं, बल्कि दो परिवारों और संस्कृतियों का मिलन है। विशेष रूप से बिहार, पूर्वांचल (उत्तर प्रदेश) और झारखंड में रिश्ते की बात शुरू करते समय परिवार के बड़े-बुजुर्ग (दादा-दादी, नाना-नानी और माता-पिता) अपनी मातृभाषा <strong>हिंदी</strong> में बायोडाटा पढ़ना पसंद करते हैं।
          </p>
          <p className="text-[#d8c8b0] leading-relaxed mb-4">
            हिंदी बायोडाटा में <strong>कुल, गोत्र, ननिहाल पक्ष, मांगलिक विचार</strong> और पारिवारिक मर्यादाओं को जिस सम्मान के साथ व्यक्त किया जा सकता है, वह अंग्रेजी में संभव नहीं हो पाता। Aguaa आपको पारंपरिक गणेश वंदना, ॐ एवं शुभ विवाह चिन्हों से सुसज्जित सुंदर हिंदी विवाह बायोडाटा मिनटों में तैयार करने की सुविधा देता है।
          </p>
        </section>

        {/* Section 2: Key Fields in Hindi Biodata */}
        <section className="mb-12 bg-[#1a1100]/70 border border-[#d4a017]/25 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
          <h2 className="text-2xl sm:text-3xl font-light text-[#f0c040] mb-6" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            हिंदी विवाह बायोडाटा के मुख्य भाग (Essential Sections in Hindi Biodata)
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="border border-[#d4a017]/20 rounded-xl p-5 bg-[#0f0a00]/60">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#d4a017]" />
                १. व्यक्तिगत विवरण (Personal Details)
              </h3>
              <p className="text-sm text-[#c8b898] leading-relaxed">
                पूरा नाम, जन्म तिथि (DOB), जन्म समय एवं स्थान, कद (ऊंचाई), वर्ण/रंग, मातृभाषा, खान-पान (शाकाहारी/मांसाहारी)।
              </p>
            </div>
            <div className="border border-[#d4a017]/20 rounded-xl p-5 bg-[#0f0a00]/60">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#d4a017]" />
                २. शैक्षणिक एवं व्यवसायिक योग्यता
              </h3>
              <p className="text-sm text-[#c8b898] leading-relaxed">
                उच्चतम डिग्री (B.Tech, MBA, UPSC आदि), कॉलेज/विश्वविद्यालय, वर्तमान पद, कंपनी/विभाग का नाम और वार्षिक आय।
              </p>
            </div>
            <div className="border border-[#d4a017]/20 rounded-xl p-5 bg-[#0f0a00]/60">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#d4a017]" />
                ३. पारिवारिक पृष्ठभूमि एवं ननिहाल
              </h3>
              <p className="text-sm text-[#c8b898] leading-relaxed">
                पिता का नाम व पेशा, माता का विवरण, भाई एवं बहनों का विवरण (विवाहित/अविवाहित), पैतृक निवास, और ननिहाल का पता।
              </p>
            </div>
            <div className="border border-[#d4a017]/20 rounded-xl p-5 bg-[#0f0a00]/60">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#d4a017]" />
                ४. धार्मिक एवं कुंडली विवरण
              </h3>
              <p className="text-sm text-[#c8b898] leading-relaxed">
                धर्म, जाति, उपजाति, गोत्र, राशि, नक्षत्र, गण, मांगलिक दोष (हाँ / नहीं / आंशिक), और संपर्क सूत्र (फ़ोन व पता)।
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Steps to Create in 5 Minutes */}
        <section className="mb-12 bg-[#1a1100]/70 border border-[#d4a017]/25 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
          <h2 className="text-2xl sm:text-3xl font-light text-[#f0c040] mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            हिंदी बायोडाटा 5 मिनट में कैसे बनाएं? (Step-by-Step Guide)
          </h2>
          <ol className="space-y-4 text-[#d8c8b0] list-decimal list-inside leading-relaxed">
            <li><strong>फॉर्म भरें:</strong> अपना नाम, जन्म विवरण, शिक्षा और परिवार की जानकारी हिंदी में टाइप करें।</li>
            <li><strong>फोटो जोड़ें:</strong> एक सुंदर और स्पष्ट पासपोर्ट या पोर्ट्रेट फोटो अपलोड करें।</li>
            <li><strong>टेम्प्लेट चुनें:</strong> Aguaa के गणेश रॉयल, ॐ क्लासिक या मॉडर्न हिंदी थीम में से पसंदीदा डिज़ाइन चुनें।</li>
            <li><strong>पूर्वावलोकन और सुधार:</strong> बायोडाटा का लाइव प्रिव्यू देखें और आवश्यकतानुसार सुधार करें।</li>
            <li><strong>PDF डाउनलोड करें:</strong> एक क्लिक में बिना किसी वाटरमार्क के A4 साइज प्रिंट-रेडी PDF डाउनलोड करें या सीधे WhatsApp पर शेयर करें।</li>
          </ol>
        </section>

        {/* Section 4: FAQs */}
        <section className="mb-12 bg-[#1a1100]/70 border border-[#d4a017]/25 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
          <h2 className="text-2xl sm:text-3xl font-light text-[#f0c040] mb-6" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            हिंदी बायोडाटा से जुड़े सामान्य प्रश्न (Frequently Asked Questions)
          </h2>
          <div className="space-y-4">
            {HINDI_FAQS.map((faq, idx) => (
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
            अन्य उपयोगी शादी बायोडाटा पृष्ठ एवं फॉर्मेट्स (Related Biodata Guides)
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <Link to="/biodata-format-for-marriage" className="p-3 rounded-lg bg-[#1a1100] border border-[#d4a017]/20 hover:border-[#f0c040] text-[#f0c040] flex items-center justify-between">
              <span>लड़के व लड़की के लिए बायोडाटा</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link to="/biodata-pdf-download" className="p-3 rounded-lg bg-[#1a1100] border border-[#d4a017]/20 hover:border-[#f0c040] text-[#f0c040] flex items-center justify-between">
              <span>शादी बायोडाटा PDF डाउनलोड</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link to="/bihar-up-shaadi-biodata" className="p-3 rounded-lg bg-[#1a1100] border border-[#d4a017]/20 hover:border-[#f0c040] text-[#f0c040] flex items-center justify-between">
              <span>बिहार व यूपी शादी बायोडाटा</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link to="/muslim-marriage-biodata" className="p-3 rounded-lg bg-[#1a1100] border border-[#d4a017]/20 hover:border-[#f0c040] text-[#f0c040] flex items-center justify-between">
              <span>मुस्लिम निकाह बायोडाटा फॉर्मेट</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link to="/gallery" className="p-3 rounded-lg bg-[#1a1100] border border-[#d4a017]/20 hover:border-[#f0c040] text-[#f0c040] flex items-center justify-between">
              <span>शाही बायोडाटा टेम्प्लेट गैलरी</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link to="/explore" className="p-3 rounded-lg bg-[#1a1100] border border-[#d4a017]/20 hover:border-[#f0c040] text-[#f0c040] flex items-center justify-between">
              <span>वेरिफाइड रिश्ते खोजें</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Final CTA */}
        <div className="text-center bg-gradient-to-r from-[#201000] via-[#352000] to-[#201000] border border-[#d4a017]/40 rounded-3xl p-8 sm:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
          <Heart className="w-10 h-10 text-[#f0c040] mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-light text-white mb-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            आज ही अपना सुंदर हिंदी शादी बायोडाटा बनाएं
          </h2>
          <p className="text-[#d8c8b0] text-sm sm:text-base max-w-xl mx-auto mb-6">
            हजारों संतुष्ट परिवारों का विश्वास। कोई छिपा हुआ शुल्क नहीं। 100% सुरक्षित और निःशुल्क।
          </p>
          <Link to={currentUser ? '/create' : '/signup'}>
            <Button variant="gold" size="xl" className="min-h-[48px] px-8 text-base">
              बायोडाटा बनाना शुरू करें (Get Started)
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default HindiBiodataPage;
