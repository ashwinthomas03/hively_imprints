import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import SplashScreen from './SplashScreen';
import emailjs from '@emailjs/browser';
emailjs.init("c60WYXJLshSycWcGj");

// Create a separate collection page component
const Collection = () => (
  <div className="page-container">
    <h1>Our Collection</h1>
    <p>Browse our collection of custom designs and products.</p>
  </div>
);

// Main App component with NavLinks
function AppContent() {
  const location = useLocation();
  
  // Scroll to section function
  const scrollToSection = (sectionId) => {
    // If we're not on the home page, navigate to home first
    if (location.pathname !== '/') {
      window.location.href = `#/${sectionId}`;
      return;
    }
    
    // If we're already on the home page, just scroll to the section
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80, // Offset for navbar height
        behavior: 'smooth'
      });
    } else if (sectionId === 'home') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };
  
  // Add scroll highlight effect
  useEffect(() => {
    // Only run this effect if we're on the home page
    if (location.pathname !== '/') return;
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      
      // Get all sections with IDs
      const sections = ['home', 'features', 'collection', 'about', 'contact'].map(id => {
        const element = document.getElementById(id);
        if (!element) return { id, top: 0, bottom: 0 };
        
        const rect = element.getBoundingClientRect();
        return {
          id,
          top: rect.top + scrollPosition - 100, // Adjust for navbar offset
          bottom: rect.bottom + scrollPosition - 100
        };
      }).filter(section => section.top && section.bottom);
      
      // Find the current section in view
      const currentSection = sections.find(section => 
        scrollPosition >= section.top && scrollPosition < section.bottom
      );
      
      // Remove 'in-view' class from all navigation links
      const navLinks = document.querySelectorAll('.nav-links');
      navLinks.forEach(link => {
        link.classList.remove('in-view');
      });
      
      // Add 'in-view' class to the current section's navigation link
      if (currentSection) {
        const sectionMap = {
          'home': 'home-link',
          'features': 'features-link',
          'collection': 'collection-link',
          'about': 'about-link',
          'contact': 'contact-link'
        };
        
        const linkId = sectionMap[currentSection.id];
        if (linkId) {
          const currentLink = document.getElementById(linkId);
          if (currentLink) {
            currentLink.classList.add('in-view');
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once to set initial state
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

  return (
    <div className="App">
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">Hively Imprints</Link>
          <ul className="nav-menu">
            <li className="nav-item">
              <a 
                id="home-link"
                className="nav-links" 
                onClick={() => scrollToSection('home')}
              >
                Home
              </a>
            </li>
            <li className="nav-item">
              {location.pathname === '/' ? (
                <a 
                  id="collection-link"
                  className="nav-links" 
                  onClick={() => scrollToSection('collection')}
                >
                  Our Collection
                </a>
              ) : (
                <Link to="/collection" className="nav-links">Our Collection</Link>
              )}
            </li>
            <li className="nav-item">
              <a 
                id="about-link"
                className="nav-links" 
                onClick={() => scrollToSection('about')}
              >
                About
              </a>
            </li>
            <li className="nav-item">
              <a 
                id="contact-link"
                className="nav-links" 
                onClick={() => scrollToSection('contact')}
              >
                Contact Us
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        {/* Add a catch-all redirect to home page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

// Wrapper component for HashRouter with splash screen
function App() {
  const [showSplash, setShowSplash] = useState(true);
  
  const handleSplashComplete = () => {
    setShowSplash(false);
  };
  
  return (
    <>
      {showSplash ? (
        <SplashScreen onComplete={handleSplashComplete} />
      ) : (
        <Router>
          <AppContent />
        </Router>
      )}
    </>
  );
}

export default App;