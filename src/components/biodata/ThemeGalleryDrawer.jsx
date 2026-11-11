import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, X, ChevronLeft, ChevronRight, Check, Loader2 } from 'lucide-react';
import { apiUpdateBiodata } from '../../api/client';
import Button from '../ui/Button';

const THEMES = [
  { id: 'RoyalMaharaja', name: 'Royal Maharaja', color: 'from-[#4A0404] to-[#1a0000]' },
  { id: 'ModernMinimal', name: 'Modern Minimal', color: 'from-gray-200 to-white' },
  { id: 'FloralWedding', name: 'Floral Wedding', color: 'from-[#FAF5EE] to-[#FFE6E6]' },
  { id: 'TraditionalIndian', name: 'Traditional Indian', color: 'from-[#ff7722] to-[#b30000]' },
  { id: 'PremiumDark', name: 'Premium Dark', color: 'from-gray-900 to-black' },
  { id: 'RoyalBlueDiamond', name: 'Royal Blue Diamond', color: 'from-[#001F3F] to-[#000a1a]' },
  { id: 'default', name: '(Legacy) Aguaa Classic', color: 'from-red-900 to-[#1a0000]' },
  { id: 'GaneshRoyal', name: '(Legacy) Divine Ganesh', color: 'from-[#3a0303] to-[#140000]' },
  { id: 'OmClassic', name: '(Legacy) Sacred Om', color: 'from-[#ff7722]/20 to-[#1a0000]' },
  { id: 'RoyalTexture', name: '(Legacy) Royal Texture', color: 'from-[#d4af37]/20 to-[#1a0000]' },
  { id: 'ModernPro', name: '(Legacy) Modern Pro', color: 'from-gray-800 to-[#1a0000]' },
];

const ThemeGalleryDrawer = ({ biodata, setBiodata, DynamicTemplate, isOpen, setIsOpen }) => {
  const [localTheme, setLocalTheme] = useState(biodata?.templateId || 'default');
  const [isSaving, setIsSaving] = useState(false);

  // Sync localTheme when drawer opens or biodata changes
  useEffect(() => {
    if (isOpen) {
      setLocalTheme(biodata?.templateId || 'default');
    }
  }, [isOpen, biodata?.templateId]);

  const handleApply = async () => {
    setIsSaving(true);
    try {
      await apiUpdateBiodata(biodata._id, { templateId: localTheme });
      setBiodata({ ...biodata, templateId: localTheme });
      setIsOpen(false);
    } catch (err) {
      console.error('Failed to update theme:', err);
      alert('Failed to save theme. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const currentIndex = THEMES.findIndex((t) => t.id === localTheme);

  const handlePrev = () => {
    const nextIndex = currentIndex === 0 ? THEMES.length - 1 : currentIndex - 1;
    setLocalTheme(THEMES[nextIndex].id);
  };

  const handleNext = () => {
    const nextIndex = currentIndex === THEMES.length - 1 ? 0 : currentIndex + 1;
    setLocalTheme(THEMES[nextIndex].id);
  };

  return (
    <>
      {/* Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end print:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-[#0a0000] border-l border-yellow-900/30 h-full shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-yellow-900/20">
                <div className="flex items-center gap-3">
                  <Palette className="w-5 h-5 text-yellow-500" />
                  <h2 className="text-xl font-semibold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Theme Gallery
                  </h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6">
                
                {/* Live Preview Container */}
                <div className="relative w-full aspect-[210/297] bg-[#1a1a1a] rounded-xl overflow-hidden border border-yellow-900/30 shadow-inner flex flex-col items-center">
                  <div className="absolute top-2 left-0 right-0 flex justify-between items-center px-4 z-10">
                    <button onClick={handlePrev} className="p-1.5 rounded-full bg-black/50 text-white hover:bg-black/80 backdrop-blur-md">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-xs font-medium tracking-widest uppercase text-yellow-500 bg-black/50 px-3 py-1 rounded-full backdrop-blur-md">
                      Live Preview
                    </span>
                    <button onClick={handleNext} className="p-1.5 rounded-full bg-black/50 text-white hover:bg-black/80 backdrop-blur-md">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Scaled PDF Template */}
                  <div className="origin-top mt-12" style={{ transform: 'scale(0.35)', width: '794px' }}>
                    <div className="pointer-events-none">
                      <DynamicTemplate biodata={{ ...biodata, templateId: localTheme }} />
                    </div>
                  </div>
                </div>

                {/* Horizontal Theme Selector */}
                <div className="space-y-3">
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">Available Themes</p>
                  <div className="flex overflow-x-auto gap-3 pb-2 snap-x scrollbar-hide">
                    {THEMES.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => setLocalTheme(theme.id)}
                        className={`snap-center shrink-0 w-28 h-20 rounded-xl relative border-2 transition-all duration-300 flex items-end p-2 bg-gradient-to-br ${theme.color} ${localTheme === theme.id ? 'border-yellow-500 shadow-[0_0_15px_rgba(212,160,23,0.3)]' : 'border-yellow-900/20 hover:border-yellow-700/50'}`}
                      >
                        {localTheme === theme.id && (
                          <div className="absolute top-1 right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-black" />
                          </div>
                        )}
                        <span className="text-[10px] font-semibold text-white leading-tight text-left" style={{ fontFamily: 'Playfair Display, serif' }}>
                          {theme.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Footer Actions */}
              <div className="p-5 border-t border-yellow-900/20 bg-gradient-to-t from-black to-transparent">
                <Button
                  onClick={handleApply}
                  disabled={isSaving || localTheme === biodata.templateId}
                  className="w-full relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative flex items-center justify-center gap-2">
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    {localTheme === biodata.templateId ? 'Current Theme' : 'Apply Theme'}
                  </span>
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ThemeGalleryDrawer;
