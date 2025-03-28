#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Print colored message
function echo_color() {
  echo -e "${2}${1}${NC}"
}

echo_color "=== Printify Pop-Up Store Scraper Setup ===" "$GREEN"
echo_color "This script will set up your React app and proxy server" "$GREEN"
echo

# Ask for Printify Pop-Up Store URL
read -p "Enter your Printify Pop-Up Store URL (e.g. https://your-store.printify.me): " POPUP_URL

if [ -z "$POPUP_URL" ]; then
  echo_color "Error: Printify Pop-Up Store URL is required" "$RED"
  exit 1
fi

echo
echo_color "=== Setting up Proxy Server ===" "$GREEN"

# Create proxy server directory
mkdir -p printify-scraper
cd printify-scraper

# Initialize npm project
echo_color "Initializing npm project..." "$YELLOW"
npm init -y

# Install dependencies
echo_color "Installing dependencies..." "$YELLOW"
npm install express axios cors cheerio

# Create server.js file
echo_color "Creating server.js file..." "$YELLOW"
cat > server.js << 'EOL'
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cheerio = require('cheerio');
const app = express();
const port = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors());

// Route to fetch and parse products from Printify Pop-Up Store
app.get('/fetch-printify-popup', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    console.log(`Fetching products from: ${url}`);

    // Fetch the HTML from the Printify Pop-Up store
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    // Parse the HTML to extract product information
    const html = response.data;
    const $ = cheerio.load(html);
    const products = [];

    // Log the structure for debugging
    console.log('Page loaded, finding product elements...');

    // Adjust these selectors based on the actual HTML structure of your Printify Pop-Up Store
    $('.product-item, .product-card, .product').each((index, element) => {
      console.log(`Processing product ${index + 1}`);
      
      // Try different possible selector combinations to find the right ones
      const title = $(element).find('.product-title, .title, h2, h3').first().text().trim();
      const description = $(element).find('.product-description, .description, p').first().text().trim();
      let priceText = $(element).find('.product-price, .price, .amount').first().text().trim();
      
      // Clean up price text and convert to cents
      priceText = priceText.replace(/[^\d.,]/g, '');
      priceText = priceText.replace(',', '.');
      const price = Math.round(parseFloat(priceText) * 100) || 0;
      
      // Find image URL
      let imageUrl = $(element).find('img').attr('src') || 
                     $(element).find('img').attr('data-src') || 
                     $(element).find('.product-image img').attr('src') || 
                     'https://via.placeholder.com/300x400';
                     
      // Some sites use relative URLs - make them absolute
      if (imageUrl && !imageUrl.startsWith('http')) {
        const baseUrl = new URL(url).origin;
        imageUrl = `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
      }
      
      // Get product URL
      let productUrl = $(element).find('a').attr('href') || '';
      if (productUrl && !productUrl.startsWith('http')) {
        const baseUrl = new URL(url).origin;
        productUrl = `${baseUrl}${productUrl.startsWith('/') ? '' : '/'}${productUrl}`;
      }

      console.log(`Found product: ${title} - ${priceText} - ${imageUrl.substring(0, 50)}...`);

      products.push({
        id: `popup-${index + 1}`,
        title: title || `Product ${index + 1}`,
        description: description || 'Custom printed product',
        image: imageUrl,
        price,
        url: productUrl
      });
    });

    console.log(`Total products found: ${products.length}`);

    // If no products were found with the initial selectors, try a more generic approach
    if (products.length === 0) {
      console.log('No products found with specific selectors. Trying generic approach...');
      
      // Find all elements that look like products (containing both an image and a price)
      $('div, li, article').each((index, element) => {
        const $el = $(element);
        
        // Skip if this element is nested inside another product element
        if ($el.parents('.product-item, .product-card, .product').length > 0) {
          return;
        }
        
        // Look for elements that have both an image and text that looks like a price
        const hasImage = $el.find('img').length > 0;
        const hasPriceText = $el.text().match(/\$\s*\d+\.?\d*/);
        
        if (hasImage && hasPriceText) {
          const title = $el.find('h1, h2, h3, h4, .title, .name').first().text().trim() || `Product ${index + 1}`;
          const description = $el.find('p, .description').first().text().trim() || 'Custom printed product';
          const priceMatch = $el.text().match(/\$\s*(\d+\.?\d*)/);
          const price = priceMatch ? Math.round(parseFloat(priceMatch[1]) * 100) : 0;
          const imageUrl = $el.find('img').attr('src') || 'https://via.placeholder.com/300x400';
          
          products.push({
            id: `popup-generic-${index + 1}`,
            title,
            description,
            image: imageUrl,
            price,
            url: ''
          });
          
          console.log(`Found generic product: ${title} - $${price/100} - ${imageUrl.substring(0, 50)}...`);
        }
      });
      
      console.log(`Total products found with generic approach: ${products.length}`);
    }

    res.json({ products });
  } catch (error) {
    console.error('Error fetching Printify Pop-Up Store:', error);
    res.status(500).json({ 
      error: 'Failed to fetch products from Printify Pop-Up Store',
      details: error.message 
    });
  }
});

app.listen(port, () => {
  console.log(`Proxy server running on port ${port}`);
  console.log(`Use http://localhost:${port}/fetch-printify-popup?url=YOUR_PRINTIFY_POPUP_URL`);
});
EOL

# Create start script
echo_color "Creating start script..." "$YELLOW"
cat > start.sh << 'EOL'
#!/bin/bash
node server.js
EOL

chmod +x start.sh

echo_color "Proxy server setup complete" "$GREEN"
echo_color "To start the server, run: cd printify-scraper && ./start.sh" "$GREEN"

# Go back to the original directory
cd ..

echo
echo_color "=== Updating React Components ===" "$GREEN"

# Create the pages directory if it doesn't exist
mkdir -p src/pages

# Create Products.js
echo_color "Creating Products.js..." "$YELLOW"
cat > src/pages/Products.js << EOL
import React, { useState, useEffect } from 'react';
import './Products.css';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch from Printify Pop-Up Store using proxy server
        const popupStoreUrl = 'http://localhost:5000/fetch-printify-popup?url=${POPUP_URL}';
        const response = await fetch(popupStoreUrl);
        
        if (!response.ok) {
          throw new Error(\`Pop-up store fetch error: \${response.status}\`);
        }
        
        const data = await response.json();
        setProducts(data.products);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error('Error fetching products from Pop-Up Store:', err);
      }
    };

    // Use actual Pop-up store fetching
    fetchProducts();
    
    // Uncomment for testing without actual fetching
    /*
    const mockProducts = [
      {
        id: '1',
        title: 'Custom T-Shirt',
        description: 'High-quality cotton t-shirt with your custom design',
        image: 'https://via.placeholder.com/300x400',
        price: 2499
      },
      // Add more mock products as needed
    ];
    
    setProducts(mockProducts);
    setLoading(false);
    */
  }, []);

  // Format price from cents to dollars
  const formatPrice = (price) => {
    return \`\$\${(price / 100).toFixed(2)}\`;
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="products-container">
      <h1 className="products-title">Our Products</h1>
      <p className="products-description">
        Browse our collection of high-quality custom print products from our Printify Pop-Up Store
      </p>
      
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img 
                src={product.image || 'https://via.placeholder.com/300x400'} 
                alt={product.title} 
              />
            </div>
            <div className="product-info">
              <h3 className="product-title">{product.title}</h3>
              <p className="product-description">{product.description}</p>
              <p className="product-price">{formatPrice(product.price || 0)}</p>
              <button className="add-to-cart-btn">Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
      
      {products.length === 0 && !loading && !error && (
        <div className="no-products">
          <p>No products found. Please check your connection settings.</p>
        </div>
      )}
    </div>
  );
}

export default Products;
EOL

# Create Products.css
echo_color "Creating Products.css..." "$YELLOW"
cat > src/pages/Products.css << 'EOL'
.products-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.products-title {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.products-description {
  text-align: center;
  margin-bottom: 40px;
  color: #666;
  font-size: 1.1rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
}

.product-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.product-image {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-info {
  padding: 20px;
}

.product-title {
  font-size: 1.3rem;
  margin-bottom: 10px;
  color: #333;
}

.product-description {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 15px;
  height: 40px;
  overflow: hidden;
}

.product-price {
  font-size: 1.4rem;
  font-weight: bold;
  color: #4CAF50;
  margin-bottom: 15px;
}

.add-to-cart-btn {
  width: 100%;
  padding: 10px 0;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-to-cart-btn:hover {
  background-color: #45a049;
}

.loading {
  text-align: center;
  padding: 50px;
  font-size: 1.5rem;
  color: #666;
}

.error {
  text-align: center;
  padding: 50px;
  font-size: 1.5rem;
  color: #f44336;
}

.no-products {
  text-align: center;
  padding: 50px;
  font-size: 1.2rem;
  color: #666;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-top: 30px;
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
  }
  
  .product-image {
    height: 200px;
  }
  
  .product-title {
    font-size: 1.1rem;
  }
  
  .product-price {
    font-size: 1.2rem;
  }
}
EOL

# Create a simple Home page
echo_color "Creating Home.js..." "$YELLOW"
cat > src/pages/Home.js << 'EOL'
import React from 'react';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Our Store</h1>
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
EOL

# Create Home.css
echo_color "Creating Home.css..." "$YELLOW"
cat > src/pages/Home.css << 'EOL'
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero-section {
  background-color: #f8f9fa;
  text-align: center;
  padding: 80px 20px;
  margin: 20px 0;
  border-radius: 10px;
}

.hero-content h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #333;
}

.hero-content p {
  font-size: 1.2rem;
  margin-bottom: 30px;
  color: #666;
}

.cta-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 12px 30px;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.cta-button:hover {
  background-color: #45a049;
}

.features-section {
  padding: 60px 0;
  text-align: center;
}

.features-section h2 {
  font-size: 2rem;
  margin-bottom: 40px;
  color: #333;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.feature-card {
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-10px);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
}

.feature-card h3 {
  font-size: 1.3rem;
  margin-bottom: 10px;
  color: #333;
}

.feature-card p {
  color: #666;
}

.about-section {
  padding: 60px 0;
  text-align: center;
}

.about-section h2 {
  font-size: 2rem;
  margin-bottom: 20px;
  color: #333;
}

.about-section p {
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
  color: #666;
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2rem;
  }
  
  .hero-content p {
    font-size: 1rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
}
EOL

# Update App.js to include routing
echo_color "Updating App.js..." "$YELLOW"
cat > src/App.js << 'EOL'
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Products from './pages/Products';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">YourBrand</Link>
            <ul className="nav-menu">
              <li className="nav-item">
                <Link to="/" className="nav-links">Home</Link>
              </li>
              <li className="nav-item">
                <Link to="/products" className="nav-links">Products</Link>
              </li>
            </ul>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
EOL

# Update App.css for navigation
echo_color "Updating App.css..." "$YELLOW"
cat > src/App.css << 'EOL'
.App {
  text-align: center;
}

.navbar {
  background-color: #333;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  position: sticky;
  top: 0;
  z-index: 999;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 80px;
  max-width: 1200px;
  padding: 0 20px;
}

.nav-logo {
  color: #fff;
  text-decoration: none;
  font-size: 2rem;
  font-weight: bold;
  cursor: pointer;
}

.nav-menu {
  display: flex;
  list-style: none;
  text-align: center;
  margin: 0;
  padding: 0;
}

.nav-item {
  line-height: 40px;
  margin-right: 1rem;
}

.nav-links {
  color: #fff;
  text-decoration: none;
  padding: 0.5rem 1rem;
  height: 100%;
  border-bottom: 3px solid transparent;
}

.nav-links:hover {
  color: #4CAF50;
  border-bottom: 3px solid #4CAF50;
  transition: all 0.2s ease-out;
}

@media screen and (max-width: 960px) {
  .nav-menu {
    position: absolute;
    top: 80px;
    left: -100%;
    flex-direction: column;
    width: 100%;
    background-color: #333;
    transition: all 0.5s ease;
  }

  .nav-menu.active {
    left: 0;
    opacity: 1;
    transition: all 0.5s ease;
    z-index: 1;
  }

  .nav-item {
    margin: 1.5rem 0;
  }
}
EOL

# Add React Router DOM dependency
echo_color "Installing React Router DOM..." "$YELLOW"
echo "You'll need to install react-router-dom. Run this command in your React project folder:"
echo "npm install react-router-dom"

echo
echo_color "=== Setup Complete! ===" "$GREEN"
echo
echo_color "Next Steps:" "$YELLOW"
echo "1. Install React Router DOM: npm install react-router-dom"
echo "2. Start the proxy server: cd printify-scraper && ./start.sh"
echo "3. Start your React app: npm start"
echo 
echo_color "Note: The scraper is configured to fetch products from: ${POPUP_URL}" "$YELLOW"
echo_color "If you need to change it later, update the URL in src/pages/Products.js" "$YELLOW"
echo
echo_color "Happy coding!" "$GREEN"