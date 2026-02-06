/**
 * Main JavaScript file for QuickBasket E-commerce Site
 * Handles site-wide interactions, navigation, animations, and user experience
 */

class QuickBasketApp {
    constructor() {
        this.initializeApp();
    }

    initializeApp() {
        this.setupEventListeners();
        this.initializeModals();
        this.initializeAnimations();
        this.initializeMobileMenu();
        this.initializeNotifications();
        this.initializeScrollEffects();
        this.initializeFormValidation();
        this.loadInitialData();
    }

    setupEventListeners() {
        // Ensure handleDOMReady runs regardless of when this class is constructed
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.handleDOMReady());
        } else {
            // DOM is already parsed; run immediately
            this.handleDOMReady();
        }

        window.addEventListener('scroll', () => {
            this.handleScroll();
        });

        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Product interaction events
        document.addEventListener('click', (e) => {
            this.handleGlobalClicks(e);
        });

        // Form submission events
        document.addEventListener('submit', (e) => {
            this.handleFormSubmissions(e);
        });

        // Search input events
        const searchInputs = document.querySelectorAll('.search-input');
        searchInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                this.handleSearchInput(e);
            });
        });
    }

    handleDOMReady() {
        this.initializeProductCards();
        this.initializeFilterButtons();
        this.initializePriceSliders();
        this.initializeImageLazyLoading();
        this.initializeTooltips();
        this.initializeCarousels();
        this.updateCartBadge();
        this.initializeWishlist();
        this.initializeCategoryButtons();
        this.initializeSpecialOffers();
    }

    // Initialize category Shop Now buttons
    // Initialize category Shop Now buttons and card clicks
    initializeCategoryButtons() {
        const categoryCards = document.querySelectorAll('.category-card');
        
        categoryCards.forEach(card => {
            const shopButton = card.querySelector('.btn');
            const categoryName = card.dataset.category;
            
            if (categoryName) {
                // Handle entire card click
                card.addEventListener('click', (e) => {
                    // Don't trigger card click if button was clicked
                    if (!e.target.closest('.btn')) {
                        this.handleCategoryShop(categoryName, card);
                    }
                });
                
                // Add cursor pointer to indicate clickability
                card.style.cursor = 'pointer';
                
                // Handle shop button click
                if (shopButton) {
                    shopButton.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.handleCategoryShop(categoryName, card);
                    });
                    
                    // Add hover effects for button
                    shopButton.addEventListener('mouseenter', () => {
                        this.animateCategoryButton(shopButton, true);
                    });
                    
                    shopButton.addEventListener('mouseleave', () => {
                        this.animateCategoryButton(shopButton, false);
                    });
                }
                
                // Add hover effects for entire card
                card.addEventListener('mouseenter', () => {
                    this.animateCategoryCard(card, true);
                });
                
                card.addEventListener('mouseleave', () => {
                    this.animateCategoryCard(card, false);
                });
            }
        });
    }

    // Make Special Offers section functional
    initializeSpecialOffers() {
        const offerButtons = document.querySelectorAll('.special-offers [data-offer]');
        if (!offerButtons.length) return;

        offerButtons.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                const offer = btn.getAttribute('data-offer');
                const category = btn.getAttribute('data-category');

                // Visual feedback
                const originalHtml = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Working...';
                btn.disabled = true;

                try {
                    await this.applyOfferAction(offer, category);
                } finally {
                    // restore UI shortly after
                    setTimeout(() => {
                        btn.innerHTML = originalHtml;
                        btn.disabled = false;
                    }, 800);
                }
            });
        });
    }

    async applyOfferAction(offer, category) {
        switch ((offer || '').toLowerCase()) {
            case 'fruits50':
                // Navigate to fruits with a filter (query param) and cue message
                if (window.quickBasketApp) {
                    this.showNotification('Loading Fruits with 50% OFF deals…', 'info');
                }
                if (window.navigateWithTransition) {
                    navigateWithTransition(`pages/category.html?cat=${encodeURIComponent(category || 'fruits')}&deal=50off`, 'Loading deals…');
                } else {
                    window.location.href = `pages/category.html?cat=${encodeURIComponent(category || 'fruits')}&deal=50off`;
                }
                break;
            case 'free-delivery':
                // Apply free shipping coupon if cart is present; otherwise take user to checkout to apply later
                if (window.cart && typeof window.cart.applyCoupon === 'function') {
                    const applied = window.cart.applyCoupon('FREESHIP');
                    if (applied && window.quickBasketApp) {
                        this.showNotification('Free Delivery applied to your cart!', 'success');
                    }
                } else if (window.quickBasketApp) {
                    this.showNotification('We’ll apply Free Delivery at checkout.', 'info');
                }
                // Optionally nudge to checkout
                break;
            case 'bogo':
                // Navigate to snacks with bogo flag
                if (window.quickBasketApp) {
                    this.showNotification('Opening Snacks with Buy 2 Get 1 offers…', 'info');
                }
                if (window.navigateWithTransition) {
                    navigateWithTransition(`pages/category.html?cat=${encodeURIComponent(category || 'snacks')}&deal=bogo`, 'Loading offers…');
                } else {
                    window.location.href = `pages/category.html?cat=${encodeURIComponent(category || 'snacks')}&deal=bogo`;
                }
                break;
            default:
                if (window.quickBasketApp) {
                    this.showNotification('Offer coming soon.', 'warning');
                }
        }
    }

    // Handle category shopping navigation
    handleCategoryShop(categoryName, card) {
        // Show loading animation on card
        this.showCategoryLoadingAnimation(card);
        
        // Animate card click
        this.animateCategoryCardClick(card);
        
        // Create loading message for the specific category
        const loadingMessage = `Loading ${this.getCategoryDisplayName(categoryName)}...`;
        
        // Navigate with transition after animation
        setTimeout(() => {
            if (window.navigateWithTransition) {
                navigateWithTransition(`pages/category.html?cat=${categoryName}`, loadingMessage);
            } else {
                window.location.href = `pages/category.html?cat=${categoryName}`;
            }
        }, 400);
    }

    // Get display name for category
    getCategoryDisplayName(categoryName) {
        const displayNames = {
            'beverages': 'Beverages',
            'chocolates': 'Chocolates & Sweets',
            'dairy': 'Dairy & Breads',
            'fruits': 'Fruits & Vegetables',
            'noodles': 'Noodles & Pasta',
            'snacks': 'Snacks & Namkeen'
        };
        return displayNames[categoryName] || categoryName;
    }

    // Animate category button on hover
    animateCategoryButton(button, isHover) {
        if (isHover) {
            button.style.transform = 'translateY(-2px) scale(1.05)';
            button.style.boxShadow = '0 8px 25px rgba(231, 76, 60, 0.3)';
        } else {
            button.style.transform = 'translateY(0) scale(1)';
            button.style.boxShadow = '';
        }
    }

    // Show loading animation on category card
    showCategoryLoadingAnimation(card) {
        const button = card.querySelector('.btn');
        if (button) {
            const originalText = button.textContent;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            button.style.pointerEvents = 'none';
            
            // Reset after navigation
            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.pointerEvents = '';
            }, 1000);
        }
    }

    // Animate category card on click and hover
    animateCategoryCard(card, isHover = false) {
        if (isHover) {
            // Hover animation
            card.style.transform = 'translateY(-8px) scale(1.03)';
            card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
            card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        } else {
            // Reset hover animation
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '';
        }
    }
    
    // Animate category card on click
    animateCategoryCardClick(card) {
        card.style.transform = 'scale(0.95)';
        card.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            card.style.transform = 'scale(1.02)';
        }, 150);
        
        setTimeout(() => {
            card.style.transform = 'scale(1)';
        }, 300);
    }

    handleScroll() {
        this.updateHeaderOnScroll();
        this.updateScrollProgress();
        this.triggerAnimationsOnScroll();
        this.handleInfiniteScroll();
    }

    handleResize() {
        this.adjustLayoutForScreenSize();
        this.repositionModals();
        this.adjustMobileMenu();
    }

    // Mobile Menu Functionality
    initializeMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const mobileMenu = document.querySelector('.mobile-menu');
        const overlay = document.querySelector('.mobile-overlay');

        if (hamburger && mobileMenu) {
            hamburger.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        if (overlay) {
            overlay.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }

        // Close mobile menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const mobileMenu = document.querySelector('.mobile-menu');
        const overlay = document.querySelector('.mobile-overlay');
        const body = document.body;

        if (mobileMenu && hamburger) {
            const isOpen = mobileMenu.classList.contains('active');
            
            if (isOpen) {
                this.closeMobileMenu();
            } else {
                mobileMenu.classList.add('active');
                hamburger.classList.add('active');
                if (overlay) overlay.classList.add('active');
                body.style.overflow = 'hidden';
            }
        }
    }

    closeMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const mobileMenu = document.querySelector('.mobile-menu');
        const overlay = document.querySelector('.mobile-overlay');
        const body = document.body;

        if (mobileMenu) {
            mobileMenu.classList.remove('active');
        }
        if (hamburger) {
            hamburger.classList.remove('active');
        }
        if (overlay) {
            overlay.classList.remove('active');
        }
        body.style.overflow = '';
    }

    adjustMobileMenu() {
        const mobileMenu = document.querySelector('.mobile-menu');
        if (mobileMenu && window.innerWidth > 768) {
            this.closeMobileMenu();
        }
    }

    // Header Scroll Effects
    updateHeaderOnScroll() {
        const header = document.querySelector('.header');
        const scrolled = window.scrollY > 100;

        if (header) {
            header.classList.toggle('scrolled', scrolled);
        }
    }

    updateScrollProgress() {
        const progressBar = document.querySelector('.scroll-progress');
        if (progressBar) {
            const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
        }
    }

    // Product Card Interactions
    initializeProductCards() {
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            this.setupProductCardEvents(card);
        });
    }

    setupProductCardEvents(card) {
        // Quick view functionality
        const quickViewBtn = card.querySelector('.quick-view-btn');
        if (quickViewBtn) {
            quickViewBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.openQuickView(card);
            });
        }

        // Wishlist functionality
        const wishlistBtn = card.querySelector('.wishlist-btn');
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleWishlist(card);
            });
        }

        // Add to cart from product card
        const addToCartBtn = card.querySelector('.add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.addToCartFromCard(card);
            });
        }

        // Product card hover effects
        card.addEventListener('mouseenter', () => {
            this.animateProductCard(card, true);
        });

        card.addEventListener('mouseleave', () => {
            this.animateProductCard(card, false);
        });
    }

    animateProductCard(card, isHover) {
        const image = card.querySelector('.product-image img');
        const actions = card.querySelector('.product-actions');
        
        if (isHover) {
            if (image) {
                image.style.transform = 'scale(1.05)';
            }
            if (actions) {
                actions.style.opacity = '1';
                actions.style.transform = 'translateY(0)';
            }
        } else {
            if (image) {
                image.style.transform = 'scale(1)';
            }
            if (actions) {
                actions.style.opacity = '0';
                actions.style.transform = 'translateY(10px)';
            }
        }
    }

    // Quick View Modal
    openQuickView(productCard) {
        const productData = this.extractProductData(productCard);
        this.createQuickViewModal(productData);
    }

    extractProductData(card) {
        const name = card.querySelector('.product-name')?.textContent || '';
        const price = card.querySelector('.product-price')?.textContent || '';
        const image = card.querySelector('.product-image img')?.src || '';
        const rating = card.querySelector('.product-rating .rating-value')?.textContent || '0';
        const description = card.dataset.description || 'No description available';
        
        return { name, price, image, rating, description };
    }

    createQuickViewModal(product) {
        const modal = document.createElement('div');
        modal.className = 'modal quick-view-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" onclick="this.closest('.modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
                <div class="quick-view-content">
                    <div class="quick-view-image">
                        <img src="${product.image}" alt="${product.name}" loading="lazy">
                    </div>
                    <div class="quick-view-details">
                        <h3 class="product-name">${product.name}</h3>
                        <div class="product-rating">
                            ${this.generateStarRating(product.rating)}
                            <span class="rating-count">(${Math.floor(Math.random() * 100) + 1} reviews)</span>
                        </div>
                        <div class="product-price">${product.price}</div>
                        <p class="product-description">${product.description}</p>
                        <div class="quick-view-actions">
                            <div class="quantity-selector">
                                <button class="quantity-btn minus">-</button>
                                <input type="number" value="1" min="1" class="quantity-input">
                                <button class="quantity-btn plus">+</button>
                            </div>
                            <button class="btn btn-primary add-to-cart-btn">
                                <i class="fas fa-shopping-cart"></i>
                                Add to Cart
                            </button>
                            <button class="btn btn-outline wishlist-btn">
                                <i class="far fa-heart"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.setupModalEvents(modal);
        this.showModal(modal);
    }

    generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let stars = '';
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return `<div class="stars">${stars}</div><span class="rating-value">${rating}</span>`;
    }

    // Modal Management
    initializeModals() {
        // Close modals on outside click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideModal(e.target);
            }
        });

        // Close modals on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.modal.active');
                if (activeModal) {
                    this.hideModal(activeModal);
                }
            }
        });
    }

    setupModalEvents(modal) {
        // Quantity selector
        const quantityBtns = modal.querySelectorAll('.quantity-btn');
        const quantityInput = modal.querySelector('.quantity-input');

        quantityBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const isPlus = btn.classList.contains('plus');
                const currentValue = parseInt(quantityInput.value);
                
                if (isPlus) {
                    quantityInput.value = currentValue + 1;
                } else if (currentValue > 1) {
                    quantityInput.value = currentValue - 1;
                }
            });
        });

        // Add to cart from modal
        const addToCartBtn = modal.querySelector('.add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                this.addToCartFromModal(modal);
            });
        }

        // Wishlist toggle
        const wishlistBtn = modal.querySelector('.wishlist-btn');
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', () => {
                this.toggleWishlistFromModal(modal);
            });
        }
    }

    showModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Animate in
        requestAnimationFrame(() => {
            modal.style.opacity = '1';
            const content = modal.querySelector('.modal-content');
            if (content) {
                content.style.transform = 'scale(1) translateY(0)';
            }
        });
    }

    hideModal(modal) {
        modal.style.opacity = '0';
        const content = modal.querySelector('.modal-content');
        if (content) {
            content.style.transform = 'scale(0.9) translateY(20px)';
        }
        
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    }

    // Wishlist Functionality - integrated with WishlistManager
    initializeWishlist() {
        // Wait for wishlist manager to be ready
        if (window.wishlistManager) {
            this.updateWishlistUI();
        } else {
            // Wait for wishlist manager to load
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => this.updateWishlistUI(), 100);
            });
        }
    }

    toggleWishlist(productCard) {
        if (window.wishlistManager) {
            const productData = this.extractProductData(productCard);
            return window.wishlistManager.toggleWishlist(productData);
        } else {
            console.warn('Wishlist manager not available');
            return false;
        }
    }

    saveWishlist() {
        // Handled by WishlistManager
        if (window.wishlistManager) {
            window.wishlistManager.saveWishlist();
        }
    }

    updateWishlistUI() {
        // Handled by WishlistManager
        if (window.wishlistManager) {
            window.wishlistManager.updateWishlistUI();
        }
    }

    // Cart Integration
    addToCartFromCard(productCard) {
        const productData = this.extractProductData(productCard);
        this.addToCartAnimation(productCard, () => {
            if (window.cart) {
                window.cart.addItem({
                    name: productData.name,
                    price: productData.price,
                    image: productData.image,
                    quantity: 1
                });
            }
        });
    }

    addToCartFromModal(modal) {
        const quantity = parseInt(modal.querySelector('.quantity-input').value);
        const productName = modal.querySelector('.product-name').textContent;
        const productPrice = modal.querySelector('.product-price').textContent;
        const productImage = modal.querySelector('.quick-view-image img').src;
        
        if (window.cart) {
            window.cart.addItem({
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: quantity
            });
        }
        
        this.hideModal(modal);
    }

    addToCartAnimation(productCard, callback) {
        const productImage = productCard.querySelector('.product-image img');
        const cartIcon = document.querySelector('.cart-icon');
        
        if (productImage && cartIcon) {
            // Create flying image animation
            const flyingImage = productImage.cloneNode(true);
            flyingImage.style.position = 'fixed';
            flyingImage.style.width = '50px';
            flyingImage.style.height = '50px';
            flyingImage.style.zIndex = '9999';
            flyingImage.style.transition = 'all 0.8s ease-in-out';
            flyingImage.style.pointerEvents = 'none';
            
            const imageRect = productImage.getBoundingClientRect();
            const cartRect = cartIcon.getBoundingClientRect();
            
            flyingImage.style.left = imageRect.left + 'px';
            flyingImage.style.top = imageRect.top + 'px';
            
            document.body.appendChild(flyingImage);
            
            setTimeout(() => {
                flyingImage.style.left = cartRect.left + 'px';
                flyingImage.style.top = cartRect.top + 'px';
                flyingImage.style.transform = 'scale(0.3)';
                flyingImage.style.opacity = '0.7';
            }, 100);
            
            setTimeout(() => {
                flyingImage.remove();
                if (callback) callback();
                this.animateCartIcon();
            }, 900);
        } else {
            if (callback) callback();
        }
    }

    animateCartIcon() {
        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon) {
            cartIcon.style.transform = 'scale(1.2)';
            setTimeout(() => {
                cartIcon.style.transform = 'scale(1)';
            }, 200);
        }
    }

    updateCartBadge() {
        const cartBadge = document.querySelector('.cart-badge');
        const cartData = JSON.parse(localStorage.getItem('quickbasket_cart')) || [];
        const itemCount = cartData.reduce((count, item) => count + item.quantity, 0);
        
        if (cartBadge) {
            cartBadge.textContent = itemCount;
            cartBadge.style.display = itemCount > 0 ? 'block' : 'none';
        }
    }

    // Filter and Search Enhancement
    initializeFilterButtons() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleFilterClick(btn);
            });
        });
    }

    handleFilterClick(btn) {
        // Remove active class from all filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');
        
        // Animate filter change
        const productGrid = document.querySelector('.products-grid');
        if (productGrid) {
            productGrid.style.opacity = '0.7';
            setTimeout(() => {
                productGrid.style.opacity = '1';
            }, 300);
        }
    }

    initializePriceSliders() {
        const priceSliders = document.querySelectorAll('.price-slider');
        
        priceSliders.forEach(slider => {
            slider.addEventListener('input', (e) => {
                this.updatePriceDisplay(e.target);
            });
        });
    }

    updatePriceDisplay(slider) {
        const value = slider.value;
        const display = slider.parentElement.querySelector('.price-display');
        if (display) {
            display.textContent = `$${value}`;
        }
    }

    // Image Lazy Loading
    initializeImageLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }

    // Animations
    initializeAnimations() {
        // Fade in animations
        const animatedElements = document.querySelectorAll('.fade-in, .slide-up, .slide-in-left, .slide-in-right');
        
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, { threshold: 0.1 });
        
        animatedElements.forEach(el => animationObserver.observe(el));
    }

    triggerAnimationsOnScroll() {
        const scrolled = window.scrollY;
        const rate = scrolled * -0.5;
        
        // Parallax effect for hero section
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
        
        // Fade effect for header
        const header = document.querySelector('.header');
        if (header && scrolled > 50) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else if (header) {
            header.style.background = 'white';
            header.style.backdropFilter = 'none';
        }
    }

    // Notification System
    initializeNotifications() {
        if (!document.querySelector('.notification-container')) {
            const container = document.createElement('div');
            container.className = 'notification-container';
            container.id = 'notification-container';
            document.body.appendChild(container);
        }
    }

    showNotification(message, type = 'info', duration = 3000) {
        const container = document.getElementById('notification-container');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        // Enhanced notification structure with icon and better content
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
            </div>
            <div class="notification-text">
                <div class="notification-title">${this.getNotificationTitle(type)}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        container.appendChild(notification);

        // Enhanced animation entrance
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0) scale(1)';
        });

        // Auto remove with fade out
        setTimeout(() => {
            this.hideNotification(notification);
        }, duration);

        // Add hover pause functionality
        let timeoutId = setTimeout(() => {
            this.hideNotification(notification);
        }, duration);

        notification.addEventListener('mouseenter', () => {
            clearTimeout(timeoutId);
        });

        notification.addEventListener('mouseleave', () => {
            timeoutId = setTimeout(() => {
                this.hideNotification(notification);
            }, 1000); // Give 1 more second after mouse leave
        });
    }

    getNotificationTitle(type) {
        const titles = {
            success: 'Success!',
            error: 'Error',
            warning: 'Warning',
            info: 'Info'
        };
        return titles[type] || titles.info;
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    hideNotification(notification) {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(120%) scale(0.9)';
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }

    // Global Click Handler
    handleGlobalClicks(e) {
        // Handle category clicks
        if (e.target.matches('.category-card, .category-card *')) {
            const categoryCard = e.target.closest('.category-card');
            if (categoryCard) {
                this.handleCategoryClick(categoryCard);
            }
        }

        // Handle product clicks (but ignore clicks on actions like Add to Cart or Wishlist)
        const clickedProductCard = e.target.closest('.product-card');
        if (clickedProductCard) {
            // If the click originated on an interactive action inside the card, do nothing here
            const isAction = !!e.target.closest('.product-actions, .wishlist-btn, .add-to-cart, .add-to-cart-btn, .quick-view-btn');
            if (!isAction) {
                this.handleProductClick(clickedProductCard);
            }
        }

        // Handle back to top button
        if (e.target.matches('.back-to-top, .back-to-top *')) {
            this.scrollToTop();
        }
    }

    handleCategoryClick(categoryCard) {
        // Get category from data attribute
        const categoryName = categoryCard.dataset.category;
        if (categoryName) {
            // Use the same function as button clicks for consistency
            this.handleCategoryShop(categoryName, categoryCard);
        }
    }

    handleProductClick(productCard) {
        const productName = productCard.querySelector('.product-name')?.textContent;
        const productId = productCard.dataset.productId;
        
        if (productName) {
            // Navigate to product detail page with product information
            const params = new URLSearchParams();
            if (productId) {
                params.append('id', productId);
            } else {
                params.append('name', productName);
            }
            // Build a correct relative path whether we're on / or /pages/
            const base = window.location.pathname.includes('/pages/') ? '' : 'pages/';
            window.location.href = `${base}product-detail.html?${params.toString()}`;
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Form Validation
    initializeFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                }
            });
        });
    }

    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                this.showFieldError(input, 'This field is required');
                isValid = false;
            } else {
                this.clearFieldError(input);
            }
        });
        
        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        
        let errorElement = field.parentElement.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'field-error';
            field.parentElement.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentElement.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    // Initialize tooltips
    initializeTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.showTooltip(e.target);
            });
            
            element.addEventListener('mouseleave', (e) => {
                this.hideTooltip(e.target);
            });
        });

        // Add special tooltip for location selector
        const locationSelector = document.getElementById('location-selector');
        if (locationSelector) {
            locationSelector.addEventListener('mouseenter', () => {
                this.showLocationTooltip(locationSelector);
            });
            
            locationSelector.addEventListener('mouseleave', () => {
                this.hideTooltip(locationSelector);
            });
        }
    }

    showLocationTooltip(element) {
        const currentLocation = element.querySelector('#delivery-location')?.textContent || 'Select location';
        const tooltipText = `Current delivery location: ${currentLocation}. Click to change.`;
        
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip location-tooltip';
        tooltip.textContent = tooltipText;
        
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.bottom + 5 + 'px';
        
        setTimeout(() => {
            tooltip.classList.add('show');
        }, 10);
        
        element._tooltip = tooltip;
    }

    showTooltip(element) {
        const tooltipText = element.dataset.tooltip;
        if (!tooltipText) return;
        
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = tooltipText;
        
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
        
        setTimeout(() => {
            tooltip.classList.add('show');
        }, 10);
        
        element._tooltip = tooltip;
    }

    hideTooltip(element) {
        if (element._tooltip) {
            element._tooltip.remove();
            delete element._tooltip;
        }
    }

    // Carousel functionality
    initializeCarousels() {
        const carousels = document.querySelectorAll('.carousel');
        
        carousels.forEach(carousel => {
            this.setupCarousel(carousel);
        });
    }

    setupCarousel(carousel) {
        const track = carousel.querySelector('.carousel-track');
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevBtn = carousel.querySelector('.carousel-prev');
        const nextBtn = carousel.querySelector('.carousel-next');
        const indicators = carousel.querySelectorAll('.carousel-indicator');
        
        let currentSlide = 0;
        const totalSlides = slides.length;
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
                this.updateCarousel(carousel, currentSlide);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentSlide = (currentSlide + 1) % totalSlides;
                this.updateCarousel(carousel, currentSlide);
            });
        }
        
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                currentSlide = index;
                this.updateCarousel(carousel, currentSlide);
            });
        });
        
        // Auto-play
        if (carousel.dataset.autoplay) {
            setInterval(() => {
                currentSlide = (currentSlide + 1) % totalSlides;
                this.updateCarousel(carousel, currentSlide);
            }, parseInt(carousel.dataset.autoplay) || 5000);
        }
    }

    updateCarousel(carousel, slideIndex) {
        const track = carousel.querySelector('.carousel-track');
        const indicators = carousel.querySelectorAll('.carousel-indicator');
        
        if (track) {
            track.style.transform = `translateX(-${slideIndex * 100}%)`;
        }
        
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === slideIndex);
        });
    }

    // Data loading
    loadInitialData() {
        // Update cart badge on page load
        this.updateCartBadge();
        
        // Load user preferences
        this.loadUserPreferences();
        
        // Initialize recently viewed products
        this.initializeRecentlyViewed();
        
        // Initialize delivery location
        this.initializeDeliveryLocation();
    }

    initializeDeliveryLocation() {
        // Load saved location from localStorage
        try {
            const savedLocation = localStorage.getItem('quickbasket_delivery_location');
            if (savedLocation) {
                updateDeliveryLocation(savedLocation);
                
                // Trigger location change event for other components
                const locationChangeEvent = new CustomEvent('locationChanged', {
                    detail: { location: savedLocation, timestamp: Date.now() }
                });
                document.dispatchEvent(locationChangeEvent);
            }
        } catch (error) {
            console.warn('Could not load saved location:', error);
            // Set default location
            updateDeliveryLocation('New York 10001');
        }
    }

    loadUserPreferences() {
        const preferences = JSON.parse(localStorage.getItem('quickbasket_preferences')) || {};
        
        // Apply theme if set
        if (preferences.theme) {
            document.body.classList.add(preferences.theme);
        }
        
        // Apply other preferences
        if (preferences.currency) {
            this.currentCurrency = preferences.currency;
        }
    }

    initializeRecentlyViewed() {
        this.recentlyViewed = JSON.parse(localStorage.getItem('quickbasket_recently_viewed')) || [];
    }

    // Layout adjustments
    adjustLayoutForScreenSize() {
        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
        
        // Adjust grid layouts
        const productGrids = document.querySelectorAll('.products-grid');
        productGrids.forEach(grid => {
            if (isMobile) {
                grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
            } else if (isTablet) {
                grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
            } else {
                grid.style.gridTemplateColumns = 'repeat(4, 1fr)';
            }
        });
    }

    repositionModals() {
        const activeModals = document.querySelectorAll('.modal.active');
        activeModals.forEach(modal => {
            const content = modal.querySelector('.modal-content');
            if (content) {
                // Recenter modal content
                content.style.marginTop = '0';
                content.style.marginBottom = '0';
            }
        });
    }

    // Infinite scroll for product listings
    handleInfiniteScroll() {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 1000) {
            // Load more products if on a product listing page
            if (window.location.pathname.includes('products.html') || 
                window.location.pathname.includes('category.html')) {
                this.loadMoreProducts();
            }
        }
    }

    loadMoreProducts() {
        // Prevent multiple simultaneous loads
        if (this.loadingMore) return;
        this.loadingMore = true;
        
        // Show loading indicator
        this.showLoadingIndicator();
        
        // Simulate loading delay
        setTimeout(() => {
            // Hide loading indicator
            this.hideLoadingIndicator();
            this.loadingMore = false;
            
            // In a real app, this would fetch more products from an API
            // Suppress popup toast per user preference; leave silently
            // this.showNotification('All products loaded', 'info');
        }, 1000);
    }

    showLoadingIndicator() {
        let indicator = document.querySelector('.loading-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'loading-indicator';
            indicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading more products...';
            document.body.appendChild(indicator);
        }
        indicator.style.display = 'flex';
    }

    hideLoadingIndicator() {
        const indicator = document.querySelector('.loading-indicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.quickBasketApp = new QuickBasketApp();
});

