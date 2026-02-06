// Location Selector Manager
class LocationManager {
    constructor() {
        this.currentLocation = 'New York 10001';
        this.deliveryAreas = [
            { name: 'New York', zip: '10001', available: true },
            { name: 'New York', zip: '10002', available: true },
            { name: 'New York', zip: '10003', available: true },
            { name: 'Brooklyn', zip: '11201', available: true },
            { name: 'Brooklyn', zip: '11215', available: true },
            { name: 'Queens', zip: '11101', available: true },
            { name: 'Queens', zip: '11102', available: true },
            { name: 'Manhattan', zip: '10001', available: true },
            { name: 'Manhattan', zip: '10010', available: true },
            { name: 'Manhattan', zip: '10011', available: true },
            { name: 'Bronx', zip: '10451', available: true },
            { name: 'Staten Island', zip: '10301', available: false },
            { name: 'Los Angeles', zip: '90210', available: true },
            { name: 'Los Angeles', zip: '90211', available: true },
            { name: 'Chicago', zip: '60601', available: true },
            { name: 'Miami', zip: '33101', available: true },
            { name: 'Boston', zip: '02101', available: true },
            { name: 'San Francisco', zip: '94102', available: true },
            { name: 'Washington DC', zip: '20001', available: true },
            { name: 'Philadelphia', zip: '19101', available: false }
        ];
        
        this.selectedLocation = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadSavedLocation();
    }

