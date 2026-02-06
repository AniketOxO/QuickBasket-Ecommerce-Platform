// QuickBasket Search System
class SearchManager {
    constructor() {
        this.searchInput = null;
        this.searchSuggestions = null;
        this.searchHistory = this.loadSearchHistory();
        this.isSearching = false;
        this.searchTimeout = null;
        this.init();
    }

    init() {
        this.bindElements();
        this.bindEvents();
    }

    bindElements() {
        this.searchInput = document.getElementById('search-input');
        this.searchSuggestions = document.getElementById('search-suggestions');
    }

    bindEvents() {
        if (!this.searchInput) return;

        // Search input events
        this.searchInput.addEventListener('input', (e) => {
            this.handleSearchInput(e.target.value);
        });

        this.searchInput.addEventListener('focus', () => {
            this.showSearchSuggestions();
        });

        this.searchInput.addEventListener('keydown', (e) => {
            this.handleKeyNavigation(e);
        });

        // Search form submission
        const searchForm = this.searchInput.closest('form');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.performSearch(this.searchInput.value);
            });
        }

        // Click outside to hide suggestions
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-bar')) {
                this.hideSuggestions();
            }
        });

        // Escape key to hide suggestions
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideSuggestions();
            }
        });
    }

    handleSearchInput(query) {
        // Clear previous timeout
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }

        // Debounce search
        this.searchTimeout = setTimeout(() => {
            if (query.length >= 2) {
                this.generateSuggestions(query);
            } else if (query.length === 0) {
                this.showRecentSearches();
            } else {
                this.hideSuggestions();
            }
        }, 300);
    }

    generateSuggestions(query) {
        if (!productManager) {
            console.error('ProductManager not available');
            return;
        }

        const suggestions = productManager.getSearchSuggestions(query, 8);
        const productSuggestions = this.getProductSuggestions(query, 4);
        
        this.displaySuggestions(query, suggestions, productSuggestions);
    }

    getProductSuggestions(query, limit = 4) {
        if (!productManager) return [];

        const results = productManager.searchProducts(query);
        return results.slice(0, limit);
    }

    displaySuggestions(query, suggestions, productSuggestions) {
        if (!this.searchSuggestions) return;

        let html = '';

        // Search suggestions
        if (suggestions.length > 0) {
            html += '<div class="suggestion-section">';
            html += '<div class="suggestion-header">Search Suggestions</div>';
            suggestions.forEach(suggestion => {
                html += `
                    <div class="search-suggestion" onclick="searchManager.selectSuggestion('${suggestion}')">
                        <i class="fas fa-search"></i>
                        <span>${this.highlightQuery(suggestion, query)}</span>
                    </div>
                `;
            });
            html += '</div>';
        }

        // Product suggestions
        if (productSuggestions.length > 0) {
            html += '<div class="suggestion-section">';
            html += '<div class="suggestion-header">Products</div>';
            productSuggestions.forEach(product => {
                html += `
                    <div class="product-suggestion" onclick="searchManager.selectProduct('${product.id}')">
                        <div class="product-suggestion-image">
                            ${product.image.startsWith('fas') ? 
                                `<i class="${product.image}"></i>` : 
                                `<img src="${product.image}" alt="${product.name}">`
                            }
                        </div>
                        <div class="product-suggestion-info">
                            <div class="product-suggestion-name">${this.highlightQuery(product.name, query)}</div>
                            <div class="product-suggestion-price">${productManager.formatPrice(product.price)}</div>
                        </div>
                    </div>
                `;
            });
            html += '</div>';
        }

        // Recent searches
        if (html === '' && this.searchHistory.length > 0) {
            this.showRecentSearches();
            return;
        }

        // View all results option
        if (query.length >= 2) {
            html += `
                <div class="suggestion-section">
                    <div class="search-suggestion view-all" onclick="searchManager.performSearch('${query}')">
                        <i class="fas fa-arrow-right"></i>
                        <span>View all results for "${query}"</span>
                    </div>
                </div>
            `;
        }

        this.searchSuggestions.innerHTML = html;
        this.showSearchSuggestions();
    }

    showRecentSearches() {
        if (!this.searchSuggestions || this.searchHistory.length === 0) return;

        let html = '<div class="suggestion-section">';
        html += '<div class="suggestion-header">Recent Searches</div>';
        
        this.searchHistory.slice(0, 5).forEach(search => {
            html += `
                <div class="search-suggestion recent" onclick="searchManager.selectSuggestion('${search}')">
                    <i class="fas fa-history"></i>
                    <span>${search}</span>
                    <button class="remove-recent" onclick="event.stopPropagation(); searchManager.removeFromHistory('${search}')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
        });

        if (this.searchHistory.length > 0) {
            html += `
                <div class="search-suggestion clear-history" onclick="searchManager.clearSearchHistory()">
                    <i class="fas fa-trash"></i>
                    <span>Clear search history</span>
                </div>
            `;
        }

        html += '</div>';

        this.searchSuggestions.innerHTML = html;
        this.showSearchSuggestions();
    }

    showSearchSuggestions() {
        if (this.searchSuggestions) {
            this.searchSuggestions.style.display = 'block';
        }
    }

    hideSuggestions() {
        if (this.searchSuggestions) {
            this.searchSuggestions.style.display = 'none';
        }
    }

    selectSuggestion(suggestion) {
        if (this.searchInput) {
            this.searchInput.value = suggestion;
        }
        this.performSearch(suggestion);
    }

    selectProduct(productId) {
        // Navigate to product page or show product details
        this.hideSuggestions();
        
        // For now, just show the product in search results
        const product = productManager.getProductById(productId);
        if (product) {
            this.searchInput.value = product.name;
            this.performSearch(product.name);
        }
    }

    performSearch(query) {
        if (!query || query.trim().length === 0) return;

        query = query.trim();
        this.addToSearchHistory(query);
        this.hideSuggestions();

        // Clear search input focus
        if (this.searchInput) {
            this.searchInput.blur();
        }

        // Perform the actual search
        this.executeSearch(query);
    }

    executeSearch(query) {
        // Show loading state
        this.showSearchLoading();

        // Simulate search delay
        setTimeout(() => {
            const results = productManager.searchProducts(query);
            this.displaySearchResults(query, results);
            this.hideSearchLoading();
        }, 500);
    }

    displaySearchResults(query, results) {
        // Check if we're on a page that can display search results
        const currentPage = window.location.pathname;
        
        if (currentPage.includes('products.html') || currentPage.includes('category.html')) {
            // Update existing product grid
            this.updateProductGrid(results);
            this.updateSearchInfo(query, results.length);
        } else {
            // Navigate to products page with search query
            const searchUrl = this.getSearchUrl(query);
            window.location.href = searchUrl;
        }
    }

    updateProductGrid(products) {
        const productGrid = document.getElementById('products-grid') || 
                          document.getElementById('featured-products-grid') ||
                          document.getElementById('all-products-grid');
        
        if (!productGrid) return;

        if (products.length === 0) {
            productGrid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <i class="fas fa-search"></i>
                    <h3>No products found</h3>
                    <p>Try adjusting your search terms or browse our categories</p>
                    <button class="btn btn-primary" onclick="window.location.href='${this.getCategoriesUrl()}'">
                        Browse Categories
                    </button>
                </div>
            `;
        } else {
            productGrid.innerHTML = products.map(product => renderProductCard(product)).join('');
        }
    }

    updateSearchInfo(query, count) {
        const resultsInfo = document.getElementById('results-count');
        if (resultsInfo) {
            resultsInfo.textContent = count;
        }

        // Update page title or header if applicable
        const pageTitle = document.querySelector('.page-title');
        if (pageTitle) {
            pageTitle.textContent = `Search results for "${query}"`;
        }
    }

    showSearchLoading() {
        const loadingIndicator = document.getElementById('loading-products');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'block';
        }

        // Hide product grids
        const grids = ['products-grid', 'featured-products-grid', 'all-products-grid'];
        grids.forEach(gridId => {
            const grid = document.getElementById(gridId);
            if (grid) grid.style.display = 'none';
        });
    }

    hideSearchLoading() {
        const loadingIndicator = document.getElementById('loading-products');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }

        // Show product grids
        const grids = ['products-grid', 'featured-products-grid', 'all-products-grid'];
        grids.forEach(gridId => {
            const grid = document.getElementById(gridId);
            if (grid) grid.style.display = '';
        });
    }

    addToSearchHistory(query) {
        // Remove if already exists
        this.searchHistory = this.searchHistory.filter(item => item !== query);
        
        // Add to beginning
        this.searchHistory.unshift(query);
        
        // Keep only last 10 searches
        this.searchHistory = this.searchHistory.slice(0, 10);
        
        // Save to localStorage
        this.saveSearchHistory();
    }

    removeFromHistory(query) {
        this.searchHistory = this.searchHistory.filter(item => item !== query);
        this.saveSearchHistory();
        this.showRecentSearches();
    }

    clearSearchHistory() {
        this.searchHistory = [];
        this.saveSearchHistory();
        this.hideSuggestions();
    }

    saveSearchHistory() {
        try {
            localStorage.setItem('quickbasket_search_history', JSON.stringify(this.searchHistory));
        } catch (error) {
            console.error('Error saving search history:', error);
        }
    }

    loadSearchHistory() {
        try {
            const saved = localStorage.getItem('quickbasket_search_history');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading search history:', error);
            return [];
        }
    }

    highlightQuery(text, query) {
        if (!query) return text;
        
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<strong>$1</strong>');
    }

    handleKeyNavigation(e) {
        const suggestions = this.searchSuggestions?.querySelectorAll('.search-suggestion, .product-suggestion');
        if (!suggestions || suggestions.length === 0) return;

        const currentActive = this.searchSuggestions.querySelector('.suggestion-active');
        let currentIndex = currentActive ? Array.from(suggestions).indexOf(currentActive) : -1;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                currentIndex = Math.min(currentIndex + 1, suggestions.length - 1);
                this.setActiveSuggestion(suggestions, currentIndex);
                break;
            case 'ArrowUp':
                e.preventDefault();
                currentIndex = Math.max(currentIndex - 1, 0);
                this.setActiveSuggestion(suggestions, currentIndex);
                break;
            case 'Enter':
                e.preventDefault();
                if (currentActive) {
                    currentActive.click();
                } else {
                    this.performSearch(this.searchInput.value);
                }
                break;
        }
    }

    setActiveSuggestion(suggestions, index) {
        // Remove previous active
        suggestions.forEach(s => s.classList.remove('suggestion-active'));
        
        // Set new active
        if (suggestions[index]) {
            suggestions[index].classList.add('suggestion-active');
        }
    }

    getSearchUrl(query) {
        const currentPath = window.location.pathname;
        const baseUrl = currentPath.includes('/pages/') ? 'products.html' : 'pages/products.html';
        return `${baseUrl}?search=${encodeURIComponent(query)}`;
    }

    getCategoriesUrl() {
        const currentPath = window.location.pathname;
        return currentPath.includes('/pages/') ? '../index.html#categories' : 'index.html#categories';
    }

    // Advanced search functionality
    getFilteredSearchResults(query, filters = {}) {
        return productManager.searchProducts(query, filters);
    }

    getSortedSearchResults(results, sortBy = 'relevance') {
        return productManager.sortProducts(results, sortBy);
    }

    // Search analytics (for future implementation)
    trackSearch(query, resultCount) {
        // Track search analytics
        console.log(`Search: "${query}" - ${resultCount} results`);
    }

    // Auto-complete functionality
    getAutoComplete(query) {
        if (!query || query.length < 2) return [];
        
        const suggestions = productManager.getSearchSuggestions(query, 5);
        return suggestions.map(suggestion => ({
            text: suggestion,
            type: 'suggestion'
        }));
    }

    // Search filters helper
    buildSearchFilters(formData) {
        const filters = {};
        
        // Extract category filters
        const categories = formData.getAll('category').filter(cat => cat !== 'all');
        if (categories.length > 0) {
            filters.category = categories;
        }
        
        // Extract brand filters
        const brands = formData.getAll('brand');
        if (brands.length > 0) {
            filters.brand = brands;
        }
        
        // Extract price range
        const minPrice = formData.get('minPrice');
        const maxPrice = formData.get('maxPrice');
        if (minPrice) filters.minPrice = parseFloat(minPrice);
        if (maxPrice) filters.maxPrice = parseFloat(maxPrice);
        
        // Extract rating filter
        const minRating = formData.get('minRating');
        if (minRating) filters.minRating = parseFloat(minRating);
        
        // Extract availability filters
        const availability = formData.getAll('availability');
        if (availability.length > 0) {
            filters.availability = availability;
        }
        
        return filters;
    }
}

