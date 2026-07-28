import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router';
import { routes } from './app.routes';
import { ThemeProvider } from './context/ThemeContext';
import Loader from './components/Loader';
import { getUser } from './features/auth/apis/auth.apis';
import { useDispatch } from 'react-redux';
import { setUser } from './redux/features/authSlice';

gsap.registerPlugin(ScrollTrigger);

const App = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch()
  useEffect(() => {
    async function getCurrentUser() {
      try {
        const res = await getUser();
        dispatch(setUser(res.data))
        console.log(res.data)
      } catch(e) {
        console.log(e)
      }
    }
    getCurrentUser();
  }, [])

  return (
    <ThemeProvider>
      {loading && <Loader onComplete={() => setLoading(false)} />}
      <main className='w-full min-h-screen'>
        <RouterProvider router={routes} />
      </main>
    </ThemeProvider>
  );
};

export default App;