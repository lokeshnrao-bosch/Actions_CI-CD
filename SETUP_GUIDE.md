# ShopEasy - Setup Guide

This guide will help you get the ShopEasy eCommerce application running on your local machine.

## Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Basic understanding of HTML, CSS, and JavaScript (for customization)

## Installation Steps

### Method 1: Simple File Access (Quick Start)

1. **Download the Files**

   - Download all files to a folder on your computer
   - Maintain the folder structure as shown in the README

2. **Open in Browser**

   - Double-click on `index.html`
   - The application will open in your default browser

3. **Start Shopping**
   - Browse products, add to cart, and test functionality

**Note**: Some features like product data loading work better with a local server.

### Method 2: Local Server (Recommended)

For the best experience, run the application on a local server:

#### Option A: Python Server

```bash
# Open command prompt/terminal in the ecommerce-app folder
cd path/to/ecommerce-app

# For Python 3.x
python -m http.server 8000

# For Python 2.x
python -m SimpleHTTPServer 8000

# Open browser and go to: http://localhost:8000
```

#### Option B: Node.js Server

```bash
# Install http-server globally (one-time setup)
npm install -g http-server

# Navigate to project folder
cd path/to/ecommerce-app

# Start server
http-server

# Open browser and go to: http://localhost:8080
```

#### Option C: PHP Server

```bash
# Navigate to project folder
cd path/to/ecommerce-app

# Start PHP server
php -S localhost:8000

# Open browser and go to: http://localhost:8000
```

## Folder Structure Verification

Ensure your folder structure looks like this:

```
ecommerce-app/
├── index.html
├── products.html
├── product-detail.html
├── cart.html
├── README.md
├── SETUP_GUIDE.md
├── assets/
│   ├── css/
│   │   ├── styles.css
│   │   ├── home.css
│   │   ├── products.css
│   │   ├── product-detail.css
│   │   └── cart.css
│   ├── js/
│   │   ├── main.js
│   │   ├── home.js
│   │   ├── products.js
│   │   ├── product-detail.js
│   │   └── cart.js
│   └── images/
│       └── products/
└── data/
    └── products.json
```

## Testing the Installation

1. **Home Page Test**

   - Open the application
   - Verify featured products load
   - Test category navigation

2. **Products Page Test**

   - Navigate to Products page
   - Test search functionality
   - Try filtering by category
   - Test sorting options

3. **Product Details Test**

   - Click on any product
   - Verify product details display
   - Test add to cart functionality

4. **Cart Test**
   - Add products to cart
   - Navigate to cart page
   - Test quantity changes
   - Test item removal

## Customization Quick Start

### Adding Your Own Products

1. Open `data/products.json`
2. Add new product objects following the existing format
3. Save the file
4. Refresh the browser

### Changing Colors

1. Open `assets/css/styles.css`
2. Modify the color variables at the top:
   ```css
   :root {
     --primary-color: #your-color;
     --secondary-color: #your-color;
   }
   ```
3. Save and refresh

### Adding Real Images

1. Add image files to `assets/images/products/`
2. Update product data in `products.json`:
   ```json
   "image": "assets/images/products/your-image.jpg"
   ```
3. Save and refresh

## Troubleshooting

### Common Issues and Solutions

**Issue**: Products not loading

- **Solution**: Use a local server instead of opening HTML files directly

**Issue**: Console errors about CORS

- **Solution**: Run the application through a local server

**Issue**: Cart not saving

- **Solution**: Check if JavaScript is enabled and localStorage is available

**Issue**: Mobile layout broken

- **Solution**: Check viewport meta tag in HTML head section

**Issue**: Images not displaying

- **Solution**: Verify image paths in products.json match actual file locations

### Browser-Specific Issues

**Chrome/Edge**:

- Enable "Allow local files" if running without server
- Check Developer Tools console for errors

**Firefox**:

- May block local file access - use local server
- Check Browser Console for errors

**Safari**:

- Check Web Inspector for any blocked resources
- Ensure JavaScript is enabled

## Performance Tips

1. **Image Optimization**

   - Use compressed images (JPG for photos, PNG for graphics)
   - Consider WebP format for better compression

2. **File Minification**

   - Minify CSS and JavaScript for production
   - Remove comments and extra whitespace

3. **Caching**
   - Implement browser caching headers if using a real server
   - Consider service workers for offline functionality

## Next Steps

Once you have the basic application running:

1. **Customize the Design**

   - Modify colors, fonts, and layouts
   - Add your own branding

2. **Add More Products**

   - Expand the product catalog
   - Add real product images

3. **Enhance Functionality**

   - Add user reviews
   - Implement wishlist feature
   - Add product comparison

4. **Prepare for Production**
   - Set up a real server
   - Implement backend database
   - Add payment processing

## Getting Help

If you encounter issues:

1. Check the browser console for error messages
2. Verify all files are in the correct locations
3. Try using a different browser
4. Use a local server instead of file:// protocol

For additional help, refer to the main README.md file for detailed documentation.

## Security Notes

This is a frontend-only demo application. For production use:

- Implement server-side validation
- Add proper authentication
- Use HTTPS
- Implement proper payment processing
- Add input sanitization

Happy coding! 🚀
