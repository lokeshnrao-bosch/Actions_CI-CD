// ===== MAIN JAVASCRIPT - SHARED FUNCTIONALITY =====

// Global variables
let products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize the application
function initializeApp() {
    setupMobileNavigation();
    updateCartCount();
    loadProducts();
}

// Mobile Navigation
function setupMobileNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// Load products from JSON file
async function loadProducts() {
    try {
        const response = await fetch('data/products.json');
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        products = await response.json();
        
        // Trigger custom event when products are loaded
        const event = new CustomEvent('productsLoaded', { detail: products });
        document.dispatchEvent(event);
    } catch (error) {
        console.error('Error loading products:', error);
        // Fallback to sample products if JSON file doesn't exist
        products = getSampleProducts();
        const event = new CustomEvent('productsLoaded', { detail: products });
        document.dispatchEvent(event);
    }
}

// Sample products fallback
function getSampleProducts() {
    return [
        {
            id: 1,
            name: "Smartphone Pro",
            description: "Latest smartphone with advanced features and excellent camera quality.",
            price: 699.99,
            originalPrice: 799.99,
            category: "electronics",
            image: "📱",
            rating: 4.5,
            reviews: 128,
            inStock: true,
            quantity: 25,
            specifications: {
                "Display": "6.1-inch OLED",
                "Storage": "128GB",
                "Camera": "48MP Triple Camera",
                "Battery": "4000mAh",
                "OS": "Latest Mobile OS"
            },
            featured: true
        },
        {
            id: 2,
            name: "Wireless Headphones",
            description: "Premium noise-cancelling wireless headphones with superior sound quality.",
            price: 199.99,
            originalPrice: 249.99,
            category: "electronics",
            image: "🎧",
            rating: 4.7,
            reviews: 89,
            inStock: true,
            quantity: 15,
            specifications: {
                "Type": "Over-ear",
                "Connectivity": "Bluetooth 5.0",
                "Battery Life": "30 hours",
                "Noise Cancellation": "Active",
                "Driver": "40mm Dynamic"
            },
            featured: true
        },
        {
            id: 3,
            name: "Classic T-Shirt",
            description: "Comfortable cotton t-shirt perfect for everyday wear.",
            price: 29.99,
            originalPrice: 39.99,
            category: "clothing",
            image: "👕",
            rating: 4.2,
            reviews: 45,
            inStock: true,
            quantity: 50,
            specifications: {
                "Material": "100% Cotton",
                "Fit": "Regular",
                "Care": "Machine washable",
                "Sizes": "S, M, L, XL",
                "Colors": "Multiple colors available"
            },
            featured: false
        },
        {
            id: 4,
            name: "Coffee Maker",
            description: "Automatic drip coffee maker with programmable features.",
            price: 89.99,
            originalPrice: 119.99,
            category: "home",
            image: "☕",
            rating: 4.4,
            reviews: 67,
            inStock: true,
            quantity: 8,
            specifications: {
                "Capacity": "12 cups",
                "Type": "Drip coffee maker",
                "Features": "Programmable, Auto shut-off",
                "Material": "Stainless steel",
                "Warranty": "2 years"
            },
            featured: false
        },
        {
            id: 5,
            name: "JavaScript Guide",
            description: "Comprehensive guide to modern JavaScript programming.",
            price: 49.99,
            originalPrice: 59.99,
            category: "books",
            image: "📚",
            rating: 4.8,
            reviews: 156,
            inStock: true,
            quantity: 30,
            specifications: {
                "Pages": "500",
                "Language": "English",
                "Format": "Paperback",
                "Publisher": "Tech Books",
                "Edition": "Latest Edition"
            },
            featured: true
        },
        {
            id: 6,
            name: "Gaming Laptop",
            description: "High-performance gaming laptop with dedicated graphics card.",
            price: 1299.99,
            originalPrice: 1499.99,
            category: "electronics",
            image: "💻",
            rating: 4.6,
            reviews: 92,
            inStock: true,
            quantity: 5,
            specifications: {
                "Processor": "Intel i7",
                "RAM": "16GB DDR4",
                "Storage": "512GB SSD",
                "Graphics": "NVIDIA RTX",
                "Display": "15.6-inch Full HD"
            },
            featured: false
        },
        {
            id: 7,
            name: "Designer Jeans",
            description: "Premium denim jeans with modern fit and style.",
            price: 89.99,
            originalPrice: 120.00,
            category: "clothing",
            image: "👖",
            rating: 4.3,
            reviews: 73,
            inStock: false,
            quantity: 0,
            specifications: {
                "Material": "98% Cotton, 2% Elastane",
                "Fit": "Slim fit",
                "Care": "Machine wash cold",
                "Sizes": "28-38 waist",
                "Style": "Contemporary"
            },
            featured: false
        },
        {
            id: 8,
            name: "Smart Watch",
            description: "Feature-rich smartwatch with health monitoring and fitness tracking.",
            price: 249.99,
            originalPrice: 299.99,
            category: "electronics",
            image: "⌚",
            rating: 4.4,
            reviews: 134,
            inStock: true,
            quantity: 20,
            specifications: {
                "Display": "1.4-inch AMOLED",
                "Battery": "7 days",
                "Water Resistance": "5ATM",
                "Features": "GPS, Heart rate, Sleep tracking",
                "Compatibility": "iOS and Android"
            },
            featured: true
        }
    ];
}