    bindEvents() {
        // Location selector click (header)
        const locationSelector = document.getElementById('location-selector');
        if (locationSelector) {
            locationSelector.addEventListener('click', () => this.openModal());
        }

        // Also bind to any other location change triggers
        const changeLocationBtns = document.querySelectorAll('[data-action="change-location"], .change-location-btn');
        changeLocationBtns.forEach(btn => {
            btn.addEventListener('click', () => this.openModal());
        });

        // Modal close events
        const modal = document.getElementById('location-modal');
        const closeBtn = document.getElementById('location-modal-close');
        const cancelBtn = document.getElementById('location-cancel');
        
        if (closeBtn) closeBtn.addEventListener('click', () => this.closeModal());
        if (cancelBtn) cancelBtn.addEventListener('click', () => this.closeModal());
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeModal();
            });
        }

        // Search input events
        const searchInput = document.getElementById('location-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
            searchInput.addEventListener('focus', () => this.showSuggestions());
        }

        // Confirm button
        const confirmBtn = document.getElementById('location-confirm');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => this.confirmLocation());
        }

        // Use current location button
        const useCurrentBtn = document.getElementById('location-use-current');
        if (useCurrentBtn) {
            useCurrentBtn.addEventListener('click', () => this.useCurrentLocation());
        }

        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
        });

        // Listen for location change events from other components
        document.addEventListener('locationChanged', (e) => {
            this.onLocationChanged(e.detail);
        });
    }

    openModal() {
        const modal = document.getElementById('location-modal');
        const searchInput = document.getElementById('location-search');
        
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Focus search input after modal opens
            setTimeout(() => {
                if (searchInput) searchInput.focus();
            }, 100);
        }
    }

    closeModal() {
        const modal = document.getElementById('location-modal');
        const suggestions = document.getElementById('location-suggestions');
        const deliveryStatus = document.getElementById('delivery-status');
        
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        // Reset form
        const searchInput = document.getElementById('location-search');
        if (searchInput) searchInput.value = '';
        if (suggestions) suggestions.style.display = 'none';
        if (deliveryStatus) deliveryStatus.style.display = 'none';
        
        this.selectedLocation = null;
    }

    handleSearch(query) {
        if (query.length < 2) {
            this.hideSuggestions();
            return;
        }

        const matches = this.deliveryAreas.filter(area => 
            area.name.toLowerCase().includes(query.toLowerCase()) ||
            area.zip.includes(query) ||
            `${area.name} ${area.zip}`.toLowerCase().includes(query.toLowerCase())
        );

        this.showSuggestions(matches);
    }

    showSuggestions(matches = null) {
        const suggestions = document.getElementById('location-suggestions');
        if (!suggestions) return;

        if (!matches) {
            matches = this.deliveryAreas.slice(0, 8); // Show top 8 areas by default
        }

        if (matches.length === 0) {
            suggestions.innerHTML = '<div class="location-suggestion">No delivery areas found</div>';
        } else {
            suggestions.innerHTML = matches.map(area => `
                <div class="location-suggestion" data-location="${area.name} ${area.zip}" data-available="${area.available}">
                    <div class="location-suggestion-main">${area.name}, ${area.zip}</div>
                    <div class="location-suggestion-sub">
                        ${area.available ? '✓ Delivery available' : '✗ Delivery not available'}
                    </div>
                </div>
            `).join('');

            // Add click handlers to suggestions
            suggestions.querySelectorAll('.location-suggestion').forEach(suggestion => {
                suggestion.addEventListener('click', () => {
                    const location = suggestion.dataset.location;
                    const available = suggestion.dataset.available === 'true';
                    this.selectLocation(location, available);
                });
            });
        }

        suggestions.style.display = 'block';
    }

    hideSuggestions() {
        const suggestions = document.getElementById('location-suggestions');
        if (suggestions) {
            suggestions.style.display = 'none';
        }
    }

    selectLocation(location, available) {
        const searchInput = document.getElementById('location-search');
        const deliveryStatus = document.getElementById('delivery-status');
        
        if (searchInput) searchInput.value = location;
        this.hideSuggestions();
        
        this.selectedLocation = { location, available };
        
        if (deliveryStatus) {
            deliveryStatus.style.display = 'block';
            if (available) {
                deliveryStatus.className = 'delivery-status available';
                deliveryStatus.textContent = '✓ Great! We deliver to this area';
            } else {
                deliveryStatus.className = 'delivery-status unavailable';
                deliveryStatus.textContent = '✗ Sorry, we don\'t deliver to this area yet';
            }
        }
    }

    confirmLocation() {
        if (!this.selectedLocation) {
            // Try to parse the input manually
            const searchInput = document.getElementById('location-search');
            if (searchInput && searchInput.value.trim()) {
                const inputValue = searchInput.value.trim();
                const match = this.deliveryAreas.find(area => 
                    `${area.name} ${area.zip}`.toLowerCase() === inputValue.toLowerCase() ||
                    area.zip === inputValue ||
                    area.name.toLowerCase() === inputValue.toLowerCase()
                );
                
                if (match) {
                    this.selectedLocation = { 
                        location: `${match.name} ${match.zip}`, 
                        available: match.available 
                    };
                } else {
                    // Default to input value but mark as unavailable
                    this.selectedLocation = { 
                        location: inputValue, 
                        available: false 
                    };
                }
            } else {
                this.showNotification('Please select a delivery location', 'error');
                return;
            }
        }

        if (!this.selectedLocation.available) {
            this.showNotification('Sorry, delivery is not available to this location', 'error');
            return;
        }

        // Update the display
        this.updateLocationDisplay(this.selectedLocation.location);
        
        // Save to localStorage
        this.saveLocation(this.selectedLocation.location);
        
        // Show success message
        this.showNotification('Delivery location updated successfully!', 'success');
        
        // Close modal
        this.closeModal();
    }

    updateLocationDisplay(location) {
        const locationDisplay = document.getElementById('delivery-location');
        if (locationDisplay) {
            locationDisplay.textContent = location;
            
            // Add visual feedback animation
            locationDisplay.style.animation = 'locationUpdate 0.5s ease-in-out';
            setTimeout(() => {
                locationDisplay.style.animation = '';
            }, 500);
        }
        
        // Update all other delivery location displays
        const deliveryElements = document.querySelectorAll('[data-delivery-location], .delivery-location');
        deliveryElements.forEach(element => {
            element.textContent = `Deliver to ${location}`;
        });
        
        this.currentLocation = location;
        
        // Trigger location change event for other components
        const locationChangeEvent = new CustomEvent('locationChanged', {
            detail: { location, timestamp: Date.now() }
        });
        document.dispatchEvent(locationChangeEvent);
    }

    saveLocation(location) {
        try {
            localStorage.setItem('quickbasket_delivery_location', location);
        } catch (error) {
            console.warn('Could not save location to localStorage:', error);
        }
    }

    loadSavedLocation() {
        try {
            const savedLocation = localStorage.getItem('quickbasket_delivery_location');
            if (savedLocation) {
                this.updateLocationDisplay(savedLocation);
            }
        } catch (error) {
            console.warn('Could not load saved location:', error);
        }
    }

    showNotification(message, type = 'info') {
        // Use the main app notification system if available
        if (window.quickBasketApp && typeof window.quickBasketApp.showNotification === 'function') {
            window.quickBasketApp.showNotification(message, type);
            return;
        }

        // Fallback: create enhanced notification element
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'notification-container';
            container.id = 'notification-container';
            document.body.appendChild(container);
        }

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const iconMap = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        
        const titleMap = {
            success: 'Success!',
            error: 'Error',
            warning: 'Warning',
            info: 'Info'
        };
        
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas ${iconMap[type] || iconMap.info}"></i>
            </div>
            <div class="notification-text">
                <div class="notification-title">${titleMap[type] || titleMap.info}</div>
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
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(120%) scale(0.9)';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }

    // Public methods for external access
    getCurrentLocation() {
        return this.currentLocation;
    }

    isDeliveryAvailable(location = null) {
        const checkLocation = location || this.currentLocation;
        return this.deliveryAreas.some(area => 
            `${area.name} ${area.zip}` === checkLocation && area.available
        );
    }

    // Handle location changes from other components
    onLocationChanged(detail) {
        if (detail && detail.location) {
            this.currentLocation = detail.location;
            console.log('Location updated via event:', detail.location);
        }
    }

    // Public method to open modal (for external access)
    openLocationSelector() {
        this.openModal();
    }

    // Try to use browser geolocation and update the modal
    useCurrentLocation() {
        if (!('geolocation' in navigator)) {
            this.showNotification('Geolocation not supported by this browser', 'warning');
            return;
        }

        const btn = document.getElementById('location-use-current');
        const originalHtml = btn ? btn.innerHTML : '';
        const setLoading = (isLoading) => {
            if (!btn) return;
            btn.disabled = isLoading;
            btn.classList.toggle('loading', isLoading);
            btn.innerHTML = isLoading ? '<i class="fas fa-spinner fa-spin"></i> Detecting…' : originalHtml;
        };

        setLoading(true);

        const onError = (err) => {
            console.warn('Geolocation error:', err);
            setLoading(false);
            if (err && err.code === err.PERMISSION_DENIED) {
                this.showNotification('Location permission denied. You can type your city or ZIP instead.', 'warning');
            } else if (err && err.code === err.POSITION_UNAVAILABLE) {
                this.showNotification('Location unavailable. Try again or enter your address manually.', 'warning');
            } else if (err && err.code === err.TIMEOUT) {
                this.showNotification('Location request timed out. Please try again.', 'warning');
            } else {
                this.showNotification('Could not get your location. Please enter it manually.', 'warning');
            }
        };

        navigator.geolocation.getCurrentPosition(async (pos) => {
            try {
                const { latitude, longitude } = pos.coords;
                // Try a lightweight reverse geocode; fall back to nearest known area by zip or city
                const human = await this.reverseGeocode(latitude, longitude).catch(() => null);

                if (human && (human.zip || human.city)) {
                    const zip = human.zip || '';
                    const city = human.city || human.state || 'Current Location';
                    // Try to match our service list by zip first
                    let match = null;
                    if (zip) {
                        match = this.deliveryAreas.find(a => a.zip === zip && a.available);
                    }
                    if (!match && city) {
                        const lc = city.toLowerCase();
                        match = this.deliveryAreas.find(a => a.name.toLowerCase() === lc && a.available);
                    }

                    const composed = match ? `${match.name} ${match.zip}` : `${city}${zip ? ' ' + zip : ''}`;
                    const available = !!match;
                    this.selectLocation(composed, available);
                } else {
                    // No human-readable result; pick the first available area as suggestion
                    const fallback = this.deliveryAreas.find(a => a.available);
                    if (fallback) {
                        this.selectLocation(`${fallback.name} ${fallback.zip}`, true);
                    }
                }
            } catch (e) {
                console.warn('Reverse geocode failed:', e);
                this.showNotification('Could not resolve your location. Please type your city or ZIP.', 'warning');
            } finally {
                setLoading(false);
            }
        }, onError, { enableHighAccuracy: false, timeout: 8000, maximumAge: 30000 });
    }

    // Reverse geocode using a public endpoint with no key; keep lightweight and resilient
    async reverseGeocode(lat, lon) {
        // Use OpenStreetMap Nominatim public endpoint respectfully
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`;
        const resp = await fetch(url, { headers: { 'Accept': 'application/json' } });
        if (!resp.ok) throw new Error('HTTP ' + resp.status);
        const data = await resp.json();
        const addr = data && data.address ? data.address : {};
        return {
            city: addr.city || addr.town || addr.village || addr.county,
            state: addr.state,
            zip: addr.postcode || addr["postcode"]
        };
    }
}

// Initialize location manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.locationManager = new LocationManager();
});
