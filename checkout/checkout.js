// Retrieve cart items from localStorage
function getCartItems() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Function to remove a product from the cart
function removeFromCart(productId) {
    let cartItems = getCartItems();
    cartItems = cartItems.filter(item => item.productId !== productId);
    localStorage.setItem('cart', JSON.stringify(cartItems));
    updateCartUI();
}

// Function to clear the cart
function clearCart() {
    localStorage.removeItem('cart');
    updateCartUI();
}

// Function to display cart items
function displayCartItems() {
    const checkoutProductList = document.getElementById('checkoutProductList');
    checkoutProductList.innerHTML = '';

    const cartItems = getCartItems();

    cartItems.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('cart-item');
        // Create necessary HTML to display cart item (product title, size, image, price, etc.)
        cartItemElement.innerHTML = `
            <div class="cart-item-details">
                <img src="${item.productImage}" alt="${item.productTitle}">
                <div>
                    <p>${item.productTitle} - Size: ${item.selectedSize}</p>
                    <p>Price: ${item.productPrice}</p>
                </div>
            </div>
            <button onclick="removeFromCart(${item.productId})">Remove</button>
        `;
        checkoutProductList.appendChild(cartItemElement);
    });
}

// Function to update the UI with the current cart items
function updateCartUI() {
    displayCartItems();
}

// Call updateCartUI to initialize the cart display
updateCartUI();