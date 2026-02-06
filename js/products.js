// QuickBasket Products Database and Management
class ProductManager {
    constructor() {
        this.products = this.initializeProducts();
        this.categories = this.initializeCategories();
        this.brands = this.initializeBrands();
    }

    initializeProducts() {
        return [
            // Beverages
            {
                id: 'bev001',
                name: 'Premium Coffee Blend',
                category: 'beverages',
                subcategory: 'coffee',
                brand: 'Fresh Choice',
                price: 12.99,
                originalPrice: 15.99,
                image: 'fas fa-coffee',
                description: 'Rich and aromatic coffee blend perfect for morning brewing. Made from premium beans.',
                rating: 4.5,
                stock: 45,
                isNew: true,
                isOnSale: true,
                tags: ['organic', 'premium', 'hot-drink']
            },
            {
                id: 'bev002',
                name: 'Fresh Orange Juice',
                category: 'beverages',
                subcategory: 'juice',
                brand: 'Organic Valley',
                price: 4.99,
                originalPrice: 6.99,
                image: 'fas fa-glass-whiskey',
                description: 'Freshly squeezed orange juice with pulp. 100% natural with no added sugar.',
                rating: 4.3,
                stock: 28,
                isNew: false,
                isOnSale: true,
                tags: ['fresh', 'vitamin-c', 'natural']
            },
            {
                id: 'bev003',
                name: 'Green Tea Premium',
                category: 'beverages',
                subcategory: 'tea',
                brand: 'Premium Select',
                price: 8.99,
                originalPrice: 10.99,
                image: 'fas fa-leaf',
                description: 'Premium green tea leaves with antioxidants. Perfect for relaxation and health.',
                rating: 4.7,
                stock: 35,
                isNew: true,
                isOnSale: false,
                tags: ['healthy', 'antioxidants', 'relaxing']
            },
            {
                id: 'bev004',
                name: 'Energy Boost Drink',
                category: 'beverages',
                subcategory: 'energy',
                brand: 'QuickBasket',
                price: 3.99,
                originalPrice: 4.99,
                image: 'fas fa-bolt',
                description: 'Natural energy drink with vitamins and minerals. Sugar-free formula.',
                rating: 4.1,
                stock: 52,
                isNew: false,
                isOnSale: true,
                tags: ['energy', 'vitamins', 'sugar-free']
            },

            // Chocolates & Sweets
            {
                id: 'choc001',
                name: 'Dark Chocolate Bar 85%',
                category: 'chocolates',
                subcategory: 'dark-chocolate',
                brand: 'Premium Select',
                price: 8.99,
                originalPrice: 10.99,
                image: 'fas fa-square',
                description: 'Rich dark chocolate with 85% cocoa content. Perfect for chocolate lovers.',
                rating: 4.8,
                stock: 22,
                isNew: true,
                isOnSale: false,
                tags: ['premium', 'dark', 'antioxidants']
            },
            {
                id: 'choc002',
                name: 'Milk Chocolate Cookies',
                category: 'chocolates',
                subcategory: 'cookies',
                brand: 'Fresh Choice',
                price: 6.99,
                originalPrice: 8.99,
                image: 'fas fa-cookie',
                description: 'Crispy cookies with milk chocolate chips. Perfect for snacking.',
                rating: 4.4,
                stock: 38,
                isNew: false,
                isOnSale: true,
                tags: ['crispy', 'sweet', 'snack']
            },
            {
                id: 'choc003',
                name: 'Assorted Candy Mix',
                category: 'chocolates',
                subcategory: 'candy',
                brand: 'QuickBasket',
                price: 5.99,
                originalPrice: 7.99,
                image: 'fas fa-candy-cane',
                description: 'Colorful assorted candy mix with various flavors. Kids favorite!',
                rating: 4.2,
                stock: 44,
                isNew: false,
                isOnSale: true,
                tags: ['colorful', 'variety', 'kids']
            },

            // Dairy & Breads
            {
                id: 'dairy001',
                name: 'Organic Whole Milk',
                category: 'dairy',
                subcategory: 'milk',
                brand: 'Organic Valley',
                price: 4.49,
                originalPrice: 5.99,
                image: 'fas fa-glass-whiskey',
                description: 'Fresh organic whole milk from grass-fed cows. Rich in nutrients.',
                rating: 4.6,
                stock: 18,
                isNew: false,
                isOnSale: true,
                tags: ['organic', 'fresh', 'nutritious']
            },
            {
                id: 'dairy002',
                name: 'Artisan Sourdough Bread',
                category: 'dairy',
                subcategory: 'bread',
                brand: 'Fresh Choice',
                price: 5.99,
                originalPrice: 7.99,
                image: 'fas fa-bread-slice',
                description: 'Handcrafted sourdough bread with crispy crust and soft interior.',
                rating: 4.7,
                stock: 12,
                isNew: true,
                isOnSale: false,
                tags: ['artisan', 'handcrafted', 'crispy']
            },
            {
                id: 'dairy003',
                name: 'Aged Cheddar Cheese',
                category: 'dairy',
                subcategory: 'cheese',
                brand: 'Premium Select',
                price: 9.99,
                originalPrice: 12.99,
                image: 'fas fa-cheese',
                description: 'Sharp aged cheddar cheese with rich flavor. Perfect for sandwiches.',
                rating: 4.5,
                stock: 25,
                isNew: false,
                isOnSale: true,
                tags: ['aged', 'sharp', 'flavorful']
            },

            // Fruits & Vegetables
            {
                id: 'fruit001',
                name: 'Organic Red Apples (1kg)',
                category: 'fruits',
                subcategory: 'fruits',
                brand: 'Organic Valley',
                price: 5.99,
                originalPrice: 7.99,
                image: 'fas fa-apple-alt',
                description: 'Fresh organic red apples. Crispy, sweet, and perfect for snacking.',
                rating: 4.4,
                stock: 33,
                isNew: false,
                isOnSale: true,
                tags: ['organic', 'fresh', 'crispy']
            },
            {
                id: 'fruit002',
                name: 'Baby Spinach (200g)',
                category: 'fruits',
                subcategory: 'leafy-greens',
                brand: 'Fresh Choice',
                price: 3.99,
                originalPrice: 4.99,
                image: 'fas fa-leaf',
                description: 'Fresh baby spinach leaves. Rich in iron and vitamins.',
                rating: 4.3,
                stock: 28,
                isNew: false,
                isOnSale: true,
                tags: ['fresh', 'iron', 'vitamins']
            },
            {
                id: 'fruit003',
                name: 'Organic Carrots (500g)',
                category: 'fruits',
                subcategory: 'root-vegetables',
                brand: 'Organic Valley',
                price: 2.99,
                originalPrice: 3.99,
                image: 'fas fa-carrot',
                description: 'Fresh organic carrots. Sweet and crunchy, perfect for cooking or snacking.',
                rating: 4.5,
                stock: 41,
                isNew: false,
                isOnSale: true,
                tags: ['organic', 'sweet', 'crunchy']
            },

            // Noodles & Pasta
            {
                id: 'noodle001',
                name: 'Instant Ramen Noodles',
                category: 'noodles',
                subcategory: 'instant',
                brand: 'QuickBasket',
                price: 2.99,
                originalPrice: 3.99,
                image: 'fas fa-bowl-rice',
                description: 'Quick cooking ramen noodles with flavorful seasoning. Ready in 3 minutes.',
                rating: 4.0,
                stock: 65,
                isNew: false,
                isOnSale: true,
                tags: ['quick', 'flavorful', 'convenient']
            },
            {
                id: 'noodle002',
                name: 'Penne Pasta Premium',
                category: 'noodles',
                subcategory: 'pasta',
                brand: 'Premium Select',
                price: 4.99,
                originalPrice: 6.99,
                image: 'fas fa-utensils',
                description: 'Italian durum wheat penne pasta. Perfect al dente texture every time.',
                rating: 4.6,
                stock: 29,
                isNew: true,
                isOnSale: false,
                tags: ['italian', 'durum-wheat', 'al-dente']
            },
            {
                id: 'noodle003',
                name: 'Tomato Pasta Sauce',
                category: 'noodles',
                subcategory: 'sauce',
                brand: 'Fresh Choice',
                price: 3.99,
                originalPrice: 5.99,
                image: 'fas fa-bottle-droplet',
                description: 'Rich tomato pasta sauce with herbs and spices. No artificial preservatives.',
                rating: 4.4,
                stock: 37,
                isNew: false,
                isOnSale: true,
                tags: ['rich', 'herbs', 'natural']
            },

            // Snacks & Namkeen
            {
                id: 'snack001',
                name: 'Crispy Potato Chips',
                category: 'snacks',
                subcategory: 'chips',
                brand: 'QuickBasket',
                price: 3.49,
                originalPrice: 4.99,
                image: 'fas fa-cookie-bite',
                description: 'Crispy golden potato chips with sea salt. Perfect movie night snack.',
                rating: 4.2,
                stock: 48,
                isNew: false,
                isOnSale: true,
                tags: ['crispy', 'golden', 'sea-salt']
            },
            {
                id: 'snack002',
                name: 'Mixed Nuts Premium',
                category: 'snacks',
                subcategory: 'nuts',
                brand: 'Premium Select',
                price: 9.99,
                originalPrice: 12.99,
                image: 'fas fa-seedling',
                description: 'Premium mix of almonds, cashews, walnuts, and pistachios. Healthy snacking.',
                rating: 4.7,
                stock: 22,
                isNew: true,
                isOnSale: false,
                tags: ['premium', 'healthy', 'protein']
            },
            {
                id: 'snack003',
                name: 'Spicy Namkeen Mix',
                category: 'snacks',
                subcategory: 'namkeen',
                brand: 'Fresh Choice',
                price: 4.99,
                originalPrice: 6.99,
                image: 'fas fa-pepper-hot',
                description: 'Traditional spicy namkeen mix with peanuts, sev, and spices.',
                rating: 4.3,
                stock: 35,
                isNew: false,
                isOnSale: true,
                tags: ['spicy', 'traditional', 'peanuts']
            }
        ];
    }

