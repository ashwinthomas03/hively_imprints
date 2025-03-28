import React from 'react';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Hively Imprints</h1>
          <p>High-quality custom print products for every occasion</p>
          <button className="cta-button" onClick={() => window.location.href = '/products'}>
            Shop Now
          </button>
        </div>
      </section>

      <section className="features-section">
        <h2>Why Choose Us</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>Custom Designs</h3>
            <p>Create personalized products with your unique designs</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Fast Shipping</h3>
            <p>Quick production and delivery to your doorstep</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💯</div>
            <h3>Quality Materials</h3>
            <p>Premium materials for lasting products</p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2>About Us</h2>
        <p>
          We are dedicated to providing high-quality custom printed products. 
          Our mission is to help you express your creativity through 
          personalized merchandise that stands out.
        </p>
      </section>
    </div>
  );
}

export default Home;
