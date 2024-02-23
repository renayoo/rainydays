function getCartItems() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

const numberOfItemsInCart = cartItems.length;
updateCartCounter(numberOfItemsInCart);

function updateCartCounter(newCount) {
    var counter = document.querySelector(".shopping-cart #counter");
    counter.setAttribute("counter-value", newCount);
}