import { useEffect, useRef } from "react";
import { gsap } from 'gsap'
import { KB_VARIANTS } from "../utils";


const BgTile = ({ src, col, row, kb, index }) => {
  const wrapRef = useRef(null);
  const imgRef  = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const img  = imgRef.current;
    if (!wrap || !img) return;

    // Staggered fade-in
    gsap.fromTo(wrap,
      { opacity: 0 },
      { opacity: 1, duration: 1.4, delay: index * 0.06, ease: 'power2.out' }
    );

    // Ken Burns loop
    const v   = KB_VARIANTS[kb];
    const dur = 14 + (index % 6) * 1.5; // 14s–22.5s
    gsap.fromTo(img,
      { scale: v.fromScale, x: v.fromX, y: v.fromY },
      { scale: v.toScale,   x: v.toX,   y: v.toY,
        duration: dur, ease: 'none', repeat: -1, yoyo: true }
    );
  }, []);

  return (
    <div
      ref={wrapRef}
      style={{
        gridColumn: col,
        gridRow: row,
        opacity: 0,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <img
        ref={imgRef}
        src={src}
        alt=""
        draggable={false}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      />
      {/* per-tile dark wash so edges don't blow out */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(4,4,12,0.3)' }} />
    </div>
  );
};

export default BgTile