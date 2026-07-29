import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Folders, ChevronDown, Sun, Moon, LogIn } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSelector } from 'react-redux'

const Navbar = () => {
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const rightRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const isLogged = useSelector((state) => state.auth.user)

  useEffect(() => {
    // Navbar entrance animation
    const tl = gsap.timeline();
    tl.fromTo(navRef.current,
      { y: -60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }
    );
    tl.fromTo(logoRef.current,
      { x: -30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' },
      '-=0.4'
    );
    tl.fromTo(rightRef.current,
      { x: 30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' },
      '-=0.4'
    );

    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoHover = () => gsap.to(logoRef.current, { scale: 1.05, duration: 0.2, ease: 'power2.out' });
  const handleLogoLeave = () => gsap.to(logoRef.current, { scale: 1, duration: 0.2, ease: 'power2.out' });

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-30 py-4 transition-all duration-300 ${scrolled
        ? 'dark:bg-black/30 bg-white/85 backdrop-blur-xl border-b dark:border-white/5 border-slate-200 shadow-sm dark:shadow-none'
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
          <span className="dark:text-white text-gray-900 font-black">PicVid</span>
          <span className="gradient-text font-black">Gif</span>
        </span>
      </div>

      {/* Right side nav */}
      <div ref={rightRef} className="flex items-center gap-3">

        {/* Collections link */}
        <a href="/collection">
          <button className="flex items-center gap-2 text-sm dark:text-gray-300 text-slate-600 dark:hover:text-white hover:text-indigo-700 transition-colors duration-200 px-3 py-2 rounded-lg dark:hover:bg-white/5 hover:bg-indigo-50 group cursor-pointer">
            <Folders
              size={18}
              className="dark:text-gray-400 text-slate-400 dark:group-hover:text-gray-200 group-hover:text-indigo-500 transition-colors duration-200"
            />
            <span className="font-medium">Collections</span>
          </button>
        </a>

        {/* Light / Dark toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="w-9 h-9 flex items-center justify-center rounded-full dark:bg-white/5 bg-indigo-50 dark:hover:bg-white/10 hover:bg-indigo-100 border dark:border-white/10 border-indigo-200 transition-all duration-200 cursor-pointer"
        >
          {isDark
            ? <Sun size={16} className="text-gray-300" />
            : <Moon size={16} className="text-indigo-500" />
          }
        </button>

        {/* Divider */}
        <div className="w-px h-6 dark:bg-white/10 bg-slate-200" />

        {/* User avatar */}
        {isLogged ? (
          <button className="relative flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-full bg-linear-to-br from-indigo-500 to-indigo-700 dark:from-gray-500 dark:to-gray-700 flex items-center justify-center text-white font-bold text-sm ring-2 dark:ring-gray-600/30 ring-indigo-200 dark:group-hover:ring-gray-400/50 group-hover:ring-indigo-400 transition-all duration-200 uppercase">
              {isLogged.name[0]}
            </div>
            <ChevronDown
              size={14}
              className="dark:text-gray-400 text-slate-400 dark:group-hover:text-white group-hover:text-slate-700 transition-colors duration-200"
            />
          </button>
        ) : (
          <a href="/auth/login">
            <button className='relative flex items-center gap-2 group'>
              <div className='w-fit px-8 py-2 rounded-full bg-linear-to-br from-indigo-500 to-indigo-700 dark:from-gray-500 dark:to-gray-700 flex items-center justify-center text-white font-bold text-sm ring-2 dark:ring-gray-600/30 ring-indigo-200 dark:group-hover:ring-gray-400/50 group-hover:ring-indigo-400 transition-all duration-200 cursor-pointer'>
                <span>Login</span>
                <LogIn />
              </div>
            </button>
          </a>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