    initializeCategories() {
        return {
            beverages: {
                name: 'Beverages',
                icon: 'fas fa-coffee',
                description: 'Refresh yourself with our wide selection of beverages',
                subcategories: {
                    coffee: 'Coffee & Tea',
                    juice: 'Juices',
                    tea: 'Tea',
                    energy: 'Energy Drinks',
                    water: 'Water & Sports Drinks'
                }
            },
            chocolates: {
                name: 'Chocolates & Sweets',
                icon: 'fas fa-candy-cane',
                description: 'Indulge in our premium collection of chocolates and sweets',
                subcategories: {
                    'dark-chocolate': 'Dark Chocolate',
                    'milk-chocolate': 'Milk Chocolate',
                    cookies: 'Cookies & Biscuits',
                    candy: 'Candies',
                    desserts: 'Desserts'
                }
            },
            dairy: {
                name: 'Dairy & Breads',
                icon: 'fas fa-cheese',
                description: 'Fresh dairy products and bakery items',
                subcategories: {
                    milk: 'Milk & Dairy',
                    cheese: 'Cheese',
                    bread: 'Bread & Bakery',
                    butter: 'Butter & Spreads',
                    yogurt: 'Yogurt'
                }
            },
            fruits: {
                name: 'Fruits & Vegetables',
                icon: 'fas fa-apple-alt',
                description: 'Farm-fresh fruits and vegetables',
                subcategories: {
                    fruits: 'Fresh Fruits',
                    'leafy-greens': 'Leafy Greens',
                    'root-vegetables': 'Root Vegetables',
                    herbs: 'Herbs & Spices',
                    exotic: 'Exotic Fruits'
                }
            },
            noodles: {
                name: 'Noodles & Pasta',
                icon: 'fas fa-utensils',
                description: 'Quick and delicious meal solutions',
                subcategories: {
                    instant: 'Instant Noodles',
                    pasta: 'Pasta',
                    asian: 'Asian Noodles',
                    sauce: 'Sauces',
                    ready: 'Ready Meals'
                }
            },
            snacks: {
                name: 'Snacks & Namkeen',
                icon: 'fas fa-cookie-bite',
                description: 'Crispy, crunchy, and delicious snacks',
                subcategories: {
                    chips: 'Chips & Crisps',
                    nuts: 'Nuts & Seeds',
                    namkeen: 'Traditional Namkeen',
                    crackers: 'Crackers',
                    popcorn: 'Popcorn'
                }
            }
        };
    }

