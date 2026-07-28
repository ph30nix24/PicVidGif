import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { BG_TILES } from '../utils/index';
import BgTile from "../Components/BgTile";
import { AppleIcon, GoogleIcon, Spinner } from "../../../icons/Icons";
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../../utils/firebase';
import { useTheme } from '../../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router'

import { loginApi } from "../apis/auth.apis";
import { setUser } from "../../../redux/features/authSlice";


const Login = () => {
  const cardRef = useRef(null);
  const logoRef = useRef(null);
  const titleRef = useRef(null);
  const subRef = useRef(null);
  const divRef = useRef(null);
  const btnsRef = useRef(null);
  const footerRef = useRef(null);

  const [googleHover, setGoogleHover] = useState(false);
  const [appleHover, setAppleHover] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);

  const { isDark, toggleTheme } = useTheme();
  const dispatch = useDispatch()

  const navigate = useNavigate()
  const location = useLocation();

  const from = location.state?.from || '/';


  /* entrance timeline */
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(cardRef.current,
      { y: 52, opacity: 0, scale: 0.93 },
      { y: 0, opacity: 1, scale: 1, duration: 0.85, ease: 'back.out(1.5)' }, 0.5)

      .fromTo(logoRef.current,
        { y: -16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48 }, '-=0.52')

      .fromTo(titleRef.current,
        { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.44 }, '-=0.3')

      .fromTo(subRef.current,
        { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, '-=0.26')

      .fromTo(divRef.current,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.48, ease: 'power2.out', transformOrigin: 'left' },
        '-=0.1')

      .fromTo(btnsRef.current.children,
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.42, stagger: 0.13 }, '-=0.14')

      .fromTo(footerRef.current,
        { opacity: 0 }, { opacity: 1, duration: 0.38 }, '-=0.05');
  }, []);

  /* button micro-interactions */
  const onEnter = el => gsap.to(el, { scale: 1.025, y: -2, duration: 0.2, ease: 'power2.out' });
  const onLeave = el => gsap.to(el, { scale: 1, y: 0, duration: 0.2, ease: 'power2.out' });
  const onPress = el => gsap.to(el, { scale: 0.97, duration: 0.1, ease: 'power2.in' });
  const onRelease = el => gsap.to(el, { scale: 1.025, duration: 0.2, ease: 'back.out(2)' });

  const handleGoogle = async () => {
    if (googleLoading || appleLoading) return;
    setGoogleLoading(true);
    gsap.to(cardRef.current, { scale: 0.97, duration: 0.12, yoyo: true, repeat: 1 });
    try {
      const data = await signInWithPopup(auth, googleProvider);
      const idToken = await data.user.getIdToken();
      const res = await loginApi({ token: idToken })
      dispatch(setUser(res.data))
      navigate(from, { replace: true });
    } catch (e) {
      console.log(e);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleApple = () => {
    if (googleLoading || appleLoading) return;
    setAppleLoading(true);
    gsap.to(cardRef.current, { scale: 0.97, duration: 0.12, yoyo: true, repeat: 1 });
    setTimeout(() => setAppleLoading(false), 1500);
  };


  

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 relative overflow-hidden transition-colors duration-300"
      style={{ background: isDark ? '#05050d' : '#dde1e9' }}
    >
      {/* ── Theme toggle (top-right) ── */}
      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="absolute top-5 right-5 z-20 w-9 h-9 flex items-center justify-center rounded-full dark:bg-white/5 bg-white/70 dark:hover:bg-white/10 hover:bg-white border dark:border-white/10 border-slate-300/60 backdrop-blur-sm transition-all duration-200 cursor-pointer shadow-sm"
      >
        {isDark
          ? <Sun size={16} className="text-gray-300" />
          : <Moon size={16} className="text-slate-600" />
        }
      </button>

      {/* ══ MOSAIC BACKGROUND ══ */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          gridTemplateColumns: '1.35fr 0.95fr 1.05fr 1fr 1.2fr',
          gridTemplateRows: '1.2fr 1fr 1.1fr 0.9fr',
          gap: '5px',
        }}
      >
        {BG_TILES.map((tile, i) => (
          <BgTile key={i} index={i} {...tile} />
        ))}
      </div>

      {/* ── Overlays ── */}
      {/* Base wash — very light in light mode so photos shine through */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: isDark ? 'rgba(5,5,13,0.72)' : 'rgba(220,225,235,0.12)',
        }}
      />
      {/* Radial vignette — soft edges only */}
      <div style={{
        position: 'absolute', inset: 0,
        background: isDark
          ? 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 35%, rgba(5,5,13,0.88) 100%)'
          : 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 45%, rgba(190,198,215,0.28) 100%)',
      }} />
      {/* Top fade */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '28%',
        background: isDark
          ? 'linear-gradient(to bottom, rgba(5,5,13,0.6) 0%, transparent 100%)'
          : 'linear-gradient(to bottom, rgba(190,198,215,0.15) 0%, transparent 100%)',
      }} />
      {/* Bottom fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '28%',
        background: isDark
          ? 'linear-gradient(to top, rgba(5,5,13,0.7) 0%, transparent 100%)'
          : 'linear-gradient(to top, rgba(190,198,215,0.15) 0%, transparent 100%)',
      }} />

      {/* ── Card ── */}
      <div
        ref={cardRef}
        className="relative w-full max-w-md rounded-3xl p-8 flex flex-col items-center"
        style={isDark ? {
          background: 'rgba(8,8,8,0.72)',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.04) inset',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
        } : {
          background: 'rgba(255,255,255,0.96)',
          border: '1px solid rgba(99,102,241,0.18)',
          boxShadow: [
            '0 4px 6px rgba(99,102,241,0.06)',
            '0 20px 60px rgba(99,102,241,0.12)',
            '0 40px 100px rgba(0,0,0,0.14)',
            '0 0 0 1px rgba(255,255,255,0.9) inset',
          ].join(', '),
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        {/* Top hairline accent */}
        <div
          style={{
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
            width: '65%', height: '2px', borderRadius: '9999px',
            background: isDark
              ? 'linear-gradient(90deg, transparent, rgba(200,200,200,0.45), transparent)'
              : 'linear-gradient(90deg, transparent, rgba(99,102,241,0.7), rgba(139,92,246,0.5), transparent)',
          }}
        />

        {/* Logo */}
        <div ref={logoRef} className="mb-6 mt-1">
          <span className="text-2xl font-black tracking-tight select-none">
            <span className="dark:text-white text-slate-800">PicVid</span>
            <span className="gradient-text">Gif</span>
          </span>
        </div>

        {/* Heading */}
        <div ref={titleRef} className="text-center mb-2">
          <h1 className="text-2xl font-bold dark:text-white text-slate-900 tracking-tight">
            Welcome back
          </h1>
        </div>

        {/* Subtitle */}
        <p ref={subRef} className="dark:text-gray-400 text-slate-500 text-sm text-center mb-8 leading-relaxed max-w-xs">
          Sign in to access millions of high-quality images, videos &amp; GIFs.
        </p>

        {/* Divider */}
        <div ref={divRef} className="w-full mb-5">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px dark:bg-white/8 bg-slate-200" />
            <span className="text-xs dark:text-gray-500 text-slate-400 font-semibold tracking-widest uppercase">
              Continue with
            </span>
            <div className="flex-1 h-px dark:bg-white/8 bg-slate-200" />
          </div>
        </div>

        {/* Buttons */}
        <div ref={btnsRef} className="w-full flex flex-col gap-3">

          {/* Google */}
          <button
            id="btn-google"
            onClick={handleGoogle}
            onMouseEnter={e => { setGoogleHover(true); onEnter(e.currentTarget); }}
            onMouseLeave={e => { setGoogleHover(false); onLeave(e.currentTarget); }}
            onMouseDown={e => onPress(e.currentTarget)}
            onMouseUp={e => onRelease(e.currentTarget)}
            disabled={googleLoading || appleLoading}
            className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-semibold disabled:cursor-not-allowed"
            style={{
              background: isDark
                ? (googleHover ? '#ffffff' : 'rgba(255,255,255,0.93)')
                : (googleHover ? '#f8f9ff' : '#ffffff'),
              color: '#111',
              border: isDark ? 'none' : '1px solid rgba(99,102,241,0.15)',
              boxShadow: googleHover
                ? '0 10px 36px rgba(66,133,244,0.28), 0 0 0 1px rgba(255,255,255,0.25)'
                : isDark ? '0 4px 20px rgba(0,0,0,0.18)' : '0 2px 12px rgba(99,102,241,0.10)',
              transition: 'background 0.18s, box-shadow 0.18s',
            }}
          >
            {googleLoading
              ? <Spinner color="#4285F4" />
              : <><GoogleIcon /><span>Continue with Google</span></>
            }
          </button>

          {/* Apple */}
          <button
            id="btn-apple"
            onClick={handleApple}
            onMouseEnter={e => { setAppleHover(true); onEnter(e.currentTarget); }}
            onMouseLeave={e => { setAppleHover(false); onLeave(e.currentTarget); }}
            onMouseDown={e => onPress(e.currentTarget)}
            onMouseUp={e => onRelease(e.currentTarget)}
            disabled={googleLoading || appleLoading}
            className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-semibold disabled:cursor-not-allowed"
            style={{
              background: appleHover ? '#1c1c1c' : '#0f0f0f',
              color: '#fff',
              border: isDark ? '1px solid rgba(255,255,255,0.13)' : '1px solid rgba(15,15,15,0.85)',
              boxShadow: appleHover
                ? '0 10px 36px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.08)'
                : isDark ? '0 4px 20px rgba(0,0,0,0.25)' : '0 4px 16px rgba(0,0,0,0.22)',
              transition: 'background 0.18s, box-shadow 0.18s',
            }}
          >
            {appleLoading
              ? <Spinner color="#fff" />
              : <><AppleIcon /><span>Continue with Apple</span></>
            }
          </button>
        </div>

        {/* Footer */}
        <p ref={footerRef} className="mt-7 text-xs dark:text-gray-600 text-slate-400 text-center leading-relaxed max-w-xs">
          By continuing, you agree to our{' '}
          <span className="dark:text-gray-400 text-indigo-500 dark:hover:text-gray-200 hover:text-indigo-700 cursor-pointer transition-colors font-medium">
            Terms of Service
          </span>
          {' '}and{' '}
          <span className="dark:text-gray-400 text-indigo-500 dark:hover:text-gray-200 hover:text-indigo-700 cursor-pointer transition-colors font-medium">
            Privacy Policy
          </span>.
        </p>
      </div>
    </div>
  );
};

export default Login;