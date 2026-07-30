import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Search, Image, Video, Smile } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTab, setImageResults, setLoading, setQuary, setVideoResults, setGifResults } from '../../../redux/features/searchSlice';
import { getImages, getRandomImages } from '../../../apis/mediaApis';
import Loader from '../../../components/Loader'
import { getPopular, getVideos } from '../../../apis/videoApis';

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
  const [text, setText] = useState('');
  const dispatch = useDispatch();
  const activeFilter = useSelector((state) => state.search.activeTab);
  const loading = useSelector((state) => state.search.loading);


  useEffect(() => {
    const fetchImages = async () => {
      dispatch(setLoading(true))
      try {

        const data = await getRandomImages();
        dispatch(setImageResults(data));
        const vData = await getPopular()
        dispatch(setVideoResults(vData.videos));
      } catch (error) {
        console.log(error.message);
      }
      finally {
        dispatch(setLoading(false))
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    if (loading) return;
    const tl = gsap.timeline({ delay: 0.3 });

    tl.fromTo(headingRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    );
    tl.fromTo(subRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
      '-=0.4'
    );
    tl.fromTo(searchRef.current,
      { y: 30, opacity: 0, scale: 0.97 },
      { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' },
      '-=0.3'
    );
    tl.fromTo(filtersRef.current.children,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'power2.out' },
      '-=0.3'
    );

    // Floating animation for search bar
    gsap.to(searchRef.current, {
      y: -4, duration: 0.5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.5,
    });
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center dark:bg-[#080808] bg-gray-50 dark:text-gray-400 text-gray-500 text-sm font-medium">
        <Loader />
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setQuary(text));
    dispatch(setLoading(true))
    try {
      let data;
      switch (activeFilter) {
        case "videos":
          data = await getVideos(text);
          dispatch(setVideoResults(data.videos));
          
          break;
        // case "gif":
        //   data = await getGifs(text);
        //   dispatch(setGifResults(data.results));
        //   break;
        case "image":
        default:
          data = await getImages(text);
          dispatch(setImageResults(data.results));
          break;
      }
    } catch (error) {
      console.log(error.message);
    }
    finally {
      dispatch(setLoading(false))
    }
  };

  const handleFilterClick = (id) => {
    dispatch(setActiveTab(id));
    gsap.fromTo(`#filter-${id}`, { scale: 0.92 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' });
  };

  return (
    <section className="relative flex flex-col items-center justify-center pt-36 pb-8 px-4 z-10">

      {/* Background radial glow — subtle in both modes */}
      <div
        className="absolute inset-0 pointer-events-none dark:[background:radial-gradient(ellipse_60%_40%_at_50%_20%,rgba(80,80,80,0.07)_0%,transparent_70%)] [background:radial-gradient(ellipse_60%_40%_at_50%_20%,rgba(99,102,241,0.06)_0%,transparent_70%)]"
      />
      <div
        className="absolute top-16 left-1/4 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)', filter: 'blur(40px)' }}
      />
      <div
        className="absolute top-24 right-1/4 w-60 h-60 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(129,140,248,0.04) 0%, transparent 70%)', filter: 'blur(50px)' }}
      />

      {/* Heading */}
      <h1
        ref={headingRef}
        className="text-4xl md:text-5xl lg:text-6xl font-black text-center leading-tight mb-3 tracking-tight"
      >
        <span className="dark:text-white text-gray-900">Search. </span>
        <span className="gradient-text">Discover.</span>
        <span className="dark:text-white text-gray-900"> Download.</span>
      </h1>

      {/* Subtitle */}
      <p
        ref={subRef}
        className="dark:text-gray-400 text-slate-500 text-base md:text-lg text-center mb-10 max-w-lg font-normal"
      >
        Millions of high-quality images, videos &amp; GIFs at your fingertips.
      </p>

      {/* Search Bar */}
      <div
        ref={searchRef}
        className={`w-full max-w-2xl relative flex items-center rounded-full border transition-all duration-300 ${searchFocused
            ? 'search-border dark:bg-[#111111] bg-white dark:border-gray-500 border-indigo-400 shadow-lg dark:shadow-black/20 shadow-indigo-100'
            : 'dark:border-gray-700 border-slate-200 dark:bg-[#111111]/80 bg-white shadow-sm shadow-slate-100 dark:shadow-gray-900'
          }`}
        style={{ minHeight: 56, zIndex: 20 }}
      >
        {/* Search icon */}
        <div className="pl-5 pr-3 shrink-0">
          <Search
            size={20}
            className={`transition-colors duration-200 ${searchFocused ? 'dark:text-gray-300 text-indigo-500' : 'dark:text-gray-500 text-slate-400'
              }`}
          />
        </div>

        {/* Input */}
        <form className="w-full" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Search images, videos, GIFs..."
            value={text}
            className="flex-1 bg-transparent dark:text-white text-slate-900 text-sm md:text-base dark:placeholder-gray-500 placeholder-slate-400 outline-none py-4 w-full"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </form>
      </div>

      {/* Filter Tabs */}
      <div ref={filtersRef} className="flex items-center gap-2 mt-6 flex-wrap justify-center">
        {FILTERS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            id={`filter-${id}`}
            onClick={() => handleFilterClick(id)}
            className={`filter-tab flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 cursor-pointer ${activeFilter === id
                ? 'dark:bg-gray-700 bg-indigo-600 dark:border-gray-500 border-indigo-500 text-white dark:shadow-black/40 shadow-indigo-500/25 shadow-md'
                : 'dark:bg-white/5 bg-white dark:border-white/10 border-slate-200 dark:text-gray-300 text-slate-600 dark:hover:border-gray-500/60 hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50'
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
