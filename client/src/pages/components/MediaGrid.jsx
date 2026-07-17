import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MediaCard from './MediaCard';
import { useSelector } from 'react-redux';

gsap.registerPlugin(ScrollTrigger);


const MediaGrid = () => {
  const gridRef = useRef(null);
  const MEDIA_ITEMS = useSelector((state) => state.search.results)
  useEffect(() => {
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
            delay: index * 0.06,
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
  }, []);

  return (
    <section className="relative px-4 md:px-6 pb-20 max-w-[1400px] mx-auto w-full pt-10" style={{ zIndex: 0 }}>
      <div ref={gridRef} className="masonry-grid">
        {MEDIA_ITEMS.map((item) => (
          <MediaCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};

export default MediaGrid;
