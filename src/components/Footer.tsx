
import React, { useState, useEffect } from 'react';
import { Github } from 'lucide-react';

const Footer = () => {
  const [visible, setVisible] = useState(true);
  const [scrollingUp, setScrollingUp] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingUp = currentScrollY < lastScrollY;
      
      // Set scrolling direction state
      setScrollingUp(isScrollingUp);
      
      // When close to bottom of page or scrolling up, show footer
      const isAtBottom = window.innerHeight + currentScrollY >= document.body.offsetHeight - 100;
      
      if (isAtBottom || isScrollingUp) {
        setVisible(true);
      } else if (currentScrollY > 100 && !isAtBottom) {
        setVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <footer className={`bg-gradient-to-r from-black/70 via-black/80 to-black/70 backdrop-blur-md text-[#9b87f5] py-6 mt-auto transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 flex items-center gap-2">
            {/* Empty div to maintain layout */}
          </div>
          <div className="flex flex-col items-center space-y-2">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="GitHub"
              className="group flex flex-col items-center"
            >
              <Github className="h-5 w-5 text-[#6E59A5] group-hover:text-[#9b87f5] transition-colors" />
              <span className="text-xs text-[#7E69AB] mt-1">Made by Mayonese</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
