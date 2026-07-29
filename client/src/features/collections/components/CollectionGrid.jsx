import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CollectionCard from './CollectionCard'
import { Layers, Search, SlidersHorizontal, Image, Video, Film, Inbox } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const FILTER_TABS = [
  { key: 'all',    label: 'All',    icon: Layers },
  { key: 'image',  label: 'Images', icon: Image  },
  { key: 'video',  label: 'Videos', icon: Video  },
  { key: 'gif',    label: 'GIFs',   icon: Film   },
]

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'az',     label: 'A → Z'        },
]

const EmptyState = () => {
  const ref = useRef(null)
  useEffect(() => {
    gsap.fromTo(ref.current,
      { opacity: 0, y: 30, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.5)' }
    )
  }, [])

  return (
    <div ref={ref} className="flex flex-col items-center justify-center py-24 gap-5 text-center">
      <div className="w-20 h-20 rounded-3xl dark:bg-white/[0.04] bg-indigo-50 border dark:border-white/[0.07] border-indigo-100 flex items-center justify-center">
        <Inbox size={36} className="dark:text-gray-600 text-indigo-300" />
      </div>
      <div>
        <h3 className="text-lg font-semibold dark:text-gray-300 text-slate-600 mb-1">Nothing saved yet</h3>
        <p className="text-sm dark:text-gray-600 text-slate-400 max-w-xs">
          Start exploring and save your favourite images, videos, and GIFs here.
        </p>
      </div>
      <a href="/">
        <button className="mt-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-sm font-semibold hover:from-indigo-400 hover:to-indigo-500 transition-all duration-200 shadow-lg shadow-indigo-500/25">
          Browse Media
        </button>
      </a>
    </div>
  )
}

const CollectionGrid = ({ items, onRemove }) => {
  const gridRef = useRef(null)
  const [activeFilter, setActiveFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [searchQuery, setSearchQuery] = useState('')
  const [showSort, setShowSort] = useState(false)
  const tabLineRef = useRef(null)

  // Filter + sort + search
  const processed = items
    .filter(item => {
      const matchFilter = activeFilter === 'all' || (item.type || 'image') === activeFilter
      const matchSearch = !searchQuery || (item.alt || '').toLowerCase().includes(searchQuery.toLowerCase())
      return matchFilter && matchSearch
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.savedAt || 0) - new Date(a.savedAt || 0)
      if (sortBy === 'oldest') return new Date(a.savedAt || 0) - new Date(b.savedAt || 0)
      if (sortBy === 'az')     return (a.alt || '').localeCompare(b.alt || '')
      return 0
    })

  // Animate on filter change
  useEffect(() => {
    if (!gridRef.current || processed.length === 0) return
    const cards = gridRef.current.querySelectorAll('.masonry-item')
    gsap.fromTo(cards,
      { opacity: 0, y: 20, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, stagger: 0.04, duration: 0.4, ease: 'power2.out' }
    )
  }, [activeFilter, sortBy, searchQuery])

  // Scroll-trigger on initial mount
  useEffect(() => {
    if (!gridRef.current || processed.length === 0) return
    const ctx = gsap.context(() => {
      gridRef.current.querySelectorAll('.masonry-item').forEach((item, i) => {
        gsap.fromTo(item,
          { y: 60, opacity: 0, scale: 0.95 },
          {
            y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out', delay: i * 0.055,
            scrollTrigger: { trigger: item, start: 'top 95%', toggleActions: 'play none none none' }
          }
        )
      })
    }, gridRef)
    return () => ctx.revert()
  }, [])

  return (
    <section>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        {/* Filter tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl dark:bg-white/[0.04] bg-white border dark:border-white/[0.07] border-slate-200 self-start">
          {FILTER_TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`filter-tab flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                activeFilter === key
                  ? 'dark:bg-white/10 bg-indigo-50 dark:text-white text-indigo-700 dark:shadow-none shadow-sm dark:border dark:border-white/10 border border-indigo-200'
                  : 'dark:text-gray-500 text-slate-400 hover:dark:text-gray-300 hover:text-slate-600'
              }`}
            >
              <Icon size={12} />
              {label}
              <span className={`ml-0.5 text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                activeFilter === key
                  ? 'dark:bg-white/10 bg-indigo-100 dark:text-gray-200 text-indigo-600'
                  : 'dark:bg-white/5 bg-slate-100 dark:text-gray-600 text-slate-400'
              }`}>
                {key === 'all' ? items.length : items.filter(i => (i.type || 'image') === key).length}
              </span>
            </button>
          ))}
        </div>

        {/* Search + Sort */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 dark:text-gray-500 text-slate-400" />
            <input
              type="text"
              placeholder="Search saved..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-2 rounded-xl text-xs dark:bg-white/[0.04] bg-white border dark:border-white/[0.07] border-slate-200 dark:text-gray-300 text-slate-700 placeholder:dark:text-gray-600 placeholder:text-slate-400 focus:outline-none focus:dark:border-white/15 focus:border-indigo-300 w-44 transition-all duration-200"
            />
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSort(!showSort)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium dark:bg-white/[0.04] bg-white border dark:border-white/[0.07] border-slate-200 dark:text-gray-400 text-slate-500 dark:hover:bg-white/[0.07] hover:bg-indigo-50 hover:text-indigo-600 dark:hover:text-gray-200 transition-all duration-200"
            >
              <SlidersHorizontal size={12} />
              {SORT_OPTIONS.find(s => s.value === sortBy)?.label}
            </button>
            {showSort && (
              <div className="absolute right-0 top-10 z-20 rounded-xl dark:bg-[#1a1a1a] bg-white border dark:border-white/[0.08] border-slate-200 shadow-xl overflow-hidden min-w-36">
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => { setSortBy(opt.value); setShowSort(false) }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-medium transition-colors duration-150 ${
                      sortBy === opt.value
                        ? 'dark:bg-white/10 bg-indigo-50 dark:text-white text-indigo-700'
                        : 'dark:text-gray-400 text-slate-600 dark:hover:bg-white/5 hover:bg-slate-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results count */}
      {processed.length > 0 && (
        <p className="text-xs dark:text-gray-600 text-slate-400 mb-4 font-medium">
          Showing <span className="dark:text-gray-400 text-slate-600 font-semibold">{processed.length}</span> item{processed.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Grid */}
      {processed.length === 0 ? (
        items.length === 0 ? <EmptyState /> : (
          <div className="flex flex-col items-center py-16 gap-3 text-center">
            <Search size={32} className="dark:text-gray-700 text-slate-300" />
            <p className="dark:text-gray-500 text-slate-400 text-sm">No results for that filter / search</p>
          </div>
        )
      ) : (
        <div ref={gridRef} className="masonry-grid">
          {processed.map((item) => (
            <CollectionCard key={item.id || item._id} item={item} onRemove={onRemove} />
          ))}
        </div>
      )}
    </section>
  )
}

export default CollectionGrid
