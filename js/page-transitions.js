/**
 * Page Transitions Handler for QuickBasket
 * Provides smooth transitions between pages and sections
 */

class PageTransitions {
    constructor() {
        this.isTransitioning = false;
        this.transitionDuration = 600;
        this.init();
    }

    init() {
        this.createTransitionOverlay();
        this.interceptLinks();
        this.addPageLoadAnimation();
        this.initSectionScrolling();
    }

    // Create overlay for smooth transitions
    createTransitionOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'page-transition-overlay';
        overlay.innerHTML = `
            <div class="transition-content">
                <div class="transition-spinner">
                    <i class="fas fa-shopping-basket"></i>
                </div>
                <div class="transition-text">Loading...</div>
            </div>
        `;
        document.body.appendChild(overlay);

        // Add CSS styles
        const style = document.createElement('style');
        style.textContent = `
            #page-transition-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }

            #page-transition-overlay.active {
                opacity: 1;
                visibility: visible;
            }

            .transition-content {
                text-align: center;
                color: white;
            }

            .transition-spinner {
                font-size: 3rem;
                color: var(--primary-color);
                margin-bottom: 1rem;
                animation: transitionSpin 1s linear infinite;
            }

            .transition-text {
                font-size: 1.2rem;
                font-weight: 500;
                opacity: 0.9;
            }

            @keyframes transitionSpin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }

            /* Page entrance animation */
            .page-enter {
                animation: pageEnter 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }

            @keyframes pageEnter {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            /* Section scroll animations */
            .section-transition {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .section-transition.visible {
                opacity: 1;
                transform: translateY(0);
            }

            /* Link hover effects for smooth navigation */
            a {
                transition: all 0.3s ease;
            }

            .category-card, .product-card {
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }
        `;
        document.head.appendChild(style);
    }

    // Intercept link clicks for smooth transitions
    interceptLinks() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href]');
            
            if (link && this.shouldInterceptLink(link)) {
                e.preventDefault();
                this.navigateWithTransition(link.href);
            }
        });
    }

    // Check if link should be intercepted
    shouldInterceptLink(link) {
        const href = link.getAttribute('href');
        
        // Don't intercept external links, anchors, or special links
        return href && 
               !href.startsWith('#') && 
               !href.startsWith('mailto:') && 
               !href.startsWith('tel:') && 
               !href.includes('://') &&
               !link.target === '_blank';
    }

    // Navigate with smooth transition
    navigateWithTransition(url) {
        if (this.isTransitioning) return;

        this.isTransitioning = true;
        const overlay = document.getElementById('page-transition-overlay');
        
        // Show transition overlay
        overlay.classList.add('active');
        
        // Update transition text based on destination
        const transitionText = overlay.querySelector('.transition-text');
        transitionText.textContent = this.getTransitionText(url);

        // Navigate after animation
        setTimeout(() => {
            window.location.href = url;
        }, this.transitionDuration);
    }

    // Get appropriate transition text
    getTransitionText(url) {
        if (url.includes('category.html')) {
            return 'Loading Category...';
        } else if (url.includes('product-detail.html')) {
            return 'Loading Product...';
        } else if (url.includes('cart.html')) {
            return 'Opening Cart...';
        } else if (url.includes('checkout.html')) {
            return 'Processing Checkout...';
        } else {
            return 'Loading...';
        }
    }

    // Add page load animation
    addPageLoadAnimation() {
        document.addEventListener('DOMContentLoaded', () => {
            // Hide transition overlay if it exists
            const overlay = document.getElementById('page-transition-overlay');
            if (overlay) {
                setTimeout(() => {
                    overlay.classList.remove('active');
                    this.isTransitioning = false;
                }, 100);
            }

            // Add entrance animation to main content
            const mainContent = document.querySelector('main, .main-content, body > *:not(#page-transition-overlay)');
            if (mainContent) {
                mainContent.classList.add('page-enter');
            }
        });
    }

    // Initialize section scrolling animations
    initSectionScrolling() {
        // Add section transition classes to main sections
        const sections = document.querySelectorAll('section, .hero, .categories-section, .popular-products, .features');
        
        sections.forEach(section => {
            section.classList.add('section-transition');
        });

        // Create intersection observer for scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe all sections
        sections.forEach(section => {
            observer.observe(section);
        });
    }

    // Smooth scroll to section
    scrollToSection(sectionId, offset = 0) {
        const section = document.getElementById(sectionId) || document.querySelector(sectionId);
        
        if (section) {
            const sectionTop = section.getBoundingClientRect().top + window.pageYOffset - offset;
            
            window.scrollTo({
                top: sectionTop,
                behavior: 'smooth'
            });

            // Add visual feedback
            section.style.animation = 'sectionHighlight 1s ease-in-out';
            setTimeout(() => {
                section.style.animation = '';
            }, 1000);
        }
    }

    // Enhanced category navigation with smooth transitions
    navigateToCategory(categoryName) {
        this.navigateWithTransition(`pages/category.html?cat=${categoryName}`);
    }
}

// Add section highlight animation
const highlightStyle = document.createElement('style');
highlightStyle.textContent = `
    @keyframes sectionHighlight {
        0% { background-color: transparent; }
        50% { background-color: rgba(231, 76, 60, 0.1); }
        100% { background-color: transparent; }
    }
`;
document.head.appendChild(highlightStyle);

// Initialize page transitions when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.pageTransitions = new PageTransitions();
});

// Global function for easy access from HTML onclick events
function navigateWithTransition(url, customMessage = null) {
    if (window.pageTransitions) {
        if (customMessage) {
            // If custom message provided, temporarily update the transition text
            const overlay = document.getElementById('page-transition-overlay');
            const transitionText = overlay.querySelector('.transition-text');
            const originalGetTransitionText = window.pageTransitions.getTransitionText;
            
            // Override the getTransitionText method temporarily
            window.pageTransitions.getTransitionText = () => customMessage;
            
            // Navigate with transition
            window.pageTransitions.navigateWithTransition(url);
            
            // Restore original method after a short delay
            setTimeout(() => {
                window.pageTransitions.getTransitionText = originalGetTransitionText;
            }, 100);
        } else {
            window.pageTransitions.navigateWithTransition(url);
        }
    } else {
        // Fallback to direct navigation
        window.location.href = url;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PageTransitions;
}
