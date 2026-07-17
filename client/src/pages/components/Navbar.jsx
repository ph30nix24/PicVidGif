import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Folders, ChevronDown, Bell, User } from 'lucide-react';

const Navbar = () => {
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const rightRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Navbar entrance animation
    const tl = gsap.timeline();
    tl.fromTo(
      navRef.current,
      { y: -60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }
    );
    tl.fromTo(
      logoRef.current,
      { x: -30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' },
      '-=0.4'
    );
    tl.fromTo(
      rightRef.current,
      { x: 30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' },
      '-=0.4'
    );

    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoHover = () => {
    gsap.to(logoRef.current, {
      scale: 1.05,
      duration: 0.2,
      ease: 'power2.out',
    });
  };
  const handleLogoLeave = () => {
    gsap.to(logoRef.current, {
      scale: 1,
      duration: 0.2,
      ease: 'power2.out',
    });
  };

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300 ${
        scrolled
          ? 'bg-black/80 backdrop-blur-xl border-b border-purple-500/10'
          : 'bg-transparent'
      }`}
    >
      {/* Logo */}
      <div
        ref={logoRef}
        onMouseEnter={handleLogoHover}
        onMouseLeave={handleLogoLeave}
        className="cursor-pointer select-none"
        style={{ transformOrigin: 'left center' }}
      >
        <span className="text-xl font-bold tracking-tight">
          <span className="text-white font-black">PicVid</span>
          <span className="gradient-text font-black">Gif</span>

        </span>
      </div>

      {/* Right side nav */}
      <div ref={rightRef} className="flex items-center gap-4">
        <button className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-white/5 group">
          <Folders
            size={18}
            className="text-gray-400 group-hover:text-purple-400 transition-colors duration-200"
          />
          <span className="font-medium">Collections</span>
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-white/10" />

        {/* User avatar */}
        <button className="relative flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-violet-700 flex items-center justify-center text-white font-bold text-sm ring-2 ring-purple-500/30 group-hover:ring-purple-400/60 transition-all duration-200">
            U
          </div>
          <ChevronDown size={14} className="text-gray-400 group-hover:text-white transition-colors duration-200" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
