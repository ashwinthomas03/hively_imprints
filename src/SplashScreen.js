// SplashScreen.js - Final version with spacing fix
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './SplashScreen.css';

const SplashScreen = ({ onComplete }) => {
  const [animationComplete, setAnimationComplete] = useState(false);
  
  useEffect(() => {
    // Set a timeout to ensure the splash screen eventually completes
    const timer = setTimeout(() => {
      setAnimationComplete(true);
      setTimeout(() => {
        onComplete();
      }, 800); // Allow time for exit animation
    }, 5500); // Total animation duration
    
    return () => clearTimeout(timer);
  }, [onComplete]);
  
  return (
    <AnimatePresence>
      {!animationComplete && (
        <motion.div 
          className="splash-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { 
              duration: 0.8,
              ease: "easeInOut"
            }
          }}
          transition={{ duration: 0.5 }}
        >
          <div className="splash-content">
            {/* Logo animation without circle container */}
            <motion.div 
              className="logo-container"
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 1.2, 
                type: "spring",
                damping: 12 
              }}
            >
              <motion.img 
                src={`${process.env.PUBLIC_URL}/logo192.png`}
                alt="Hively Imprints Logo"
                className="logo-image"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              />
              
              <motion.div 
                className="logo-glow"
                animate={{ 
                  opacity: [0, 0.8, 0],
                  scale: [0.5, 1.0, 0.8]
                }}
                transition={{ 
                  repeat: 2,
                  duration: 1.5,
                  delay: 1
                }}
              />
            </motion.div>
            
            {/* Horizontal text animation with proper spacing */}
            <motion.div 
              className="text-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.8 }}
            >
              <motion.h1 className="company-name">
                {['H','i','v','e','l','y',' ','I','m','p','r','i','n','t','s'].map((letter, index) => (
                  <motion.span 
                    key={index}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: 2.0 + (index * 0.1),
                      duration: 0.4,
                      type: "spring",
                      stiffness: 100
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </motion.h1>
            </motion.div>
            
            {/* Tagline animation at the bottom with lines */}
            <motion.div 
              className="tagline-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.5, duration: 0.8 }}
            >
              <motion.div 
                className="tagline-line"
                initial={{ width: 0 }}
                animate={{ width: "120px" }}
                transition={{ delay: 3.7, duration: 0.6 }}
              />
              
              <motion.p 
                className="tagline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 4, duration: 0.5 }}
              >
                Design that speaks, Imprints that last
              </motion.p>
              
              <motion.div 
                className="tagline-line"
                initial={{ width: 0 }}
                animate={{ width: "120px" }}
                transition={{ delay: 3.7, duration: 0.6 }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;