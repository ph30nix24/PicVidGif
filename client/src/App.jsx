import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useState } from 'react';
import { RouterProvider } from 'react-router';
import { routes } from './app.routes';
import { ThemeProvider } from './context/ThemeContext';
import Loader from './components/Loader';

gsap.registerPlugin(ScrollTrigger);

const App = () => {
  const [loading, setLoading] = useState(true);

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