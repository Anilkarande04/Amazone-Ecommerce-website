console.log("Welcome to Amazon E-Commerce Website!");


// ======================================
// AMAZON E-COMMERCE WEBSITE
// ======================================

// STEP 1: PRODUCT DATA

const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 1499,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
    },
    {
        id: 2,
        name: "Men Fashion Shirt",
        price: 899,
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500"
    },
    {
        id: 3,
        name: "Home Decor Lamp",
        price: 1299,
        category: "Home",
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500"
    },
    {
        id: 4,
        name: "Comfortable Bedding",
        price: 1999,
        category: "Home",
        image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500"
    },
    {
        id: 5,
        name: "Kitchen Appliances",
        price: 2499,
        category: "Home",
        image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500"
    },
    {
        id: 6,
        name: "Casual Footwear",
        price: 1199,
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"
    },
    {
        id: 7,
        name: "Fashion Jewelry",
        price: 699,
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500"
    },
    {
        id: 8,
        name: "Smart Electronics",
        price: 2999,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500"
    }
];


// STEP 2: HTML ELEMENTS

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const categoryFilter = document.getElementById("categoryFilter");
const sortProducts = document.getElementById("sortProducts");
const noProducts = document.getElementById("noProducts");

const cartBtn = document.getElementById("cartBtn");
const cartCount = document.getElementById("cartCount");
const cartSection = document.getElementById("cartSection");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const clearCartBtn = document.getElementById("clearCart");


// STEP 3: CART DATA

let cart = [];

try {
    const savedCart = JSON.parse(localStorage.getItem("amazonCart"));

    if (Array.isArray(savedCart)) {
        cart = savedCart;
    }
} catch (error) {
    cart = [];
}


// STEP 4: DISPLAY PRODUCTS

function displayProducts(productList) {

    productGrid.replaceChildren();

    noProducts.style.display =
        productList.length === 0 ? "block" : "none";

    productList.forEach(function(product) {

        const card = document.createElement("div");
        card.className = "product-card";

        const image = document.createElement("img");
        image.src = product.image;
        image.alt = product.name;

        const name = document.createElement("h3");
        name.textContent = product.name;

        const category = document.createElement("p");
        category.textContent = product.category;

        const price = document.createElement("p");
        price.className = "product-price";
        price.textContent = "₹" + product.price;

        const addButton = document.createElement("button");
        addButton.textContent = "Add to Cart";

        addButton.addEventListener("click", function() {
            addToCart(product.id);
        });

        card.append(
            image,
            name,
            category,
            price,
            addButton
        );

        productGrid.appendChild(card);
    });
}


// STEP 5: SEARCH + FILTER + SORT

function updateProducts() {

    const searchText = searchInput.value
        .trim()
        .toLowerCase();

    const selectedCategory = categoryFilter.value;

    const selectedSort = sortProducts.value;

    let filteredProducts = products.filter(function(product) {

        const matchesSearch = product.name
            .toLowerCase()
            .includes(searchText);

        const matchesCategory =
            selectedCategory === "All" ||
            selectedCategory === "all" ||
            product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    if (selectedSort === "low-high") {
        filteredProducts.sort(function(a, b) {
            return a.price - b.price;
        });
    }

    if (selectedSort === "high-low") {
        filteredProducts.sort(function(a, b) {
            return b.price - a.price;
        });
    }

    displayProducts(filteredProducts);
}


// Search button click
searchBtn.addEventListener("click", updateProducts);

// Search while typing
searchInput.addEventListener("input", updateProducts);

// Search using Enter key
searchInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        updateProducts();
    }
});

// Category filter
categoryFilter.addEventListener("change", updateProducts);

// Price sorting
sortProducts.addEventListener("change", updateProducts);


// STEP 6: ADD TO CART

function addToCart(productId) {

    const existingItem = cart.find(function(item) {
        return item.id === productId;
    });

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: productId,
            quantity: 1
        });
    }

    saveCart();
    displayCart();

}


// STEP 7: REMOVE FROM CART

function removeFromCart(productId) {

    cart = cart.filter(function(item) {
        return item.id !== productId;
    });

    saveCart();
    displayCart();

}


// STEP 8: SAVE CART IN LOCAL STORAGE

function saveCart() {

    localStorage.setItem("amazonCart", JSON.stringify(cart));

}


// STEP 9: DISPLAY CART

function displayCart() {

    cartItems.replaceChildren();

    let total = 0;
    let totalQuantity = 0;

    cart.forEach(function(item) {

        const product = products.find(function(p) {
            return p.id === item.id;
        });

        if (!product) return;

        total += product.price * item.quantity;
        totalQuantity += item.quantity;

        const cartItem = document.createElement("div");

        const itemName = document.createElement("h3");
        itemName.textContent = product.name;

        const itemPrice = document.createElement("p");
        itemPrice.textContent =
            "₹" + product.price + " × " + item.quantity;

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";

        removeButton.addEventListener("click", function() {
            removeFromCart(item.id);
        });

        cartItem.append(
            itemName,
            itemPrice,
            removeButton
        );

        cartItems.appendChild(cartItem);
    });

    cartCount.textContent = totalQuantity;
    cartTotal.textContent = "₹" + total;

    if (cart.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "Your cart is empty.";
        cartItems.appendChild(emptyMessage);
    }

}


// STEP 10: CLEAR CART

clearCartBtn.addEventListener("click", function() {

    cart = [];

    saveCart();
    displayCart();

});


// STEP 11: OPEN CART SECTION

cartBtn.addEventListener("click", function() {

    cartSection.scrollIntoView({
        behavior: "smooth"
    });

});


// STEP 12: INITIAL DISPLAY

displayProducts(products);
displayCart();