// Cart Management Functions
function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return false;
    
    if (!product.inStock || product.quantity < quantity) {
        showNotification('Sorry, this product is out of stock.', 'error');
        return false;
    }

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.quantity) {
            showNotification(`Only ${product.quantity} items available.`, 'warning');
            return false;
        }
        existingItem.quantity = newQuantity;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    saveCart();
    updateCartCount();
    showNotification(`${product.name} added to cart!`, 'success');
    return true;
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    
    // Trigger custom event for cart update
    const event = new CustomEvent('cartUpdated');
    document.dispatchEvent(event);
}

function updateCartItemQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        const product = products.find(p => p.id === productId);
        if (quantity > product.quantity) {
            showNotification(`Only ${product.quantity} items available.`, 'warning');
            return false;
        }
        
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            saveCart();
            updateCartCount();
            
            // Trigger custom event for cart update
            const event = new CustomEvent('cartUpdated');
            document.dispatchEvent(event);
        }
    }
    return true;
}

function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function getCartItemCount() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

function clearCart() {
    cart = [];
    saveCart();
    updateCartCount();
    
    // Trigger custom event for cart update
    const event = new CustomEvent('cartUpdated');
    document.dispatchEvent(event);
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const cartCountElements = document.querySelectorAll('#cart-count');
    const count = getCartItemCount();
    cartCountElements.forEach(element => {
        element.textContent = count;
    });
}

// Utility Functions
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '★';
    }
    
    if (hasHalfStar) {
        stars += '☆';
    }
    
    return stars;
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        color: white;
        z-index: 10000;
        max-width: 300px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        animation: slideInRight 0.3s ease;
    `;
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.backgroundColor = '#28a745';
            break;
        case 'error':
            notification.style.backgroundColor = '#dc3545';
            break;
        case 'warning':
            notification.style.backgroundColor = '#ffc107';
            notification.style.color = '#333';
            break;
        default:
            notification.style.backgroundColor = '#007bff';
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add notification animations to head
if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Category filter function (used by home page)
function filterByCategory(category) {
    window.location.href = `products.html?category=${category}`;
}

// URL parameter utility
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Local Storage utility functions
function setLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

function getLocalStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return defaultValue;
    }
}

// Export functions for use in other files
window.ecommerce = {
    products,
    cart,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    getCartTotal,
    getCartItemCount,
    clearCart,
    formatPrice,
    generateStars,
    showNotification,
    filterByCategory,
    getUrlParameter,
    debounce,
    setLocalStorage,
    getLocalStorage
};