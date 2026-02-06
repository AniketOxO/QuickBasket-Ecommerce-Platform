/**
 * User Authentication System for QuickBasket
 * Updated to work with HTML modal structure
 */

class UserAuthManager {
    constructor() {
        this.currentUser = null;
        this.users = [];
        this.authModal = null;
        this.init();
    }

    init() {
        this.loadUsersFromStorage();
        this.loadCurrentSession();
        this.setupModal();
        this.updateUIForUser();
    }

    // Load users from localStorage
    loadUsersFromStorage() {
        const savedUsers = localStorage.getItem('quickbasket_users');
        if (savedUsers) {
            this.users = JSON.parse(savedUsers);
        }
    }

    // Save users to localStorage
    saveUsersToStorage() {
        localStorage.setItem('quickbasket_users', JSON.stringify(this.users));
    }

    // Load current session
    loadCurrentSession() {
        const savedSession = localStorage.getItem('quickbasket_current_user');
        if (savedSession) {
            this.currentUser = JSON.parse(savedSession);
        }
    }

    // Save current session
    saveCurrentSession() {
        if (this.currentUser) {
            localStorage.setItem('quickbasket_current_user', JSON.stringify(this.currentUser));
        } else {
            localStorage.removeItem('quickbasket_current_user');
        }
    }

