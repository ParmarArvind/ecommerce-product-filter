// ==========================================
// PRODUCT DATA
// ==========================================

const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        category: "Electronics",
        price: 1999,
        rating: 4,
        image: "https://picsum.photos/400/300?random=1"
    },

    {
        id: 2,
        name: "Smart Watch",
        category: "Electronics",
        price: 2999,
        rating: 5,
        image: "https://picsum.photos/400/300?random=2"
    },

    {
        id: 3,
        name: "Cotton T-Shirt",
        category: "Apparel",
        price: 699,
        rating: 4,
        image: "https://picsum.photos/400/300?random=3"
    },

    {
        id: 4,
        name: "Denim Jacket",
        category: "Apparel",
        price: 1899,
        rating: 3,
        image: "https://picsum.photos/400/300?random=4"
    },

    {
        id: 5,
        name: "Running Shoes",
        category: "Footwear",
        price: 2499,
        rating: 5,
        image: "https://picsum.photos/400/300?random=5"
    },

    {
        id: 6,
        name: "Casual Sneakers",
        category: "Footwear",
        price: 1599,
        rating: 4,
        image: "https://picsum.photos/400/300?random=6"
    },

    {
        id: 7,
        name: "Bluetooth Speaker",
        category: "Electronics",
        price: 1299,
        rating: 3,
        image: "https://picsum.photos/400/300?random=7"
    },

    {
        id: 8,
        name: "Formal Shirt",
        category: "Apparel",
        price: 999,
        rating: 5,
        image: "https://picsum.photos/400/300?random=8"
    }
];


// ==========================================
// DOM ELEMENTS
// ==========================================

const productGrid = document.getElementById("productGrid");

const productCount = document.getElementById("productCount");

const emptyState = document.getElementById("emptyState");

const resetBtn = document.getElementById("resetBtn");

const emptyResetBtn = document.getElementById("emptyResetBtn");

const minPrice = document.getElementById("minPrice");

const maxPrice = document.getElementById("maxPrice");

const minPriceText = document.getElementById("minPriceText");

const maxPriceText = document.getElementById("maxPriceText");

const categoryFilters =
    document.querySelectorAll(".category-filter");

const ratingFilters =
    document.querySelectorAll('input[name="rating"]');


// ==========================================
// DISPLAY PRODUCTS
// ==========================================

function displayProducts(productList) {

    productGrid.innerHTML = "";

    productCount.textContent =
        `${productList.length} product${productList.length !== 1 ? "s" : ""}`;


    // No products

    if (productList.length === 0) {

        productGrid.style.display = "none";

        emptyState.style.display = "block";

        return;
    }


    // Products available

    productGrid.style.display = "grid";

    emptyState.style.display = "none";


    productList.forEach(product => {

        const card = document.createElement("div");

        card.className = "product-card";


        const stars =
            "★".repeat(product.rating) +
            "☆".repeat(5 - product.rating);


        card.innerHTML = `

            <img
                class="product-image"
                src="${product.image}"
                alt="${product.name}"
            >

            <div class="product-info">

                <div class="product-category">
                    ${product.category}
                </div>

                <h3 class="product-name">
                    ${product.name}
                </h3>

                <div class="product-price">
                    ₹${product.price}
                </div>

                <div class="product-rating">
                    ${stars}
                    <span style="color:#777">
                        (${product.rating})
                    </span>
                </div>

            </div>
        `;


        productGrid.appendChild(card);

    });
}


// ==========================================
// GET SELECTED CATEGORIES
// ==========================================

function getSelectedCategories() {

    const selected = [];

    categoryFilters.forEach(filter => {

        if (filter.checked) {
            selected.push(filter.value);
        }

    });

    return selected;
}


// ==========================================
// GET SELECTED RATING
// ==========================================

function getSelectedRating() {

    const selectedRating =
        document.querySelector(
            'input[name="rating"]:checked'
        );

    if (!selectedRating) {
        return 0;
    }

    return Number(selectedRating.value);
}


// ==========================================
// APPLY FILTERS
// ==========================================

function applyFilters() {

    const selectedCategories =
        getSelectedCategories();

    const selectedRating =
        getSelectedRating();

    const minimumPrice =
        Number(minPrice.value);

    const maximumPrice =
        Number(maxPrice.value);


    const filteredProducts =
        products.filter(product => {


            // Category filter

            const categoryMatch =
                selectedCategories.length === 0 ||
                selectedCategories.includes(product.category);


            // Price filter

            const priceMatch =
                product.price >= minimumPrice &&
                product.price <= maximumPrice;


            // Rating filter

            const ratingMatch =
                product.rating >= selectedRating;


            return (
                categoryMatch &&
                priceMatch &&
                ratingMatch
            );

        });


    displayProducts(filteredProducts);

}


// ==========================================
// CATEGORY EVENTS
// ==========================================

categoryFilters.forEach(filter => {

    filter.addEventListener(
        "change",
        applyFilters
    );

});


// ==========================================
// RATING EVENTS
// ==========================================

ratingFilters.forEach(filter => {

    filter.addEventListener(
        "change",
        applyFilters
    );

});


// ==========================================
// PRICE EVENTS
// ==========================================

minPrice.addEventListener(
    "input",
    () => {

        // Don't allow minimum > maximum

        if (
            Number(minPrice.value) >
            Number(maxPrice.value)
        ) {
            minPrice.value =
                maxPrice.value;
        }

        minPriceText.textContent =
            `₹${minPrice.value}`;

        applyFilters();

    }
);


maxPrice.addEventListener(
    "input",
    () => {

        // Don't allow maximum < minimum

        if (
            Number(maxPrice.value) <
            Number(minPrice.value)
        ) {
            maxPrice.value =
                minPrice.value;
        }

        maxPriceText.textContent =
            `₹${maxPrice.value}`;

        applyFilters();

    }
);


// ==========================================
// RESET FILTERS
// ==========================================

function resetFilters() {

    // Uncheck categories

    categoryFilters.forEach(filter => {
        filter.checked = false;
    });


    // Uncheck ratings

    ratingFilters.forEach(filter => {
        filter.checked = false;
    });


    // Reset price

    minPrice.value = 0;

    maxPrice.value = 5000;


    minPriceText.textContent = "₹0";

    maxPriceText.textContent = "₹5000";


    // Show all products

    displayProducts(products);

}


resetBtn.addEventListener(
    "click",
    resetFilters
);


emptyResetBtn.addEventListener(
    "click",
    resetFilters
);


// ==========================================
// INITIAL LOAD
// ==========================================

displayProducts(products);