    initializeBrands() {
        return {
            'Fresh Choice': {
                name: 'Fresh Choice',
                description: 'Quality products for everyday needs',
                logo: 'fas fa-leaf'
            },
            'Organic Valley': {
                name: 'Organic Valley',
                description: 'Certified organic products',
                logo: 'fas fa-seedling'
            },
            'Premium Select': {
                name: 'Premium Select',
                description: 'Premium quality at its finest',
                logo: 'fas fa-crown'
            },
            'QuickBasket': {
                name: 'QuickBasket',
                description: 'Our own brand of quality products',
                logo: 'fas fa-shopping-basket'
            }
        };
    }

    // Product search and filtering methods
    searchProducts(query, filters = {}) {
        let results = [...this.products];

        // Text search
        if (query && query.trim()) {
            const searchTerm = query.toLowerCase().trim();
            results = results.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm) ||
                product.brand.toLowerCase().includes(searchTerm) ||
                product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }

        // Category filter
        if (filters.category && filters.category !== 'all') {
            results = results.filter(product => product.category === filters.category);
        }

        // Subcategory filter
        if (filters.subcategory) {
            results = results.filter(product => product.subcategory === filters.subcategory);
        }

        // Brand filter
        if (filters.brand && filters.brand.length > 0) {
            results = results.filter(product => filters.brand.includes(product.brand));
        }

