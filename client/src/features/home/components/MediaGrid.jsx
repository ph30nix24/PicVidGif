import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MediaCard from './MediaCard';
import { useSelector } from 'react-redux';

gsap.registerPlugin(ScrollTrigger);

const MediaGrid = () => {
  const gridRef = useRef(null);

  const activeTab = useSelector((state) => state.search.activeTab);

  const MEDIA_ITEMS = useSelector((state) => {
    switch (activeTab) {
      case 'videos':
        return state.search.videoResults;
      case 'gif':
        return state.search.gifResults ?? [];
      case 'images':
      default:
        return state.search.imageResults;
    }
  });

  /* Re-run scroll animations whenever the media list or active tab changes */
  useEffect(() => {
    if (!MEDIA_ITEMS.length || !gridRef.current) return;

    /* Kill any existing ScrollTrigger instances for this grid to avoid stacking */
    ScrollTrigger.getAll().forEach((t) => t.kill());

    const ctx = gsap.context(() => {
      const items = gridRef.current.querySelectorAll('.masonry-item');

      items.forEach((item, index) => {
        gsap.fromTo(
          item,
          { y: 60, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.65,
            ease: 'power3.out',
            delay: index * 0.05,
            scrollTrigger: {
              trigger: item,
              start: 'top 95%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, gridRef);

    return () => ctx.revert();
  }, [MEDIA_ITEMS, activeTab]);

  return (
    <section
      className="relative px-4 md:px-6 pb-20 max-w-[1400px] mx-auto w-full pt-10"
      style={{ zIndex: 0 }}
    >
      <div ref={gridRef} className={`masonry-grid ${activeTab === 'videos' ? 'masonry-grid--video' : ''}`}>
        {MEDIA_ITEMS.map((item) => (
          <MediaCard key={item.id} item={item} type={activeTab} />
        ))}
      </div>

      {MEDIA_ITEMS.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 gap-3 dark:text-gray-600 text-gray-400">
          <span className="text-5xl">🎬</span>
          <p className="text-sm font-medium">No results yet — search for something!</p>
        </div>
      )}
    </section>
  );
};

export default MediaGrid;
