// Cart System
class CartManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('userCart')) || [];
        this.updateCartCount();
    }

    addToCart(product, quantity = 1) {
        if (!auth.isLoggedIn()) {
            alert('Please login to add items to cart');
            window.location.href = 'login.html';
            return;
        }

        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                ...product,
                quantity
            });
        }
        
        this.saveCart();
        this.updateCartCount();
        alert(`${product.name} added to cart!`);
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
    }

    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity > 0 ? quantity : 1;
            if (quantity === 0) {
                this.removeFromCart(productId);
            } else {
                this.saveCart();
            }
        }
        this.updateCartCount();
    }

    getCart() {
        return this.cart;
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getCartCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartCount();
    }

    saveCart() {
        localStorage.setItem('userCart', JSON.stringify(this.cart));
    }

    updateCartCount() {
        const cartCountElement = document.getElementById('cartCount');
        if (cartCountElement) {
            cartCountElement.textContent = this.getCartCount();
        }
    }

    checkout() {
        if (this.cart.length === 0) {
            alert('Cart is empty');
            return false;
        }

        const order = {
            id: 'ORD-' + Date.now(),
            userId: auth.getCurrentUser().id,
            items: this.cart,
            total: this.getCartTotal(),
            status: 'pending',
            createdAt: new Date()
        };

        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));

        this.clearCart();
        return { success: true, orderId: order.id };
    }
}

// Initialize Cart Manager
const cart = new CartManager();

// Toggle Cart Modal
function toggleCart() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.classList.toggle('active');
        if (cartModal.classList.contains('active')) {
            displayCart();
        }
    }
}

function closeCart() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.classList.remove('active');
    }
}

function displayCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems) return;

    const items = cart.getCart();
    
    if (items.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #888; padding: 2rem;">Cart is empty</p>';
        if (cartTotal) cartTotal.innerHTML = '0';
        return;
    }

    cartItems.innerHTML = items.map(item => `
        <div class="cart-item">
            <div class="item-info">
                <h3>${item.name}</h3>
                <p>Rs. ${item.price}</p>
            </div>
            <div class="item-quantity">
                <button onclick="cart.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                <input type="number" value="${item.quantity}" onchange="cart.updateQuantity(${item.id}, parseInt(this.value))" min="1">
                <button onclick="cart.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
            </div>
            <div class="item-price">Rs. ${(item.price * item.quantity).toFixed(2)}</div>
            <button class="btn-remove" onclick="cart.removeFromCart(${item.id})" title="Remove"><i class="fas fa-trash"></i></button>
        </div>
    `).join('');

    if (cartTotal) {
        cartTotal.innerHTML = `Rs. ${cart.getCartTotal().toFixed(2)}`;
    }
}

// Update cart on page load
document.addEventListener('DOMContentLoaded', () => {
    cart.updateCartCount();
});
