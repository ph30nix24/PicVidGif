import { useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Download, Trash2, ExternalLink, Image, Video, Film } from 'lucide-react'

const typeIcon = (type) => {
  if (type === 'gif') return <Film size={11} />
  if (type === 'video') return <Video size={11} />
  return <Image size={11} />
}

const CollectionCard = ({ item, onRemove }) => {
  const cardRef    = useRef(null)
  const overlayRef = useRef(null)
  const actionsRef = useRef(null)
  const [removing, setRemoving] = useState(false)

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, { y: -6, scale: 1.02, duration: 0.3, ease: 'power2.out' })
    gsap.to(overlayRef.current, { opacity: 1, duration: 0.25 })
    gsap.fromTo(actionsRef.current,
      { y: 14, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.28, ease: 'power2.out', delay: 0.05 }
    )
  }

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, { y: 0, scale: 1, duration: 0.3, ease: 'power2.out' })
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2 })
    gsap.to(actionsRef.current, { y: 10, opacity: 0, duration: 0.2, ease: 'power2.in' })
  }

  const handleRemove = async (e) => {
    e.stopPropagation()
    if (removing) return
    setRemoving(true)
    gsap.to(cardRef.current, {
      scale: 0.85, opacity: 0, y: -20, duration: 0.4, ease: 'power2.in',
      onComplete: () => onRemove && onRemove(item.id || item._id)
    })
  }

  const handleDownload = (e) => {
    e.stopPropagation()
    const link = document.createElement('a')
    link.href = item.url || item.urls?.raw || item.src
    link.download = item.alt || 'download'
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

        {/* Media thumbnail */}
        <img
          src={item.url || item.urls?.small || item.src}
          alt={item.alt || 'Collection item'}
          className="w-full object-cover block"
          loading="lazy"
          draggable={false}
        />

        {/* Type badge */}
        {item.type && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-full border border-white/10 uppercase tracking-wide">
            {typeIcon(item.type)}
            <span>{item.type}</span>
          </div>
        )}

        {/* Overlay */}
        <div
          ref={overlayRef}
          className="absolute inset-0 opacity-0"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.18) 55%, rgba(0,0,0,0.04) 100%)' }}
        />

        {/* Action buttons */}
        <div ref={actionsRef} className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="w-8 h-8 rounded-full bg-indigo-500/80 backdrop-blur-md border border-indigo-400/40 flex items-center justify-center text-white hover:bg-indigo-400/90 transition-all duration-200"
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
            onClick={handleRemove}
            disabled={removing}
            className="w-8 h-8 rounded-full bg-red-500/70 backdrop-blur-md border border-red-400/40 flex items-center justify-center text-white hover:bg-red-500/90 transition-all duration-200 disabled:opacity-50"
            aria-label="Remove from collection"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default CollectionCard
