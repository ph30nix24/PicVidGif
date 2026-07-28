import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RouterProvider } from 'react-router';
import { routes } from './app.routes';
import { ThemeProvider } from './context/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

const App = () => {
  return (
    <ThemeProvider>
      <main className='w-full min-h-screen'>
        <RouterProvider router={routes} />
      </main>
    </ThemeProvider>
  );
};

export default App;