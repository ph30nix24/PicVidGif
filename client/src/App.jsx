import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RouterProvider } from 'react-router';
import { routes } from './app.routes';

gsap.registerPlugin(ScrollTrigger);


const App = () => {
  
  return (
    <main className='w-full min-h-screen'>
      <RouterProvider router={routes} />
    </main>
  )
}

export default App