        // Price range filter
        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
            results = results.filter(product => {
                const price = product.price;
                const minOk = filters.minPrice === undefined || price >= filters.minPrice;
                const maxOk = filters.maxPrice === undefined || price <= filters.maxPrice;
                return minOk && maxOk;
            });
        }

        // Rating filter
        if (filters.minRating) {
            results = results.filter(product => product.rating >= filters.minRating);
        }

        // Availability filter
        if (filters.availability) {
            filters.availability.forEach(filter => {
                switch (filter) {
                    case 'in-stock':
                        results = results.filter(product => product.stock > 0);
                        break;
                    case 'on-sale':
                        results = results.filter(product => product.isOnSale);
                        break;
                    case 'new':
                        results = results.filter(product => product.isNew);
                        break;
                }
            });
        }

        // Tags filter
        if (filters.tags && filters.tags.length > 0) {
            results = results.filter(product => 
                filters.tags.some(tag => product.tags.includes(tag))
            );
        }

        return results;
    }

    sortProducts(products, sortBy = 'relevance') {
        const sorted = [...products];

        switch (sortBy) {
            case 'price-low':
                return sorted.sort((a, b) => a.price - b.price);
            case 'price-high':
                return sorted.sort((a, b) => b.price - a.price);
            case 'rating':
                return sorted.sort((a, b) => b.rating - a.rating);
            case 'name':
                return sorted.sort((a, b) => a.name.localeCompare(b.name));
            case 'newest':
                return sorted.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
            case 'popularity':
                return sorted.sort((a, b) => b.stock - a.stock); // Mock popularity by stock
            default:
                return sorted;
        }
    }

    getProductById(id) {
        return this.products.find(product => product.id === id);
    }

    getProductsByCategory(category) {
        if (category === 'all') return this.products;
        return this.products.filter(product => product.category === category);
    }

    getProductsByBrand(brand) {
        return this.products.filter(product => product.brand === brand);
    }

    getFeaturedProducts(limit = 8) {
        return this.products
            .filter(product => product.rating >= 4.3 || product.isNew)
            .slice(0, limit);
    }

    getPopularProducts(limit = 6) {
        return this.products
            .sort((a, b) => b.rating - a.rating)
            .slice(0, limit);
    }

    getOnSaleProducts(limit = 10) {
        return this.products
            .filter(product => product.isOnSale)
            .slice(0, limit);
    }

    getNewProducts(limit = 6) {
        return this.products
            .filter(product => product.isNew)
            .slice(0, limit);
    }

    // Product suggestions
    getSimilarProducts(productId, limit = 4) {
        const product = this.getProductById(productId);
        if (!product) return [];

        return this.products
            .filter(p => 
                p.id !== productId && 
                (p.category === product.category || p.brand === product.brand)
            )
            .slice(0, limit);
    }

    getSearchSuggestions(query, limit = 5) {
        if (!query || query.length < 2) return [];

        const searchTerm = query.toLowerCase();
        const suggestions = new Set();

        // Product name suggestions
        this.products.forEach(product => {
            if (product.name.toLowerCase().includes(searchTerm)) {
                suggestions.add(product.name);
            }
        });

        // Category suggestions
        Object.values(this.categories).forEach(category => {
            if (category.name.toLowerCase().includes(searchTerm)) {
                suggestions.add(category.name);
            }
        });

        // Brand suggestions
        Object.keys(this.brands).forEach(brand => {
            if (brand.toLowerCase().includes(searchTerm)) {
                suggestions.add(brand);
            }
        });

        return Array.from(suggestions).slice(0, limit);
    }

    // Utility methods
    formatPrice(price, showCurrency = true) {
        return showCurrency ? `$${price.toFixed(2)}` : price.toFixed(2);
    }

    calculateDiscount(originalPrice, currentPrice) {
        const discount = ((originalPrice - currentPrice) / originalPrice) * 100;
        return Math.round(discount);
    }

    isProductInStock(productId) {
        const product = this.getProductById(productId);
        return product ? product.stock > 0 : false;
    }

    getStockStatus(productId) {
        const product = this.getProductById(productId);
        if (!product) return 'unknown';
        
        if (product.stock === 0) return 'out-of-stock';
        if (product.stock <= 5) return 'low-stock';
        return 'in-stock';
    }

    // Convert product data for cart
    getProductForCart(productId) {
        const product = this.getProductById(productId);
        if (!product) return null;

        return {
            id: product.id,
            name: product.name,
            price: this.formatPrice(product.price),
            originalPrice: product.originalPrice ? this.formatPrice(product.originalPrice) : null,
            image: product.image,
            brand: product.brand,
            stock: product.stock
        };
    }
}