    // Setup modal and event listeners
    setupModal() {
        this.authModal = document.getElementById('auth-modal');
        
        if (!this.authModal) {
            console.error('Auth modal not found in HTML');
            return;
        }
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Account button click
        const accountBtns = document.querySelectorAll('.account-btn, #account-btn');
        accountBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.currentUser) {
                    this.showAccountDashboard();
                } else {
                    this.openAuthModal('login');
                }
            });
        });

        // Modal close events
        const closeBtn = document.getElementById('auth-modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeAuthModal());
        }

        // Form submissions
        const loginForm = document.getElementById('login-form-element');
        const registerForm = document.getElementById('register-form-element');
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Form switching
        const showRegisterBtn = document.getElementById('show-register');
        const showLoginBtn = document.getElementById('show-login');
        
        if (showRegisterBtn) {
            showRegisterBtn.addEventListener('click', () => this.switchToRegister());
        }
        
        if (showLoginBtn) {
            showLoginBtn.addEventListener('click', () => this.switchToLogin());
        }

        // Password toggles
        const passwordToggles = document.querySelectorAll('.password-toggle');
        passwordToggles.forEach(toggle => {
            toggle.addEventListener('click', () => this.togglePassword(toggle));
        });

        // Password strength checker
        const registerPassword = document.getElementById('register-password');
        if (registerPassword) {
            registerPassword.addEventListener('input', () => this.checkPasswordStrength());
        }

        // Password confirmation
        const confirmPassword = document.getElementById('register-confirm-password');
        if (confirmPassword) {
            confirmPassword.addEventListener('input', () => this.validatePasswordMatch());
        }

        // Modal overlay click
        if (this.authModal) {
            this.authModal.addEventListener('click', (e) => {
                if (e.target === this.authModal) {
                    this.closeAuthModal();
                }
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }

        // Edit profile entries
        const viewProfile = document.getElementById('view-profile');
        const viewSettings = document.getElementById('view-settings');
    const viewOrders = document.getElementById('view-orders');
    const viewWishlist = document.getElementById('view-wishlist');
    const viewAddresses = document.getElementById('view-addresses');
        if (viewProfile) viewProfile.addEventListener('click', (e) => { e.preventDefault(); this.showEditProfile(); });
    if (viewSettings) viewSettings.addEventListener('click', (e) => { e.preventDefault(); this.showEditProfile(); });
    if (viewOrders) viewOrders.addEventListener('click', (e) => { e.preventDefault(); this.showOrdersView(); });
    if (viewWishlist) viewWishlist.addEventListener('click', (e) => { e.preventDefault(); this.openWishlist(); });
    if (viewAddresses) viewAddresses.addEventListener('click', (e) => { e.preventDefault(); this.showAddressesView(); });

        // Edit profile cancel/back
        const editCancel = document.getElementById('edit-profile-cancel');
        if (editCancel) editCancel.addEventListener('click', (e) => { e.preventDefault(); this.showAccountDashboard(); });
    const ordersBack = document.getElementById('orders-back');
    if (ordersBack) ordersBack.addEventListener('click', (e) => { e.preventDefault(); this.showAccountDashboard(); });
    const addressesBack = document.getElementById('addresses-back');
    if (addressesBack) addressesBack.addEventListener('click', (e) => { e.preventDefault(); this.showAccountDashboard(); });

        // Edit profile save
        const editForm = document.getElementById('edit-profile-form-element');
        if (editForm) {
            editForm.addEventListener('submit', (e) => this.handleEditProfile(e));
        }

        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.authModal && this.authModal.classList.contains('active')) {
                this.closeAuthModal();
            }
        });
    }

    // Open wishlist drawer from account
    openWishlist() {
        try {
            if (window.wishlistManager) {
                this.closeAuthModal();
                setTimeout(() => window.wishlistManager.openWishlistDrawer(), 50);
            } else {
                this.showNotification('Wishlist unavailable on this page', 'info');
            }
        } catch (_) {}
    }

    // Show orders view
    showOrdersView() {
        if (!this.currentUser) { this.openAuthModal('login'); return; }
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const accountDashboard = document.getElementById('account-dashboard');
        const editProfileForm = document.getElementById('edit-profile-form');
        const ordersView = document.getElementById('orders-view');
        const addressesView = document.getElementById('addresses-view');
        const modalTitle = document.getElementById('auth-modal-title');

        if (loginForm) loginForm.style.display = 'none';
        if (registerForm) registerForm.style.display = 'none';
        if (accountDashboard) accountDashboard.style.display = 'none';
        if (editProfileForm) editProfileForm.style.display = 'none';
        if (addressesView) addressesView.style.display = 'none';
        if (ordersView) ordersView.style.display = 'block';
        if (modalTitle) modalTitle.textContent = 'My Orders';

        this.renderOrdersList();
        this.openAuthModal(null);
    }

    // Render orders from localStorage
    renderOrdersList() {
        const container = document.getElementById('orders-list');
        if (!container) return;
        const orders = JSON.parse(localStorage.getItem('quickbasket_orders') || '[]');

        if (!orders.length) {
            container.innerHTML = `
                <div class="empty-state" style="text-align:center; color:#ccc; padding:16px;">
                    <i class="fas fa-box-open" style="font-size:28px; color:#888;"></i>
                    <p style="margin:8px 0 0;">You have no orders yet.</p>
                    <button class="auth-btn auth-btn-primary" style="margin-top:8px;" onclick="document.getElementById('auth-modal-close').click(); scrollToCategories?.()">Shop Now</button>
                </div>`;
            return;
        }

        container.innerHTML = orders.map(o => `
            <div class="order-card" style="border:1px solid #555; border-radius:10px; padding:12px; margin-bottom:10px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <strong>Order <code>${o.id}</code></strong>
                    <span class="badge" style="background:#dc3545; color:#fff; padding:4px 8px; border-radius:999px;">${o.status}</span>
                </div>
                <div style="color:#bbb; font-size:0.9rem; margin-top:4px;">${new Date(o.createdAt).toLocaleString()}</div>
                <div style="display:flex; justify-content:space-between; margin-top:8px;">
                    <span>${(o.items||[]).length} item(s)</span>
                    <strong>$${Number(o.total||0).toFixed(2)}</strong>
                </div>
                <div style="margin-top:8px; display:flex; gap:8px;">
                    <a class="auth-btn auth-btn-secondary" href="pages/track-order.html?id=${o.id}"><i class="fas fa-location-arrow"></i> Track</a>
                </div>
            </div>
        `).join('');
    }

    // Show addresses view
    showAddressesView() {
        if (!this.currentUser) { this.openAuthModal('login'); return; }
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const accountDashboard = document.getElementById('account-dashboard');
        const editProfileForm = document.getElementById('edit-profile-form');
        const ordersView = document.getElementById('orders-view');
        const addressesView = document.getElementById('addresses-view');
        const modalTitle = document.getElementById('auth-modal-title');

        if (loginForm) loginForm.style.display = 'none';
        if (registerForm) registerForm.style.display = 'none';
        if (accountDashboard) accountDashboard.style.display = 'none';
        if (editProfileForm) editProfileForm.style.display = 'none';
        if (ordersView) ordersView.style.display = 'none';
        if (addressesView) addressesView.style.display = 'block';
        if (modalTitle) modalTitle.textContent = 'Saved Addresses';

        this.bindAddressForm();
        this.renderAddressList();
        this.openAuthModal(null);
    }

    getAddresses() {
        const key = 'quickbasket_addresses';
        const map = JSON.parse(localStorage.getItem(key) || '{}');
        return map[this.currentUser?.id] || [];
    }
    saveAddresses(list) {
        const key = 'quickbasket_addresses';
        const map = JSON.parse(localStorage.getItem(key) || '{}');
        map[this.currentUser?.id] = list;
        localStorage.setItem(key, JSON.stringify(map));
    }
    bindAddressForm() {
        const form = document.getElementById('add-address-form');
        if (!form) return;
        form.onsubmit = (e) => {
            e.preventDefault();
            const label = document.getElementById('address-label').value.trim() || 'Address';
            const line = document.getElementById('address-line').value.trim();
            if (!line) { this.showNotification('Please enter an address', 'error'); return; }
            const list = this.getAddresses();
            list.unshift({ id: Date.now().toString(), label, line });
            this.saveAddresses(list);
            this.renderAddressList();
            form.reset();
            this.showNotification('Address saved', 'success');
        };
    }
    renderAddressList() {
        const container = document.getElementById('address-list');
        if (!container) return;
        const list = this.getAddresses();
        if (!list.length) {
            container.innerHTML = '<p style="color:#ccc">No saved addresses yet.</p>';
            return;
        }
        container.innerHTML = list.map(a => `
            <div class="address-item" style="display:flex; align-items:center; gap:10px; padding:10px; border:1px solid #555; border-radius:10px; margin-bottom:8px;">
                <i class="fas fa-map-marker-alt" style="color:#dc3545"></i>
                <div style="flex:1">
                    <strong>${a.label}</strong>
                    <p style="margin:2px 0; color:#ccc">${a.line}</p>
                </div>
                <button class="auth-btn auth-btn-secondary" onclick="window.userAuth?.deleteAddress('${a.id}')"><i class="fas fa-trash"></i></button>
            </div>
        `).join('');
    }
    deleteAddress(id) {
        const list = this.getAddresses().filter(a => a.id !== id);
        this.saveAddresses(list);
        this.renderAddressList();
        this.showNotification('Address removed', 'info');
    }

    // Handle saving profile edits
    handleEditProfile(event) {
        event.preventDefault();

        const firstName = (document.getElementById('edit-firstname')?.value || '').trim();
        const lastName = (document.getElementById('edit-lastname')?.value || '').trim();
        const email = (document.getElementById('edit-email')?.value || '').trim().toLowerCase();
        const phone = (document.getElementById('edit-phone')?.value || '').trim();

        const emailError = document.getElementById('edit-email-error');
        if (emailError) emailError.textContent = '';

        if (!firstName || !lastName) {
            this.showNotification('First and last name are required', 'error');
            return;
        }
        if (!this.isValidEmail(email)) {
            if (emailError) emailError.textContent = 'Please enter a valid email address';
            return;
        }

        // Ensure email not used by another user
        const conflict = this.users.find(u => u.email === email && u.id !== this.currentUser?.id);
        if (conflict) {
            if (emailError) emailError.textContent = 'This email is already in use by another account';
            return;
        }

        // Update in users list
        const idx = this.users.findIndex(u => u.id === this.currentUser?.id);
        if (idx !== -1) {
            this.users[idx] = { ...this.users[idx], firstName, lastName, email, phone };
            this.saveUsersToStorage();
        }

        // Update session
        this.currentUser = { ...this.currentUser, firstName, lastName, email, phone };
        this.saveCurrentSession();
        this.updateUIForUser();

        // Reflect on dashboard immediately
        const accountName = document.getElementById('account-name');
        const accountEmail = document.getElementById('account-email');
        if (accountName) accountName.textContent = `Welcome, ${firstName}!`;
        if (accountEmail) accountEmail.textContent = email;

        this.showNotification('Profile updated successfully', 'success');
        this.showAccountDashboard();
    }

    // Open authentication modal
    openAuthModal(mode = null) {
        if (!this.authModal) return;

        this.authModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        if (mode === 'login') {
            this.switchToLogin();
        } else if (mode === 'register') {
            this.switchToRegister();
        }
    }

    // Close authentication modal
    closeAuthModal() {
        if (!this.authModal) return;

        this.authModal.classList.remove('active');
        document.body.style.overflow = '';
        this.clearErrors();
        this.resetForms();
    }

    // Switch to login form
    switchToLogin() {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const accountDashboard = document.getElementById('account-dashboard');
        const modalTitle = document.getElementById('auth-modal-title');

        if (loginForm) loginForm.style.display = 'block';
        if (registerForm) registerForm.style.display = 'none';
        if (accountDashboard) accountDashboard.style.display = 'none';
        if (modalTitle) modalTitle.textContent = 'Welcome Back!';

        this.clearErrors();
    }

    // Switch to register form
    switchToRegister() {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const accountDashboard = document.getElementById('account-dashboard');
        const modalTitle = document.getElementById('auth-modal-title');

        if (loginForm) loginForm.style.display = 'none';
        if (registerForm) registerForm.style.display = 'block';
        if (accountDashboard) accountDashboard.style.display = 'none';
        if (modalTitle) modalTitle.textContent = 'Join QuickBasket';

        this.clearErrors();
    }

    // Show account dashboard
    showAccountDashboard() {
        if (!this.currentUser) {
            this.openAuthModal('login');
            return;
        }

        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const accountDashboard = document.getElementById('account-dashboard');
        const modalTitle = document.getElementById('auth-modal-title');

        if (loginForm) loginForm.style.display = 'none';
        if (registerForm) registerForm.style.display = 'none';
        if (accountDashboard) accountDashboard.style.display = 'block';
        if (modalTitle) modalTitle.textContent = 'My Account';

        // Update account info
        const accountName = document.getElementById('account-name');
        const accountEmail = document.getElementById('account-email');

        if (accountName) {
            accountName.textContent = `Welcome, ${this.currentUser.firstName}!`;
        }
        if (accountEmail) {
            accountEmail.textContent = this.currentUser.email;
        }

        this.openAuthModal(null);
    }

    // Show edit profile screen
    showEditProfile() {
        if (!this.currentUser) {
            this.openAuthModal('login');
            return;
        }

        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const accountDashboard = document.getElementById('account-dashboard');
        const editProfileForm = document.getElementById('edit-profile-form');
        const modalTitle = document.getElementById('auth-modal-title');

        if (loginForm) loginForm.style.display = 'none';
        if (registerForm) registerForm.style.display = 'none';
        if (accountDashboard) accountDashboard.style.display = 'none';
        if (editProfileForm) editProfileForm.style.display = 'block';
        if (modalTitle) modalTitle.textContent = 'Edit Profile';

        // Prefill current user data
        const u = this.currentUser || {};
        const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
        setVal('edit-firstname', u.firstName);
        setVal('edit-lastname', u.lastName);
        setVal('edit-email', u.email);
        setVal('edit-phone', u.phone);

        this.openAuthModal(null);
    }

    // Handle login
    async handleLogin(event) {
        event.preventDefault();
        
        const email = document.getElementById('login-email').value.trim().toLowerCase();
        const password = document.getElementById('login-password').value;
        const rememberMe = document.getElementById('remember-me').checked;

        this.clearErrors();

        // Validate inputs
        if (!email) {
            this.showError('login-email-error', 'Email is required');
            return;
        }

        if (!password) {
            this.showError('login-password-error', 'Password is required');
            return;
        }

        // Find user
        const user = this.users.find(u => u.email === email);
        
        if (!user || user.password !== password) {
            this.showError('login-password-error', 'Invalid email or password');
            return;
        }

        // Login successful
        this.currentUser = { ...user };
        this.currentUser.rememberMe = rememberMe;
        this.saveCurrentSession();
        this.updateUIForUser();
        this.closeAuthModal();
        this.showNotification('Login successful! Welcome back.', 'success');
    }

    // Handle registration
    async handleRegister(event) {
        event.preventDefault();
        
        const firstName = document.getElementById('register-firstname').value.trim();
        const lastName = document.getElementById('register-lastname').value.trim();
        const email = document.getElementById('register-email').value.trim().toLowerCase();
        const phone = document.getElementById('register-phone').value.trim();
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        const acceptTerms = document.getElementById('terms-agree').checked;
        const newsletter = document.getElementById('newsletter-subscribe').checked;

        this.clearErrors();

        // Validate inputs
        if (!firstName) {
            this.showError('register-firstname-error', 'First name is required');
            return;
        }

        if (!lastName) {
            this.showError('register-lastname-error', 'Last name is required');
            return;
        }

        if (!email) {
            this.showError('register-email-error', 'Email is required');
            return;
        }

        if (!this.isValidEmail(email)) {
            this.showError('register-email-error', 'Please enter a valid email address');
            return;
        }

        if (!password) {
            this.showError('register-password-error', 'Password is required');
            return;
        }

        if (password.length < 6) {
            this.showError('register-password-error', 'Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            this.showError('register-confirm-password-error', 'Passwords do not match');
            return;
        }

        if (!acceptTerms) {
            this.showError('register-confirm-password-error', 'You must accept the terms and conditions');
            return;
        }

        // Check if user already exists
        if (this.users.find(u => u.email === email)) {
            this.showError('register-email-error', 'An account with this email already exists');
            return;
        }

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            firstName,
            lastName,
            email,
            phone,
            password,
            newsletter,
            createdAt: new Date().toISOString(),
            isActive: true
        };

        this.users.push(newUser);
        this.saveUsersToStorage();

    // Auto login
    this.currentUser = { ...newUser };
    this.saveCurrentSession();
    this.updateUIForUser();
    // Show dashboard so user can edit details or logout
    this.showAccountDashboard();
    this.showNotification('Account created successfully! Welcome to QuickBasket.', 'success');
    }

    // Toggle password visibility
    togglePassword(toggle) {
        const targetId = toggle.dataset.target;
        const passwordInput = document.getElementById(targetId);
        const icon = toggle.querySelector('i');

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            passwordInput.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }

    // Check password strength
    checkPasswordStrength() {
        const password = document.getElementById('register-password').value;
        const strengthElement = document.getElementById('password-strength');
        
        if (!strengthElement) return;

        const strengthBar = strengthElement.querySelector('.strength-fill');
        const strengthText = strengthElement.querySelector('.strength-text');

        let strength = 0;
        let strengthLabel = 'Weak';
        let strengthColor = '#e74c3c';

        if (password.length >= 6) strength += 25;
        if (password.match(/[a-z]/)) strength += 25;
        if (password.match(/[A-Z]/)) strength += 25;
        if (password.match(/[0-9]/)) strength += 25;

        if (strength >= 75) {
            strengthLabel = 'Strong';
            strengthColor = '#27ae60';
        } else if (strength >= 50) {
            strengthLabel = 'Medium';
            strengthColor = '#f39c12';
        }

        if (strengthBar) {
            strengthBar.style.width = `${strength}%`;
            strengthBar.style.backgroundColor = strengthColor;
        }

        if (strengthText) {
            strengthText.textContent = `Password strength: ${strengthLabel}`;
            strengthText.style.color = strengthColor;
        }
    }

    // Validate password match
    validatePasswordMatch() {
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        
        if (confirmPassword && password !== confirmPassword) {
            this.showError('register-confirm-password-error', 'Passwords do not match');
        } else {
            this.clearError('register-confirm-password-error');
        }
    }

    // Update UI for current user state
    updateUIForUser() {
        const accountBtns = document.querySelectorAll('.account-btn, #account-btn');
        
        accountBtns.forEach(btn => {
            if (this.currentUser) {
                // User is logged in
                btn.innerHTML = `
                    <i class="fas fa-user-circle"></i>
                    <span>${this.currentUser.firstName}</span>
                `;
            } else {
                // User is not logged in
                btn.innerHTML = `
                    <i class="fas fa-user"></i>
                    <span>Account</span>
                `;
            }
        });
    }

    // Logout user
    logout() {
        this.currentUser = null;
        this.saveCurrentSession();
        this.updateUIForUser();
        this.closeAuthModal();
        this.showNotification('You have been logged out', 'info');
    }

    // Utility functions
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    clearError(elementId) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }

    clearErrors() {
        const errorElements = document.querySelectorAll('.auth-error');
        errorElements.forEach(element => {
            element.textContent = '';
            element.style.display = 'none';
        });
    }

    resetForms() {
        const forms = document.querySelectorAll('#login-form-element, #register-form-element');
        forms.forEach(form => {
            if (form) form.reset();
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 4000);
    }

    // Public methods for external access
    getCurrentUser() {
        return this.currentUser;
    }

    isUserLoggedIn() {
        return !!this.currentUser;
    }
}

// Initialize the authentication system
document.addEventListener('DOMContentLoaded', () => {
    window.userAuth = new UserAuthManager();
});

// Global function for compatibility
function openAuthModal(mode = 'login') {
    if (window.userAuth) {
        window.userAuth.openAuthModal(mode);
    }
}