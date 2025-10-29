// ===== PRODUCTS PAGE SPECIFIC JAVASCRIPT =====

let filteredProducts = [];
let currentFilters = {
    search: '',
    category: '',
    maxPrice: 1000,
    sortBy: 'name'
};

document.addEventListener('DOMContentLoaded', function() {
    initializeProductsPage();
});

// Initialize products page functionality
function initializeProductsPage() {
    setupFilters();
    setupSearch();
    
    // Wait for products to load
    document.addEventListener('productsLoaded', function(event) {
        initializeProducts();
    });
    
    // If products are already loaded
    if (window.ecommerce && window.ecommerce.products.length > 0) {
        initializeProducts();
    }
}

// Initialize products display
function initializeProducts() {
    // Check for URL parameters
    const urlCategory = getUrlParameter('category');
    if (urlCategory) {
        currentFilters.category = urlCategory;
        document.getElementById('category-filter').value = urlCategory;
    }
    
    // Initialize price filter
    const priceFilter = document.getElementById('price-filter');
    if (priceFilter) {
        const maxPrice = Math.max(...products.map(p => p.price));
        priceFilter.max = Math.ceil(maxPrice);
        currentFilters.maxPrice = Math.ceil(maxPrice);
        document.getElementById('price-value').textContent = formatPrice(currentFilters.maxPrice);
    }
    
    applyFilters();
}

// Setup filter event listeners
function setupFilters() {
    // Category filter
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            currentFilters.category = this.value;
            applyFilters();
        });
    }
    
    // Price filter
    const priceFilter = document.getElementById('price-filter');
    const priceValue = document.getElementById('price-value');
    if (priceFilter && priceValue) {
        priceFilter.addEventListener('input', function() {
            currentFilters.maxPrice = parseInt(this.value);
            priceValue.textContent = formatPrice(currentFilters.maxPrice);
        });
        
        priceFilter.addEventListener('change', function() {
            applyFilters();
        });
    }
    
    // Sort filter
    const sortFilter = document.getElementById('sort-filter');
    if (sortFilter) {
        sortFilter.addEventListener('change', function() {
            currentFilters.sortBy = this.value;
            applyFilters();
        });
    }
    
    // Clear filters button
    const clearFiltersBtn = document.getElementById('clear-filters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearAllFilters);
    }
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    if (searchInput) {
        // Debounced search
        const debouncedSearch = debounce(function(searchTerm) {
            currentFilters.search = searchTerm.toLowerCase();
            applyFilters();
        }, 300);
        
        searchInput.addEventListener('input', function() {
            debouncedSearch(this.value);
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                currentFilters.search = this.value.toLowerCase();
                applyFilters();
            }
        });
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                currentFilters.search = searchInput.value.toLowerCase();
                applyFilters();
            }
        });
    }
}

// Apply all filters and sort
function applyFilters() {
    if (!products || products.length === 0) return;
    
    // Start with all products
    filteredProducts = [...products];
    
    // Apply search filter
    if (currentFilters.search) {
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(currentFilters.search) ||
            product.description.toLowerCase().includes(currentFilters.search)
        );
    }
    
    // Apply category filter
    if (currentFilters.category) {
        filteredProducts = filteredProducts.filter(product =>
            product.category === currentFilters.category
        );
    }
    
    // Apply price filter
    filteredProducts = filteredProducts.filter(product =>
        product.price <= currentFilters.maxPrice
    );
    
    // Apply sorting
    sortProducts();
    
    // Display results
    displayProducts();
    updateProductsCount();
}

// Sort products based on current sort option
function sortProducts() {
    switch (currentFilters.sortBy) {
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        default:
            break;
    }
}

// Display filtered products
function displayProducts() {
    const productsGrid = document.getElementById('products-grid');
    const loading = document.getElementById('loading');
    const noProducts = document.getElementById('no-products');
    
    if (!productsGrid) return;
    
    // Hide loading and no products messages
    if (loading) loading.style.display = 'none';
    if (noProducts) noProducts.style.display = 'none';
    
    // Clear current products
    productsGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        if (noProducts) noProducts.style.display = 'block';
        return;
    }
    
    // Create product cards
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
    
    // Add animation
    productsGrid.classList.add('fade-in');
}