// Global instance
const productManager = new ProductManager();

// Global functions for easy access
function getProduct(id) {
    return productManager.getProductById(id);
}

function searchProducts(query, filters = {}) {
    return productManager.searchProducts(query, filters);
}

function getProductsByCategory(category) {
    return productManager.getProductsByCategory(category);
}

function getFeaturedProducts(limit = 8) {
    return productManager.getFeaturedProducts(limit);
}

function getPopularProducts(limit = 6) {
    return productManager.getPopularProducts(limit);
}

// Function to render product cards
function renderProductCard(product, className = 'product-card') {
    const discount = product.originalPrice ? 
        productManager.calculateDiscount(product.originalPrice, product.price) : 0;

    return `
        <div class="${className}" 
             data-product-id="${product.id}"
             data-product-name="${product.name}"
             data-product-price="${product.price}"
             data-product-image="${product.image}"
             data-category="${product.category || 'general'}"
             data-id="${product.id}">
            <div class="product-image">
                ${product.image.startsWith('fas') ? 
                    `<i class="${product.image}"></i>` : 
                    `<img src="${product.image}" alt="${product.name}">`
                }
                ${product.isNew ? '<div class="product-badge">New</div>' : ''}
                ${product.isOnSale && discount > 0 ? `<div class="product-badge sale">-${discount}%</div>` : ''}
                <div class="product-actions">
                    <button class="action-btn wishlist-btn" onclick="addToWishlist('${product.id}')" title="Add to Wishlist">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-meta">
                    <div class="rating">
                        ${renderStars(product.rating)}
                        <span>${product.rating}</span>
                    </div>
                    <span class="stock-status ${productManager.getStockStatus(product.id)}">
                        ${getStockStatusText(product.stock)}
                    </span>
                </div>
                <div class="product-price">
                    <span class="price">${productManager.formatPrice(product.price)}</span>
                    ${product.originalPrice ? 
                        `<span class="original-price">${productManager.formatPrice(product.originalPrice)}</span>` : 
                        ''
                    }
                </div>
                <button class="add-to-cart" 
                        onclick="addToCart('${product.id}', ${JSON.stringify(productManager.getProductForCart(product.id)).replace(/"/g, '&quot;')})"
                        ${product.stock === 0 ? 'disabled' : ''}>
                    ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div>
        </div>
    `;
}

