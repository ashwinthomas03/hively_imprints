import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import './Home.css';

function Home() {
  const [isVisible, setIsVisible] = useState({
    hero: false,
    features: false,
    about: false
  });

  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const aboutRef = useRef(null);

  useEffect(() => {
    // Set hero visible immediately
    setIsVisible(prev => ({ ...prev, hero: true }));

    const observerOptions = {
      threshold: 0.2
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target === featuresRef.current) {
            setIsVisible(prev => ({ ...prev, features: true }));
          } else if (entry.target === aboutRef.current) {
            setIsVisible(prev => ({ ...prev, about: true }));
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    if (featuresRef.current) observer.observe(featuresRef.current);
    if (aboutRef.current) observer.observe(aboutRef.current);

    return () => {
      if (featuresRef.current) observer.unobserve(featuresRef.current);
      if (aboutRef.current) observer.unobserve(aboutRef.current);
    };
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <div className="home-container">
      {/* Hero Section with Parallax Effect */}
      <motion.section 
        className="hero-section"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ 
          opacity: isVisible.hero ? 1 : 0, 
          scale: isVisible.hero ? 1 : 0.9 
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        ref={heroRef}
      >
        <div className="hero-parallax"></div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className="logo-container">
            <div className="logo-text">
              <img src="/logo192.png" alt="Hively Imprints Logo" className="logo-image" />
            </div>
          </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Hively Imprints
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            "Design that speaks, Imprints that last"
          </motion.p>
          
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            Your go-to destination for custom designs, planning, and creative inspiration
          </motion.p>
          
          <motion.button 
            className="cta-button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            whileHover={{ scale: 1.05, backgroundColor: "#3a8a3e" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/Our collection'}
          >
            Explore Our Collection
          </motion.button>
        </div>
      </motion.section>

      {/* Features Section with Staggered Animation */}
      <motion.section 
        className="features-section"
        variants={containerVariants}
        initial="hidden"
        animate={isVisible.features ? "visible" : "hidden"}
        ref={featuresRef}
      >
        <motion.h2 
          variants={itemVariants}
          className="section-title"
        >
          Why Choose Hively Imprints
        </motion.h2>
        
        <div className="features-grid">
          <motion.div 
            className="feature-card"
            variants={itemVariants}
            whileHover={{ 
              y: -10, 
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
              backgroundColor: "#f9f9f9"
            }}
          >
            <div className="feature-icon-container">
              <div className="feature-icon">🎨</div>
            </div>
            <h3>Elegant Design</h3>
            <p>Beautifully handcrafted products with attention to detail and artistic touch</p>
          </motion.div>
          
          <motion.div 
            className="feature-card"
            variants={itemVariants}
            whileHover={{ 
              y: -10, 
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
              backgroundColor: "#f9f9f9"
            }}
          >
            <div className="feature-icon-container">
              <div className="feature-icon">✨</div>
            </div>
            <h3>Personalized Service</h3>
            <p>Custom designs tailored to match your unique style and vision</p>
          </motion.div>

          
          
          <motion.div 
            className="feature-card"
            variants={itemVariants}
            whileHover={{ 
              y: -10, 
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
              backgroundColor: "#f9f9f9"
            }}
          >
            <div className="feature-icon-container">
              <div className="feature-icon">💯</div>
            </div>
            <h3>Premium Quality</h3>
            <p>Finest materials and craftsmanship for products that truly last</p>
          </motion.div>
        </div>
      </motion.section>

      {/* Product Categories */}
      <motion.section 
        className="product-categories-section"
        variants={containerVariants}
        initial="hidden"
        animate={isVisible.features ? "visible" : "hidden"}
        transition={{ delay: 0.3 }}
      >
        <motion.h2 
          variants={itemVariants}
          className="section-title"
        >
          Our Collection
        </motion.h2>
        
        <div className="categories-grid">
          <motion.div 
            className="category-card"
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
          >
              <div className="category-image">
                <img src="/WeddingCard.png" alt="Elegant Invitations" className="category-image-content" />
              </div>            
              <div className="category-overlay">
              <h3>Elegant Invitations</h3>
              <button 
                className="category-btn" 
                onClick={() => window.open('https://rb.gy/npfcbj')}
              >
                View Collection
              </button>            
              </div>
          </motion.div>
          
          <motion.div 
            className="category-card"
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
          >
            <div className="category-image-gift">
                <img src="/GiftBox.png" alt="Elegant Invitations" className="category-image-content" />
              </div>   
            <div className="category-overlay">
              <h3>Custom Gift Boxes</h3>
              <button 
                className="category-btn" 
                onClick={() => window.open('https://rb.gy/npfcbj')}
              >
                View Collection
              </button>     
            </div>
          </motion.div>
          
          <motion.div 
            className="category-card"
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
          >
            <div className="category-image decor-image"></div>
            <div className="category-overlay">
              <h3>Templates</h3>
              <button 
                className="category-btn" 
                onClick={() => window.open('https://hively-imprints.printify.me/')}
              >
                View Collection
              </button>     
            </div>
          </motion.div>

          <motion.div 
            className="category-card"
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
          >
            <div className="category-image decor-image"></div>
            <div className="category-overlay">
              <h3>Digital Designs</h3>
              <button 
                className="category-btn" 
                onClick={() => window.open('https://hively-imprints.printify.me/')}
              >
                View Collection
              </button>     
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* About Section with Fade-in */}
      <motion.section 
        className="about-section"
        initial={{ opacity: 0, y: 50 }}
        animate={isVisible.about ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
        ref={aboutRef}
      >
        <div className="about-container">
          <div className="about-content">
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={isVisible.about ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="section-title"
            >
              Our Story
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={isVisible.about ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              At Hively Imprints, we're dedicated to creating beautiful, handcrafted products that tell a story. 
              Our journey began with a passion for elegant design and a commitment to quality craftsmanship.
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={isVisible.about ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              Today, we continue to bring creative visions to life through personalized merchandise 
              that stands out. Each piece we create is crafted with love and attention to detail, 
              ensuring that your special moments are captured in a way that will be cherished forever.
            </motion.p>
            
            <motion.button 
              className="learn-more-btn"
              initial={{ opacity: 0 }}
              animate={isVisible.about ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More About Us
            </motion.button>
          </div>
          <div className="about-image-container">
            <motion.div 
              className="about-image"
              initial={{ opacity: 0, x: 50 }}
              animate={isVisible.about ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <img src="logo192.png" alt="About Us" className="about-image-content" />

            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Instagram Section */}
      <section className="instagram-section">
        <h2 className="section-title">Follow Our Journey</h2>
        <p className="instagram-caption">@hivelyimprints</p>
        <div className="instagram-grid">
          <div className="instagram-item"></div>
          <div className="instagram-item"></div>
          <div className="instagram-item"></div>
          <div className="instagram-item"></div>
        </div>
      </section>
    </div>
  );
}

export default Home;