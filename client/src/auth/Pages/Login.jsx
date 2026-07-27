import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { BG_TILES } from "../utils";
import BgTile from "../Components/BgTile";
import { AppleIcon, GoogleIcon, Spinner } from "../../icons/Icons";

const Login = () => {
  const cardRef   = useRef(null);
  const logoRef   = useRef(null);
  const titleRef  = useRef(null);
  const subRef    = useRef(null);
  const divRef    = useRef(null);
  const btnsRef   = useRef(null);
  const footerRef = useRef(null);

  const [googleHover,   setGoogleHover]   = useState(false);
  const [appleHover,    setAppleHover]    = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading,  setAppleLoading]  = useState(false);

  /* entrance timeline */
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(cardRef.current,
        { y: 52, opacity: 0, scale: 0.93 },
        { y: 0,  opacity: 1, scale: 1, duration: 0.85, ease: 'back.out(1.5)' }, 0.5)

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
  const onEnter   = el => gsap.to(el, { scale: 1.025, y: -2, duration: 0.2,  ease: 'power2.out'  });
  const onLeave   = el => gsap.to(el, { scale: 1, y:  0, duration: 0.2,  ease: 'power2.out'  });
  const onPress   = el => gsap.to(el, { scale: 0.97, duration: 0.1,  ease: 'power2.in'   });
  const onRelease = el => gsap.to(el, { scale: 1.025, duration: 0.2,  ease: 'back.out(2)' });

  const handleGoogle = () => {
    if (googleLoading || appleLoading) return;
    setGoogleLoading(true);
    gsap.to(cardRef.current, { scale: 0.97, duration: 0.12, yoyo: true, repeat: 1 });
    setTimeout(() => { setGoogleLoading(false); }, 1500);
  };
  const handleApple = () => {
    if (googleLoading || appleLoading) return;
    setAppleLoading(true);
    gsap.to(cardRef.current, { scale: 0.97, duration: 0.12, yoyo: true, repeat: 1 });
    setTimeout(() => { setAppleLoading(false); }, 1500);
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: '#05050d' }}
    >
      {/* ══════════════════════════════════════════════
          MOSAIC BACKGROUND — uneven CSS grid
      ══════════════════════════════════════════════ */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          /* 5 columns — deliberately uneven widths */
          gridTemplateColumns: '1.35fr 0.95fr 1.05fr 1fr 1.2fr',
          /* 4 rows — deliberately uneven heights */
          gridTemplateRows: '1.2fr 1fr 1.1fr 0.9fr',
          gap: '5px',
        }}
      >
        {BG_TILES.map((tile, i) => (
          <BgTile key={i} index={i} {...tile} />
        ))}
      </div>

      {/* ── Overlays — dark wash only, no purple tint ── */}
      {/* Base darkness */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(5,5,13,0.68)' }} />

      {/* Radial vignette — dark edges only */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 35%, rgba(5,5,13,0.88) 100%)',
      }} />
      {/* Top fade */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '30%',
        background: 'linear-gradient(to bottom, rgba(5,5,13,0.6) 0%, transparent 100%)',
      }} />
      {/* Bottom fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%',
        background: 'linear-gradient(to top, rgba(5,5,13,0.7) 0%, transparent 100%)',
      }} />

      <div
        ref={cardRef}
        className="relative w-full max-w-md rounded-3xl p-8 flex flex-col items-center"
        style={{
          background: 'rgba(8,8,18,0.6)',
          border: '1px solid rgba(139,92,246,0.28)',
          boxShadow: [
            '0 40px 100px rgba(0,0,0,0.75)',
            '0 0 0 1px rgba(255,255,255,0.05) inset',
            '0 0 60px rgba(139,92,246,0.08)',
          ].join(', '),
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
        }}
      >
        {/* Purple hairline top accent */}
        <div
          style={{
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
            width: '70%', height: '1px', borderRadius: '9999px',
            background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.85), transparent)',
          }}
        />

        {/* Logo */}
        <div ref={logoRef} className="mb-6 mt-1">
          <span className="text-2xl font-black tracking-tight select-none">
            <span className="logo-bracket">[</span>
            <span className="text-white">PicVid</span>
            <span className="gradient-text">Gif</span>
            <span className="logo-bracket">]</span>
          </span>
        </div>

        {/* Heading */}
        <div ref={titleRef} className="text-center mb-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back</h1>
        </div>

        {/* Subtitle */}
        <p ref={subRef} className="text-gray-400 text-sm text-center mb-8 leading-relaxed max-w-xs">
          Sign in to access millions of high-quality images, videos &amp; GIFs.
        </p>

        {/* Divider */}
        <div ref={divRef} className="w-full mb-5">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <span className="text-xs text-gray-500 font-medium tracking-widest uppercase">Continue with</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
          </div>
        </div>

        {/* Buttons */}
        <div ref={btnsRef} className="w-full flex flex-col gap-3">

          {/* Google */}
          <button
            id="btn-google"
            onClick={handleGoogle}
            onMouseEnter={e => { setGoogleHover(true);  onEnter(e.currentTarget); }}
            onMouseLeave={e => { setGoogleHover(false); onLeave(e.currentTarget); }}
            onMouseDown ={e => onPress(e.currentTarget)}
            onMouseUp   ={e => onRelease(e.currentTarget)}
            disabled={googleLoading || appleLoading}
            className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-semibold disabled:cursor-not-allowed"
            style={{
              background: googleHover ? '#ffffff' : 'rgba(255,255,255,0.93)',
              color: '#111',
              boxShadow: googleHover
                ? '0 10px 36px rgba(66,133,244,0.28), 0 0 0 1px rgba(255,255,255,0.25)'
                : '0 4px 20px rgba(0,0,0,0.45)',
              transition: 'background 0.18s, box-shadow 0.18s',
            }}
          >
            {googleLoading
              ? <Spinner color="#4285F4" />
              : <><GoogleIcon /><span>Continue with Google</span></>}
          </button>

          {/* Apple */}
          <button
            id="btn-apple"
            onClick={handleApple}
            onMouseEnter={e => { setAppleHover(true);  onEnter(e.currentTarget); }}
            onMouseLeave={e => { setAppleHover(false); onLeave(e.currentTarget); }}
            onMouseDown ={e => onPress(e.currentTarget)}
            onMouseUp   ={e => onRelease(e.currentTarget)}
            disabled={googleLoading || appleLoading}
            className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-semibold disabled:cursor-not-allowed"
            style={{
              background: appleHover ? '#1c1c1c' : '#111',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.13)',
              boxShadow: appleHover
                ? '0 10px 36px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.1)'
                : '0 4px 20px rgba(0,0,0,0.55)',
              transition: 'background 0.18s, box-shadow 0.18s',
            }}
          >
            {appleLoading
              ? <Spinner color="#fff" />
              : <><AppleIcon /><span>Continue with Apple</span></>}
          </button>
        </div>

        {/* Footer */}
        <p ref={footerRef} className="mt-7 text-xs text-gray-600 text-center leading-relaxed max-w-xs">
          By continuing, you agree to our{' '}
          <span className="text-purple-400 hover:text-purple-300 cursor-pointer transition-colors">Terms of Service</span>
          {' '}and{' '}
          <span className="text-purple-400 hover:text-purple-300 cursor-pointer transition-colors">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
};


export default Login