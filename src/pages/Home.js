import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState({
    hero: false,
    features: false,
    about: false,
    social: false
  });

  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const aboutRef = useRef(null);
  const socialRef = useRef(null);

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
          } else if (entry.target === socialRef.current) {
            setIsVisible(prev => ({ ...prev, social: true }));
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    if (featuresRef.current) observer.observe(featuresRef.current);
    if (aboutRef.current) observer.observe(aboutRef.current);
    if (socialRef.current) observer.observe(socialRef.current);

    return () => {
      if (featuresRef.current) observer.unobserve(featuresRef.current);
      if (aboutRef.current) observer.unobserve(aboutRef.current);
      if (socialRef.current) observer.unobserve(socialRef.current);
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

  // Handle navigation to Collection page
  const handleExploreCollection = () => {
    const collectionSection = document.getElementById('collection');
    if (collectionSection) {
      collectionSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle smooth scroll to About section
  const handleLearnMore = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      window.scrollTo({
        top: aboutSection.offsetTop - 80, // Offset for navbar height
        behavior: 'smooth'
      });
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
        id="home"
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
            onClick={handleExploreCollection}
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
        id="features"
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
        id="collection"
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
              <img src="WeddingCard.png" alt="Elegant Invitations" className="category-image-content" />
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
                <img src="/GiftBox.png" alt="Custom Gift Boxes" className="category-image-content" />
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
        id="about"
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
              onClick={handleLearnMore}
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

      {/* Combined Instagram & Contact Section */}


{/* Contact Section */}

{/* Contact Section */}
<motion.section 
  className="contact-section" 
  id="contact"
  ref={socialRef}
  initial={{ opacity: 0, y: 50 }}
  animate={isVisible.social ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
  transition={{ duration: 0.8 }}
>
  <div className="contact-header">
    <h5 className="get-in-touch">GET IN TOUCH</h5>
    <h2 className="contact-title">Contact Me</h2>
    <div className="title-underline"></div>
  </div>

  <div className="contact-container">
    <motion.div 
      className="contact-info-column"
      initial={{ opacity: 0, x: -30 }}
      animate={isVisible.social ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <h2 className="connect-heading">Let's Connect</h2>
      <p className="connect-text">
        Feel free to reach out if you're looking for custom designs, 
        have a question, or just want to connect.
      </p>
      
      <div className="contact-details">
        <div className="contact-detail-item">
          <div className="contact-icon-circle email-circle">
            <i className="fas fa-envelope"></i>
          </div>
          <div className="contact-detail-content">
            <h4>Email: <p>hivelyimprints@gmail.com</p></h4>
          </div>
        </div>
        
        <div className="contact-detail-item">
          <div className="contact-icon-circle location-circle">
            <i className="fas fa-map-marker-alt"></i>
          </div>
          <div className="contact-detail-content">
            <h4>Location: <p>New York, NY</p></h4>
            
          </div>
        </div>
      </div>
      
      <div className="social-media-section">
        <h5 className="social-heading">Follow Us</h5>
        <div className="social-icons-container">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon-link" aria-label="Instagram">
            <div className="social-icon-circle">
              <i className="fab fa-instagram"></i>
            </div>
          </a>
          
          <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="social-icon-link" aria-label="Pinterest">
            <div className="social-icon-circle">
              <i className="fab fa-pinterest-p"></i>
            </div>
          </a>
          
          <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="social-icon-link" aria-label="TikTok">
            <div className="social-icon-circle">
              <i className="fab fa-tiktok"></i>
            </div>
          </a>
          
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon-link" aria-label="Facebook">
            <div className="social-icon-circle">
              <i className="fab fa-facebook-f"></i>
            </div>
          </a>
        </div>
      </div>
    </motion.div>
    
    <motion.div 
      className="contact-form-column"
      initial={{ opacity: 0, x: 30 }}
      animate={isVisible.social ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <h2 className="form-heading">Send Me a Message</h2>
      
      <form className="contact-form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <div className="input-container">
            <i className="fas fa-user input-icon"></i>
            <input 
              type="text" 
              id="name" 
              name="name" 
              placeholder="Your name" 
              required 
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <div className="input-container">
            <i className="fas fa-envelope input-icon"></i>
            <input 
              type="email" 
              id="email" 
              name="email" 
              placeholder="Your email" 
              required 
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <div className="input-container textarea-container">
            <i className="fas fa-comment-alt input-icon textarea-icon"></i>
            <textarea 
              id="message" 
              name="message" 
              placeholder="Your message" 
              rows="5" 
              required
            ></textarea>
          </div>
        </div>
        
        <motion.button 
          type="submit" 
          className="send-message-btn"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <i className="fas fa-paper-plane"></i>
          Send Message
        </motion.button>
      </form>
    </motion.div>
  </div>
</motion.section>
    </div>
  );
}

export default Home;