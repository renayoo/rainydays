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
        // Handle error: Unable to fetch product details
    }
    
    // Event listener - "Back to Products" button
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'outerwearproducts.html'; // Navigation - back to the products list page
        });
    }
    
    // Event listener - "Add to Basket" button
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
        const productDetails = await response.json();
        return productDetails;
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
    
    // Quantity selector
    const quantitySelector = '<input type="number" id="quantity" value="1" min="1">';
    
    // Product container
    productDetailsContainer.innerHTML = `
        <h2>${productDetails.title}</h2>
        <!-- Back to Products button -->
        <button id="backBtn">Back to Products</button> 
        <img id="productDetailsImage" src="${productDetails.image}" alt="${productDetails.title}">
        <p>${productDetails.description}</p>
        ${priceDisplay}
        <!-- Sizes dropdown -->
        ${sizesDropdown}
        <!-- Quantity selector -->
        <label for="quantity">Quantity:</label>
        <span class="quantity-text">${quantitySelector}</span>
        <!-- Add to Cart -->
        <button id="addToCart">Add to Cart</button>
    `;
}

// Function - Add to cart
async function addToCart() {
    const sizeSelect = document.getElementById('sizeSelect');
    const selectedSize = sizeSelect ? sizeSelect.value : null;
    const quantity = parseInt(document.getElementById('quantity').value);
    const productTitle = document.querySelector('h2').textContent;
    const productImage = document.getElementById("productDetailsImage").getAttribute('src');
    let productPrice = ''; 

    // Retrieve product data from the API
    const productId = new URLSearchParams(window.location.search).get('id');
    try {
        const productData = await fetchProductDetails(productId);

        // Product on discount, yes or no
        if (productData && productData.onSale && productData.discountedPrice) {
            productPrice = productData.discountedPrice.toFixed(2); // Discount price
        } else if (productData && productData.price) {
            productPrice = productData.price.toFixed(2); // Regular price
        } else {
            // Handle the case where price is not available
            return;
        }

        if (!selectedSize) {
            alert('Please select a size.');
            return;
        }

        // Save item to the cart
        saveToCart(productId, selectedSize, quantity, productTitle, productImage, productPrice);

        // Alert - item added
        alert(`Item added to cart!\nTitle: ${productTitle}\nSize: ${selectedSize}\nQuantity: ${quantity}\nPrice: $${productPrice}`);
    } catch (error) {
        // Handle error: Unable to fetch product details
    }
}

// Function - save products to localStorage
function saveToCart(productId, selectedSize, quantity, productTitle, productImage, productPrice) {
    // Retrieve existing cart items from localStorage
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    const existingItem = cartItems.find(item => item.productId == productId && item.selectedSize == selectedSize)
    if(existingItem) {
        existingItem.quantity += quantity;
    } 
    else {
        // Add item to the cart
        cartItems.push({ productId, selectedSize, productTitle, productImage, productPrice, quantity }); 
    }
    // Save the updated cart back to localStorage
    localStorage.setItem('cart', JSON.stringify(cartItems));

    const numberOfItemsInCart = cartItems.length;
    updateCartCounter(numberOfItemsInCart);

    updateCartUI();
}

function updateCartCounter(newCount) {
    var counter = document.querySelector(".shopping-cart #counter");
    counter.setAttribute("counter-value", newCount);
}

function getCartItems() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}
function updateCartUI() {
}