// Global functions for button functionality
function scrollToCategories() {
    // Use section transitions for smooth loading effect
    if (window.sectionTransitions) {
        window.sectionTransitions.goToSection('categories', 'Loading Categories...');
        
        // Add visual feedback
        if (window.quickBasketApp) {
            window.quickBasketApp.showNotification('Navigating to categories', 'info', 1500);
        }
    } else {
        // Fallback to regular smooth scroll
        const categoriesSection = document.querySelector('#categories');
        if (categoriesSection) {
            categoriesSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
            
            // Add visual feedback
            if (window.quickBasketApp) {
                window.quickBasketApp.showNotification('Scroll to categories', 'info', 1500);
            }
            
            // Add bounce animation to categories
            setTimeout(() => {
                categoriesSection.style.animation = 'bounce 0.6s ease-in-out';
                setTimeout(() => {
                    categoriesSection.style.animation = '';
                }, 600);
            }, 800);
        }
    }
}

// Enhanced section navigation with loading transitions
function goToSection(sectionId, sectionName) {
    if (window.sectionTransitions) {
        window.sectionTransitions.goToSection(sectionId, sectionName);
    } else {
        // Fallback to regular scroll
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

// Navigate to popular products with transition
function scrollToProducts() {
    if (window.sectionTransitions) {
        window.sectionTransitions.goToSection('popular-products', 'Loading Popular Products...');
    } else {
        goToSection('popular-products', 'Loading Popular Products...');
    }
}

// Navigate to features with transition
function scrollToFeatures() {
    if (window.sectionTransitions) {
        window.sectionTransitions.goToSection('features', 'Loading Our Features...');
    } else {
        goToSection('features', 'Loading Our Features...');
    }
}

function openLocationModal() {
    // Use the existing LocationManager if available
    if (window.locationManager) {
        window.locationManager.openModal();
        return;
    }
    
    // Fallback: Use the existing location modal in the DOM
    const existingModal = document.getElementById('location-modal');
    if (existingModal) {
        existingModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus the search input
        const searchInput = document.getElementById('location-search');
        if (searchInput) {
            setTimeout(() => {
                searchInput.focus();
            }, 100);
        }
        
        // Show success notification
        if (window.quickBasketApp) {
            window.quickBasketApp.showNotification('Select your delivery location', 'info', 1500);
        }
        
        return;
    }
    
    // Final fallback: create a simple location modal
    const modal = document.createElement('div');
    modal.className = 'modal location-modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Select Delivery Location</h3>
                <button class="modal-close" onclick="closeLocationModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <p>Choose your delivery location for faster service:</p>
                <div class="location-options">
                    <div class="location-option" onclick="selectLocation('New York 10001')">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>New York 10001</span>
                    </div>
                    <div class="location-option" onclick="selectLocation('Brooklyn 11201')">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>Brooklyn 11201</span>
                    </div>
                    <div class="location-option" onclick="selectLocation('Manhattan 10010')">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>Manhattan 10010</span>
                    </div>
                    <div class="location-option" onclick="selectLocation('Queens 11101')">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>Queens 11101</span>
                    </div>
                </div>
                <div class="custom-location">
                    <input type="text" placeholder="Enter your ZIP code" class="location-input">
                    <button onclick="setCustomLocation()" class="btn btn-primary">Set Location</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Add modal styles if not exists
    if (!document.querySelector('#location-modal-styles')) {
        const styles = document.createElement('style');
        styles.id = 'location-modal-styles';
        styles.textContent = `
            .location-modal .modal-content {
                max-width: 500px;
                background: #2d2d2d;
                color: white;
                border-radius: 16px;
                transform: scale(1) translateY(0);
                transition: all 0.3s ease;
            }
            .location-modal .modal-header {
                background: var(--primary-color);
                padding: 20px 30px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-radius: 16px 16px 0 0;
            }
            .location-modal .modal-body {
                padding: 30px;
            }
            .location-options {
                display: grid;
                gap: 15px;
                margin: 20px 0;
            }
            .location-option {
                display: flex;
                align-items: center;
                gap: 15px;
                padding: 15px 20px;
                background: rgba(255,255,255,0.05);
                border-radius: 10px;
                cursor: pointer;
                transition: all 0.3s ease;
                border: 2px solid transparent;
            }
            .location-option:hover {
                background: rgba(231, 76, 60, 0.1);
                border-color: var(--primary-color);
                transform: translateY(-2px);
            }
            .location-option i {
                color: var(--primary-color);
                font-size: 1.2rem;
            }
            .custom-location {
                display: flex;
                gap: 10px;
                margin-top: 20px;
            }
            .location-input {
                flex: 1;
                padding: 12px 16px;
                border: 2px solid #444;
                border-radius: 8px;
                background: #1f1f1f;
                color: white;
                font-size: 1rem;
            }
            .location-input:focus {
                outline: none;
                border-color: var(--primary-color);
            }
        `;
        document.head.appendChild(styles);
    }
}

function closeLocationModal() {
    // Try to close using LocationManager first
    if (window.locationManager && typeof window.locationManager.closeModal === 'function') {
        window.locationManager.closeModal();
        return;
    }
    
    // Handle existing modal in DOM
    const existingModal = document.getElementById('location-modal');
    if (existingModal) {
        existingModal.classList.remove('active');
        document.body.style.overflow = '';
        return;
    }
    
    // Handle dynamically created modal
    const modal = document.querySelector('.location-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

function selectLocation(location) {
    // Use LocationManager if available
    if (window.locationManager) {
        // Check if the location is available
        const area = window.locationManager.deliveryAreas.find(area => 
            `${area.name} ${area.zip}` === location || area.name === location.split(' ')[0]
        );
        
        if (area && area.available) {
            window.locationManager.updateLocationDisplay(location);
            window.locationManager.saveLocation(location);
            window.locationManager.showNotification('Location updated successfully!', 'success');
        } else if (area && !area.available) {
            window.locationManager.showNotification('Sorry, delivery not available to this location', 'error');
            return;
        }
    } else {
        // Fallback update
        updateDeliveryLocation(location);
    }
    
    closeLocationModal();
    
    // Add visual feedback
    const deliveryElement = document.getElementById('delivery-location');
    if (deliveryElement) {
        deliveryElement.style.animation = 'pulse 0.6s ease-in-out';
        setTimeout(() => {
            deliveryElement.style.animation = '';
        }, 600);
    }
    
    if (window.quickBasketApp) {
        window.quickBasketApp.showNotification(`Delivery location updated to ${location}`, 'success');
    }
}

function setCustomLocation() {
    const input = document.querySelector('.location-input');
    if (!input || !input.value.trim()) {
        if (window.quickBasketApp) {
            window.quickBasketApp.showNotification('Please enter a location', 'error');
        }
        return;
    }
    
    const customLocation = input.value.trim();
    
    // Use LocationManager validation if available
    if (window.locationManager) {
        const area = window.locationManager.deliveryAreas.find(area => 
            area.zip === customLocation || 
            area.name.toLowerCase().includes(customLocation.toLowerCase()) ||
            `${area.name} ${area.zip}`.toLowerCase().includes(customLocation.toLowerCase())
        );
        
        if (area && area.available) {
            selectLocation(`${area.name} ${area.zip}`);
        } else if (area && !area.available) {
            if (window.quickBasketApp) {
                window.quickBasketApp.showNotification('Sorry, delivery not available to this location', 'error');
            }
            return;
        } else {
            // Allow custom location but warn about delivery
            selectLocation(customLocation);
            if (window.quickBasketApp) {
                window.quickBasketApp.showNotification('Custom location set - delivery availability will be confirmed', 'warning');
            }
        }
    } else {
        selectLocation(customLocation);
    }
}

function updateDeliveryLocation(location) {
    // Update all delivery location displays
    const deliveryElements = [
        document.getElementById('delivery-location'),
        ...document.querySelectorAll('[data-delivery-location]'),
        ...document.querySelectorAll('.delivery-location')
    ];
    
    deliveryElements.forEach(element => {
        if (element) {
            if (element.id === 'delivery-location') {
                element.textContent = location;
            } else {
                element.textContent = `Deliver to ${location}`;
            }
            
            // Add visual feedback
            element.style.animation = 'locationUpdate 0.5s ease-in-out';
            setTimeout(() => {
                element.style.animation = '';
            }, 500);
        }
    });
    
    // Store in localStorage with better key management
    try {
        localStorage.setItem('quickbasket_delivery_location', location);
        localStorage.setItem('quickbasket_last_location_update', Date.now().toString());
    } catch (error) {
        console.warn('Could not save location to localStorage:', error);
    }
    
    // Trigger location change event for other components
    const locationChangeEvent = new CustomEvent('locationChanged', {
        detail: { location, timestamp: Date.now() }
    });
    document.dispatchEvent(locationChangeEvent);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuickBasketApp;
}