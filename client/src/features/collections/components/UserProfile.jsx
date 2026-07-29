import { useSelector } from 'react-redux'
import { CalendarDays, TrendingUp } from 'lucide-react'
import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'


/* ── UserProfile ───────────────────────────────────────────────────────── */
const UserProfile = () => {
  const user = useSelector((state) => state.auth.user)
  const wrapRef   = useRef(null)
  const avatarRef = useRef(null)
  const textRef   = useRef(null)
  const statsRef  = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline()
    tl.fromTo(wrapRef.current,
      { opacity: 0, y: -16 },
      { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' }
    )
    tl.fromTo(avatarRef.current,
      { scale: 0.6, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' },
      '-=0.25'
    )
    tl.fromTo(textRef.current,
      { x: -16, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.45, ease: 'power2.out' },
      '-=0.3'
    )
    tl.fromTo(statsRef.current?.children ?? [],
      { y: 18, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.07, ease: 'power2.out' },
      '-=0.2'
    )
  }, [])

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U'

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : null

  return (
    <div ref={wrapRef} className="mb-10">

      {/* ── Avatar + name row ─────────────────────────────────── */}
      <div className="flex items-center gap-5 mb-8">
        {/* Avatar */}
        <div ref={avatarRef} className="relative shrink-0">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 dark:from-gray-500 dark:to-gray-700 flex items-center justify-center text-white text-xl font-black ring-4 dark:ring-white/5 ring-indigo-100 uppercase shadow-lg shadow-indigo-500/20 dark:shadow-none overflow-hidden">
            {user?.picture
              ? <img src={user?.avatar} alt={user.name} className="w-full h-full object-cover" />
              : initials
            }
          </div>
          {/* Online dot */}
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 dark:ring-[#080808] ring-[#f0f1f7]" />
        </div>

        {/* Name + meta */}
        <div ref={textRef}>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-black dark:text-white text-gray-900 tracking-tight leading-tight">
              {user?.name || 'Your Collection'}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
            {user?.email && (
              <span className="text-sm dark:text-gray-500 text-slate-400 font-normal">
                {user.email}
              </span>
            )}
            {joinDate && (
              <span className="flex items-center gap-1.5 text-sm dark:text-gray-600 text-slate-400">
                <CalendarDays size={12} />
                Joined {joinDate}
              </span>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}

export default UserProfile
