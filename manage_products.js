// Function to load products from local storage
function loadProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const productList = document.getElementById('products');
    const downloadButton = document.getElementById('download-csv');
    productList.innerHTML = '';
    
    if (products.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.textContent = 'No products added yet.';
        productList.appendChild(emptyMessage);
        downloadButton.disabled = true;
        downloadButton.classList.add('disabled');
    } else {
        products.forEach((product, index) => {
            const li = document.createElement('li');
            li.className = 'product-item';
            li.innerHTML = `
                <span>${product.name} (${product.category})</span>
                <button onclick="deleteProduct(${index})">Delete</button>
            `;
            productList.appendChild(li);
        });
        downloadButton.disabled = false;
        downloadButton.classList.remove('disabled');
    }
}

// Function to add a new product
function addProduct(event) {
    event.preventDefault();
    const nameInput = document.getElementById('product-name');
    const categoryInput = document.getElementById('product-category');
    
    const name = nameInput.value.trim();
    const category = categoryInput.value.trim();
    
    if (name) {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        products.push({ name, category });
        localStorage.setItem('products', JSON.stringify(products));
        
        nameInput.value = '';
        categoryInput.value = '';
        
        loadProducts();
    }
}

// Function to delete a product
function deleteProduct(index) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    products.splice(index, 1);
    localStorage.setItem('products', JSON.stringify(products));
    loadProducts();
}

// Function to handle the back button click
function goBack() {
    window.location.href = 'index.html';
}

// Function to download products as JSON
function downloadJSON() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const jsonContent = JSON.stringify(products, null, 2); // Pretty print with 2 spaces
    
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "products.json");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Event listeners
document.getElementById('product-form').addEventListener('submit', addProduct);
document.getElementById('back-button').addEventListener('click', goBack);
document.getElementById('download-csv').addEventListener('click', downloadJSON);

// Load products when the page loads
document.addEventListener('DOMContentLoaded', loadProducts);
