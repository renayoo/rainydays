// Retrieve cart products from localStorage
function getCartItems() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Remove a product from the cart
function removeFromCart(productId, selectedSize) {
    let cartItems = getCartItems();
    cartItems = cartItems.filter(item => {
        return !(item.productId == productId && item.selectedSize == selectedSize)
    });
    localStorage.setItem('cart', JSON.stringify(cartItems));
    updateCartUI();
}

// Remove one item from the cart
function removeOneFromCart(productId, selectedSize) {
    let cartItems = getCartItems();
    for (let i = 0; i < cartItems.length; i++) {
        if (cartItems[i].productId === productId && cartItems[i].selectedSize === selectedSize) {
            if (cartItems[i].quantity > 1) {
                cartItems[i].quantity--;
                break;
            }
        }
    }
    localStorage.setItem('cart', JSON.stringify(cartItems));
    updateCartUI();
}

// Clear the cart
function clearCart() {
    localStorage.removeItem('cart');
    updateCartUI();
}

// Event listener to the confirm button
document.getElementById('confirmBtn').addEventListener('click', function() {
    // Clear the cart after clicking confirm order
    clearCart();

    // Redirect to the confirmation page
    window.location.href = 'confirmation/index.html';
});

// Display cart items
function displayCartItems() {
    const checkoutProductList = document.getElementById('checkoutProductList');
    checkoutProductList.innerHTML = '';

    const cartItems = getCartItems();

    let totalPrice = 0;

    if (cartItems.length === 0) {
        // Message Empty cart
        checkoutProductList.innerHTML = 
        '<p>Your cart is empty. Please add products to proceed.</p>';
        // Disable confirm button if cart is empty
        document.getElementById('confirmBtn').disabled = true;
    } else {
        cartItems.forEach(item => {

            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');

            // Calculate the price, considering if the item is on sale
            let price;
            if (item.onSale && item.discountedPrice !== undefined) {
                price = item.discountedPrice; // Use discounted price if available
            } else {
                price = item.productPrice; // Regular price if not on sale
            }

            totalPrice += parseFloat(price) * item.quantity;

            // HTML (product title, size, image, price, etc.)
            cartItemElement.innerHTML = `
                <div class="cart-item-details">
                    <img src="${item.productImage}" alt="${item.productTitle}">
                    <div>
                        <p>${item.productTitle} - Size: ${item.selectedSize}</p>
                        <p>Quantity: ${item.quantity}</p> 
                        <p>$${price}</p> 
                    </div>
                </div>
                <button onclick="removeFromCart('${item.productId}','${item.selectedSize}')">Remove</button>`;

            // If quantity is higher than 1, add a "Remove One" button
            if (item.quantity > 1) {
                const removeOneButton = document.createElement('button');
                removeOneButton.textContent = 'Remove One';
                removeOneButton.onclick = function() {
                    removeOneFromCart(item.productId, item.selectedSize);
                };
                cartItemElement.appendChild(removeOneButton);
            }

            checkoutProductList.appendChild(cartItemElement);
        });

        // Display the total price 
        const totalPriceElement = document.createElement('div');
        totalPriceElement.innerHTML = `<p>Total Price: $${totalPrice.toFixed(2)}</p>`; 
        checkoutProductList.appendChild(totalPriceElement);

        // Make confirm checkout Btn work if products added in cart
        document.getElementById('confirmBtn').disabled = false;
    }
}

function updateCartUI() {
    displayCartItems();
    updateCartCounter();
}

function updateCartCounter() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const numberOfItemsInCart = cartItems.length;

    var counter = document.querySelector(".shopping-cart #counter");
    counter.setAttribute("counter-value", numberOfItemsInCart);
}

updateCartUI();