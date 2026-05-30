// Authentication System
class AuthManager {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.ensureAdminUser();
        this.saveUsers();
        this.updateNavigation();
    }

    getDefaultUsers() {
        return [
            {
                id: 1,
                email: 'bynexstudios@gmail.com',
                password: 'SITh2007',
                fullName: 'Administrator',
                isAdmin: true,
                createdAt: new Date()
            }
        ];
    }

    ensureAdminUser() {
        const adminEmail = 'bynexstudios@gmail.com';
        const adminPassword = 'SITh2007';
        let adminUser = this.users.find(u => u.email === adminEmail);

        if (adminUser) {
            adminUser.password = adminPassword;
            adminUser.isAdmin = true;
            adminUser.fullName = 'Administrator';
        } else {
            this.users.push(this.getDefaultUsers()[0]);
        }
    }

    register(email, password, fullName) {
        if (this.users.find(u => u.email === email)) {
            return { success: false, message: 'Email already exists' };
        }
        
        const newUser = {
            id: Date.now(),
            email,
            password, // In production, hash this!
            fullName,
            isAdmin: false,
            createdAt: new Date()
        };
        
        this.users.push(newUser);
        this.saveUsers();
        return { success: true, message: 'Registration successful' };
    }

    login(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            return { success: false, message: 'Invalid email or password' };
        }
        
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.updateNavigation();
        return { success: true, message: 'Login successful', user };
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.updateNavigation();
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    isAdmin() {
        return this.currentUser && this.currentUser.isAdmin;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    updateNavigation() {
        const navLinks = document.querySelector('.nav-links');
        if (!navLinks) return;

        const loginItem = navLinks.querySelector('li a[href="login.html"]');
        const registerItem = navLinks.querySelector('li a[href="register.html"]');
        const profileDropdown = document.getElementById('profileDropdown');
        const adminLink = document.getElementById('adminLink');
        const avatar = document.getElementById('profileAvatar');

        if (this.isLoggedIn()) {
            if (loginItem) loginItem.parentElement.style.display = 'none';
            if (registerItem) registerItem.parentElement.style.display = 'none';

            if (profileDropdown) {
                profileDropdown.style.display = 'block';
                const name = this.currentUser.fullName || this.currentUser.email;
                document.getElementById('userName').textContent = name.split(' ')[0];
                if (avatar) avatar.textContent = name.charAt(0).toUpperCase();
            }

            if (adminLink) {
                adminLink.style.display = this.isAdmin() ? 'block' : 'none';
            }
            const mobileAdminLink = document.getElementById('mobileAdminLink');
            if (mobileAdminLink) {
                mobileAdminLink.style.display = this.isAdmin() ? 'block' : 'none';
            }
        } else {
            if (loginItem) loginItem.parentElement.style.display = 'block';
            if (registerItem) registerItem.parentElement.style.display = 'block';
            if (profileDropdown) profileDropdown.style.display = 'none';
            if (adminLink) adminLink.style.display = 'none';
            const mobileAdminLink = document.getElementById('mobileAdminLink');
            if (mobileAdminLink) mobileAdminLink.style.display = 'none';
        }

        const cartItem = navLinks.querySelector('.cart-icon');
        if (cartItem) {
            cartItem.style.display = this.isLoggedIn() ? 'block' : 'none';
        }
    }

    saveUsers() {
        localStorage.setItem('users', JSON.stringify(this.users));
    }

    makeAdmin(userId) {
        const user = this.users.find(u => u.id === userId);
        if (user) {
            user.isAdmin = true;
            this.saveUsers();
        }
    }
}

// Initialize Auth Manager
const auth = new AuthManager();

// Navigation update on page load
document.addEventListener('DOMContentLoaded', () => {
    auth.updateNavigation();
});

function logout(event) {
    if (event) event.preventDefault();
    auth.logout();
    window.location.href = 'index.html';
}

function toggleProfile(event) {
    event.stopPropagation();
    const profileDropdown = document.getElementById('profileDropdown');
    if (profileDropdown) {
        profileDropdown.classList.toggle('active');
    }
}

document.addEventListener('click', (event) => {
    const profileDropdown = document.getElementById('profileDropdown');
    if (profileDropdown && !profileDropdown.contains(event.target)) {
        profileDropdown.classList.remove('active');
    }
});
