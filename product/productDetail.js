window.onload = async function() {
    const productId = new URLSearchParams(window.location.search).get('id');
    if (!productId) {
        // Handle error: No product ID provided
        return;
    }
    
    try {
        const productDetails = await fetchProductDetails(productId);
        displayProductDetails(productDetails);

        document.title = productDetails.title;
    } catch (error) {
        console.error('Error fetching product details:', error);
        // Handle error: Unable to fetch product details
    }
    
    // Event listener - "Back to Products" button
    const backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.addEventListener('click', () => {
            window.location.href = '/outerwearproducts.html'; // Navigation - back to the products list page
        });
    }
    
    // Event listener for "Add to Basket" button
    const addToCartBtn = document.getElementById('addToCart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', addToCart);
    }
}

async function fetchProductDetails(productId) {
    try {
        const response = await fetch(`https://api.noroff.dev/api/v1/rainy-days/${productId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch product details');
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

function displayProductDetails(productDetails) {
    const productDetailsContainer = document.getElementById('productDetails');
    let priceDisplay = `<p>Price: $${productDetails.price.toFixed(2)}</p>`;
    
    if (productDetails.onSale && productDetails.discountedPrice) {
        priceDisplay = `
            <p><s>Price: $${productDetails.price.toFixed(2)}</s></p>
            <p>Sale Price: $${productDetails.discountedPrice.toFixed(2)}</p>
        `;
    }
    
    // Sizes dropdown menu
    let sizesDropdown = '';
    if (productDetails.sizes && productDetails.sizes.length > 0) {
        sizesDropdown = '<select id="sizeSelect">';
        productDetails.sizes.forEach(size => {
            sizesDropdown += `<option value="${size}">${size}</option>`;
        });
        sizesDropdown += '</select>';
    }
    
    // Product container
    productDetailsContainer.innerHTML = `
        <h2>${productDetails.title}</h2>
        <!-- Back to Products button -->
        <button id="backButton">Back to Products</button> 
        <img src="${productDetails.image}" alt="${productDetails.title}">
        <p>${productDetails.description}</p>
        ${priceDisplay}
        <!-- Sizes dropdown -->
        ${sizesDropdown}
        <!-- Add to Cart -->
        <button id="addToCart">Add to Cart</button>
    `;
}

function addToCart() {
    const sizeSelect = document.getElementById('sizeSelect');
    const selectedSize = sizeSelect ? sizeSelect.value : null;
    const productTitle = document.querySelector('h2').textContent; // Get the product title
    
    if (!selectedSize) {
        alert('Please select a size.');
        return;
    }

    const productId = new URLSearchParams(window.location.search).get('id');
    saveToCart(productId, selectedSize, productTitle);

    //Alert - item added
    alert('Item added to cart!');

}

function saveToCart(productId, selectedSize, productTitle) {
    // Retrieve existing cart items from localStorage
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    // Add item to the cart
    cartItems.push({ productId, selectedSize, productTitle });

    // Save the updated cart back to localStorage
    localStorage.setItem('cart', JSON.stringify(cartItems));
}
