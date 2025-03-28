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
        // Note: This requires a backend proxy to avoid CORS issues
        const popupStoreUrl = 'http://localhost:3000/fetch-printify-popup?url=https://hively-imprints.printify.me/';
        const response = await fetch(popupStoreUrl);
        
        if (!response.ok) {
          throw new Error(`Pop-up store fetch error: ${response.status}`);
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

    // Uncomment to use actual Pop-up store fetching
    fetchProducts();
    
    // For development without actual fetching, use mock data
    
    

  }, []);

  // Handle click on product card
  const handleProductClick = (url) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      window.open('https://hively-imprints.printify.me/', '_blank');
    }
  };

  // Format price from cents to dollars
  const formatPrice = (price) => {
    return `${(price / 100).toFixed(2)}`;
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
          <div 
            key={product.id} 
            className="product-card"
            onClick={() => handleProductClick(product.url)}
          >
            <div className="product-image">
              <img 
                src={product.image || 'https://via.placeholder.com/300x400'} 
                alt={product.title} 
                className="product-img"
              />
            </div>
            <div className="product-info">
              <h3 className="product-title">{product.title}</h3>
              <p className="product-description">{product.description}</p>
              <p className="product-price">{'$ ' + formatPrice(product.price || 0)}</p>
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