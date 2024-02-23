// Cart counter for products in cart
function getCartItems() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function updateCartCounter() {
    const cartItems = getCartItems(); 
    const totalQuantityInCart = cartItems.reduce((total, item) => total + item.quantity, 0); 
    const counter = document.querySelector(".shopping-cart #counter");
    counter.setAttribute("counter-value", totalQuantityInCart);
}

updateCartCounter();

// Event listener for changes and updates in cart
window.addEventListener('storage', function(e) {
    if (e.key === 'cart') {
        updateCartCounter();
    }
});