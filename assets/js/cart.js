// ===== CART PAGE SPECIFIC JAVASCRIPT =====

let isUpdatingCart = false;

document.addEventListener('DOMContentLoaded', function() {
    initializeCartPage();
});

// Initialize cart page
function initializeCartPage() {
    displayCartItems();
    setupCartEventListeners();
    
    // Listen for cart updates from other pages
    document.addEventListener('cartUpdated', function() {
        displayCartItems();
    });
}

// Setup event listeners
function setupCartEventListeners() {
    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', showCheckoutModal);
    }
    
    // Modal close events
    const closeModal = document.getElementById('close-modal');
    const cancelOrder = document.getElementById('cancel-order');
    const confirmOrder = document.getElementById('confirm-order');
    const modal = document.getElementById('checkout-modal');
    
    if (closeModal) closeModal.addEventListener('click', hideCheckoutModal);
    if (cancelOrder) cancelOrder.addEventListener('click', hideCheckoutModal);
    if (confirmOrder) confirmOrder.addEventListener('click', processOrder);
    
    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                hideCheckoutModal();
            }
        });
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            hideCheckoutModal();
        }
    });
}

// Display cart items
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSummary = document.getElementById('cart-summary');
    const emptyCart = document.getElementById('empty-cart');
    
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        // Show empty cart
        if (emptyCart) emptyCart.style.display = 'block';
        if (cartSummary) cartSummary.style.display = 'none';
        cartItemsContainer.innerHTML = '';
        return;
    }
    
    // Hide empty cart, show summary
    if (emptyCart) emptyCart.style.display = 'none';
    if (cartSummary) cartSummary.style.display = 'block';
    
    // Create cart items HTML
    let cartItemsHTML = '';
    
    cart.forEach(cartItem => {
        const product = products.find(p => p.id === cartItem.id);
        const itemTotal = cartItem.price * cartItem.quantity;
        const maxQuantity = product ? product.quantity : cartItem.quantity;
        
        cartItemsHTML += `
            <div class="cart-item" data-product-id="${cartItem.id}">
                <div class="cart-item-image">
                    ${cartItem.image}
                </div>
                <div class="cart-item-details">
                    <h3 class="cart-item-title">${cartItem.name}</h3>
                    <p class="cart-item-description">${product ? product.description : 'Product description'}</p>
                </div>
                <div class="cart-item-price">
                    ${formatPrice(cartItem.price)}
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateItemQuantity(${cartItem.id}, ${cartItem.quantity - 1})">-</button>
                    <span class="quantity-display">${cartItem.quantity}</span>
                    <button class="quantity-btn" onclick="updateItemQuantity(${cartItem.id}, ${cartItem.quantity + 1})" ${cartItem.quantity >= maxQuantity ? 'disabled' : ''}>+</button>
                </div>
                <div class="cart-item-total">
                    ${formatPrice(itemTotal)}
                </div>
                <button class="remove-item" onclick="removeCartItem(${cartItem.id})" title="Remove item">
                    ×
                </button>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = cartItemsHTML;
    
    // Update cart summary
    updateCartSummary();
}

// Update item quantity
function updateItemQuantity(productId, newQuantity) {
    if (isUpdatingCart) return;
    isUpdatingCart = true;
    
    const success = updateCartItemQuantity(productId, newQuantity);
    
    if (success) {
        // Add visual feedback
        const cartItem = document.querySelector(`[data-product-id="${productId}"]`);
        if (cartItem) {
            cartItem.style.transition = 'background-color 0.3s ease';
            cartItem.style.backgroundColor = '#e8f5e8';
            
            setTimeout(() => {
                cartItem.style.backgroundColor = '';
                displayCartItems(); // Refresh the display
            }, 300);
        }
    }
    
    setTimeout(() => {
        isUpdatingCart = false;
    }, 100);
}

// Remove cart item
function removeCartItem(productId) {
    const cartItem = document.querySelector(`[data-product-id="${productId}"]`);
    const product = cart.find(item => item.id === productId);
    
    if (cartItem && product) {
        // Add removing animation
        cartItem.classList.add('removing');
        
        setTimeout(() => {
            removeFromCart(productId);
            displayCartItems();
            showNotification(`${product.name} removed from cart`, 'info');
        }, 300);
    }
}

// Update cart summary
function updateCartSummary() {
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    const modalTotalElement = document.getElementById('modal-total');
    
    const subtotal = getCartTotal();
    const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
    const taxRate = 0.08; // 8% tax
    const tax = subtotal * taxRate;
    const total = subtotal + shipping + tax;
    
    if (subtotalElement) subtotalElement.textContent = formatPrice(subtotal);
    if (shippingElement) {
        shippingElement.textContent = shipping === 0 ? 'FREE' : formatPrice(shipping);
    }
    if (taxElement) taxElement.textContent = formatPrice(tax);
    if (totalElement) totalElement.textContent = formatPrice(total);
    if (modalTotalElement) modalTotalElement.textContent = formatPrice(total);
}

// Show checkout modal
function showCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (modal) {
        modal.classList.add('show');
        modal.style.display = 'flex';
        
        // Update modal total
        updateCartSummary();
        
        // Focus on confirm button
        setTimeout(() => {
            const confirmBtn = document.getElementById('confirm-order');
            if (confirmBtn) confirmBtn.focus();
        }, 100);
    }
}

// Hide checkout modal
function hideCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

// Process order
function processOrder() {
    if (cart.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }
    
    // Simulate order processing
    const confirmBtn = document.getElementById('confirm-order');
    if (confirmBtn) {
        const originalText = confirmBtn.textContent;
        confirmBtn.textContent = 'Processing...';
        confirmBtn.disabled = true;
        
        setTimeout(() => {
            // Simulate successful order
            showNotification('Order placed successfully! Thank you for your purchase.', 'success');
            
            // Clear cart
            clearCart();
            
            // Hide modal
            hideCheckoutModal();
            
            // Update display
            displayCartItems();
            
            // Reset button
            confirmBtn.textContent = originalText;
            confirmBtn.disabled = false;
            
            // Redirect to home page after a delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            
        }, 2000);
    }
}

// Calculate savings
function calculateSavings() {
    let totalSavings = 0;
    
    cart.forEach(cartItem => {
        const product = products.find(p => p.id === cartItem.id);
        if (product && product.originalPrice) {
            const savings = (product.originalPrice - product.price) * cartItem.quantity;
            totalSavings += savings;
        }
    });
    
    return totalSavings;
}

// Show savings information
function displaySavings() {
    const savings = calculateSavings();
    if (savings > 0) {
        const savingsElement = document.createElement('div');
        savingsElement.className = 'savings-info';
        savingsElement.innerHTML = `
            <div class="savings-text">
                🎉 You're saving ${formatPrice(savings)} on this order!
            </div>
        `;
        
        // Add to cart summary
        const summaryCard = document.querySelector('.summary-card');
        if (summaryCard) {
            summaryCard.insertBefore(savingsElement, summaryCard.firstChild.nextSibling);
        }
    }
}

// Estimate delivery date
function getDeliveryEstimate() {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 3); // 3 days delivery
    
    return deliveryDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Add delivery estimate to cart
function displayDeliveryEstimate() {
    const deliveryDate = getDeliveryEstimate();
    const deliveryElement = document.createElement('div');
    deliveryElement.className = 'delivery-estimate';
    deliveryElement.innerHTML = `
        <div class="delivery-text">
            📦 Estimated delivery: ${deliveryDate}
        </div>
    `;
    
    // Add to cart summary
    const summaryCard = document.querySelector('.summary-card');
    if (summaryCard && cart.length > 0) {
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            summaryCard.insertBefore(deliveryElement, checkoutBtn);
        }
    }
}

// Enhanced cart display with additional features
function enhanceCartDisplay() {
    if (cart.length > 0) {
        displaySavings();
        displayDeliveryEstimate();
    }
}

// Add custom styles for cart enhancements
function addCartEnhancementStyles() {
    if (!document.querySelector('#cart-enhancement-styles')) {
        const style = document.createElement('style');
        style.id = 'cart-enhancement-styles';
        style.textContent = `
            .savings-info, .delivery-estimate {
                background: #e8f5e8;
                border: 1px solid #28a745;
                border-radius: 5px;
                padding: 0.75rem;
                margin-bottom: 1rem;
                text-align: center;
            }
            
            .savings-text, .delivery-text {
                color: #155724;
                font-weight: 600;
                font-size: 0.9rem;
            }
            
            .cart-item.removing {
                animation: slideOut 0.3s ease forwards;
            }
            
            @keyframes slideOut {
                0% {
                    opacity: 1;
                    transform: translateX(0);
                }
                100% {
                    opacity: 0;
                    transform: translateX(-100%);
                }
            }
            
            .quantity-controls button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            
            .cart-item {
                transition: background-color 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize cart enhancements
document.addEventListener('DOMContentLoaded', function() {
    addCartEnhancementStyles();
    
    // Add enhancements after cart loads
    setTimeout(() => {
        enhanceCartDisplay();
    }, 100);
});

// Auto-save cart on page unload
window.addEventListener('beforeunload', function() {
    saveCart();
});

// Handle browser back/forward buttons
window.addEventListener('popstate', function() {
    displayCartItems();
});

// Print cart functionality (bonus feature)
function printCart() {
    if (cart.length === 0) {
        showNotification('Your cart is empty', 'info');
        return;
    }
    
    const printWindow = window.open('', '_blank');
    const cartHTML = generatePrintableCart();
    
    printWindow.document.write(`
        <html>
            <head>
                <title>Shopping Cart - ShopEasy</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .cart-header { text-align: center; margin-bottom: 30px; }
                    .cart-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
                    .total { font-weight: bold; font-size: 1.2em; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class="cart-header">
                    <h1>ShopEasy - Shopping Cart</h1>
                    <p>Date: ${new Date().toLocaleDateString()}</p>
                </div>
                ${cartHTML}
            </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
}

// Generate printable cart HTML
function generatePrintableCart() {
    let html = '<div class="cart-items">';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        html += `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong><br>
                    Quantity: ${item.quantity}<br>
                    Price: ${formatPrice(item.price)}
                </div>
                <div>
                    <strong>${formatPrice(itemTotal)}</strong>
                </div>
            </div>
        `;
    });
    
    const subtotal = getCartTotal();
    const shipping = subtotal > 50 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    
    html += `
        </div>
        <div class="total">
            <div>Subtotal: ${formatPrice(subtotal)}</div>
            <div>Shipping: ${shipping === 0 ? 'FREE' : formatPrice(shipping)}</div>
            <div>Tax: ${formatPrice(tax)}</div>
            <div>Total: ${formatPrice(total)}</div>
        </div>
    `;
    
    return html;
}

// Export functions for use in other files
window.cartPage = {
    displayCartItems,
    updateItemQuantity,
    removeCartItem,
    showCheckoutModal,
    hideCheckoutModal,
    processOrder,
    printCart
};