function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';

    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }

    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }

    return stars;
}

function getStockStatusText(stock) {
    if (stock === 0) return 'Out of Stock';
    if (stock <= 5) return 'Low Stock';
    return 'In Stock';
}

// Enhanced Wishlist functionality using WishlistManager
function addToWishlist(productIdentifier) {
    console.log('Adding to wishlist:', productIdentifier);
    
    // Use the global wishlist manager if available
    if (window.wishlistManager) {
        let productData;
        
        if (typeof productIdentifier === 'string') {
            // Try to find the product card with this identifier
            const productCard = document.querySelector(`[data-product-name="${productIdentifier}"]`) ||
                               document.querySelector(`[data-product-id="${productIdentifier}"]`) ||
                               Array.from(document.querySelectorAll('.product-card')).find(card => {
                                   const nameEl = card.querySelector('.product-name, .product-title, h3');
                                   return nameEl && nameEl.textContent.trim() === productIdentifier;
                               });
            
            if (productCard) {
                productData = window.wishlistManager.extractProductData(productCard);
            } else {
                // Try to get product from productManager if available
                let product = null;
                if (window.productManager && window.productManager.getProductById) {
                    product = window.productManager.getProductById(productIdentifier);
                } else if (window.sampleProducts) {
                    // Fallback to sample products for category page
                    product = window.sampleProducts.find(p => 
                        p.name === productIdentifier || 
                        p.id === productIdentifier ||
                        p.name.toLowerCase().includes(productIdentifier.toLowerCase())
                    );
                }
                
                if (product) {
                    productData = {
                        id: product.id || productIdentifier.replace(/\s+/g, '_').toLowerCase(),
                        name: product.name || productIdentifier,
                        price: product.price || '$0.00',
                        image: product.image || product.icon || 'fas fa-box',
                        category: product.category || 'general'
                    };
                } else {
                    // Fallback: create basic product data from identifier
                    productData = {
                        id: productIdentifier.replace(/\s+/g, '_').toLowerCase(),
                        name: productIdentifier,
                        price: '$0.00',
                        category: 'general'
                    };
                }
            }
        } else if (productIdentifier && typeof productIdentifier === 'object') {
            // It's already a product object
            productData = productIdentifier;
        } else {
            console.warn('Invalid product identifier for wishlist');
            return;
        }
        
        // Toggle wishlist using the manager
        window.wishlistManager.toggleWishlist(productData);
    } else {
        console.warn('Wishlist manager not available');
        // Fallback notification
        if (typeof cart !== 'undefined' && cart.showNotification) {
            cart.showNotification('Please wait, wishlist is loading...', 'info');
        } else if (window.quickBasketApp) {
            window.quickBasketApp.showNotification('Please wait, wishlist is loading...', 'info');
        }
    }
}

// Quick view functionality (placeholder)
// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ProductManager, productManager };
}