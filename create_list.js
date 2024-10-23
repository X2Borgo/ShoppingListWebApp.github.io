// At the beginning of the file
console.log('create_list.js loaded');

// Function to load products from local storage
function loadProducts() {
    console.log('loadProducts function called');
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];
    console.log('Products from localStorage:', products);
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    
    console.log('Loading products:', products);
    
    products.forEach((product, index) => {
        const li = document.createElement('li');
        li.className = 'product-item';
        const isInList = shoppingList.some(item => item.name === product.name);
        li.innerHTML = `
            <span>${product.name} (${product.category})</span>
            <button class="add-to-list-btn ${isInList ? 'added' : ''}">${isInList ? 'Added' : 'Add to List'}</button>
        `;
        const addButton = li.querySelector('.add-to-list-btn');
        addButton.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default action
            event.stopPropagation(); // Stop event from bubbling up
            console.log('Add button clicked for product:', product);
            addToShoppingList(index);
        });
        productList.appendChild(li);
    });
}

// Function to add a product to the shopping list
function addToShoppingList(index) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    let shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];
    const product = products[index];
    
    console.log('Adding product:', product);
    console.log('Current shopping list:', shoppingList);
    
    const existingProduct = shoppingList.find(item => item.name === product.name);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        shoppingList.push({...product, quantity: 1});
    }
    
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
    console.log('Updated shopping list:', shoppingList);
    updateShoppingList();
    
    // Update the button state
    const addButton = document.querySelectorAll('.add-to-list-btn')[index];
    addButton.textContent = 'Added';
    addButton.classList.add('added');
}

// Function to update the shopping list display
function updateShoppingList() {
    console.log('updateShoppingList function called');
    const shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];
    console.log('Shopping list from localStorage:', shoppingList);
    const shoppingListElement = document.getElementById('shopping-list');
    const downloadButton = document.getElementById('download-json');
    console.log('Shopping list element:', shoppingListElement);
    
    if (!shoppingListElement) {
        console.error('Shopping list element not found!');
        return;
    }
    
    shoppingListElement.innerHTML = '';
    
    if (shoppingList.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.textContent = 'Your shopping list is empty.';
        shoppingListElement.appendChild(emptyMessage);
        downloadButton.disabled = true;
        downloadButton.classList.add('disabled');
    } else {
        downloadButton.disabled = false;
        downloadButton.classList.remove('disabled');
        shoppingList.forEach((product, index) => {
            const li = document.createElement('li');
            li.className = 'product-item';
            li.innerHTML = `
                <div class="product-info">
                    <span>${product.name} (${product.category})</span>
                </div>
                <div class="quantity-controls">
                    <button class="decrease-quantity" ${product.quantity === 1 ? 'disabled' : ''}>-</button>
                    <span class="quantity">${product.quantity}</span>
                    <button class="increase-quantity">+</button>
                </div>
                <button class="remove-from-list-btn">Remove</button>
            `;
            const decreaseButton = li.querySelector('.decrease-quantity');
            const increaseButton = li.querySelector('.increase-quantity');
            const removeButton = li.querySelector('.remove-from-list-btn');
            
            decreaseButton.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                if (product.quantity > 1) {
                    updateQuantity(index, -1);
                }
            });
            
            increaseButton.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                updateQuantity(index, 1);
            });
            
            removeButton.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                removeFromShoppingList(index);
            });
            
            shoppingListElement.appendChild(li);
            console.log(`Added item to shopping list: ${product.name} (Quantity: ${product.quantity})`);
        });
    }
}

// Function to update the quantity of a product in the shopping list
function updateQuantity(index, change) {
    const shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];
    const newQuantity = shoppingList[index].quantity + change;
    
    if (newQuantity >= 1) {
        shoppingList[index].quantity = newQuantity;
        localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
        updateShoppingList();
    }
}

// Function to remove a product from the shopping list
function removeFromShoppingList(index) {
    const shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];
    console.log('Removing product at index:', index);
    console.log('Shopping list before removal:', shoppingList);
    const removedProduct = shoppingList.splice(index, 1)[0];
    console.log('Shopping list after removal:', shoppingList);
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
    updateShoppingList();

    // Update the corresponding "Add to List" button
    const productList = document.getElementById('product-list');
    const addButtons = productList.querySelectorAll('.add-to-list-btn');
    addButtons.forEach((button) => {
        if (button.previousElementSibling.textContent.includes(removedProduct.name)) {
            button.textContent = 'Add to List';
            button.classList.remove('added');
        }
    });
}

// Function to save the shopping list
function saveShoppingList(event) {
    event.preventDefault(); // Prevent default form submission
    event.stopPropagation(); // Stop event from bubbling up
    alert('Shopping list saved!');
    // You can add additional functionality here, such as sending the list to a server or generating a printable version
}

// Function to handle the back button click
function goBack(event) {
    event.preventDefault(); // Prevent default link behavior
    event.stopPropagation(); // Stop event from bubbling up
    window.location.href = 'index.html';
}

// Add this function to download the shopping list as JSON
function downloadShoppingListJSON() {
    const shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];
    const jsonContent = JSON.stringify(shoppingList, null, 2); // Pretty print with 2 spaces
    
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "shopping_list.json");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Event listeners
document.getElementById('back-button').addEventListener('click', goBack);
document.getElementById('save-list').addEventListener('click', saveShoppingList);
document.getElementById('download-json').addEventListener('click', downloadShoppingListJSON);

// Load products and shopping list when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');
    loadProducts();
    updateShoppingList();
});
