import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image as ImageIcon, Trash2, Heart, ZoomIn,
  AlertTriangle, X, Filter,
} from 'lucide-react';

/* ── Reuse the same gallery data structure as GalleryPage.jsx ── */
const STORAGE_KEY = 'biodata_gallery_images';
const CATEGORIES = ['All', 'Ceremony', 'Portraits', 'Mehendi', 'Reception', 'My Uploads'];

const DEFAULT_IMAGES = [
  { id: 'd1', src: "https://images.unsplash.com/photo-1733759414886-6b3a5423ceb3?w=600&auto=format&fit=crop&q=80&fm=webp", tag: 'Ceremony', likes: 284, photographer: 'Ravi Studios', isDefault: true },
  { id: 'd2', src: "https://images.unsplash.com/photo-1600685912448-8bc35c141e18?w=600&auto=format&fit=crop&q=80&fm=webp", tag: 'Portraits', likes: 431, photographer: 'Akash Lens', isDefault: true },
  { id: 'd3', src: "https://images.unsplash.com/photo-1645856049928-d544f6b80ce2?w=600&auto=format&fit=crop&q=80&fm=webp", tag: 'Reception', likes: 197, photographer: 'Mehta Clicks', isDefault: true },
  { id: 'd4', src: "https://images.unsplash.com/photo-1754782915842-aa4fca6c203a?w=600&auto=format&fit=crop&q=80&fm=webp", tag: 'Mehendi', likes: 312, photographer: 'Golden Hour', isDefault: true },
  { id: 'd5', src: "https://images.unsplash.com/photo-1760080903792-874870c70902?w=600&auto=format&fit=crop&q=80&fm=webp", tag: 'Ceremony', likes: 528, photographer: 'Ravi Studios', isDefault: true },
  { id: 'd6', src: "https://images.unsplash.com/photo-1740418762511-b3927603599a?w=600&auto=format&fit=crop&q=80&fm=webp", tag: 'Portraits', likes: 164, photographer: 'Akash Lens', isDefault: true },
  { id: 'd7', src: "https://images.unsplash.com/photo-1754782915524-714d8534a5df?w=600&auto=format&fit=crop&q=80&fm=webp", tag: 'Reception', likes: 391, photographer: 'Mehta Clicks', isDefault: true },
  { id: 'd8', src: "https://images.unsplash.com/photo-1703044412297-166a93480d1f?w=600&auto=format&fit=crop&q=80&fm=webp", tag: 'Mehendi', likes: 247, photographer: 'Golden Hour', isDefault: true },
  { id: 'd9', src: "https://images.unsplash.com/photo-1703044412383-fa6b9884e802?w=600&auto=format&fit=crop&q=80&fm=webp", tag: 'Ceremony', likes: 183, photographer: 'Ravi Studios', isDefault: true },
  { id: 'd10', src: "https://images.unsplash.com/photo-1722952934708-749c22eb2e58?w=600&auto=format&fit=crop&q=80&fm=webp", tag: 'Portraits', likes: 462, photographer: 'Akash Lens', isDefault: true },
];

