import { useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { Download, Heart, Play, Film } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToast } from '../../../redux/features/toastSlice';
import { addInCollection } from '../../collections/apis/collection.apis';

/* ─── helpers ─────────────────────────────────────────────── */
const formatDuration = (secs) => {
  if (!secs && secs !== 0) return null;
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

/** Pick the best Pexels video file (prefer hd > sd > first available) */
const pickVideoSrc = (videoFiles = []) => {
  if (!videoFiles.length) return null;
  const hd = videoFiles.find((f) => f.quality === 'hd');
  const sd = videoFiles.find((f) => f.quality === 'sd');
  return (hd || sd || videoFiles[0])?.link ?? null;
};

/**
 * Giphy object helpers
 * Static (still) thumbnail — shown before hover
 * Animated url — swapped in on hover
 */
const gifStill = (item) =>
  item.images?.fixed_width_still?.url ||
  item.images?.downsized_still?.url ||
  item.images?.fixed_width?.url ||
  item.images?.original?.url || '';

const gifAnimated = (item) =>
  item.images?.fixed_width?.url ||
  item.images?.downsized?.url ||
  item.images?.original?.url || '';

/* ─── component ───────────────────────────────────────────── */
const MediaCard = ({ item, type = 'images' }) => {
  const cardRef = useRef(null);
  const overlayRef = useRef(null);
  const playRef = useRef(null);
  const actionsRef = useRef(null);
  const videoRef = useRef(null);
  const imgRef = useRef(null);
  const [liked, setLiked] = useState(false);
  const dispatch = useDispatch();

  const isVideo = type === 'videos';
  const isGif = type === 'gifs';

  /* ── source resolution ── */
  const thumbnail = isVideo
    ? item.image
    : isGif
      ? gifStill(item)
      : (item.urls?.regular || item.src);

  const videoSrc = isVideo ? pickVideoSrc(item.video_files) : null;
  const gifAnimSrc = isGif ? gifAnimated(item) : null;
  const duration = isVideo ? formatDuration(item.duration) : null;

  const downloadUrl = isVideo ? videoSrc : isGif ? gifAnimSrc : item.urls?.full

  /* ── hover ── */
  const handleMouseEnter = useCallback(() => {
    gsap.to(cardRef.current, { y: -5, scale: 1.02, duration: 0.35, ease: 'power2.out' });
    gsap.to(overlayRef.current, { opacity: 1, duration: 0.25, ease: 'power2.out' });

    if (playRef.current) {
      gsap.fromTo(
        playRef.current,
        { scale: 0.6, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(2)' }
      );
    }
    if (actionsRef.current) {
      gsap.fromTo(
        actionsRef.current,
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out', delay: 0.05 }
      );
    }

    /* video: fade in native <video> and play */
    if (isVideo && videoRef.current && videoSrc) {
      videoRef.current.style.opacity = '1';
      videoRef.current.play().catch(() => { });
    }

    /* gif: swap still → animated src */
    if (isGif && imgRef.current && gifAnimSrc) {
      imgRef.current.src = gifAnimSrc;
    }
  }, [isVideo, isGif, videoSrc, gifAnimSrc]);

  const handleMouseLeave = useCallback(() => {
    gsap.to(cardRef.current, { y: 0, scale: 1, duration: 0.35, ease: 'power2.out' });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2, ease: 'power2.in' });

    if (playRef.current) {
      gsap.to(playRef.current, { scale: 0.6, opacity: 0, duration: 0.2, ease: 'power2.in' });
    }
    if (actionsRef.current) {
      gsap.to(actionsRef.current, { y: 10, opacity: 0, duration: 0.2, ease: 'power2.in' });
    }

    /* video: pause + reset */
    if (isVideo && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      videoRef.current.style.opacity = '0';
    }

    /* gif: swap animated → still */
    if (isGif && imgRef.current) {
      imgRef.current.src = thumbnail;
    }
  }, [isVideo, isGif, thumbnail]);

  /* ── like / save ── */
  const handleLike = async (e) => {
    e.stopPropagation();
    setLiked((prev) => !prev);
    gsap.fromTo(
      e.currentTarget,
      { scale: 1.4 },
      { scale: 1, duration: 0.4, ease: 'elastic.out(1.5, 0.4)' }
    );
    try {
      let payload;
      if (isVideo) {
        payload = {
          sourceId: String(item.id),
          type: 'video',
          url: videoSrc,
          downloadUrl: videoSrc,
          thumbnailUrl: item.image,
          description: item.user?.name ? `Video by ${item.user.name}` : '',
        };
      } else if (isGif) {
        payload = {
          sourceId: String(item.id),
          type: 'gif',
          url: gifAnimSrc,
          downloadUrl: gifAnimSrc,
          thumbnailUrl: gifStill(item),
          description: item.title || '',
        };
      } else {
        payload = {
          sourceId: item.id,
          type: 'image',
          url: item.urls?.regular,
          downloadUrl: item.links?.full,
          thumbnailUrl: item.urls?.thumb,
          description: item.alt_description || item.description || '',
        };
      }
      const result = await addInCollection(payload);
      dispatch(addToast(`Successful ${result.message}`, 'success'));
    } catch (error) {
      dispatch(addToast(`Failed ${error.response?.data?.message}`, 'error'));
    }
  };

  const handleDownload = async (url, filename) => {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }

      const blob = await response.blob();

      // Determine file extension from MIME type
      const contentType = response.headers.get("Content-Type") || blob.type;
      const extension = contentType.split("/")[1]?.split(";")[0] || "";

      // Determine filename
      let finalFilename = filename;

      if (!finalFilename) {
        // Try to get filename from URL
        const urlName = decodeURIComponent(
          url.split("/").pop()?.split("?")[0] || ""
        );

        if (urlName && urlName.includes(".")) {
          finalFilename = urlName;
        } else {
          finalFilename = `download.${extension || "bin"}`;
        }
      }

      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = finalFilename;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download error:", error);
      alert("Unable to download this file.");
    }
  };

  /* ── natural height for all types — true masonry flow ── */
  const imgClass = `w-full object-cover block ${(!isVideo && !isGif) ? (item.height ?? '') : ''}`;

  return (
    <div
      className="masonry-item cursor-pointer relative"
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ willChange: 'transform', zIndex: 0 }}
    >
      <div className="relative rounded-xl overflow-hidden dark:bg-[#111111] bg-white shadow-md dark:shadow-black/40 shadow-gray-200 transition-shadow duration-300 hover:shadow-xl dark:hover:shadow-black/60 hover:shadow-gray-300/60">

        {/* ── Thumbnail / GIF still (always visible) ── */}
        <img
          ref={isGif ? imgRef : undefined}
          src={thumbnail}
          alt={
            item?.alt ??
            item?.title ??
            (item?.user?.name ? `Video by ${item.user.name}` : 'media')
          }
          className={imgClass}
          loading="lazy"
          draggable={false}
        />

        {/* ── Native video (videos only) — fades in on hover ── */}
        {isVideo && videoSrc && (
          <video
            ref={videoRef}
            src={videoSrc}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
            style={{ opacity: 0 }}
            muted
            loop
            playsInline
            preload="none"
          />
        )}

        {/* ── Overlay gradient ── */}
        <div
          ref={overlayRef}
          className="absolute inset-0 opacity-0"
          style={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.05) 100%)',
          }}
        />

        {/* ── Play button (videos only) ── */}
        {isVideo && (
          <div
            ref={playRef}
            className="absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none"
          >
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center play-btn">
              <Play size={20} className="text-white fill-white ml-0.5" />
            </div>
          </div>
        )}

        {/* ── GIF animated badge (top-left) ── */}
        {isGif && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-emerald-500/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-400/30 tracking-widest uppercase">
            <Film size={10} />
            <span>GIF</span>
          </div>
        )}

        {/* ── Video HD badge (top-left) ── */}
        {isVideo && (
          <div className="absolute top-2 left-2 bg-indigo-500/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md border border-indigo-400/30 tracking-widest uppercase">
            HD
          </div>
        )}

        {/* ── Duration badge (videos) ── */}
        {duration && (
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs font-semibold px-2 py-0.5 rounded-md border border-white/10 tracking-wide">
            {duration}
          </div>
        )}

        {/* ── "Hover to animate" hint badge (GIFs, top-right) ── */}
        {isGif && (
          <div
            ref={playRef}
            className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white/80 text-[10px] font-medium px-2 py-0.5 rounded-md border border-white/10 opacity-0 pointer-events-none"
          >
            ▶ Animated
          </div>
        )}

        {/* ── Action buttons ── */}
        <div ref={actionsRef} className="absolute bottom-3 left-3 flex items-center gap-2 opacity-0">
          <button
            onClick={handleLike}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-200 cursor-pointer ${liked
              ? 'bg-red-500/80 border-red-400/50 text-white'
              : 'bg-black/50 border-white/20 text-white hover:bg-red-500/50'
              }`}
            aria-label="Save to collection"
          >
            <Heart size={13} fill={liked ? 'white' : 'none'} />
          </button>

            <button
              className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-gray-600/60 hover:border-gray-400/50 transition-all duration-200 cursor-pointer"
              aria-label="Download"
              onClick = {() => handleDownload(downloadUrl, `${type}-${item.id}`)}

            >
              <Download size={13} />
            </button>

        </div>

        {/* ── Credit (videos & GIFs) ── */}
        {isVideo && item.user?.name && (
          <div className="absolute bottom-3 right-3 text-white/60 text-[10px] font-medium truncate max-w-[100px]">
            {item.user.name}
          </div>
        )}
        {isGif && item.username && (
          <div className="absolute bottom-3 right-3 text-white/60 text-[10px] font-medium truncate max-w-[100px]">
            @{item.username}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaCard;