// Create product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-product-id', product.id);
    
    // Calculate discount percentage
    const discountPercent = product.originalPrice ? 
        Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
    
    // Stock status
    const stockStatus = getStockStatus(product);
    
    card.innerHTML = `
        <div class="product-image">
            ${product.image}
            ${discountPercent > 0 ? `<div class="discount-badge">-${discountPercent}%</div>` : ''}
            ${!product.inStock ? '<div class="out-of-stock-overlay">Out of Stock</div>' : ''}
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-rating">
                <span class="stars">${generateStars(product.rating)}</span>
                <span class="rating-text">(${product.reviews})</span>
            </div>
            <div class="product-price">
                ${formatPrice(product.price)}
                ${product.originalPrice ? `<span class="price-compare">${formatPrice(product.originalPrice)}</span>` : ''}
            </div>
            <div class="stock-status">
                <span class="stock-indicator ${stockStatus.class}"></span>
                <span class="stock-text ${stockStatus.class}">${stockStatus.text}</span>
            </div>
            <div class="product-actions">
                <button class="add-to-cart" onclick="handleAddToCart(${product.id})" ${!product.inStock ? 'disabled' : ''}>
                    ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
                <button class="view-details" onclick="viewProductDetails(${product.id})">
                    View Details
                </button>
            </div>
        </div>
    `;
    
    // Add click handler for the card (excluding buttons)
    card.addEventListener('click', function(event) {
        if (!event.target.matches('button')) {
            viewProductDetails(product.id);
        }
    });
    
    return card;
}

// Get stock status information
function getStockStatus(product) {
    if (!product.inStock || product.quantity === 0) {
        return { class: 'out-of-stock', text: 'Out of Stock' };
    } else if (product.quantity <= 5) {
        return { class: 'low-stock', text: `Only ${product.quantity} left` };
    } else {
        return { class: 'in-stock', text: 'In Stock' };
    }
}

// Update products count display
function updateProductsCount() {
    const productsCount = document.getElementById('products-count');
    if (productsCount) {
        const total = products.length;
        const showing = filteredProducts.length;
        
        if (showing === total) {
            productsCount.textContent = `Showing all ${total} products`;
        } else {
            productsCount.textContent = `Showing ${showing} of ${total} products`;
        }
    }
}

// Clear all filters
function clearAllFilters() {
    // Reset filters object
    currentFilters = {
        search: '',
        category: '',
        maxPrice: Math.max(...products.map(p => p.price)),
        sortBy: 'name'
    };
    
    // Reset form elements
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    const sortFilter = document.getElementById('sort-filter');
    const priceValue = document.getElementById('price-value');
    
    if (searchInput) searchInput.value = '';
    if (categoryFilter) categoryFilter.value = '';
    if (priceFilter) {
        priceFilter.value = currentFilters.maxPrice;
        if (priceValue) priceValue.textContent = formatPrice(currentFilters.maxPrice);
    }
    if (sortFilter) sortFilter.value = 'name';
    
    // Clear URL parameters
    const url = new URL(window.location);
    url.searchParams.delete('category');
    window.history.replaceState({}, document.title, url.pathname);
    
    // Apply filters
    applyFilters();
    
    showNotification('Filters cleared', 'info');
}

// Handle add to cart from product card
function handleAddToCart(productId) {
    const success = addToCart(productId, 1);
    if (success) {
        // Add visual feedback
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

// Navigate to product details page
function viewProductDetails(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
}

// Add CSS for out of stock overlay
function addOutOfStockStyles() {
    if (!document.querySelector('#out-of-stock-styles')) {
        const style = document.createElement('style');
        style.id = 'out-of-stock-styles';
        style.textContent = `
            .product-image {
                position: relative;
            }
            
            .out-of-stock-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 1.1rem;
            }
            
            .discount-badge {
                position: absolute;
                top: 10px;
                right: 10px;
                background: #dc3545;
                color: white;
                padding: 0.25rem 0.5rem;
                border-radius: 15px;
                font-size: 0.8rem;
                font-weight: 600;
                z-index: 2;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize out of stock styles
document.addEventListener('DOMContentLoaded', function() {
    addOutOfStockStyles();
});

// Keyboard navigation for filters
document.addEventListener('keydown', function(event) {
    // Quick filter shortcuts
    if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
            case 'f':
                event.preventDefault();
                const searchInput = document.getElementById('search-input');
                if (searchInput) searchInput.focus();
                break;
            case 'r':
                event.preventDefault();
                clearAllFilters();
                break;
        }
    }
});

// Export functions for use in other files
window.productsPage = {
    currentFilters,
    filteredProducts,
    applyFilters,
    clearAllFilters,
    handleAddToCart,
    viewProductDetails
};