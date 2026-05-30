// Admin Panel - Product, Category, Orders, Customers, Settings
class AdminManager {
    constructor() {
        this.categories = JSON.parse(localStorage.getItem('bx_categories')) || this.getDefaultCategories();
        this.products = JSON.parse(localStorage.getItem('bx_products')) || this.getDefaultProducts();
        this.settings = JSON.parse(localStorage.getItem('bx_settings')) || this.getDefaultSettings();
        this.validateAdmin();
    }

    validateAdmin() {
        if (!auth.isAdmin()) {
            window.location.href = 'index.html';
        }
    }

    getDefaultCategories() {
        return [
            { id: 1, name: 'T-Shirts', description: 'Premium quality t-shirts', status: 'active' },
            { id: 2, name: 'Hoodies', description: 'Comfortable hoodies', status: 'active' },
            { id: 3, name: 'Pants', description: 'Stylish pants and jeans', status: 'active' }
        ];
    }

    getDefaultProducts() {
        return [
            { id: 1, name: 'Classic BX Tee', category: 1, price: 2500, stock: 50, status: 'active', description: 'Soft cotton t-shirt with premium print.', image: '', createdAt: new Date() },
            { id: 2, name: 'Street Style Hoodie', category: 2, price: 4500, stock: 30, status: 'active', description: 'Warm hoodie with bold streetwear styling.', image: '', createdAt: new Date() },
            { id: 3, name: 'Premium Denim', category: 3, price: 5500, stock: 20, status: 'active', description: 'High quality denim with a comfortable fit.', image: '', createdAt: new Date() }
        ];
    }

    getDefaultSettings() {
        return {
            storeName: 'BX Clothing Store',
            storeEmail: 'support@bx.com',
            storePhone: '+94 123 456 789',
            currency: 'Rs.',
            address: 'Colombo, Sri Lanka'
        };
    }

    // CATEGORY MANAGEMENT
    addCategory(name, description) {
        const newCategory = {
            id: Date.now(),
            name,
            description,
            status: 'active'
        };
        this.categories.push(newCategory);
        this.saveCategories();
        return newCategory;
    }

    updateCategory(id, name, description, status) {
        const category = this.categories.find(c => c.id === id);
        if (category) {
            category.name = name;
            category.description = description;
            category.status = status;
            this.saveCategories();
            return true;
        }
        return false;
    }

    removeCategory(id) {
        const hasProducts = this.products.some(p => p.category === id);
        if (hasProducts) {
            return { success: false, message: 'Cannot delete category with products' };
        }
        this.categories = this.categories.filter(c => c.id !== id);
        this.saveCategories();
        return { success: true, message: 'Category deleted' };
    }

    getCategories() {
        return this.categories;
    }

    getCategoryById(id) {
        return this.categories.find(c => c.id === id);
    }

    saveCategories() {
        localStorage.setItem('bx_categories', JSON.stringify(this.categories));
    }

    // PRODUCT MANAGEMENT
    addProduct(name, category, price, stock, description = '', image = '') {
        const newProduct = {
            id: Date.now(),
            name,
            category,
            price,
            stock,
            description,
            status: 'active',
            image,
            createdAt: new Date()
        };
        this.products.push(newProduct);
        this.saveProducts();
        return newProduct;
    }

    updateProduct(id, name, category, price, stock, description, status, image = '') {
        const product = this.products.find(p => p.id === id);
        if (product) {
            product.name = name;
            product.category = category;
            product.price = price;
            product.stock = stock;
            product.description = description;
            product.status = status;
            if (image) product.image = image;
            this.saveProducts();
            return true;
        }
        return false;
    }

    removeProduct(id) {
        this.products = this.products.filter(p => p.id !== id);
        this.saveProducts();
        return { success: true, message: 'Product deleted' };
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        return this.products.find(p => p.id === id);
    }

    saveProducts() {
        localStorage.setItem('bx_products', JSON.stringify(this.products));
    }

    // ORDERS
    getOrders() {
        return JSON.parse(localStorage.getItem('bx_orders') || '[]');
    }

    saveOrders(orders) {
        localStorage.setItem('bx_orders', JSON.stringify(orders));
    }

    updateOrderStatus(orderId, status) {
        const orders = this.getOrders();
        const order = orders.find(o => o.id === orderId);
        if (order) {
            order.status = status;
            this.saveOrders(orders);
            return true;
        }
        return false;
    }

    removeOrder(orderId) {
        const orders = this.getOrders().filter(o => o.id !== orderId);
        this.saveOrders(orders);
        return { success: true, message: 'Order removed' };
    }

    // CUSTOMERS
    getCustomers() {
        return auth.users.filter(user => !user.isAdmin);
    }

    removeCustomer(userId) {
        auth.users = auth.users.filter(user => user.id !== userId);
        auth.saveUsers();
        return { success: true, message: 'Customer removed' };
    }

    promoteCustomer(userId) {
        const user = auth.users.find(u => u.id === userId);
        if (user) {
            user.isAdmin = true;
            auth.saveUsers();
            return { success: true, message: 'Customer promoted to admin' };
        }
        return { success: false, message: 'Customer not found' };
    }

    // SETTINGS
    getSettings() {
        return this.settings;
    }

    saveSettings(settings) {
        this.settings = { ...this.settings, ...settings };
        localStorage.setItem('bx_settings', JSON.stringify(this.settings));
    }

    // STATISTICS
    getStats() {
        const orders = this.getOrders();
        return {
            totalProducts: this.products.length,
            totalCategories: this.categories.length,
            lowStockProducts: this.products.filter(p => p.stock < 10).length,
            totalRevenue: orders.reduce((sum, order) => sum + (order.total || 0), 0),
            totalOrders: orders.length,
            totalCustomers: auth.users.filter(user => !user.isAdmin).length
        };
    }

    getLowStockProducts() {
        return this.products.filter(p => p.stock < 10).sort((a, b) => a.stock - b.stock);
    }
}

let admin;
document.addEventListener('DOMContentLoaded', () => {
    if (auth.isAdmin()) {
        admin = new AdminManager();
    }
});
