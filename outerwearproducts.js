// Fetch API data initially
async function fetchProducts() {
    try {
        const response = await fetch('https://api.noroff.dev/api/v1/rainy-days');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}


async function initialize() {
    try {
        productsData = await fetchProducts();
        displayProducts(productsData);
    } catch (error) {
        // Handle errors if needed
    }
}

initialize();


// Event listener sorting dropdown menu price
const sortSelect = document.getElementById('sortSelect');
sortSelect.addEventListener('change', () => {
    const sortOption = sortSelect.value;
    if (sortOption === 'ascending') {
        sortAndDisplayProducts(true); // Sort ascending price
    } else if (sortOption === 'descending') {
        sortAndDisplayProducts(false); // Sort descending price
    }
});

// Event listener - filter dropdown menu
const filterSelect = document.getElementById('filterSelect');
filterSelect.addEventListener('change', () => {
    const filterOption = filterSelect.value;
    if (filterOption === 'all') {
        displayProducts(productsData); // all products
    } else if (filterOption === 'male') {
        filterAndDisplayProductsByGender('Male'); // man products
    } else if (filterOption === 'female') {
        filterAndDisplayProductsByGender('Female'); // woman products
    } else if (filterOption === 'onsale') {
        filterAndDisplayProductsBySale(true); // on sale
    } else if (filterOption === 'favorites') {
        filterAndDisplayProductsByFavorites(true); // popular favorites
    }
});

// Function - sort and display products
function sortAndDisplayProducts(isAscending) {
    if (!productsData) return;

    const sortedProducts = productsData.slice().sort((a, b) => {
        return isAscending ? a.price - b.price : b.price - a.price;
    });

    displayProducts(sortedProducts);
}

// Function - filter and display products by gender
function filterAndDisplayProductsByGender(gender) {
    if (!productsData) return;

    const filteredProducts = productsData.filter(product => product.gender === gender);
    displayProducts(filteredProducts);
}

// Function - filter and display products by sale status
function filterAndDisplayProductsBySale(onSale) {
    if (!productsData) return;

    const filteredProducts = productsData.filter(product => product.onSale === onSale);
    displayProducts(filteredProducts);
}

// Filter function to filter and display products as favorites
function filterAndDisplayProductsByFavorites(favorite) {
    if (!productsData) return;

    const filteredProducts = productsData.filter(product => product.favorite === favorite);
    displayProducts(filteredProducts);
}

// Function - Add to cart
function addToCart(productId) {
    const sizeSelect = document.getElementById(`size-${productId}`);
    const selectedSize = sizeSelect ? sizeSelect.value : null; // Retrieve selected size value
    if (!selectedSize) {
        alert('Please select a size.');
        return;
    }
    
    const quantityInput = document.getElementById(`quantity-${productId}`);
    const quantity = quantityInput ? parseInt(quantityInput.value) : 1; 
    const productElement = document.getElementById(`product-${productId}`);
    const productTitle = productElement.querySelector('h3').textContent;
    const productImage = productElement.querySelector('img').getAttribute('src');
    let productPrice = ''; // Initialize productPrice

    // Retrieve product data from the API
    const productData = productsData.find(product => product.id === productId);

    // Product on dicount, yes or no
    if (productData && productData.onSale && productData.discountedPrice) {
        productPrice = productData.discountedPrice.toFixed(2); // Discount price
    } else if (productData && productData.price) {
        productPrice = productData.price.toFixed(2); // Regular price
    } else {
        // Handle the case where price is not available
        return;
    }

    // Alert - added to cart
    alert(`Item added to cart!\nTitle: ${productTitle}\nSize: ${selectedSize}\nQuantity: ${quantity}\nPrice: $${productPrice}`);

    saveToCart(productId, selectedSize, productTitle, productImage, productPrice, quantity);
}

// Function - save products to localStorage
function saveToCart(productId, selectedSize, productTitle, productImage, productPrice, quantity, onSale) {
    // Retrieve existing cart items from localStorage
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    const existingItem = cartItems.find(item => item.productId == productId && item.selectedSize == selectedSize)
    if(existingItem) {
        existingItem.quantity += quantity;
    } 
    else {
    // Add item to the cart
        cartItems.push({ productId, selectedSize, productTitle, productImage, productPrice, quantity, onSale }); // Include onSale in the cart item
    }

    // Save the cart
    localStorage.setItem('cart', JSON.stringify(cartItems));

    const numberOfItemsInCart = cartItems.length;
    updateCartCounter(numberOfItemsInCart);
}

// Function - retrieve cart items from localStorage
function getCartItems() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Function - update the UI to reflect the current cart state
function updateCartCounter(newCount) {
    var counter = document.querySelector(".shopping-cart #counter");
    counter.setAttribute("counter-value", newCount);
}

// Function - display products
function displayProducts(products) {
    const productList = document.getElementById("productList");
    productList.innerHTML = ''; 

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');
        productElement.setAttribute('id', `product-${product.id}`);

        // Product on sale, yes no price
        let priceDisplay = '';
        if (product.onSale && product.discountedPrice) {
            priceDisplay = `
                <p class="price"><s>Price: $${product.price.toFixed(2)}</s></p>
                <p>Sale Price: $${product.discountedPrice.toFixed(2)}</p>
            `;
        } else {
            priceDisplay = `
                <p class="price">Price: $${product.price.toFixed(2)}</p>
            `;
        }

        // Size dropdown selection
        const sizeOptions = product.sizes.map(size => `<option value="${size}">${size}</option>`).join('');
        const sizeDropdown = `
            <select id="size-${product.id}">
                ${sizeOptions}
            </select>
        `;

        // Quantity input field
        const quantityInput = `<input class="quantity-input" type="number" id="quantity-${product.id}" value="1" min="1">`;

        // Event listener for add to cart Btn
        const addToCartBtn = document.createElement('button');
        addToCartBtn.textContent = 'Add to Cart';
        addToCartBtn.addEventListener('click', () => {
            addToCart(product.id);
        });

        productElement.innerHTML = `
            <a href="/product/index.html?id=${product.id}">
                <img src="${product.image}" alt="${product.title}">
                <h3>${product.title}</h3>
            </a>
            ${priceDisplay}
            ${sizeDropdown}
            ${quantityInput}
            <br>
        `;

        productElement.appendChild(addToCartBtn);
        productList.appendChild(productElement);
    });
}
