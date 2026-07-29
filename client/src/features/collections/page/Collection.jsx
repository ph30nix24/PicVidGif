import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import Navbar from '../../../components/Navbar'
import UserProfile from '../components/UserProfile'
import CollectionGrid from '../components/CollectionGrid'
import { getSavedImages } from '../apis/collection.apis'
import { Loader2 } from 'lucide-react'

const MOCK_ITEMS = [
  {
    id: 'm1', type: 'image', alt: 'Mountain landscape at sunrise',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
    savedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'm2', type: 'image', alt: 'Neon city street at night',
    url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80',
    savedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 'm3', type: 'image', alt: 'Tropical beach with turquoise water',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
    savedAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: 'm4', type: 'image', alt: 'Autumn forest path',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80',
    savedAt: new Date(Date.now() - 345600000).toISOString(),
  },
  {
    id: 'm5', type: 'image', alt: 'Abstract gradient art',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80',
    savedAt: new Date(Date.now() - 432000000).toISOString(),
  },
  {
    id: 'm6', type: 'image', alt: 'Snowy mountain peak',
    url: 'https://images.unsplash.com/photo-1491555103944-7c647fd857e6?w=600&q=80',
    savedAt: new Date(Date.now() - 518400000).toISOString(),
  },
  {
    id: 'm7', type: 'gif', alt: 'Animated wave loop',
    url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&q=80',
    savedAt: new Date(Date.now() - 604800000).toISOString(),
  },
  {
    id: 'm8', type: 'image', alt: 'Cozy coffee shop interior',
    url: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=600&q=80',
    savedAt: new Date(Date.now() - 691200000).toISOString(),
  },
]


const Collection = () => {
  const pageRef = useRef(null)
  const [items, setItems]           = useState([])
  const [loading, setLoading]       = useState(true)



  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const data = await getSavedImages()
        setItems(data?.items || data?.saved || [])
      } catch {
        // API not available – fall back to mock data for demo
        setItems(MOCK_ITEMS)
      } finally {
        setLoading(false)
      }
    }
    fetchCollection()
  }, [])

  useEffect(() => {
    gsap.from(pageRef.current, { opacity: 0, duration: 0.5, ease: 'power2.out' })
  }, [])

  const handleRemove = (id) => {
    setItems(prev => prev.filter(i => (i.id || i._id) !== id))
  }

  return (
    <div
      ref={pageRef}
      className="min-h-screen dark:bg-[#080808] bg-[#f0f1f7] transition-colors duration-300"
    >
      <Navbar />

      {/* Page wrapper */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 pt-28 pb-20">

        {/* Demo banner */}
        

        {/* Loading skeleton */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 size={40} className="animate-spin dark:text-gray-600 text-indigo-400" />
            <p className="text-sm dark:text-gray-600 text-slate-400 font-medium">Loading your collection…</p>
          </div>
        ) : (
          <>
            {/* User profile + stats */}
            <UserProfile />

            {/* Section heading */}
            <p className="text-xs font-bold uppercase tracking-widest dark:text-gray-600 text-slate-400 mb-5">
              Saved Media
            </p>

            {/* Grid */}
            <CollectionGrid items={items} onRemove={handleRemove} />
          </>
        )}
      </div>
    </div>
  )
}

export default Collection