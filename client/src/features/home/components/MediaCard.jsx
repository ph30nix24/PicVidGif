import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Download, Heart } from 'lucide-react';

const MediaCard = ({ item }) => {
  const cardRef    = useRef(null);
  const overlayRef = useRef(null);
  const playRef    = useRef(null);
  const actionsRef = useRef(null);
  const [liked, setLiked] = useState(false);

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, { y: -5, scale: 1.02, duration: 0.35, ease: 'power2.out' });
    gsap.to(overlayRef.current, { opacity: 1, duration: 0.25, ease: 'power2.out' });
    if (playRef.current) {
      gsap.fromTo(playRef.current,
        { scale: 0.6, opacity: 0 },
        { scale: 1,   opacity: 1, duration: 0.3, ease: 'back.out(2)' }
      );
    }
    if (actionsRef.current) {
      gsap.fromTo(actionsRef.current,
        { y: 15, opacity: 0 },
        { y: 0,  opacity: 1, duration: 0.3, ease: 'power2.out', delay: 0.05 }
      );
    }
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, { y: 0, scale: 1, duration: 0.35, ease: 'power2.out' });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2, ease: 'power2.in' });
    if (playRef.current) {
      gsap.to(playRef.current, { scale: 0.6, opacity: 0, duration: 0.2, ease: 'power2.in' });
    }
    if (actionsRef.current) {
      gsap.to(actionsRef.current, { y: 10, opacity: 0, duration: 0.2, ease: 'power2.in' });
    }
  };

  const handleLike = (e) => {
    e.stopPropagation();
    setLiked(!liked);
    gsap.fromTo(e.currentTarget,
      { scale: 1.4 },
      { scale: 1, duration: 0.4, ease: 'elastic.out(1.5, 0.4)' }
    );
  };

  return (
    <div
      className="masonry-item cursor-pointer relative"
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ willChange: 'transform', zIndex: 0 }}
    >
      <div className="relative rounded-xl overflow-hidden dark:bg-[#111111] bg-white shadow-md dark:shadow-black/40 shadow-gray-200 transition-shadow duration-300 hover:shadow-xl dark:hover:shadow-black/60 hover:shadow-gray-300/60">

        {/* Image */}
        <img
          src={item.urls?.raw || item.src}
          alt={item?.alt}
          className={`w-full object-cover ${item.height} block`}
          loading="lazy"
          draggable={false}
        />

        {/* Overlay gradient */}
        <div
          ref={overlayRef}
          className="absolute inset-0 opacity-0"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.05) 100%)' }}
        />

        {/* Duration badge for GIFs/videos */}
        {item.duration && item.badge && (
          <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-md border border-white/10">
            {item.duration}
          </div>
        )}

        {/* Action buttons */}
        <div ref={actionsRef} className="absolute bottom-3 left-3 flex items-center gap-2 opacity-0">
          <button
            onClick={handleLike}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-200 ${
              liked
                ? 'bg-red-500/80 border-red-400/50 text-white'
                : 'bg-black/50 border-white/20 text-white hover:bg-red-500/50'
            }`}
            aria-label="Like"
          >
            <Heart size={13} fill={liked ? 'white' : 'none'} />
          </button>
          <button
            className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-gray-600/60 hover:border-gray-400/50 transition-all duration-200"
            aria-label="Download"
          >
            <Download size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MediaCard;
