import { useEffect, useRef, useState } from 'react';

import gsap from 'gsap';
import { useTheme } from '../context/ThemeContext';

const FULL_TEXT = 'PicVidGif';
const GRADIENT_START = 6; // index where 'Gif' begins

const Loader = ({ onComplete }) => {
  const { isDark } = useTheme();
  const overlayRef = useRef(null);
  const cursorRef = useRef(null);
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const [visible, setVisible] = useState(true);

  // ── Lock scroll while loader is mounted ──────────────────────────
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // ── Typewriter ────────────────────────────────────────────────────
  useEffect(() => {
    let i = 0;
    setDisplayed('');
    setDone(false);

    const id = setInterval(() => {
      i++;
      setDisplayed(FULL_TEXT.slice(0, i));
      if (i === FULL_TEXT.length) {
        clearInterval(id);
        // short pause then fade out
        setTimeout(() => {
          setDone(true);
          gsap.to(overlayRef.current, {
            opacity: 0,
            duration: 0.45,
            ease: 'power2.inOut',
            onComplete: () => {
              setVisible(false);
              onComplete?.();
            },
          });
        }, 700);
      }
    }, 100);

    return () => clearInterval(id);
  }, [onComplete]);

  // ── Cursor blink ──────────────────────────────────────────────────
  useEffect(() => {
    if (!cursorRef.current) return;
    const tween = gsap.to(cursorRef.current, {
      opacity: 0,
      duration: 0.45,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1,
    });
    return () => tween.kill();
  }, [visible]);

  if (!visible) return null;

  // ── Split text into plain + gradient portions ─────────────────────
  const plain = displayed.slice(0, GRADIENT_START);       // 'PicVid' (up to 6 chars)
  const gradient = displayed.slice(GRADIENT_START);        // 'Gif'

  // ── Theme tokens ──────────────────────────────────────────────────
  const bg = isDark ? '#080808' : '#f0f1f7';
  const plainColor = isDark ? '#ffffff' : '#111827';
  const cursorColor = isDark ? 'rgba(99,102,241,0.9)' : 'rgba(79,70,229,0.9)';
  const gradientStyle = isDark
    ? 'linear-gradient(135deg, #e5e7eb, #9ca3af, #6b7280)'
    : 'linear-gradient(135deg, #4f46e5, #6366f1, #818cf8)';

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: bg,
        transition: 'background 0.3s',
      }}
    >
      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 'clamp(2rem, 8vw, 3.5rem)',
          fontWeight: 900,
          letterSpacing: '-0.02em',
          lineHeight: 1,
          display: 'inline-flex',
          alignItems: 'baseline',
        }}
      >
        {/* Plain portion — PicVid */}
        <span style={{ color: plainColor }}>{plain}</span>

        {/* Gradient portion — Gif */}
        {gradient && (
          <span
            style={{
              background: gradientStyle,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {gradient}
          </span>
        )}

        {/* Blinking cursor — hidden once typing finishes */}
        {!done && (
          <span
            ref={cursorRef}
            style={{
              display: 'inline-block',
              width: '3px',
              height: '1em',
              background: cursorColor,
              marginLeft: '4px',
              borderRadius: '2px',
              verticalAlign: 'middle',
            }}
          />
        )}
      </span>
    </div>
  );
};

export default Loader;
