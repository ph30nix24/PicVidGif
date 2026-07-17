import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Home from './pages/Home';

gsap.registerPlugin(ScrollTrigger);


const App = () => {
  
  return (
    <main className='w-full min-h-screen'>
      <Home />
    </main>
  )
}

export default App