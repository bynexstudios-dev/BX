const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\Lenovo\\Desktop\\S Project new 30';

const filesToUpdate = ['index.html', 'shop.html', 'about.html', 'contact.html', 'login.html', 'register.html'];

const newNav = `
    <!-- Navigation -->
    <nav id="navbar" class="scrolled">
        <div class="nav-container">
            <a href="index.html" class="logo">B<span>X</span></a>
            <ul class="nav-links">
                <li><a href="index.html">Home</a></li>
                <li><a href="shop.html">Shop</a></li>
                <li><a href="about.html">About</a></li>
                <li><a href="contact.html">Contact</a></li>
                <li>
                    <div class="auth-dropdown" style="position: relative;">
                        <div class="cart-icon" id="profileBtn" onclick="toggleProfileMenu()">
                            <i class="fas fa-user"></i>
                        </div>
                        <div id="profileMenu" class="dropdown-content" style="display: none; position: absolute; top: 100%; right: 0; background: var(--black); border: 1px solid var(--border); width: 150px; padding: 0.5rem 0;">
                            <!-- Injected via JS -->
                        </div>
                    </div>
                </li>
                <li>
                    <div class="cart-icon" onclick="toggleCart()">
                        <i class="fas fa-shopping-bag"></i>
                        <span class="cart-count" id="cartCount">0</span>
                    </div>
                </li>
            </ul>
            <div class="mobile-menu" onclick="openMobileMenu()">
                <i class="fas fa-bars"></i>
            </div>
        </div>
    </nav>
`;

const newMobileMenu = `
    <!-- Mobile Menu -->
    <div class="mobile-panel" id="mobilePanel">
        <button class="mobile-close" onclick="closeMobileMenu()"><i class="fas fa-times"></i></button>
        <a href="index.html" onclick="closeMobileMenu()">Home</a>
        <a href="shop.html" onclick="closeMobileMenu()">Shop</a>
        <a href="about.html" onclick="closeMobileMenu()">About</a>
        <a href="contact.html" onclick="closeMobileMenu()">Contact</a>
        <div id="mobilePanelAuth" style="border-top: 1px solid var(--border); margin-top: 1rem; padding-top: 1rem;">
            <!-- Injected via JS -->
        </div>
    </div>
`;

const newCSS = `
        .dropdown-content a {
            display: block;
            padding: 0.8rem 1.5rem;
            color: var(--text);
            text-decoration: none;
            font-family: 'Space Grotesk', sans-serif;
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 2px;
            transition: background 0.3s;
        }
        .dropdown-content a:hover {
            background: var(--surface-2);
            color: var(--accent);
        }
        .auth-dropdown:hover .dropdown-content {
            /* Optional: could make it hover based, but JS click is better for mobile */
        }
`;

const newJS = `
        // ==================== AUTH ====================
        let bx_user = JSON.parse(localStorage.getItem('bx_user'));

        function initAuth() {
            const profileMenu = document.getElementById('profileMenu');
            const mobilePanelAuth = document.getElementById('mobilePanelAuth');
            
            if (bx_user) {
                // Logged in
                let adminLink = bx_user.isAdmin ? '<a href="admin-dashboard.html">Admin Panel</a>' : '';
                if(profileMenu) profileMenu.innerHTML = \`
                    <div style="padding: 0.5rem 1.5rem; border-bottom: 1px solid var(--border); font-size: 0.75rem; color: var(--text-dim);">Hi, \${bx_user.name}</div>
                    \${adminLink}
                    <a href="#" onclick="logout(event)">Logout</a>
                \`;
                
                if (mobilePanelAuth) {
                    mobilePanelAuth.innerHTML = \`
                        \${adminLink}
                        <a href="#" onclick="logout(event)">Logout</a>
                    \`;
                }
            } else {
                // Logged out
                if(profileMenu) profileMenu.innerHTML = \`
                    <a href="login.html">Login</a>
                    <a href="register.html">Sign Up</a>
                \`;
                
                if (mobilePanelAuth) {
                    mobilePanelAuth.innerHTML = \`
                        <a href="login.html" onclick="closeMobileMenu()">Login</a>
                        <a href="register.html" onclick="closeMobileMenu()">Sign Up</a>
                    \`;
                }
            }
        }

        function toggleProfileMenu() {
            const menu = document.getElementById('profileMenu');
            if(menu) menu.style.display = menu.style.display === 'none' || menu.style.display === '' ? 'block' : 'none';
        }

        function logout(e) {
            e.preventDefault();
            localStorage.removeItem('bx_user');
            window.location.reload();
        }

        document.addEventListener('click', (e) => {
            const profileMenu = document.getElementById('profileMenu');
            const profileBtn = document.getElementById('profileBtn');
            if (profileMenu && !profileMenu.contains(e.target) && !profileBtn.contains(e.target)) {
                profileMenu.style.display = 'none';
            }
        });
`;

filesToUpdate.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');

        // Replace Navbar
        content = content.replace(/<!-- Navigation -->[\s\S]*?<\/nav>/, newNav.trim());
        
        // Replace Mobile Menu
        content = content.replace(/<!-- Mobile Menu -->[\s\S]*?<\/div>/, newMobileMenu.trim());

        // Inject CSS if not exists
        if (!content.includes('.dropdown-content a')) {
            content = content.replace('</style>', newCSS + '\n    </style>');
        }

        // Inject JS if not exists
        if (!content.includes('initAuth()')) {
            content = content.replace('<script>', '<script>\n' + newJS);
            // Also call initAuth() in DOMContentLoaded
            if (content.includes('updateCartUI();')) {
                content = content.replace('updateCartUI();', 'updateCartUI();\n            initAuth();');
            } else {
                content = content.replace("document.addEventListener('DOMContentLoaded', () => {", "document.addEventListener('DOMContentLoaded', () => {\n            initAuth();");
            }
        }

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated nav in ${file}`);
    }
});
