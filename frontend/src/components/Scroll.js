import React, { useState, useEffect } from 'react';
import { FaCaretSquareUp } from 'react-icons/fa';

const ScrollToTopButton = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight / 2) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  const scrollButtonStyle = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',  
    display: showScrollButton ? 'block' : 'none',
    zIndex: 999, 
    fontSize: "50px",
    color: "white",
    };




  return (
    <div>
      <FaCaretSquareUp
        className="scroll-to-top-button"
        style={scrollButtonStyle}
        onClick={scrollToTop}
      />
    </div>
  );
};

export default ScrollToTopButton;



