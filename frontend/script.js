// ==========================================
// API CONFIGURATION
// ==========================================

const API_URL =
    "http://localhost:5000/api/products";


// ==========================================
// FILTER STATE
// ==========================================

const filterState = {

    categories: [],

    minPrice: 0,

    maxPrice: 5000,

    rating: null,

    sortBy: "default"

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


const sortBy =
    document.getElementById("sortBy");


const categoryFilters =
    document.querySelectorAll(
        ".category-filter"
    );


const ratingFilters =
    document.querySelectorAll(
        'input[name="rating"]'
    );


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


    filterState.sortBy =
        sortBy.value;

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
// DISPLAY PRODUCTS
// ==========================================

function displayProducts(productList) {

    productGrid.innerHTML = "";


    // Update count

    productCount.textContent =
        `${productList.length} product${productList.length !== 1 ? "s" : ""}`;


    // ======================================
    // EMPTY RESULT
    // ======================================

    if (productList.length === 0) {

        productGrid.style.display = "none";

        emptyState.style.display = "block";

        return;
    }


    // ======================================
    // PRODUCTS AVAILABLE
    // ======================================

    productGrid.style.display = "grid";

    emptyState.style.display = "none";


    // ======================================
    // CREATE CARDS
    // ======================================

    productList.forEach(product => {

        const card =
            document.createElement("article");


        card.className =
            "product-card";


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
// FETCH PRODUCTS FROM BACKEND
// ==========================================

async function fetchProducts() {

    try {

        updateFilterState();


        // ==================================
        // CREATE QUERY PARAMETERS
        // ==================================

        const params =
            new URLSearchParams();


        // Categories

        if (
            filterState.categories.length > 0
        ) {

            params.set(
                "categories",
                filterState.categories.join(",")
            );

        }


        // Minimum price

        params.set(
            "minPrice",
            filterState.minPrice
        );


        // Maximum price

        params.set(
            "maxPrice",
            filterState.maxPrice
        );


        // Rating

        if (
            filterState.rating !== null
        ) {

            params.set(
                "rating",
                filterState.rating
            );

        }


        // Sort

        if (
            filterState.sortBy !== "default"
        ) {

            params.set(
                "sortBy",
                filterState.sortBy
            );

        }


        // ==================================
        // API REQUEST
        // ==================================

        const response =
            await fetch(
                `${API_URL}?${params.toString()}`
            );


        // ==================================
        // HANDLE HTTP ERROR
        // ==================================

        if (!response.ok) {

            throw new Error(
                `Server returned ${response.status}`
            );

        }


        // ==================================
        // READ JSON
        // ==================================

        const result =
            await response.json();


        // ==================================
        // HANDLE API ERROR
        // ==================================

        if (!result.success) {

            throw new Error(
                result.message ||
                "Unable to fetch products."
            );

        }


        // ==================================
        // DISPLAY RESULTS
        // ==================================

        displayProducts(
            result.data
        );

    }

    catch (error) {

        console.error(
            "Failed to fetch products:",
            error
        );


        productGrid.innerHTML = "";


        productGrid.style.display = "none";


        emptyState.style.display = "block";


        emptyState.innerHTML = `

            <div class="empty-icon">
                ⚠️
            </div>

            <h2>
                Unable to load products
            </h2>

            <p>
                Please make sure the backend
                server is running.
            </p>

            <button
                type="button"
                id="connectionRetryBtn"
                class="reset-large-btn"
            >
                Try Again
            </button>

        `;


        const connectionRetryBtn =
            document.getElementById(
                "connectionRetryBtn"
            );


        connectionRetryBtn.addEventListener(
            "click",
            fetchProducts
        );

    }

}


// ==========================================
// CATEGORY EVENTS
// ==========================================

categoryFilters.forEach(filter => {

    filter.addEventListener(
        "change",
        fetchProducts
    );

});


// ==========================================
// RATING EVENTS
// ==========================================

ratingFilters.forEach(filter => {

    filter.addEventListener(
        "change",
        fetchProducts
    );

});


// ==========================================
// SORT EVENT
// ==========================================

sortBy.addEventListener(
    "change",
    fetchProducts
);


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


        if (minimum > maximum) {

            minPrice.value =
                maxPrice.value;

        }


        updatePriceDisplay();

        updateRangeProgress();

        fetchProducts();

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


        if (maximum < minimum) {

            maxPrice.value =
                minPrice.value;

        }


        updatePriceDisplay();

        updateRangeProgress();

        fetchProducts();

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


    // Reset rating

    ratingFilters.forEach(filter => {

        filter.checked = false;

    });


    // Reset price

    minPrice.value = 0;

    maxPrice.value = 5000;


    // Reset sorting

    sortBy.value = "default";


    // Reset state

    filterState.categories = [];

    filterState.minPrice = 0;

    filterState.maxPrice = 5000;

    filterState.rating = null;

    filterState.sortBy = "default";


    // Update UI

    updatePriceDisplay();

    updateRangeProgress();


    // Fetch complete inventory

    fetchProducts();

}


// ==========================================
// RESET BUTTONS
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
// INITIAL LOAD
// ==========================================

updatePriceDisplay();

updateRangeProgress();

fetchProducts();