// Global search manager instance
let searchManager;

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    searchManager = new SearchManager();
    
    // Handle URL search parameters
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    
    if (searchQuery) {
        // Set search input value and perform search
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = searchQuery;
            searchManager.performSearch(searchQuery);
        }
    }
});

// Global search function for easy access
function performGlobalSearch(query) {
    if (searchManager) {
        searchManager.performSearch(query);
    }
}

// CSS for search suggestions styling
const searchStyle = document.createElement('style');
searchStyle.textContent = `
    .search-suggestions {
        max-height: 400px;
        overflow-y: auto;
        border: 1px solid var(--border-color);
    }
    
    .suggestion-section {
        border-bottom: 1px solid var(--border-color);
    }
    
    .suggestion-section:last-child {
        border-bottom: none;
    }
    
    .suggestion-header {
        padding: 10px 20px;
        background: var(--background-light);
        font-weight: 600;
        font-size: 0.9rem;
        color: var(--text-dark);
        border-bottom: 1px solid var(--border-color);
    }
    
    .search-suggestion {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 12px 20px;
        cursor: pointer;
        transition: var(--transition);
        position: relative;
    }
    
    .search-suggestion:hover,
    .search-suggestion.suggestion-active {
        background: var(--primary-light);
    }
    
    .search-suggestion.view-all {
        color: var(--primary-color);
        font-weight: 600;
    }
    
    .search-suggestion.clear-history {
        color: var(--error-color);
    }
    
    .search-suggestion i {
        color: var(--text-light);
        width: 16px;
    }
    
    .search-suggestion.view-all i,
    .search-suggestion.clear-history i {
        color: currentColor;
    }
    
    .remove-recent {
        position: absolute;
        right: 15px;
        background: none;
        border: none;
        color: var(--text-light);
        cursor: pointer;
        padding: 5px;
        opacity: 0;
        transition: var(--transition);
    }
    
    .search-suggestion.recent:hover .remove-recent {
        opacity: 1;
    }
    
    .product-suggestion {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 12px 20px;
        cursor: pointer;
        transition: var(--transition);
    }
    
    .product-suggestion:hover,
    .product-suggestion.suggestion-active {
        background: var(--primary-light);
    }
    
    .product-suggestion-image {
        width: 40px;
        height: 40px;
        background: var(--background-light);
        border-radius: var(--border-radius);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }
    
    .product-suggestion-image i {
        color: var(--primary-color);
        font-size: 1.2rem;
    }
    
    .product-suggestion-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: var(--border-radius);
    }
    
    .product-suggestion-info {
        flex: 1;
    }
    
    .product-suggestion-name {
        font-weight: 600;
        color: var(--text-dark);
        margin-bottom: 2px;
    }
    
    .product-suggestion-price {
        color: var(--primary-color);
        font-weight: 600;
        font-size: 0.9rem;
    }
    
    .product-suggestion-name strong {
        background: #ffea8a; /* soft yellow */
        color: #111;         /* dark text for contrast */
        padding: 2px 4px;
        border-radius: 3px;
    }
    
    .search-suggestion span strong {
        background: #ffea8a; /* soft yellow */
        color: #111;         /* dark text for contrast */
        padding: 2px 4px;
        border-radius: 3px;
    }
`;
document.head.appendChild(searchStyle);

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SearchManager, searchManager };
}