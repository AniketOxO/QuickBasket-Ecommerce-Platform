/**
 * Wishlist Management System for QuickBasket
 * Handles wishlist functionality across all pages
 */

class WishlistManager {
    constructor() {
        this.wishlist = [];
        this.storageKey = 'quickbasket_wishlist';
        this.init();
    }

    init() {
        this.loadWishlist();
        this.updateWishlistUI();
        this.setupEventListeners();
        this.setupWishlistPage();
    }

    // Load wishlist from localStorage
    loadWishlist() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            this.wishlist = stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.warn('Error loading wishlist:', error);
            this.wishlist = [];
        }
    }

    // Save wishlist to localStorage
    saveWishlist() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.wishlist));
        } catch (error) {
            console.warn('Error saving wishlist:', error);
        }
    }

    // Add product to wishlist
    addToWishlist(productData) {
        const existingIndex = this.findProductIndex(productData);
        
        if (existingIndex === -1) {
            // Add timestamp and unique ID
            const wishlistItem = {
                ...productData,
                id: productData.id || `product_${Date.now()}`,
                addedAt: new Date().toISOString(),
                category: productData.category || 'general'
            };
            
            this.wishlist.push(wishlistItem);
            this.saveWishlist();
            this.updateWishlistUI();
            this.showNotification('💖 Added to wishlist!', 'success');
            return true;
        } else {
            this.showNotification('Already in wishlist', 'info');
            return false;
        }
    }

    // Remove product from wishlist
    removeFromWishlist(productData) {
        const existingIndex = this.findProductIndex(productData);
        
        if (existingIndex > -1) {
            this.wishlist.splice(existingIndex, 1);
            this.saveWishlist();
            this.updateWishlistUI();
            this.showNotification('Removed from wishlist', 'info');
            return true;
        }
        return false;
    }

    // Toggle product in/out of wishlist
    toggleWishlist(productData) {
        const isInWishlist = this.isInWishlist(productData);
        
        if (isInWishlist) {
            return this.removeFromWishlist(productData);
        } else {
            return this.addToWishlist(productData);
        }
    }

    // Check if product is in wishlist
    isInWishlist(productData) {
        return this.findProductIndex(productData) > -1;
    }

    // Find product index in wishlist
    findProductIndex(productData) {
        return this.wishlist.findIndex(item => {
            // Match by ID first, then by name
            if (productData.id && item.id) {
                return item.id === productData.id;
            }
            return item.name === productData.name;
        });
    }

    // Extract product data from various sources
    extractProductData(source) {
        if (typeof source === 'string') {
            // If it's a product name string
            return { name: source };
        }
        
        if (source.dataset) {
            // If it's a DOM element with data attributes
            return {
                id: source.dataset.productId,
                name: source.dataset.productName || source.querySelector('.product-name, .product-title')?.textContent,
                price: source.dataset.productPrice || source.querySelector('.price')?.textContent,
                image: source.dataset.productImage || source.querySelector('img')?.src,
                category: source.dataset.category || 'general'
            };
        }
        
        if (source.querySelector) {
            // If it's a product card element
            return {
                id: source.dataset.productId,
                name: source.querySelector('.product-name, .product-title')?.textContent,
                price: source.querySelector('.price')?.textContent,
                image: source.querySelector('img')?.src,
                category: source.dataset.category || 'general',
                rating: source.querySelector('.rating-value')?.textContent || '4.0'
            };
        }
        
        // If it's already a product object
        return source;
    }

    // Update wishlist UI elements
    updateWishlistUI() {
        // Update wishlist count in header
        const wishlistCountElements = document.querySelectorAll('#wishlist-count, .wishlist-count');
        const count = this.wishlist.length;
        
        wishlistCountElements.forEach(element => {
            if (element) {
                element.textContent = count;
                element.style.display = count > 0 ? 'flex' : 'none';
            }
        });

        // Update wishlist button states on product cards
        this.updateProductCardStates();
        
        // Update wishlist page if we're on it
        this.updateWishlistPage();
    }

    // Update product card wishlist button states
    updateProductCardStates() {
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            const productData = this.extractProductData(card);
            const wishlistBtn = card.querySelector('.wishlist-btn, .action-btn[title*="Wishlist"], .action-btn[onclick*="addToWishlist"]');
            
            if (wishlistBtn && productData.name) {
                const isInWishlist = this.isInWishlist(productData);
                const heartIcon = wishlistBtn.querySelector('i');
                
                if (heartIcon) {
                    heartIcon.className = isInWishlist ? 'fas fa-heart' : 'far fa-heart';
                }
                
                wishlistBtn.classList.toggle('active', isInWishlist);
                wishlistBtn.title = isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist';
                
                // Add click handler if not already present
                if (!wishlistBtn.hasAttribute('data-wishlist-handler')) {
                    wishlistBtn.setAttribute('data-wishlist-handler', 'true');
                    
                    // Remove existing onclick attribute and add proper event listener
                    wishlistBtn.removeAttribute('onclick');
                    wishlistBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.handleWishlistClick(card);
                    });
                }
            }
        });
    }

    // Handle wishlist button clicks
    handleWishlistClick(productCard) {
        const productData = this.extractProductData(productCard);
        const wishlistBtn = productCard.querySelector('.wishlist-btn, .action-btn[title*="Wishlist"]');
        
        if (productData.name) {
            const wasToggled = this.toggleWishlist(productData);
            
            if (wasToggled && wishlistBtn) {
                // Add visual feedback
                wishlistBtn.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    wishlistBtn.style.transform = 'scale(1)';
                }, 200);
                
                // Add heartbeat animation for added items
                if (this.isInWishlist(productData)) {
                    wishlistBtn.classList.add('heartbeat');
                    setTimeout(() => {
                        wishlistBtn.classList.remove('heartbeat');
                    }, 600);
                }
            }
        }
    }

    // Set up event listeners
    setupEventListeners() {
        // Handle wishlist icon click in header
        const wishlistIcon = document.querySelector('#wishlist-btn, .nav-icon[href*="wishlist"]');
        if (wishlistIcon) {
            wishlistIcon.addEventListener('click', (e) => {
                e.preventDefault();
                this.openWishlistModal();
            });
        }

        // Update UI when page loads
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => this.updateWishlistUI(), 100);
        });
    }

    // Open professional wishlist drawer
    openWishlistModal() {
        this.openWishlistDrawer();
    }

    // Open professional sliding drawer
    openWishlistDrawer() {
        // Remove any existing drawer
        const existingDrawer = document.querySelector('.wishlist-drawer');
        const existingOverlay = document.querySelector('.wishlist-drawer-overlay');
        
        if (existingDrawer) existingDrawer.remove();
        if (existingOverlay) existingOverlay.remove();

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'wishlist-drawer-overlay';
        
        // Create drawer
        const drawer = document.createElement('div');
        drawer.className = 'wishlist-drawer';
        
        // Generate drawer content
        drawer.innerHTML = this.generateDrawerHTML();
        
        // Add to DOM
        document.body.appendChild(overlay);
        document.body.appendChild(drawer);
        
        // Animate in
        setTimeout(() => {
            overlay.classList.add('active');
            drawer.classList.add('active');
        }, 10);
        
        // Close handlers
        overlay.addEventListener('click', () => this.closeWishlistDrawer());
        
        const closeBtn = drawer.querySelector('.wishlist-drawer-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeWishlistDrawer());
        }
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    // Close wishlist drawer
    closeWishlistDrawer() {
        const drawer = document.querySelector('.wishlist-drawer');
        const overlay = document.querySelector('.wishlist-drawer-overlay');
        
        if (drawer) {
            drawer.classList.remove('active');
        }
        
        if (overlay) {
            overlay.classList.remove('active');
        }
        
        setTimeout(() => {
            if (drawer) drawer.remove();
            if (overlay) overlay.remove();
            document.body.style.overflow = '';
        }, 400);
    }

    // Generate professional drawer HTML
    generateDrawerHTML() {
        const itemCount = this.wishlist.length;
        
        if (itemCount === 0) {
            return `
                <div class="wishlist-drawer-header">
                    <div class="wishlist-drawer-title">
                        <h2>
                            <i class="fas fa-heart"></i>
                            My Wishlist
                            <span class="wishlist-count-badge">0</span>
                        </h2>
                        <button class="wishlist-drawer-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                <div class="wishlist-drawer-body">
                    <div class="wishlist-empty-state">
                        <i class="far fa-heart"></i>
                        <h3>Your wishlist is empty</h3>
                        <p>Start browsing and add items you love to your wishlist.</p>
                        <button class="wishlist-empty-cta" onclick="wishlistManager.closeWishlistDrawer(); navigateWithTransition('pages/category.html', 'Loading products...')">
                            Start Shopping
                        </button>
                    </div>
                </div>
            `;
        }
        
        return `
            <div class="wishlist-drawer-header">
                <div class="wishlist-drawer-title">
                    <h2>
                        <i class="fas fa-heart"></i>
                        My Wishlist
                        <span class="wishlist-count-badge">${itemCount}</span>
                    </h2>
                    <button class="wishlist-drawer-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div class="wishlist-drawer-body">
                <div class="wishlist-items-container">
                    ${this.generateDrawerItemsHTML()}
                </div>
            </div>
            <div class="wishlist-drawer-footer">
                <div class="wishlist-footer-actions">
                    <button class="wishlist-footer-btn secondary" onclick="wishlistManager.clearWishlist()">
                        <i class="fas fa-trash"></i>
                        Clear All
                    </button>
                    <button class="wishlist-footer-btn primary" onclick="wishlistManager.addAllToCart()">
                        <i class="fas fa-cart-plus"></i>
                        Add All to Cart
                    </button>
                </div>
            </div>
        `;
    }

    // Generate drawer items HTML
    generateDrawerItemsHTML() {
        return this.wishlist.map(item => `
            <div class="wishlist-drawer-item" data-product-id="${item.id}">
                <div class="wishlist-item-content">
                    <div class="wishlist-item-image">
                        ${item.image && !item.image.startsWith('fas') ? 
                            `<img src="${item.image}" alt="${item.name}">` : 
                            `<i class="${item.image || 'fas fa-box'}"></i>`
                        }
                    </div>
                    <div class="wishlist-item-details">
                        <h4>${item.name}</h4>
                        <div class="price">${item.price || 'Price not available'}</div>
                        <div class="category">${item.category || 'General'}</div>
                    </div>
                    <div class="wishlist-item-actions">
                        <button class="wishlist-action-btn primary" onclick="wishlistManager.addToCartFromWishlist('${item.id}')">
                            <i class="fas fa-cart-plus"></i>
                            Add to Cart
                        </button>
                        <button class="wishlist-action-btn secondary" onclick="wishlistManager.removeFromWishlistById('${item.id}')">
                            <i class="fas fa-trash"></i>
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Generate HTML for wishlist items
    generateWishlistHTML() {
        if (this.wishlist.length === 0) {
            return '<div class="empty-wishlist">Your wishlist is empty</div>';
        }

        return this.wishlist.map(item => `
            <div class="wishlist-item" data-product-id="${item.id}">
                <div class="wishlist-item-image">
                    ${item.image ? `<img src="${item.image}" alt="${item.name}">` : '<i class="fas fa-box"></i>'}
                </div>
                <div class="wishlist-item-details">
                    <h4 class="wishlist-item-name">${item.name}</h4>
                    <div class="wishlist-item-price">${item.price || 'Price not available'}</div>
                    <div class="wishlist-item-category">${item.category}</div>
                </div>
                <div class="wishlist-item-actions">
                    <button class="btn btn-primary btn-sm" onclick="wishlistManager.addToCartFromWishlist('${item.id}')">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="wishlistManager.removeFromWishlistById('${item.id}')">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Remove item by ID
    removeFromWishlistById(itemId) {
        const index = this.wishlist.findIndex(item => item.id === itemId);
        if (index > -1) {
            this.wishlist.splice(index, 1);
            this.saveWishlist();
            this.updateWishlistUI();
            this.showNotification('Item removed from wishlist', 'info');
            
            // Update drawer if open
            const drawer = document.querySelector('.wishlist-drawer');
            if (drawer) {
                drawer.innerHTML = this.generateDrawerHTML();
                
                // Re-attach close handler
                const closeBtn = drawer.querySelector('.wishlist-drawer-close');
                if (closeBtn) {
                    closeBtn.addEventListener('click', () => this.closeWishlistDrawer());
                }
            }
        }
    }

    // Add to cart from wishlist
    addToCartFromWishlist(itemId) {
        const item = this.wishlist.find(item => item.id === itemId);
        if (item && window.cart) {
            window.cart.addItem({
                id: item.id, // ensure stable identity in cart
                name: item.name,
                price: item.price,
                originalPrice: item.originalPrice || item.price,
                image: item.image,
                quantity: 1
            });
            this.showNotification('Added to cart!', 'success');
        }
    }

    // Add all wishlist items to cart
    addAllToCart() {
        if (this.wishlist.length === 0) {
            this.showNotification('No items in wishlist', 'info');
            return;
        }

        let addedCount = 0;
        this.wishlist.forEach(item => {
            if (window.cart) {
                window.cart.addItem({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    originalPrice: item.originalPrice || item.price,
                    image: item.image,
                    quantity: 1
                });
                addedCount++;
            }
        });

        if (addedCount > 0) {
            this.showNotification(`Added ${addedCount} items to cart!`, 'success');
            this.closeWishlistDrawer();
        }
    }

    // Clear entire wishlist
    clearWishlist() {
        if (this.wishlist.length === 0) {
            this.showNotification('Wishlist is already empty', 'info');
            return;
        }

        if (confirm('Are you sure you want to clear your entire wishlist?')) {
            this.wishlist = [];
            this.saveWishlist();
            this.updateWishlistUI();
            this.showNotification('Wishlist cleared', 'info');
            
            // Update drawer if open
            const drawer = document.querySelector('.wishlist-drawer');
            if (drawer) {
                drawer.innerHTML = this.generateDrawerHTML();
                
                // Re-attach close handler
                const closeBtn = drawer.querySelector('.wishlist-drawer-close');
                if (closeBtn) {
                    closeBtn.addEventListener('click', () => this.closeWishlistDrawer());
                }
            }
        }
    }

    // Update wishlist page content
    updateWishlistPage() {
        const wishlistContainer = document.querySelector('.wishlist-container, #wishlist-container');
        if (wishlistContainer) {
            wishlistContainer.innerHTML = this.generateWishlistHTML();
        }
    }

    // Setup wishlist page if we're on it
    setupWishlistPage() {
        if (window.location.pathname.includes('wishlist')) {
            this.updateWishlistPage();
        }
    }

    // Show notification
    showNotification(message, type = 'info', duration = 3000) {
        if (window.quickBasketApp && window.quickBasketApp.showNotification) {
            window.quickBasketApp.showNotification(message, type, duration);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }

    // Get wishlist count
    getWishlistCount() {
        return this.wishlist.length;
    }

    // Get wishlist items
    getWishlistItems() {
        return [...this.wishlist];
    }
}

// Global wishlist function for backward compatibility
function addToWishlist(productIdentifier) {
    if (window.wishlistManager) {
        let productData;
        
        if (typeof productIdentifier === 'string') {
            // Try to find product card with this identifier
            const productCard = document.querySelector(`[data-product-id="${productIdentifier}"], [data-product-name="${productIdentifier}"]`);
            if (productCard) {
                productData = window.wishlistManager.extractProductData(productCard);
            } else {
                productData = { name: productIdentifier, id: productIdentifier };
            }
        } else {
            productData = productIdentifier;
        }
        
        window.wishlistManager.addToWishlist(productData);
    }
}

// Initialize wishlist manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.wishlistManager = new WishlistManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WishlistManager;
}
