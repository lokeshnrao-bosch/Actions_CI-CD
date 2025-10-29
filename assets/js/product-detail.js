// ===== PRODUCT DETAIL PAGE SPECIFIC JAVASCRIPT =====

let currentProduct = null;
let selectedQuantity = 1;

document.addEventListener('DOMContentLoaded', function() {
    initializeProductDetailPage();
});

// Initialize product detail page
function initializeProductDetailPage() {
    const productId = parseInt(getUrlParameter('id'));
    
    if (!productId) {
        showProductNotFound();
        return;
    }
    
    // Wait for products to load
    document.addEventListener('productsLoaded', function(event) {
        loadProductDetail(productId);
    });
    
    // If products are already loaded
    if (window.ecommerce && window.ecommerce.products.length > 0) {
        loadProductDetail(productId);
    }
}

// Load and display product details
function loadProductDetail(productId) {
    currentProduct = products.find(product => product.id === productId);
    
    if (!currentProduct) {
        showProductNotFound();
        return;
    }
    
    displayProductDetail();
    loadRelatedProducts();
    updateBreadcrumb();
}

// Display product details
function displayProductDetail() {
    const productDetailContainer = document.getElementById('product-detail');
    if (!productDetailContainer) return;
    
    const stockStatus = getStockStatus(currentProduct);
    const discountPercent = currentProduct.originalPrice ? 
        Math.round(((currentProduct.originalPrice - currentProduct.price) / currentProduct.originalPrice) * 100) : 0;
    
    productDetailContainer.innerHTML = `
        <div class="product-detail-content">
            <div class="product-images">
                <div class="main-image">
                    ${currentProduct.image}
                </div>
                <div class="thumbnail-images">
                    <div class="thumbnail active" onclick="selectThumbnail(this, '${currentProduct.image}')">
                        ${currentProduct.image}
                    </div>
                    <!-- Additional thumbnails would go here -->
                </div>
            </div>
            
            <div class="product-details">
                <h1 class="product-title">${currentProduct.name}</h1>
                
                <div class="product-rating">
                    <div class="stars">${generateStars(currentProduct.rating)}</div>
                    <div class="rating-info">
                        <span>${currentProduct.rating}/5</span>
                        <span>(${currentProduct.reviews} reviews)</span>
                    </div>
                </div>
                
                <div class="product-price">
                    ${formatPrice(currentProduct.price)}
                    ${currentProduct.originalPrice ? `<span class="price-compare">${formatPrice(currentProduct.originalPrice)}</span>` : ''}
                    ${discountPercent > 0 ? `<span class="discount-badge">Save ${discountPercent}%</span>` : ''}
                </div>
                
                <div class="stock-status">
                    <span class="stock-indicator ${stockStatus.class}"></span>
                    <span class="stock-text ${stockStatus.class}">${stockStatus.text}</span>
                </div>
                
                <div class="product-description">
                    <p>${currentProduct.description}</p>
                </div>
                
                <div class="product-options">
                    <div class="option-group">
                        <label for="quantity">Quantity:</label>
                        <div class="quantity-selector">
                            <button class="quantity-btn" onclick="changeQuantity(-1)" ${!currentProduct.inStock ? 'disabled' : ''}>-</button>
                            <input type="number" id="quantity" class="quantity-input" value="1" min="1" max="${currentProduct.quantity}" onchange="updateQuantity(this.value)" ${!currentProduct.inStock ? 'disabled' : ''}>
                            <button class="quantity-btn" onclick="changeQuantity(1)" ${!currentProduct.inStock ? 'disabled' : ''}>+</button>
                        </div>
                    </div>
                </div>
                
                <div class="product-actions">
                    <button class="add-to-cart-btn" onclick="handleAddToCart()" ${!currentProduct.inStock ? 'disabled' : ''}>
                        ${currentProduct.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                    <button class="wishlist-btn" onclick="addToWishlist()">
                        ♡ Wishlist
                    </button>
                </div>
                
                <div class="product-specs">
                    <h3>Specifications</h3>
                    <div class="specs-list">
                        ${Object.entries(currentProduct.specifications || {}).map(([key, value]) => 
                            `<div class="spec-item">
                                <span class="spec-label">${key}:</span>
                                <span class="spec-value">${value}</span>
                            </div>`
                        ).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add fade-in animation
    productDetailContainer.classList.add('fade-in');
}

// Get stock status information
function getStockStatus(product) {
    if (!product.inStock || product.quantity === 0) {
        return { class: 'out-of-stock', text: 'Out of Stock' };
    } else if (product.quantity <= 5) {
        return { class: 'low-stock', text: `Only ${product.quantity} left in stock` };
    } else {
        return { class: 'in-stock', text: 'In Stock' };
    }
}

// Change quantity
function changeQuantity(change) {
    const quantityInput = document.getElementById('quantity');
    if (!quantityInput) return;
    
    const newQuantity = Math.max(1, Math.min(currentProduct.quantity, selectedQuantity + change));
    selectedQuantity = newQuantity;
    quantityInput.value = newQuantity;
}

// Update quantity from input
function updateQuantity(value) {
    const quantity = parseInt(value);
    if (isNaN(quantity) || quantity < 1) {
        selectedQuantity = 1;
    } else if (quantity > currentProduct.quantity) {
        selectedQuantity = currentProduct.quantity;
        showNotification(`Only ${currentProduct.quantity} items available`, 'warning');
    } else {
        selectedQuantity = quantity;
    }
    
    document.getElementById('quantity').value = selectedQuantity;
}

// Handle add to cart
function handleAddToCart() {
    if (!currentProduct.inStock) {
        showNotification('This product is out of stock', 'error');
        return;
    }
    
    const success = addToCart(currentProduct.id, selectedQuantity);
    if (success) {
        // Visual feedback
        const button = document.querySelector('.add-to-cart-btn');
        const originalText = button.textContent;
        button.textContent = 'Added to Cart!';
        button.style.backgroundColor = '#28a745';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = '';
        }, 2000);
    }
}

// Add to wishlist (placeholder functionality)
function addToWishlist() {
    showNotification('Added to wishlist! (Demo feature)', 'info');
    
    // Visual feedback
    const button = document.querySelector('.wishlist-btn');
    const originalText = button.innerHTML;
    button.innerHTML = '♥ Added!';
    button.style.color = '#dc3545';
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.color = '';
    }, 2000);
}

// Select thumbnail image
function selectThumbnail(thumbnail, imageContent) {
    // Remove active class from all thumbnails
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.classList.remove('active');
    });
    
    // Add active class to selected thumbnail
    thumbnail.classList.add('active');
    
    // Update main image
    const mainImage = document.querySelector('.main-image');
    if (mainImage) {
        mainImage.innerHTML = imageContent;
    }
}

// Load related products
function loadRelatedProducts() {
    const relatedProductsContainer = document.getElementById('related-products');
    if (!relatedProductsContainer || !currentProduct) return;
    
    // Get products from the same category, excluding current product
    const relatedProducts = products
        .filter(product => 
            product.category === currentProduct.category && 
            product.id !== currentProduct.id
        )
        .slice(0, 4);
    
    if (relatedProducts.length === 0) {
        // If no related products in same category, show random products
        relatedProducts.push(...products
            .filter(product => product.id !== currentProduct.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 4)
        );
    }
    
    relatedProductsContainer.innerHTML = '';
    
    relatedProducts.forEach(product => {
        const productCard = createRelatedProductCard(product);
        relatedProductsContainer.appendChild(productCard);
    });
}

// Create related product card
function createRelatedProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-product-id', product.id);
    
    const discountPercent = product.originalPrice ? 
        Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
    
    card.innerHTML = `
        <div class="product-image">
            ${product.image}
            ${discountPercent > 0 ? `<div class="discount-badge">-${discountPercent}%</div>` : ''}
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <div class="product-rating">
                <span class="stars">${generateStars(product.rating)}</span>
                <span class="rating-text">(${product.reviews})</span>
            </div>
            <div class="product-price">
                ${formatPrice(product.price)}
            </div>
            <div class="product-actions">
                <button class="add-to-cart" onclick="addRelatedToCart(${product.id})" ${!product.inStock ? 'disabled' : ''}>
                    ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
                <button class="view-details" onclick="viewRelatedProduct(${product.id})">
                    View Details
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Add related product to cart
function addRelatedToCart(productId) {
    const success = addToCart(productId, 1);
    if (success) {
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = 'Added!';
        button.style.backgroundColor = '#28a745';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = '';
        }, 1500);
    }
}

