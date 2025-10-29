# Image Integration Guide

This guide shows you how to replace emoji icons with real product images.

## Steps to Add Real Images

### 1. Prepare Your Images

- Recommended size: 400x400px for product cards
- Formats: JPG, PNG, WebP
- Keep file sizes under 200KB for fast loading

### 2. Add Images to Project

Place your images in: `assets/images/products/`

Example structure:

```
assets/images/products/
├── smartphone-pro.jpg
├── wireless-headphones.jpg
├── classic-tshirt.jpg
├── coffee-maker.jpg
└── javascript-guide.jpg
```

### 3. Update Product Data

In `data/products.json`, change the image property:

**Before (emoji):**

```json
{
  "id": 1,
  "name": "Smartphone Pro",
  "image": "📱"
}
```

**After (real image):**

```json
{
  "id": 1,
  "name": "Smartphone Pro",
  "image": "assets/images/products/smartphone-pro.jpg"
}
```

### 4. Update CSS for Image Handling

Add this to your `assets/css/styles.css`:

```css
.product-image img,
.cart-item-image img,
.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
}

.product-image {
  position: relative;
  overflow: hidden;
}

/* Fallback for missing images */
.product-image::before {
  content: attr(data-fallback);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3rem;
  z-index: 1;
}
```

### 5. Update JavaScript for Image Handling

Add image error handling to `assets/js/main.js`:

```javascript
// Enhanced createProductCard function with image error handling
function createProductCard(product) {
  const card = document.createElement("div");
  card.className = "product-card";

  const imageElement = product.image.startsWith("assets/")
    ? `<img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'">`
    : product.image; // Keep emoji if not a path

  card.innerHTML = `
        <div class="product-image" data-fallback="${
          product.image.length === 2 ? product.image : "🛍️"
        }">
            ${imageElement}
        </div>
        <!-- rest of card content -->
    `;

  return card;
}
```

## Benefits of Using Real Images

1. **Professional Appearance**: Real photos make the store look more credible
2. **Better User Experience**: Customers can see actual products
3. **Improved Conversion**: Visual products increase purchase likelihood
4. **SEO Benefits**: Images with alt text improve search rankings

## Image Best Practices

### Optimization

- Compress images before adding (use tools like TinyPNG)
- Use appropriate formats (WebP > JPG > PNG)
- Consider lazy loading for better performance

### Accessibility

- Always include alt text
- Use descriptive filenames
- Ensure good contrast for text overlays

### Responsive Images

Consider using different image sizes for different devices:

```html
<picture>
  <source media="(max-width: 480px)" srcset="product-mobile.jpg" />
  <source media="(max-width: 768px)" srcset="product-tablet.jpg" />
  <img src="product-desktop.jpg" alt="Product Name" />
</picture>
```

## Sample Images Sources

For testing, you can get free product images from:

- Unsplash.com
- Pexels.com
- Pixabay.com
- Product manufacturer websites

Remember to check licensing requirements for commercial use!
