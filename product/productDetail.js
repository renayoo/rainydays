window.onload = async function() {
    const productId = new URLSearchParams(window.location.search).get('id');
    if (!productId) {
        // Handle error: No product ID provided
        return;
    }
    
    try {
        const productDetails = await fetchProductDetails(productId);
        displayProductDetails(productDetails);
    } catch (error) {
        console.error('Error fetching product details:', error);
        // Handle error: Unable to fetch product details
    }
    
    // Add event listener to the "Back to Products" button
    const backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.addEventListener('click', () => {
            window.location.href = '/outerwearproducts.html'; // Navigate back to the products list page
        });
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
    productDetailsContainer.innerHTML = `
        <h2>${productDetails.title}</h2>
        <img src="${productDetails.image}" alt="${productDetails.title}">
        <p>Description: ${productDetails.description}</p>
        <p>Price: $${productDetails.price.toFixed(2)}</p>
        ${productDetails.discountedPrice ? `<p>Sale Price: $${productDetails.discountedPrice.toFixed(2)}</p>` : ''}
        <button>Add to Basket</button>
        <button id="backButton">Back to Products</button> <!-- Back to Products button -->
    `;
}