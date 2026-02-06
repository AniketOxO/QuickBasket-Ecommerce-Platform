// QuickBasket Shopping Cart System
class ShoppingCart {
    constructor() {
        this.items = this.loadCartFromStorage();
        this.init();
    }

    init() {
        this.updateCartUI();
        this.bindEvents();
    }

    bindEvents() {
        // Cart toggle
        const cartBtn = document.getElementById('cart-btn');
        const closeCart = document.getElementById('close-cart');
        const cartOverlay = document.getElementById('cart-overlay');

        if (cartBtn) {
            cartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openCart();
            });
        }

        if (closeCart) {
            closeCart.addEventListener('click', () => {
                this.closeCart();
            });
        }

        if (cartOverlay) {
            cartOverlay.addEventListener('click', () => {
                this.closeCart();
            });
        }

        // Prevent cart from closing when clicking inside
        const cartSidebar = document.getElementById('cart-sidebar');
        if (cartSidebar) {
            cartSidebar.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }

    openCart() {
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartOverlay = document.getElementById('cart-overlay');
        
        if (cartSidebar && cartOverlay) {
            cartSidebar.classList.add('active');
            cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeCart() {
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartOverlay = document.getElementById('cart-overlay');
        
        if (cartSidebar && cartOverlay) {
            cartSidebar.classList.remove('active');
            cartOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    addItem(product) {
        // Normalize incoming product data
        const normalized = this.normalizeProduct(product);
        const existingItem = this.items.find(item => item.id === normalized.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: normalized.id,
                name: normalized.name,
                price: normalized.price,
                originalPrice: normalized.originalPrice,
                image: normalized.image || 'fas fa-box',
                quantity: 1
            });
        }

        this.saveCartToStorage();
        this.updateCartUI();
        this.showNotification('Product added to cart!', 'success');
        
        // Open cart sidebar briefly to show the addition
        this.openCart();
        setTimeout(() => {
            if (this.items.length === 1) {
                // Keep open for first item
            } else {
                this.closeCart();
            }
        }, 1500);
    }

    // Ensure product has id and well-formed price
    normalizeProduct(product) {
        const id = product.id || product.productId || product.sku || product.name || `item_${Date.now()}`;
        const image = product.image || (product.icon ? product.icon : 'fas fa-box');
        const price = this.normalizePrice(product.price);
        const originalPrice = this.normalizePrice(product.originalPrice || product.price);
        const name = product.name || 'Untitled Product';
        return { id: id.toString(), image, price, originalPrice, name };
    }

    normalizePrice(val) {
        if (typeof val === 'number') {
            return `$${val.toFixed(2)}`;
        }
        if (typeof val === 'string') {
            // Extract first number in the string
            const match = val.match(/\d+(?:\.\d+)?/);
            if (match) return `$${parseFloat(match[0]).toFixed(2)}`;
        }
        return '$0.00';
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCartToStorage();
        this.updateCartUI();
        this.showNotification('Product removed from cart', 'info');
    }

    updateQuantity(productId, newQuantity) {
        const item = this.items.find(item => item.id === productId);
        
        if (item) {
            if (newQuantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = newQuantity;
                this.saveCartToStorage();
                this.updateCartUI();
            }
        }
    }

    increaseQuantity(productId) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            this.updateQuantity(productId, item.quantity + 1);
        }
    }

    decreaseQuantity(productId) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            this.updateQuantity(productId, item.quantity - 1);
        }
    }

    clearCart() {
        this.items = [];
        this.saveCartToStorage();
        this.updateCartUI();
        this.showNotification('Cart cleared', 'info');
    }

    getTotal() {
        return this.items.reduce((total, item) => {
            return total + (parseFloat(item.price.replace('$', '')) * item.quantity);
        }, 0);
    }

    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    updateCartUI() {
        this.updateCartCount();
        this.updateCartItems();
        this.updateCartTotal();
    }

    updateCartCount() {
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            const count = this.getItemCount();
            cartCountElement.textContent = count;
            cartCountElement.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    updateCartItems() {
        const cartItemsContainer = document.getElementById('cart-items');
        if (!cartItemsContainer) return;

        if (this.items.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Your cart is empty</h3>
                    <p>Add some products to get started</p>
                    <button class="btn btn-primary" onclick="cart.closeCart(); window.location.href='${this.getShopUrl()}'">
                        Start Shopping
                    </button>
                </div>
            `;
            return;
        }

        cartItemsContainer.innerHTML = this.items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    ${item.image.startsWith('fas') ? `<i class="${item.image}"></i>` : `<img src="${item.image}" alt="${item.name}">`}
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price}</div>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="cart.decreaseQuantity('${item.id}')">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="cart.increaseQuantity('${item.id}')">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <button class="remove-item" onclick="cart.removeItem('${item.id}')" title="Remove item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    updateCartTotal() {
        const cartTotalElement = document.getElementById('cart-total');
        if (cartTotalElement) {
            cartTotalElement.textContent = this.getTotal().toFixed(2);
        }
    }

    saveCartToStorage() {
        try {
            localStorage.setItem('quickbasket_cart', JSON.stringify(this.items));
        } catch (error) {
            console.error('Error saving cart to storage:', error);
        }
    }

    loadCartFromStorage() {
        try {
            const savedCart = localStorage.getItem('quickbasket_cart');
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error('Error loading cart from storage:', error);
            return [];
        }
    }

    getShopUrl() {
        const currentPath = window.location.pathname;
        if (currentPath.includes('/pages/')) {
            return '../index.html#categories';
        }
        return 'index.html#categories';
    }

    showNotification(message, type = 'success') {
        const notificationContainer = document.getElementById('notification-container');
        if (!notificationContainer) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const iconMap = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        notification.innerHTML = `
            <i class="${iconMap[type] || iconMap.info}"></i>
            <div class="notification-text">
                <div class="notification-title">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
                <div class="notification-message">${message}</div>
            </div>
        `;

        notificationContainer.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Method to handle checkout
    proceedToCheckout() {
        if (this.items.length === 0) {
            this.showNotification('Your cart is empty!', 'warning');
            return;
        }

        // Save cart data for checkout page
        const checkoutData = {
            items: this.items,
            total: this.getTotal(),
            itemCount: this.getItemCount(),
            timestamp: Date.now()
        };

        try {
            localStorage.setItem('quickbasket_checkout', JSON.stringify(checkoutData));
            
            // Navigate to checkout page
            const currentPath = window.location.pathname;
            if (currentPath.includes('/pages/')) {
                window.location.href = 'checkout.html';
            } else {
                window.location.href = 'pages/checkout.html';
            }
        } catch (error) {
            console.error('Error preparing checkout:', error);
            this.showNotification('Error proceeding to checkout', 'error');
        }
    }

    // Method to get cart summary for other pages
    getCartSummary() {
        return {
            items: this.items,
            total: this.getTotal(),
            itemCount: this.getItemCount()
        };
    }

    // Method to validate cart (check stock, prices, etc.)
    async validateCart() {
        // In a real application, this would check with the server
        // to validate stock availability and current prices
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    valid: true,
                    errors: []
                });
            }, 500);
        });
    }

    // Method to apply discount/coupon
    applyCoupon(couponCode) {
        // Simulate coupon validation
        const validCoupons = {
            'WELCOME10': { type: 'percentage', value: 10, description: '10% off your order' },
            'SAVE5': { type: 'fixed', value: 5, description: '$5 off your order' },
            'FREESHIP': { type: 'shipping', value: 0, description: 'Free shipping' }
        };

        const coupon = validCoupons[couponCode.toUpperCase()];
        
        if (coupon) {
            this.appliedCoupon = coupon;
            this.appliedCoupon.code = couponCode.toUpperCase();
            this.saveCartToStorage();
            this.updateCartUI();
            this.showNotification(`Coupon applied: ${coupon.description}`, 'success');
            return true;
        } else {
            this.showNotification('Invalid coupon code', 'error');
            return false;
        }
    }

    removeCoupon() {
        delete this.appliedCoupon;
        this.saveCartToStorage();
        this.updateCartUI();
        this.showNotification('Coupon removed', 'info');
    }

    // Method to calculate discount
    getDiscount() {
        if (!this.appliedCoupon) return 0;
        
        const subtotal = this.getTotal();
        
        switch (this.appliedCoupon.type) {
            case 'percentage':
                return subtotal * (this.appliedCoupon.value / 100);
            case 'fixed':
                return Math.min(this.appliedCoupon.value, subtotal);
            default:
                return 0;
        }
    }

    // Method to get final total after discount
    getFinalTotal() {
        return Math.max(0, this.getTotal() - this.getDiscount());
    }
}

// Global cart instance
let cart;

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    cart = new ShoppingCart();
    // Expose globally for modules referencing window.cart
    try { window.cart = cart; } catch (_) {}
});

// Global functions for easy access from HTML
function addToCart(productId, productData = null) {
    if (!cart) {
        console.error('Cart not initialized');
        return;
    }

    // If productData is not provided, create sample data
    if (!productData) {
        productData = {
            id: productId.toString(),
            name: `Product ${productId}`,
            price: '$9.99',
            originalPrice: '$12.99',
            image: 'fas fa-box'
        };
    }

    cart.addItem(productData);
}

function removeFromCart(productId) {
    if (cart) {
        cart.removeItem(productId);
    }
}

function updateCartQuantity(productId, quantity) {
    if (cart) {
        cart.updateQuantity(productId, quantity);
    }
}

function clearShoppingCart() {
    if (cart) {
        cart.clearCart();
    }
}

function openShoppingCart() {
    if (cart) {
        cart.openCart();
    }
}

function closeShoppingCart() {
    if (cart) {
        cart.closeCart();
    }
}

// CSS for slideOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ShoppingCart, cart };
}