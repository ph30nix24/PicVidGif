import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import Navbar from '../../../components/Navbar'
import UserProfile from '../components/UserProfile'
import CollectionGrid from '../components/CollectionGrid'
import { getSavedImages } from '../apis/collection.apis'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { setCollection, setLoading } from '../../../redux/features/collectionSlice'



const Collection = () => {
  const pageRef = useRef(null)

  const loading = useSelector((state) => state.collection.loading)
  const items = useSelector((state) => state.collection.items)
  const dispatch = useDispatch()



  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const result = await getSavedImages()
        dispatch(setCollection(result.data.items))
      } catch (e){
        // API not available – fall back to mock data for demo
        console.log(e.response?.data.message)
      } finally {
        dispatch(setLoading(false))
      }
    }
    fetchCollection()
  }, [])

  useEffect(() => {

    gsap.from(pageRef.current, { opacity: 0, duration: 0.5, ease: 'power2.out' })
  }, [])

  


  return (
    <div
      ref={pageRef}
      className="min-h-screen dark:bg-[#080808] bg-[#f0f1f7] transition-colors duration-300"
    >
      <Navbar />

      {/* Page wrapper */}
      <div className="max-w-350 mx-auto px-4 md:px-6 pt-28 pb-20">

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
            <CollectionGrid items={items}/>
          </>
        )}
      </div>
    </div>
  )
}

export default Collection