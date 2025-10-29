// ===== HOME PAGE SPECIFIC JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', function() {
    initializeHomePage();
});

// Initialize home page functionality
function initializeHomePage() {
    // Wait for products to load
    document.addEventListener('productsLoaded', function(event) {
        loadFeaturedProducts();
    });
    
    // If products are already loaded
    if (window.ecommerce && window.ecommerce.products.length > 0) {
        loadFeaturedProducts();
    }
}

// Load and display featured products
function loadFeaturedProducts() {
    const featuredProductsContainer = document.getElementById('featured-products');
    if (!featuredProductsContainer) return;
    
    // Get featured products
    const featuredProducts = products.filter(product => product.featured).slice(0, 4);
    
    if (featuredProducts.length === 0) {
        // If no featured products, show first 4 products
        featuredProducts.push(...products.slice(0, 4));
    }
    
    // Clear loading state
    featuredProductsContainer.innerHTML = '';
    
    // Create product cards
    featuredProducts.forEach(product => {
        const productCard = createProductCard(product);
        featuredProductsContainer.appendChild(productCard);
    });
    
    // Add fade-in animation
    featuredProductsContainer.classList.add('fade-in');
}

// Create product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-product-id', product.id);
    
    // Calculate discount percentage
    const discountPercent = product.originalPrice ? 
        Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
    
    card.innerHTML = `
        <div class="product-image">
            ${product.image}
            ${discountPercent > 0 ? `<div class="discount-badge">-${discountPercent}%</div>` : ''}
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
        // Don't navigate if clicking on buttons
        if (!event.target.matches('button')) {
            viewProductDetails(product.id);
        }
    });
    
    return card;
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

// Category navigation (called from HTML)
function filterByCategory(category) {
    window.location.href = `products.html?category=${category}`;
}

// Add loading spinner styles for featured products
function showFeaturedProductsLoading() {
    const container = document.getElementById('featured-products');
    if (container) {
        container.innerHTML = `
            <div class="loading">
                <div class="loading-spinner"></div>
                <p>Loading featured products...</p>
            </div>
        `;
    }
}

// Hero section animations
function initializeHeroAnimations() {
    const hero = document.querySelector('.hero');
    if (hero) {
        // Add entrance animation
        hero.style.opacity = '0';
        hero.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            hero.style.transition = 'opacity 1s ease, transform 1s ease';
            hero.style.opacity = '1';
            hero.style.transform = 'translateY(0)';
        }, 100);
    }
}

// Category cards hover effects
function initializeCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Initialize hero animations and category cards when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initializeHeroAnimations();
        initializeCategoryCards();
    }, 100);
});

// Smooth scrolling for CTA button
document.addEventListener('DOMContentLoaded', function() {
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton && ctaButton.getAttribute('href') === '#featured') {
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();
            const featuredSection = document.querySelector('.featured-products');
            if (featuredSection) {
                featuredSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
});

// Intersection Observer for animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe sections for scroll animations
    const sections = document.querySelectorAll('.featured-products, .categories');
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', function() {
    initializeScrollAnimations();
});

// Performance optimization: Lazy load non-critical features
function initializeNonCriticalFeatures() {
    // Initialize any non-critical features here
    console.log('Home page initialized successfully');
}

// Initialize non-critical features after page load
window.addEventListener('load', function() {
    setTimeout(initializeNonCriticalFeatures, 100);
});