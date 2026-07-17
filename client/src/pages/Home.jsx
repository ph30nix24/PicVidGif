import gsap from 'gsap';
import { useEffect, useRef  } from 'react';
import Navbar from './components/Navbar';

const Home = () => {
    const appRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('body', {
                opacity: 0,
                duration: 0.5,
                ease: 'power2.out',
            });
        }, appRef);

        return () => ctx.revert();
    }, []);


    return (
        <div ref={appRef} className='min-h-screen bg-linear-to-b from-[#0a0a0f] to-[#080810]'>
            <Navbar />
        </div>
    )
}

export default Home