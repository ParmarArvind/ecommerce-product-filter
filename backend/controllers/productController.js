// ==========================================
// PRODUCT CONTROLLER
// ==========================================

const products =
    require("../data/products");


// ==========================================
// ALLOWED VALUES
// ==========================================

const allowedCategories = [

    "Electronics",

    "Apparel",

    "Footwear"

];


const allowedSortOptions = [

    "default",

    "price-low-high",

    "top-rated"

];


// ==========================================
// GET FILTERED + SORTED PRODUCTS
// ==========================================

function getFilteredProducts(req, res) {

    try {

        // ======================================
        // READ QUERY PARAMETERS
        // ======================================

        const {
            categories,
            minPrice,
            maxPrice,
            rating,
            sortBy
        } = req.query;


        // ======================================
        // NORMALIZE CATEGORIES
        // ======================================

        let selectedCategories = [];


        if (
            typeof categories === "string" &&
            categories.trim() !== ""
        ) {

            selectedCategories =
                categories
                    .split(",")
                    .map(category =>
                        category.trim()
                    )
                    .filter(category =>
                        category !== ""
                    );

        }


        // ======================================
        // VALIDATE CATEGORIES
        // ======================================

        const invalidCategories =
            selectedCategories.filter(
                category =>
                    !allowedCategories.includes(
                        category
                    )
            );


        if (
            invalidCategories.length > 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid category selected.",

                invalidCategories

            });

        }


        // ======================================
        // NORMALIZE MINIMUM PRICE
        // ======================================

        let minimumPrice = null;


        if (
            minPrice !== undefined &&
            minPrice !== ""
        ) {

            minimumPrice =
                Number(minPrice);


            if (
                !Number.isFinite(
                    minimumPrice
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Minimum price must be a valid number."

                });

            }

        }


        // ======================================
        // NORMALIZE MAXIMUM PRICE
        // ======================================

        let maximumPrice = null;


        if (
            maxPrice !== undefined &&
            maxPrice !== ""
        ) {

            maximumPrice =
                Number(maxPrice);


            if (
                !Number.isFinite(
                    maximumPrice
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Maximum price must be a valid number."

                });

            }

        }


        // ======================================
        // VALIDATE MINIMUM PRICE
        // ======================================

        if (
            minimumPrice !== null &&
            minimumPrice < 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Minimum price cannot be negative."

            });

        }


        // ======================================
        // VALIDATE MAXIMUM PRICE
        // ======================================

        if (
            maximumPrice !== null &&
            maximumPrice < 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Maximum price cannot be negative."

            });

        }


        // ======================================
        // VALIDATE PRICE BOUNDARY
        // ======================================

        if (
            minimumPrice !== null &&
            maximumPrice !== null &&
            minimumPrice > maximumPrice
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Minimum price cannot be greater than maximum price."

            });

        }


        // ======================================
        // NORMALIZE RATING
        // ======================================

        let minimumRating = null;


        if (
            rating !== undefined &&
            rating !== ""
        ) {

            minimumRating =
                Number(rating);


            if (
                !Number.isInteger(
                    minimumRating
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Rating must be an integer."

                });

            }

        }


        // ======================================
        // VALIDATE RATING
        // ======================================

        if (
            minimumRating !== null &&
            (
                minimumRating < 1 ||
                minimumRating > 5
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Rating must be between 1 and 5."

            });

        }


        // ======================================
        // NORMALIZE SORT
        // ======================================

        const selectedSort =
            sortBy &&
            sortBy.trim() !== ""
                ? sortBy
                : "default";


        // ======================================
        // VALIDATE SORT
        // ======================================

        if (
            !allowedSortOptions.includes(
                selectedSort
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid sort option."

            });

        }


        // ======================================
        // STEP 1: FILTER
        // ======================================

        const filteredProducts =
            products.filter(product => {


                // --------------------------------
                // CATEGORY
                // --------------------------------

                const categoryMatch =
                    selectedCategories.length === 0 ||
                    selectedCategories.includes(
                        product.category
                    );


                // --------------------------------
                // MINIMUM PRICE
                // --------------------------------

                const minimumPriceMatch =
                    minimumPrice === null ||
                    product.price >= minimumPrice;


                // --------------------------------
                // MAXIMUM PRICE
                // --------------------------------

                const maximumPriceMatch =
                    maximumPrice === null ||
                    product.price <= maximumPrice;


                // --------------------------------
                // RATING
                // --------------------------------

                const ratingMatch =
                    minimumRating === null ||
                    product.rating >= minimumRating;


                // --------------------------------
                // INTERSECTION
                // --------------------------------

                return (
                    categoryMatch &&
                    minimumPriceMatch &&
                    maximumPriceMatch &&
                    ratingMatch
                );

            });


        // ======================================
        // STEP 2: SORT
        // ======================================

        const sortedProducts =
            [...filteredProducts];


        // --------------------------------------
        // PRICE LOW TO HIGH
        // --------------------------------------

        if (
            selectedSort === "price-low-high"
        ) {

            sortedProducts.sort(
                (a, b) =>
                    a.price - b.price
            );

        }


        // --------------------------------------
        // TOP RATED FIRST
        // --------------------------------------

        else if (
            selectedSort === "top-rated"
        ) {

            sortedProducts.sort(
                (a, b) =>
                    b.rating - a.rating
            );

        }


        // ======================================
        // STEP 3: RESPONSE
        // ======================================

        return res.status(200).json({

            success: true,

            count:
                sortedProducts.length,

            filters: {

                categories:
                    selectedCategories,

                minPrice:
                    minimumPrice,

                maxPrice:
                    maximumPrice,

                rating:
                    minimumRating

            },

            sortBy:
                selectedSort,

            data:
                sortedProducts

        });

    }


    catch (error) {

        console.error(
            "Product filtering error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Internal server error."

        });

    }

}


// ==========================================
// EXPORT
// ==========================================

module.exports = {

    getFilteredProducts

};
