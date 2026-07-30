import { useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { Download, Trash2, ExternalLink, Image, Video, Film, Play } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { addToast } from '../../../redux/features/toastSlice'
import { removeFromCollection } from '../apis/collection.apis'
import { setCollection } from '../../../redux/features/collectionSlice'

/* ─── helpers ──────────────────────────────────────────────── */
const formatDuration = (secs) => {
  if (!secs && secs !== 0) return null
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

const typeConfig = {
  video: { icon: Video, label: 'Video', color: 'bg-indigo-500/80 border-indigo-400/30' },
  gif: { icon: Film, label: 'GIF', color: 'bg-emerald-500/80 border-emerald-400/30' },
  image: { icon: Image, label: 'Image', color: 'bg-black/60 border-white/10' },
}

/* ─── component ────────────────────────────────────────────── */
const CollectionCard = ({ item }) => {
  const cardRef = useRef(null)
  const overlayRef = useRef(null)
  const actionsRef = useRef(null)
  const playRef = useRef(null)
  const videoRef = useRef(null)
  const imgRef = useRef(null)

  const dispatch = useDispatch()

  /* normalise type — backend may return any casing */
  const itemType = (item.type || 'image').toLowerCase()
  const isVideo = itemType === 'video'
  const isGif = itemType === 'gif'
  const cfg = typeConfig[itemType] ?? typeConfig.image

  /* duration is only meaningful for videos */
  const duration = isVideo ? formatDuration(item.duration) : null

  /* GIF: thumbnailUrl = still frame, url = animated */
  const gifStill = item.thumbnailUrl || item.urls?.small || item.src
  const gifAnimated = item.url || item.thumbnailUrl

  /* ── hover ── */
  const handleMouseEnter = useCallback(() => {
    gsap.to(cardRef.current, { y: -6, scale: 1.02, duration: 0.3, ease: 'power2.out' })
    gsap.to(overlayRef.current, { opacity: 1, duration: 0.25 })
    gsap.fromTo(
      actionsRef.current,
      { y: 14, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.28, ease: 'power2.out', delay: 0.05 }
    )
    if (playRef.current) {
      gsap.fromTo(
        playRef.current,
        { scale: 0.6, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(2)' }
      )
    }
    /* autoplay video preview on hover */
    if (isVideo && videoRef.current && item.url) {
      videoRef.current.style.opacity = '1'
      videoRef.current.play().catch(() => { })
    }
    /* GIF: swap still → animated */
    if (isGif && imgRef.current) {
      imgRef.current.src = gifAnimated
    }
  }, [isVideo, isGif, item.url, gifAnimated])

  const handleMouseLeave = useCallback(() => {
    gsap.to(cardRef.current, { y: 0, scale: 1, duration: 0.3, ease: 'power2.out' })
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2 })
    gsap.to(actionsRef.current, { y: 10, opacity: 0, duration: 0.2, ease: 'power2.in' })
    if (playRef.current) {
      gsap.to(playRef.current, { scale: 0.6, opacity: 0, duration: 0.2, ease: 'power2.in' })
    }
    if (isVideo && videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
      videoRef.current.style.opacity = '0'
    }
    /* GIF: swap animated → still */
    if (isGif && imgRef.current) {
      imgRef.current.src = gifStill
    }
  }, [isVideo, isGif, gifStill])

  /* ── remove ── */
  const handleRemove = async (sourceId) => {
    try {
      console.log(item.sourceId)
      const result = await removeFromCollection(sourceId)
      dispatch(setCollection(result.data.items))
      dispatch(addToast('SuccessFul', "success"))
    } catch (e) {
      dispatch(addToast(`Failed ${e.response?.data.message}`, "error"))
    }

  }

  /* ── download ── */
  const handleDownload = (e) => {
    e.stopPropagation()
    const link = document.createElement('a')
    link.href = item.url || item.thumbnailUrl || item.urls?.raw || item.src
    link.download = item.description || item.alt || 'download'
    link.target = '_blank'
    link.click()
  }

  return (
    <div
      className="masonry-item cursor-pointer relative"
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ willChange: 'transform', zIndex: 0 }}
    >
      <div className="relative rounded-xl overflow-hidden dark:bg-[#111] bg-white shadow-md dark:shadow-black/40 shadow-gray-200 transition-shadow duration-300 hover:shadow-xl dark:hover:shadow-black/60 hover:shadow-indigo-100/60">

        {/* ── Thumbnail / GIF still (natural height — no forced aspect ratio) ── */}
        <img
          ref={isGif ? imgRef : undefined}
          src={item.thumbnailUrl || item.urls?.small || item.src}
          alt={item.description || item.alt || 'Collection item'}
          className="w-full object-cover block"
          loading="lazy"
          draggable={false}
        />

        {/* ── Hover video (videos only) ── */}
        {isVideo && item.url && (
          <video
            ref={videoRef}
            src={item.url}
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
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.18) 55%, rgba(0,0,0,0.04) 100%)' }}
        />

        {/* ── Play button (videos) / Animated hint (GIFs) ── */}
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
        {isGif && (
          <div
            ref={playRef}
            className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white/90 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-white/10 opacity-0 pointer-events-none"
          >
            ▶ Animated
          </div>
        )}

        {/* ── Type badge (top-left) ── */}
        {item.type && (
          <div className={`absolute top-2 left-2 flex items-center gap-1 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full border uppercase tracking-wider ${cfg.color}`}>
            <cfg.icon size={10} />
            <span>{cfg.label}</span>
          </div>
        )}

        {/* ── Duration badge for videos (top-right) ── */}
        {duration && (
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs font-semibold px-2 py-0.5 rounded-md border border-white/10 tracking-wide">
            {duration}
          </div>
        )}

        {/* ── Action buttons ── */}
        <div ref={actionsRef} className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="w-8 h-8 rounded-full bg-indigo-500/80 backdrop-blur-md border border-indigo-400/40 flex items-center justify-center text-white hover:bg-indigo-400/90 transition-all duration-200 cursor-pointer"
              aria-label="Download"
            >
              <Download size={13} />
            </button>
            <a href={item.url || item.urls?.raw || item.src} target="_blank" rel="noreferrer">
              <button
                className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/40 transition-all duration-200"
                aria-label="Open original"
              >
                <ExternalLink size={12} />
              </button>
            </a>
          </div>
          <button
            onClick={() => handleRemove(item.sourceId)}
            className="w-8 h-8 rounded-full bg-red-500/70 backdrop-blur-md border border-red-400/40 flex items-center justify-center text-white hover:bg-red-500/90 transition-all duration-200 disabled:opacity-50 cursor-pointer"
            aria-label="Remove from collection"
          >
            <Trash2 size={13} />
          </button>
        </div>

        {/* ── Description / credit (bottom-right, visible on hover via overlay) ── */}
        {item.description && (
          <div className="absolute bottom-3 right-12 text-white/50 text-[10px] font-medium truncate max-w-[90px]">
            {item.description}
          </div>
        )}
      </div>
    </div>
  )
}

export default CollectionCard
