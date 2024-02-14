// Variable definitions
const productList = document.getElementById('productList');
const sortAscendingBtn = document.getElementById('sortAscendingBtn');
const sortDescendingBtn = document.getElementById('sortDescendingBtn');
const filterMaleBtn = document.getElementById('filterMaleBtn');
const filterFemaleBtn = document.getElementById('filterFemaleBtn');
const filterOnSaleBtn = document.getElementById('filterOnSaleBtn');
const filterFavoritesBtn = document.getElementById('filterFavoritesBtn');
let productsData; 


/// Fetch API data initially
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
    filterAndDisplayProductsByFavorites(true); //Filter products that are favorites
});


// Function to sort and display products
function sortAndDisplayProducts(isAscending) {
    if (!productsData) return; 

    const sortedProducts = productsData.slice().sort((a, b) => {
        return isAscending ? a.price - b.price : b.price - a.price;
    });

    displayProducts(sortedProducts);
}

// Function to filter and display products by gender
function filterAndDisplayProductsByGender(gender) {
    if (!productsData) return; 

    const filteredProducts = productsData.filter(product => product.gender === gender);
    displayProducts(filteredProducts);
}

// Function to filter and display products by sale status
function filterAndDisplayProductsBySale(onSale) {
    if (!productsData) return; 

    const filteredProducts = productsData.filter(product => product.onSale === onSale);
    displayProducts(filteredProducts);
}

//Filter function to filter and display products as favorites
function filterAndDisplayProductsByFavorites(favorite) {
    if (!productsData) return;

    const filteredProducts = productsData.filter(product => product.favorite === favorite);
    displayProducts(filteredProducts);
}

// Function to display products
function displayProducts(products) {
    productList.innerHTML = ''; // Clear previous content

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');

            // Product on sale, yes no price
            let priceDisplay = '';
            if (product.onSale && product.discountedPrice) {
                priceDisplay = `
                    <p><s>Price: $${product.price.toFixed(2)}</s></p>
                    <p>Sale Price: $${product.discountedPrice.toFixed(2)}</p>
                `;
            } else {
                priceDisplay = `
                    <p>Price: $${product.price.toFixed(2)}</p>
                `;
            }


        productElement.innerHTML = `
        <img src="${product.image}" alt="${product.title}">
        <h3>${product.title}</h3>
        <p>${product.description}</p>
        ${priceDisplay}
        `;

        productList.appendChild(productElement);
    });

}
