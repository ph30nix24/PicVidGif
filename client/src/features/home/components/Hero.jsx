import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Search, Image, Video, Smile } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTab, setQuary, setResults } from '../../../redux/features/searchSlice';
import { getImages, getRandomImages } from '../../../apis/mediaApis';

const FILTERS = [
  { id: 'images', label: 'Images', icon: Image },
  { id: 'videos', label: 'Videos', icon: Video },
  { id: 'gifs', label: 'GIFs', icon: Smile },
];

const Hero = () => {
  const headingRef = useRef(null);
  const subRef = useRef(null);
  const searchRef = useRef(null);
  const filtersRef = useRef(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [text, setText] = useState('')
  const dispatch = useDispatch()
  const activeFilter = useSelector((state) => state.search.activeTab)
  const loading = useSelector((state) => state.search.loading)
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await getRandomImages();
        dispatch(setResults(data));
        console.log(data)
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    if (loading) return;
    const tl = gsap.timeline({ delay: 0.3 });

    // Heading split animation
    tl.fromTo(
      headingRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    );

    tl.fromTo(
      subRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
      '-=0.4'
    );

    tl.fromTo(
      searchRef.current,
      { y: 30, opacity: 0, scale: 0.97 },
      { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' },
      '-=0.3'
    );

    tl.fromTo(
      filtersRef.current.children,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'power2.out' },
      '-=0.3'
    );

    // Floating animation for the search bar
    gsap.to(searchRef.current, {
      y: -4,
      duration: 0.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 1.5,
    });
  }, []);

  if(loading) {
    return (
      <div className='w-full h-screen'>
        Loading
      </div>
    )
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(setQuary(text))
    try {
      const data = await getImages(text);
      dispatch(setResults(data.results))
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleFilterClick = (id) => {
    dispatch(setActiveTab(id))
    // Animate the active filter indicator
    gsap.fromTo(
      `#filter-${id}`,
      { scale: 0.92 },
      { scale: 1, duration: 0.3, ease: 'back.out(2)' }
    );
  };

  if(loading) {
    return (
      <main className='w-full h-screen '>
        Loading
      </main>
    )
  }

  return (
    <section className="relative flex flex-col items-center justify-center pt-36 pb-8 px-4 z-10">
      {/* Background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 20%, rgba(139,92,246,0.12) 0%, transparent 70%)',
        }}
      />

      {/* Animated orbs */}
      <div
        className="absolute top-16 left-1/4 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="absolute top-24 right-1/4 w-60 h-60 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(168,85,247,0.05) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />

      {/* Heading */}
      <h1
        ref={headingRef}
        className="text-4xl md:text-5xl lg:text-6xl font-black text-center leading-tight mb-3 tracking-tight"
      >
        <span className="text-white">Search. </span>
        <span className="gradient-text">Discover.</span>
        <span className="text-white"> Download.</span>
      </h1>

      {/* Subtitle */}
      <p
        ref={subRef}
        className="text-gray-400 text-base md:text-lg text-center mb-10 max-w-lg font-normal"
      >
        Millions of high-quality images, videos &amp; GIFs at your fingertips.
      </p>

      {/* Search Bar */}
      <div
        ref={searchRef}
        className={`w-full max-w-2xl relative flex items-center rounded-full border transition-all duration-300 ${searchFocused
          ? 'search-glow search-border bg-[#13131f] border-purple-500'
          : 'border-purple-500/50 bg-[#13131f]/80'
          }`}
        style={{ minHeight: 56, zIndex: 20 }}
      >
        {/* Search icon */}
        <div className="pl-5 pr-3 shrink-0">
          <Search
            size={20}
            className={`transition-colors duration-200 ${searchFocused ? 'text-purple-400' : 'text-gray-500'
              }`}
          />
        </div>

        {/* Input */}
        <form className='w-full' onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Search images, videos, GIFs..."
            value={text}
            className="flex-1 bg-transparent text-white text-sm md:text-base placeholder-gray-500 outline-none py-4 w-full"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </form>

      </div>

      {/* Filter Tabs */}
      <div
        ref={filtersRef}
        className="flex items-center gap-2 mt-6 flex-wrap justify-center"
      >
        {FILTERS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            id={`filter-${id}`}
            onClick={() => handleFilterClick(id)}
            className={`filter-tab flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 cursor-pointer ${activeFilter === id
              ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/25'
              : 'bg-white/5 border-white/10 text-gray-300 hover:border-purple-500/40 hover:text-white'
              }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>
    </section>
  );
};

export default Hero;
