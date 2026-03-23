import { useEffect } from 'react';
import './animations.css';
import './App.css'
import Navbar from './components/Navbar'
import Mask from './components/Mask';
import HomeBody from './components/HomeBody';
import ContactBody from './components/ContactBody';

function App() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); //animations play once
        }
      });
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 0.15 // Triggers when 15% of the element is visible
    });

    const hiddenElements = document.querySelectorAll('.scroll-animate');
    hiddenElements.forEach((el) => observer.observe(el));


    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navbar />
      <Mask />
      <HomeBody />
      <ContactBody />
    </>
  )
}

export default App
