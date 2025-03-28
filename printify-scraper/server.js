const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cheerio = require('cheerio');
const app = express();
const port = process.env.PORT || 3000;

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
    
    // Extract all product links first
    const productLinks = new Set();
    $('a').each((i, el) => {
      const href = $(el).attr('href');
      if (href && href.includes('/product/')) {
        productLinks.add(href);
      }
    });
    
    console.log(`Found ${productLinks.size} product links`);
    
    // For each product link, extract product information
    const products = [];
    
    // If we found product links, use them to find products
    if (productLinks.size > 0) {
      let index = 1;
      productLinks.forEach(link => {
        // Find the product card that contains this link
        const productCard = $(`a[href="${link}"]`).closest('.product-card, .product-item, .product, div');
        
        if (productCard.length) {
          // Extract product information
          let title = productCard.find('h1, h2, h3, h4, .product-title, .title').first().text().trim();
          if (!title) {
            // Try getting title from link text
            title = $(`a[href="${link}"]`).text().trim();
          }
          
          // Only process if we found a title
          if (title) {
            const description = productCard.find('p, .description, .product-description').first().text().trim();
            let priceText = productCard.find('.price, .product-price, [class*="price"]').first().text().trim();
            
            // If no price found directly, look for price in the text content
            if (!priceText) {
              const allText = productCard.text();
              const priceMatch = allText.match(/\$\s*(\d+\.?\d*)/);
              if (priceMatch) {
                priceText = priceMatch[0];
              }
            }
            
            // Clean up price text and convert to cents
            priceText = priceText.replace(/[^\d.,]/g, '');
            priceText = priceText.replace(',', '.');
            const price = Math.round(parseFloat(priceText) * 100) || 0;
            
            // Find image URL
            let imageUrl = '';
            productCard.find('img').each((i, img) => {
              const src = $(img).attr('src') || $(img).attr('data-src');
              if (src && (src.includes('.jpg') || src.includes('.png') || src.includes('.webp'))) {
                imageUrl = src;
                return false; // Break out of the loop
              }
            });
            
            // Make absolute URLs from relative URLs
            if (imageUrl && !imageUrl.startsWith('http')) {
              const baseUrl = new URL(url).origin;
              imageUrl = `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
            }
            
            // Make absolute URLs from relative URLs for the product link
            let productUrl = link;
            if (productUrl && !productUrl.startsWith('http')) {
              const baseUrl = new URL(url).origin;
              productUrl = `${baseUrl}${productUrl.startsWith('/') ? '' : '/'}${productUrl}`;
            }
            
            console.log(`Found product ${index}: ${title} - ${priceText} - ${imageUrl ? 'Has image' : 'No image'}`);
            
            products.push({
              id: `product-${index++}`,
              title,
              description: description || 'Custom printed product',
              image: imageUrl || 'https://via.placeholder.com/300x400',
              price,
              url: productUrl
            });
          }
        }
      });
    }
    
    // If we didn't find any products using the link approach, try a more direct method
    if (products.length === 0) {
      console.log('No products found using links. Trying direct method...');
      
      // Try to find product cards directly
      $('.product-card, .product-item, [class*="product"], .grid-item').each((index, element) => {
        const title = $(element).find('h1, h2, h3, h4, .product-title, .title').first().text().trim();
        
        // Only process if we found a title
        if (title) {
          const description = $(element).find('p, .description, .product-description').first().text().trim();
          let priceText = $(element).find('.price, .product-price, [class*="price"]').first().text().trim();
          
          // If no price found directly, look for price in the text content
          if (!priceText) {
            const allText = $(element).text();
            const priceMatch = allText.match(/\$\s*(\d+\.?\d*)/);
            if (priceMatch) {
              priceText = priceMatch[0];
            }
          }
          
          // Clean up price text and convert to cents
          priceText = priceText.replace(/[^\d.,]/g, '');
          priceText = priceText.replace(',', '.');
          const price = Math.round(parseFloat(priceText) * 100) || 0;
          
          // Find image URL
          let imageUrl = '';
          $(element).find('img').each((i, img) => {
            const src = $(img).attr('src') || $(img).attr('data-src');
            if (src && (src.includes('.jpg') || src.includes('.png') || src.includes('.webp'))) {
              imageUrl = src;
              return false; // Break out of the loop
            }
          });
          
          // Make absolute URLs from relative URLs
          if (imageUrl && !imageUrl.startsWith('http')) {
            const baseUrl = new URL(url).origin;
            imageUrl = `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
          }
          
          // Get product URL by finding a link
          let productUrl = $(element).find('a').attr('href') || '';
          if (productUrl && !productUrl.startsWith('http')) {
            const baseUrl = new URL(url).origin;
            productUrl = `${baseUrl}${productUrl.startsWith('/') ? '' : '/'}${productUrl}`;
          }
          
          console.log(`Found product ${products.length + 1}: ${title} - ${priceText} - ${imageUrl ? 'Has image' : 'No image'}`);
          
          products.push({
            id: `product-${products.length + 1}`,
            title,
            description: description || 'Custom printed product',
            image: imageUrl || 'https://via.placeholder.com/300x400',
            price,
            url: productUrl || url
          });
        }
      });
    }
    
    // If we still didn't find any products, try an even more generic approach
    if (products.length === 0) {
      console.log('No products found with specific selectors. Trying generic approach...');
      
      // Look for anything that might be a product
      $('div, li, article').each((index, element) => {
        // Skip if this is a tiny element or likely not a product
        if ($(element).find('img').length === 0) {
          return;
        }
        
        // Check if it has price-like text
        const text = $(element).text();
        const hasPriceText = text.match(/\$\s*\d+\.?\d*/);
        
        if (hasPriceText) {
          const title = $(element).find('h1, h2, h3, h4, .title, .name').first().text().trim() || 
                        text.replace(/\$\s*\d+\.?\d*/, '').trim() || 
                        `Product ${products.length + 1}`;
                        
          const description = $(element).find('p, .description').first().text().trim() || '';
          const priceMatch = text.match(/\$\s*(\d+\.?\d*)/);
          const price = priceMatch ? Math.round(parseFloat(priceMatch[1]) * 100) : 0;
          
          let imageUrl = $(element).find('img').attr('src') || $(element).find('img').attr('data-src') || '';
          
          // Make absolute URLs from relative URLs
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
          
          console.log(`Found generic product ${products.length + 1}: ${title} - ${price/100} - ${imageUrl ? 'Has image' : 'No image'}`);
          
          products.push({
            id: `product-${products.length + 1}`,
            title,
            description,
            image: imageUrl || 'https://via.placeholder.com/300x400',
            price,
            url: productUrl || url
          });
        }
      });
    }

    console.log(`Total products found: ${products.length}`);
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
  console.log(`Use http://localhost:${port}/fetch-printify-popup?url=https://hively-imprints.printify.me/`);
});