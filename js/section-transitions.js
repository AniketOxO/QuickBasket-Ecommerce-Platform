/**
 * Section Transitions Handler for QuickBasket
 * Provides smooth transitions between sections within the same page
 */

class SectionTransitions {
    constructor() {
        this.isTransitioning = false;
        this.transitionDuration = 800;
        this.init();
    }

    init() {
        this.createSectionTransitionOverlay();
        this.initSectionObserver();
        this.interceptSectionNavigation();
    }

    // Create overlay for section transitions
    createSectionTransitionOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'section-transition-overlay';
        overlay.innerHTML = `
            <div class="section-transition-content">
                <div class="section-transition-spinner">
                    <div class="spinner-ring"></div>
                    <div class="spinner-icon">
                        <i class="fas fa-shopping-basket"></i>
                    </div>
                </div>
                <div class="section-transition-text">Loading Section...</div>
            </div>
        `;
        document.body.appendChild(overlay);

        // Add CSS styles for section transitions
        const style = document.createElement('style');
        style.textContent = `
            #section-transition-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(44, 62, 80, 0.95);
                backdrop-filter: blur(10px);
                z-index: 8888;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            #section-transition-overlay.active {
                opacity: 1;
                visibility: visible;
            }

            .section-transition-content {
                text-align: center;
                color: white;
                transform: scale(0.8);
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            #section-transition-overlay.active .section-transition-content {
                transform: scale(1);
            }

            .section-transition-spinner {
                position: relative;
                width: 80px;
                height: 80px;
                margin: 0 auto 1.5rem;
            }

            .spinner-ring {
                position: absolute;
                width: 80px;
                height: 80px;
                border: 3px solid rgba(231, 76, 60, 0.3);
                border-top: 3px solid var(--primary-color);
                border-radius: 50%;
                animation: sectionSpinRing 1s linear infinite;
            }

            .spinner-icon {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 2rem;
                color: var(--primary-color);
                animation: sectionSpinIcon 2s ease-in-out infinite;
            }

            .section-transition-text {
                font-size: 1.1rem;
                font-weight: 500;
                opacity: 0.9;
                animation: sectionTextPulse 1.5s ease-in-out infinite;
            }

            @keyframes sectionSpinRing {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            @keyframes sectionSpinIcon {
                0%, 100% { transform: translate(-50%, -50%) scale(1); }
                50% { transform: translate(-50%, -50%) scale(1.1); }
            }

            @keyframes sectionTextPulse {
                0%, 100% { opacity: 0.9; }
                50% { opacity: 0.6; }
            }

            /* Section animation classes */
            .section-fade-out {
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.4s ease-out;
            }

            .section-fade-in {
                opacity: 1;
                transform: translateY(0);
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }

            /* Enhanced section highlighting */
            .section-highlight {
                position: relative;
                overflow: hidden;
            }

            .section-highlight::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(231, 76, 60, 0.1), transparent);
                animation: sectionHighlightSweep 1.5s ease-in-out;
                z-index: 1;
            }

            @keyframes sectionHighlightSweep {
                0% { left: -100%; }
                100% { left: 100%; }
            }

            /* Section content animation */
            .section-content-animate {
                animation: sectionContentSlide 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            }

            @keyframes sectionContentSlide {
                0% {
                    opacity: 0;
                    transform: translateX(-30px);
                }
                100% {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Show section transition with custom text
    showSectionTransition(sectionName = 'Loading Section...') {
        if (this.isTransitioning) return;

        this.isTransitioning = true;
        const overlay = document.getElementById('section-transition-overlay');
        const textElement = overlay.querySelector('.section-transition-text');
        
        // Update transition text
        textElement.textContent = sectionName;
        
        // Show overlay
        overlay.classList.add('active');
        
        return overlay;
    }

    // Hide section transition
    hideSectionTransition() {
        const overlay = document.getElementById('section-transition-overlay');
        
        overlay.classList.remove('active');
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, 300);
    }

    // Smooth transition to section with loading effect
    transitionToSection(sectionId, sectionName, offset = 80) {
        const section = document.getElementById(sectionId) || document.querySelector(sectionId);
        
        if (!section || this.isTransitioning) return;

        // Show loading overlay
        this.showSectionTransition(sectionName);

        // Add fade out effect to current view
        const currentSections = document.querySelectorAll('section:not(.section-fade-out)');
        currentSections.forEach(sec => {
            if (sec !== section) {
                sec.classList.add('section-fade-out');
            }
        });

        // Wait for fade out, then scroll and animate
        setTimeout(() => {
            const sectionTop = section.getBoundingClientRect().top + window.pageYOffset - offset;
            
            window.scrollTo({
                top: sectionTop,
                behavior: 'smooth'
            });

            // Wait for scroll to complete
            setTimeout(() => {
                // Hide loading overlay
                this.hideSectionTransition();
                
                // Animate target section
                this.animateSection(section);
                
                // Remove fade out from other sections
                setTimeout(() => {
                    currentSections.forEach(sec => {
                        sec.classList.remove('section-fade-out');
                        sec.classList.add('section-fade-in');
                    });
                }, 200);

            }, 600);
        }, 300);
    }

    // Animate section entrance
    animateSection(section) {
        // Add highlight effect
        section.classList.add('section-highlight');
        
        // Animate section content
        const content = section.querySelectorAll('.container, .section-header, .categories-grid, .products-grid, .features-grid');
        content.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('section-content-animate');
            }, index * 100);
        });

        // Remove highlight after animation
        setTimeout(() => {
            section.classList.remove('section-highlight');
            content.forEach(element => {
                element.classList.remove('section-content-animate');
            });
        }, 1500);
    }

    // Initialize section observer for auto-transitions
    initSectionObserver() {
        const sections = document.querySelectorAll('section[id], .hero[id]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.isTransitioning) {
                    const sectionId = entry.target.id;
                    const sectionName = this.getSectionDisplayName(sectionId);
                    
                    // Subtle animation for sections coming into view
                    entry.target.style.animation = 'sectionContentSlide 0.6s ease-out';
                    setTimeout(() => {
                        entry.target.style.animation = '';
                    }, 600);
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-50px 0px -50px 0px'
        });

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    // Intercept section navigation links
    interceptSectionNavigation() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"], button[data-section]');
            
            if (link && !e.defaultPrevented) {
                let sectionId, sectionName;
                
                if (link.matches('a[href^="#"]')) {
                    sectionId = link.getAttribute('href');
                    sectionName = this.getSectionDisplayName(sectionId.substring(1));
                } else if (link.dataset.section) {
                    sectionId = '#' + link.dataset.section;
                    sectionName = this.getSectionDisplayName(link.dataset.section);
                }
                
                if (sectionId && sectionId !== '#') {
                    e.preventDefault();
                    this.transitionToSection(sectionId, sectionName);
                }
            }
        });
    }

    // Get display name for section
    getSectionDisplayName(sectionId) {
        const sectionNames = {
            'hero': 'Loading Welcome Section...',
            'categories': 'Loading Categories...',
            'popular-products': 'Loading Popular Products...',
            'features': 'Loading Our Features...',
            'about': 'Loading About Us...',
            'contact': 'Loading Contact Information...',
            'footer': 'Loading Footer Information...'
        };
        
        return sectionNames[sectionId] || `Loading ${sectionId.replace('-', ' ')}...`;
    }

    // Public method to trigger section transition
    goToSection(sectionId, customName = null) {
        const sectionName = customName || this.getSectionDisplayName(sectionId);
        this.transitionToSection('#' + sectionId, sectionName);
    }

    // Enhanced category scroll with section transition
    scrollToCategories() {
        this.transitionToSection('#categories', 'Loading Categories...');
    }

    // Navigate to popular products
    scrollToProducts() {
        this.transitionToSection('#popular-products', 'Loading Popular Products...');
    }

    // Navigate to features
    scrollToFeatures() {
        this.transitionToSection('#features', 'Loading Our Features...');
    }
}

// Initialize section transitions when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.sectionTransitions = new SectionTransitions();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SectionTransitions;
}