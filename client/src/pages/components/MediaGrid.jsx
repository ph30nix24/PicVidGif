import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MediaCard from './MediaCard';

gsap.registerPlugin(ScrollTrigger);

const MEDIA_ITEMS = [
  {
    id: 1,
    src: '/lake_dock.png',
    type: 'image',
    alt: 'Mountain lake with dock',
    height: 'h-72',
  },
  {
    id: 2,
    src: '/astronaut.png',
    type: 'image',
    alt: 'Astronaut in space nebula',
    height: 'h-64',
  },
  {
    id: 3,
    src: '/sports_car.png',
    type: 'image',
    alt: 'Sports car at sunset',
    height: 'h-56',
  },
  {
    id: 4,
    src: '/jellyfish.png',
    type: 'image',
    alt: 'Glowing jellyfish',
    height: 'h-64',
  },
  {
    id: 5,
    src: '/neon_city.png',
    type: 'image',
    alt: 'Neon city street',
    height: 'h-60',
  },
  {
    id: 6,
    src: '/galaxy_sky.png',
    type: 'image',
    alt: 'Galaxy and milky way',
    height: 'h-52',
  },
  {
    id: 7,
    src: '/cute_cat.png',
    type: 'image',
    alt: 'Cute orange cat',
    height: 'h-60',
  },
  {
    id: 8,
    src: '/underwater.png',
    type: 'image',
    alt: 'Underwater coral reef',
    height: 'h-56',
  },
  {
    id: 9,
    src: '/sunset.png',
    type: 'image',
    alt: 'Dramatic sunset clouds',
    height: 'h-52',
  },
  {
    id: 10,
    src: '/swirl.png',
    type: 'image',
    alt: 'Colorful abstract swirl',
    height: 'h-64',
  },
  {
    id: 11,
    src: '/dark_forest.png',
    type: 'image',
    alt: 'Dark misty forest',
    height: 'h-60',
  },
  {
    id: 12,
    src: '/lake_dock.png',
    type: 'image',
    alt: 'Mountain landscape',
    height: 'h-44',
  },
];

const MediaGrid = () => {
  const gridRef = useRef(null);

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
    <section className="relative px-4 md:px-6 pb-20 max-w-[1400px] mx-auto w-full" style={{ zIndex: 0 }}>
      <div ref={gridRef} className="masonry-grid">
        {MEDIA_ITEMS.map((item) => (
          <MediaCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};

export default MediaGrid;
