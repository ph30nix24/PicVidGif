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
import ToastContainer from './components/Toast/ToastContainer'
import wakeServer from './utils/wakeServer';
gsap.registerPlugin(ScrollTrigger);

const App = () => {
  const [loading, setLoading] = useState(true);
  const [serverStatus, setServerStatus] = useState('checking');
  const dispatch = useDispatch()

  useEffect(() => {
    wakeServer(import.meta.env.VITE_BACKEND_URI).then((ok) => {
      setServerStatus(ok ? 'ready' : 'failed');
    });
  }, []);

  useEffect(() => {
    async function getCurrentUser() {
      try {
        const res = await getUser();
        dispatch(setUser(res.data))
      } catch(e) {
        console.log(e)
      }
    }
    getCurrentUser();
  }, [])

  if (serverStatus === 'checking') {
    return (
      <Loader />
    );
  }

  if (serverStatus === 'failed') {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-3">
        <p>Couldn't reach the server. Please refresh in a moment.</p>
        <button onClick={() => setServerStatus('checking')}>Retry</button>
      </div>
    );
  }

  return (
    <ThemeProvider>
      {loading && <Loader onComplete={() => setLoading(false)} />}
      <main className='w-full min-h-screen'>
        <ToastContainer />
        <RouterProvider router={routes} />
      </main>
    </ThemeProvider>
  );
};

export default App;