// Variable definitions
const productList = document.getElementById('productList');
const sortAscendingBtn = document.getElementById('sortAscendingBtn');
const sortDescendingBtn = document.getElementById('sortDescendingBtn');
const filterMaleBtn = document.getElementById('filterMaleBtn');
const filterFemaleBtn = document.getElementById('filterFemaleBtn');
const filterOnSaleBtn = document.getElementById('filterOnSaleBtn');
const filterFavoritesBtn = document.getElementById('filterFavoritesBtn');
let productsData;

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

// Event listeners for sorting buttons
sortAscendingBtn.addEventListener('click', () => {
    sortAndDisplayProducts(true); // Sort ascending
});

sortDescendingBtn.addEventListener('click', () => {
    sortAndDisplayProducts(false); // Sort descending
});

// Event listeners for filtering buttons
filterMaleBtn.addEventListener('click', () => {
    filterAndDisplayProductsByGender('Male'); // Filter male products
});

filterFemaleBtn.addEventListener('click', () => {
    filterAndDisplayProductsByGender('Female'); // Filter female products
});

filterOnSaleBtn.addEventListener('click', () => {
    filterAndDisplayProductsBySale(true); // Filter products on sale
});

filterFavoritesBtn.addEventListener('click', () => {
    filterAndDisplayProductsByFavorites(true); // Filter products that are favorites
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

// Function - add a product to the cart
function addToCart(productId) {
    const sizeSelect = document.getElementById(`size-${productId}`);
    const selectedSize = sizeSelect ? sizeSelect.value : null;
    const productTitle = document.querySelector(`#product-${productId} h3`).textContent;
    const productImage = document.querySelector(`#product-${productId} img`).getAttribute('src');
    const productPrice = document.querySelector(`#product-${productId} .price`).textContent;
    
    if (!selectedSize) {
        alert('Please select a size.');
        return;
    }

    //Alert - added to cart
    alert(`Item added to cart!\nTitle: ${productTitle}\nSize: ${selectedSize}\nPrice: ${productPrice}`);
    
    saveToCart(productId, selectedSize, productTitle, productImage, productPrice);
    
    console.log(`Product added to cart:\nTitle: ${productTitle}\nSize: ${selectedSize}`);
}

// Function - save products to localStorage
function saveToCart(productId, selectedSize, productTitle, productImage, productPrice) {
    // Retrieve existing cart items from localStorage
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    // Add item to the cart
    cartItems.push({ productId, selectedSize, productTitle, productImage, productPrice });

    // Save the updated cart back to localStorage
    localStorage.setItem('cart', JSON.stringify(cartItems));

    // Optionally, you can update the UI to reflect the addition of the item to the cart
    updateCartUI();
}

// Function - retrieve cart items from localStorage
function getCartItems() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Function - update the UI to reflect the current cart state
function updateCartUI() {
    // You can implement this function to update the UI with the current cart items
}

// Function - display products
function displayProducts(products) {
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

        // Add to cart button eventListener
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
            <br>
        `;

        // Add to cart button to product element
        productElement.appendChild(addToCartBtn);

        // Product element to the product list container
        productList.appendChild(productElement);
    });
}