// View related product details
function viewRelatedProduct(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
}

// Update breadcrumb
function updateBreadcrumb() {
    const breadcrumbProduct = document.getElementById('breadcrumb-product');
    if (breadcrumbProduct && currentProduct) {
        breadcrumbProduct.textContent = currentProduct.name;
    }
}

// Show product not found message
function showProductNotFound() {
    const productDetailContainer = document.getElementById('product-detail');
    if (productDetailContainer) {
        productDetailContainer.innerHTML = `
            <div class="product-not-found">
                <h2>Product Not Found</h2>
                <p>The product you're looking for doesn't exist or has been removed.</p>
                <a href="products.html" class="btn-primary">Browse All Products</a>
            </div>
        `;
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
            case 'b':
                event.preventDefault();
                window.history.back();
                break;
            case 'a':
                if (currentProduct && currentProduct.inStock) {
                    event.preventDefault();
                    handleAddToCart();
                }
                break;
        }
    }
});

// Image zoom functionality (optional enhancement)
function initializeImageZoom() {
    const mainImage = document.querySelector('.main-image');
    if (mainImage) {
        mainImage.addEventListener('mouseenter', function() {
            this.style.cursor = 'zoom-in';
        });
        
        mainImage.addEventListener('click', function() {
            this.style.transform = this.style.transform === 'scale(1.5)' ? 'scale(1)' : 'scale(1.5)';
            this.style.transition = 'transform 0.3s ease';
            this.style.cursor = this.style.transform === 'scale(1.5)' ? 'zoom-out' : 'zoom-in';
        });
    }
}

// Initialize image zoom after product loads
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for the product to load
    setTimeout(initializeImageZoom, 1000);
});

// Add custom styles for product detail page
function addProductDetailStyles() {
    if (!document.querySelector('#product-detail-custom-styles')) {
        const style = document.createElement('style');
        style.id = 'product-detail-custom-styles';
        style.textContent = `
            .product-not-found {
                text-align: center;
                padding: 4rem 2rem;
                background: white;
                border-radius: 10px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            }
            
            .product-not-found h2 {
                color: #333;
                margin-bottom: 1rem;
                font-size: 2rem;
            }
            
            .product-not-found p {
                color: #666;
                margin-bottom: 2rem;
                font-size: 1.1rem;
            }
            
            .main-image {
                transition: transform 0.3s ease;
                overflow: hidden;
            }
            
            .discount-badge {
                position: absolute;
                top: 10px;
                right: 10px;
                z-index: 2;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize custom styles
document.addEventListener('DOMContentLoaded', function() {
    addProductDetailStyles();
});

// Export functions for use in other files
window.productDetail = {
    currentProduct,
    selectedQuantity,
    handleAddToCart,
    addToWishlist,
    changeQuantity,
    updateQuantity
};