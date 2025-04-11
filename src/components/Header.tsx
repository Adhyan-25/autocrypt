
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  titleRef?: React.RefObject<HTMLHeadingElement>;
}

const Header: React.FC<HeaderProps> = ({ titleRef }) => {
  const [visible, setVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  useEffect(() => {
    if (!titleRef?.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When title is NOT visible (out of view), show header
        const shouldShow = !entry.isIntersecting;
        
        if (shouldShow !== visible) {
          if (shouldShow) {
            // Title just went out of view, show header immediately with swift transition
            setIsTransitioning(true);
            setTimeout(() => {
              setVisible(true);
            }, 50); // Much shorter delay for swifter appearance
          } else {
            // Title came back into view, hide header immediately
            setVisible(false);
            setIsTransitioning(false);
          }
        }
      },
      {
        rootMargin: '-5px 0px 0px 0px', // Just slightly above the viewport for faster trigger
        threshold: 0.2 // Trigger sooner when scrolling
      }
    );
    
    observer.observe(titleRef.current);
    
    return () => {
      if (titleRef.current) observer.unobserve(titleRef.current);
    };
  }, [titleRef, visible]);

  return (
    <header className={`bg-black/90 backdrop-blur-md text-[#9b87f5] p-4 sticky top-0 z-50 transition-all duration-300 ${!visible ? 'opacity-0 -translate-y-full' : 'opacity-100 translate-y-0'} ${isTransitioning ? 'pointer-events-none' : ''}`}>
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
          <span className="text-gradient-purple glow-text">
            AUTO<span className="text-[#D6BCFA]">CRYP</span>
          </span>
        </Link>
        <nav>
          <ul className="flex gap-6">
            <li>
              <Link to="/" className="hover:text-[#D6BCFA] transition-colors flex items-center gap-1 relative group">
                <span>Home</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D6BCFA]/70 transition-all group-hover:w-full"></span>
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-[#D6BCFA] transition-colors flex items-center gap-1 relative group">
                <span>About</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D6BCFA]/70 transition-all group-hover:w-full"></span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
