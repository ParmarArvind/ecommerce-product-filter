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
// FILTER STATE
// ==========================================

const filterState = {
    categories: [],
    minPrice: 0,
    maxPrice: 5000,
    rating: null
};


// ==========================================
// DOM ELEMENTS
// ==========================================

const productGrid =
    document.getElementById("productGrid");

const productCount =
    document.getElementById("productCount");

const emptyState =
    document.getElementById("emptyState");

const resetBtn =
    document.getElementById("resetBtn");

const emptyResetBtn =
    document.getElementById("emptyResetBtn");

const minPrice =
    document.getElementById("minPrice");

const maxPrice =
    document.getElementById("maxPrice");

const minPriceText =
    document.getElementById("minPriceText");

const maxPriceText =
    document.getElementById("maxPriceText");

const rangeProgress =
    document.getElementById("rangeProgress");

const categoryFilters =
    document.querySelectorAll(".category-filter");

const ratingFilters =
    document.querySelectorAll(
        'input[name="rating"]'
    );


// ==========================================
// DISPLAY PRODUCTS
// ==========================================

function displayProducts(productList) {

    productGrid.innerHTML = "";


    // Update product count

    productCount.textContent =
        `${productList.length} product${productList.length !== 1 ? "s" : ""}`;


    // ======================================
    // EMPTY STATE
    // ======================================

    if (productList.length === 0) {

        productGrid.style.display = "none";

        emptyState.style.display = "block";

        return;
    }


    // ======================================
    // PRODUCT GRID
    // ======================================

    productGrid.style.display = "grid";

    emptyState.style.display = "none";


    productList.forEach(product => {

        const card =
            document.createElement("article");

        card.className = "product-card";


        // Generate stars

        const stars =
            "★".repeat(product.rating) +
            "☆".repeat(5 - product.rating);


        card.innerHTML = `

            <img
                class="product-image"
                src="${product.image}"
                alt="${product.name}"
                loading="lazy"
            >

            <div class="product-info">

                <div class="product-category">
                    ${product.category}
                </div>

                <h3 class="product-name">
                    ${product.name}
                </h3>

                <div class="product-price">
                    ₹${product.price.toLocaleString("en-IN")}
                </div>

                <div
                    class="product-rating"
                    aria-label="${product.rating} out of 5 stars"
                >
                    ${stars}

                    <span class="rating-number">
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

    const selectedCategories = [];


    categoryFilters.forEach(filter => {

        if (filter.checked) {

            selectedCategories.push(
                filter.value
            );

        }

    });


    return selectedCategories;
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

        return null;

    }


    return Number(
        selectedRating.value
    );
}


// ==========================================
// UPDATE FILTER STATE
// ==========================================

function updateFilterState() {

    filterState.categories =
        getSelectedCategories();


    filterState.minPrice =
        Number(minPrice.value);


    filterState.maxPrice =
        Number(maxPrice.value);


    filterState.rating =
        getSelectedRating();

}


// ==========================================
// UPDATE PRICE DISPLAY
// ==========================================

function updatePriceDisplay() {

    minPriceText.textContent =
        `₹${Number(minPrice.value).toLocaleString("en-IN")}`;


    maxPriceText.textContent =
        `₹${Number(maxPrice.value).toLocaleString("en-IN")}`;

}


// ==========================================
// UPDATE RANGE PROGRESS
// ==========================================

function updateRangeProgress() {

    const minimum =
        Number(minPrice.min);

    const maximum =
        Number(minPrice.max);

    const currentMin =
        Number(minPrice.value);

    const currentMax =
        Number(maxPrice.value);


    const minPercent =
        ((currentMin - minimum) /
        (maximum - minimum)) * 100;


    const maxPercent =
        ((currentMax - minimum) /
        (maximum - minimum)) * 100;


    rangeProgress.style.left =
        `${minPercent}%`;


    rangeProgress.style.width =
        `${maxPercent - minPercent}%`;

}


// ==========================================
// APPLY FILTERS
// ==========================================

function applyFilters() {

    // Update state first

    updateFilterState();


    const {
        categories,
        minPrice: minimumPrice,
        maxPrice: maximumPrice,
        rating: minimumRating
    } = filterState;


    // ======================================
    // FILTER MASTER INVENTORY
    // ======================================

    const filteredProducts =
        products.filter(product => {


            // -------------------------------
            // CATEGORY
            // -------------------------------

            const categoryMatch =
                categories.length === 0 ||
                categories.includes(
                    product.category
                );


            // -------------------------------
            // MINIMUM PRICE
            // -------------------------------

            const minPriceMatch =
                product.price >= minimumPrice;


            // -------------------------------
            // MAXIMUM PRICE
            // -------------------------------

            const maxPriceMatch =
                product.price <= maximumPrice;


            // -------------------------------
            // RATING
            // -------------------------------

            const ratingMatch =
                minimumRating === null ||
                product.rating >= minimumRating;


            // -------------------------------
            // INTERSECTION
            // -------------------------------

            return (
                categoryMatch &&
                minPriceMatch &&
                maxPriceMatch &&
                ratingMatch
            );

        });


    // Display filtered result

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
// MINIMUM PRICE EVENT
// ==========================================

minPrice.addEventListener(
    "input",
    () => {

        const minimum =
            Number(minPrice.value);

        const maximum =
            Number(maxPrice.value);


        // Prevent minimum > maximum

        if (minimum > maximum) {

            minPrice.value =
                maxPrice.value;

        }


        updatePriceDisplay();

        updateRangeProgress();

        applyFilters();

    }
);


// ==========================================
// MAXIMUM PRICE EVENT
// ==========================================

maxPrice.addEventListener(
    "input",
    () => {

        const minimum =
            Number(minPrice.value);

        const maximum =
            Number(maxPrice.value);


        // Prevent maximum < minimum

        if (maximum < minimum) {

            maxPrice.value =
                minPrice.value;

        }


        updatePriceDisplay();

        updateRangeProgress();

        applyFilters();

    }
);


// ==========================================
// RESET FILTERS
// ==========================================

function resetFilters() {

    // Reset categories

    categoryFilters.forEach(filter => {

        filter.checked = false;

    });


    // Reset ratings

    ratingFilters.forEach(filter => {

        filter.checked = false;

    });


    // Reset price

    minPrice.value = 0;

    maxPrice.value = 5000;


    // Reset state

    filterState.categories = [];

    filterState.minPrice = 0;

    filterState.maxPrice = 5000;

    filterState.rating = null;


    // Update UI

    updatePriceDisplay();

    updateRangeProgress();


    // Show complete inventory

    displayProducts(products);

}


// ==========================================
// RESET BUTTON EVENTS
// ==========================================

resetBtn.addEventListener(
    "click",
    resetFilters
);


emptyResetBtn.addEventListener(
    "click",
    resetFilters
);


// ==========================================
// INITIALIZATION
// ==========================================

updatePriceDisplay();

updateRangeProgress();

displayProducts(products);