/* ═══════════════════════════════════════════════════════════════════
   GALLERY PAGE
═══════════════════════════════════════════════════════════════════ */
const AdminGalleryPage = () => {
  const [images, setImages] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const userImages = stored ? JSON.parse(stored) : [];
      return [...DEFAULT_IMAGES, ...userImages];
    } catch { return DEFAULT_IMAGES; }
  });

  const [activeCategory, setActiveCategory] = useState('All');
  const [lightbox, setLightbox]             = useState(null);
  const [confirmDel, setConfirmDel]         = useState(null);

  const filtered = activeCategory === 'All' ? images : images.filter((img) => img.tag === activeCategory);
  const lightboxIdx = lightbox !== null ? filtered.findIndex((img) => img.id === lightbox) : -1;

  const handleDelete = (id) => {
    setImages((prev) => {
      const updated = prev.filter((img) => img.id !== id);
      const userImages = updated.filter((img) => !img.isDefault);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userImages));
      return updated;
    });
    setConfirmDel(null);
    if (lightbox === id) setLightbox(null);
  };

  const userUploads = images.filter((img) => !img.isDefault).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 page-enter">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-1" style={{ color: 'rgba(212,160,23,0.6)' }}>
            Admin · Gallery
          </p>
          <h1 className="text-2xl sm:text-3xl font-light text-white" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Gallery <span className="text-gradient-gold">Management</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(168,144,96,0.6)' }}>
            {images.length} total images · {userUploads} user upload{userUploads !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-3">
          {CATEGORIES.slice(1).map((cat) => {
            const count = images.filter((img) => img.tag === cat).length;
            return (
              <div key={cat} className="text-center px-3 py-2 rounded-xl" style={{ background: 'rgba(212,160,23,0.06)', border: '1px solid rgba(212,160,23,0.12)' }}>
                <p className="text-sm font-bold text-white">{count}</p>
                <p className="text-[9px] uppercase tracking-widest" style={{ color: 'rgba(168,144,96,0.6)' }}>{cat}</p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hidden pb-2 mb-6">
        {CATEGORIES.map((cat) => {
          const count = cat === 'All' ? images.length : images.filter((img) => img.tag === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium border transition-all whitespace-nowrap flex-shrink-0"
              style={{
                borderColor: activeCategory === cat ? '#d4a017' : 'rgba(212,160,23,0.25)',
                background: activeCategory === cat ? 'linear-gradient(135deg, #d4a017, #f0c040)' : 'rgba(212,160,23,0.04)',
                color: activeCategory === cat ? '#1a0800' : '#a89060',
              }}
            >
              {cat}
              <span
                className="px-1.5 py-0.5 rounded-full text-[9px]"
                style={{
                  background: activeCategory === cat ? 'rgba(0,0,0,0.2)' : 'rgba(212,160,23,0.15)',
                  color: activeCategory === cat ? '#1a0800' : '#d4a017',
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Notice about user uploads */}
      {userUploads > 0 && (
        <div className="mb-5 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
          style={{ background: 'rgba(212,160,23,0.05)', border: '1px solid rgba(212,160,23,0.15)', color: '#a89060' }}>
          <Filter className="w-4 h-4 flex-shrink-0" style={{ color: '#d4a017' }} />
          {userUploads} user-uploaded image{userUploads !== 1 ? 's' : ''} found. Only user uploads can be deleted by admin.
        </div>
      )}

      {/* Grid */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-center">
            <ImageIcon className="w-12 h-12 mb-4 opacity-20" style={{ color: '#d4a017' }} />
            <p className="text-base text-white" style={{ fontFamily: 'Cormorant Garamond, serif' }}>No photos in this category</p>
          </motion.div>
        ) : (
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4"
          >
            {filtered.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="relative overflow-hidden rounded-2xl group break-inside-avoid mb-4 cursor-pointer"
                style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
              >
                <img
                  src={item.src}
                  alt={item.tag}
                  loading="lazy"
                  decoding="async"
                  onClick={() => setLightbox(item.id)}
                  className="w-full h-auto object-cover block transition-transform duration-700 group-hover:scale-[1.05]"
                />

                {/* Tag */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                    style={{ background: 'rgba(212,160,23,0.88)', color: '#1a0800' }}>
                    {item.tag}
                  </span>
                </div>

                {/* User upload badge */}
                {!item.isDefault && (
                  <div className="absolute top-3 left-3 mt-7 z-10">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase"
                      style={{ background: 'rgba(22,163,74,0.85)', color: 'white' }}>
                      User Upload
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 duration-300">
                  <button
                    onClick={(e) => { e.stopPropagation(); setLightbox(item.id); }}
                    className="w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all hover:scale-110"
                    style={{ background: 'rgba(30,15,0,0.8)', border: '1px solid rgba(212,160,23,0.5)' }}
                  >
                    <ZoomIn className="w-3.5 h-3.5" style={{ color: '#f0c040' }} />
                  </button>
                  {!item.isDefault && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setConfirmDel(item.id); }}
                      className="w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all hover:scale-110"
                      style={{ background: 'rgba(220,38,38,0.85)', border: '1px solid rgba(220,38,38,0.5)' }}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-white" />
                    </button>
                  )}
                </div>

                {/* Bottom overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300"
                  style={{ background: 'linear-gradient(to top, rgba(10,4,0,0.9) 0%, transparent 60%)' }} />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-white font-semibold" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                      📷 {item.photographer}
                    </p>
                    <div className="flex items-center gap-1 text-[10px]" style={{ color: '#f0c040' }}>
                      <Heart className="w-3 h-3 fill-current" />
                      <span>{item.likes}</span>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 rounded-2xl pointer-events-none border border-transparent group-hover:border-[#d4a017]/50 transition-colors duration-300" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && lightboxIdx !== -1 && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(12px)' }}
            onClick={(e) => e.target === e.currentTarget && setLightbox(null)}
          >
            <button onClick={() => setLightbox(null)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10"
              style={{ color: '#f5ead0' }}>
              <X className="w-6 h-6" />
            </button>
            <motion.img
              initial={{ scale: 0.85 }} animate={{ scale: 1 }} exit={{ scale: 0.85 }}
              src={filtered[lightboxIdx].src}
              alt={filtered[lightboxIdx].tag}
              className="max-w-4xl max-h-[85vh] rounded-2xl object-contain"
              style={{ border: '1px solid rgba(212,160,23,0.3)' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {confirmDel && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={(e) => e.target === e.currentTarget && setConfirmDel(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="glass-card rounded-2xl p-6 max-w-sm w-full text-center"
              style={{ border: '1px solid rgba(220,38,38,0.3)' }}
            >
              <AlertTriangle className="w-10 h-10 mx-auto mb-3 text-red-400" />
              <h3 className="text-lg font-semibold text-white mb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Remove Photo?</h3>
              <p className="text-sm mb-5" style={{ color: 'rgba(168,144,96,0.7)' }}>This removes the user-uploaded image from the gallery.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDel(null)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                  style={{ background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)', color: '#a89060' }}>
                  Cancel
                </button>
                <button onClick={() => handleDelete(confirmDel)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold"
                  style={{ background: 'linear-gradient(135deg, #dc2626, #ef4444)', color: 'white' }}>
                  Remove
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminGalleryPage;
