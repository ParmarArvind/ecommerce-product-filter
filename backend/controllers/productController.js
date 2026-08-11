// ==========================================
// PRODUCT CONTROLLER
// ==========================================

const products = require("../data/products");


// ==========================================
// ALLOWED CATEGORIES
// ==========================================

const allowedCategories = [
    "Electronics",
    "Apparel",
    "Footwear"
];


// ==========================================
// FILTER PRODUCTS
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
            rating
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


        if (invalidCategories.length > 0) {

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
        // VALIDATE PRICE VALUES
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
        // APPLY COMBINATORIAL FILTERING
        // ======================================

        const filteredProducts =
            products.filter(product => {


                // ----------------------------------
                // CATEGORY CONDITION
                // ----------------------------------

                const categoryMatch =
                    selectedCategories.length === 0 ||
                    selectedCategories.includes(
                        product.category
                    );


                // ----------------------------------
                // MINIMUM PRICE CONDITION
                // ----------------------------------

                const minimumPriceMatch =
                    minimumPrice === null ||
                    product.price >= minimumPrice;


                // ----------------------------------
                // MAXIMUM PRICE CONDITION
                // ----------------------------------

                const maximumPriceMatch =
                    maximumPrice === null ||
                    product.price <= maximumPrice;


                // ----------------------------------
                // RATING CONDITION
                // ----------------------------------

                const ratingMatch =
                    minimumRating === null ||
                    product.rating >= minimumRating;


                // ----------------------------------
                // INTERSECTION
                // ----------------------------------

                return (
                    categoryMatch &&
                    minimumPriceMatch &&
                    maximumPriceMatch &&
                    ratingMatch
                );

            });


        // ======================================
        // RESPONSE
        // ======================================

        return res.status(200).json({

            success: true,

            count: filteredProducts.length,

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

            data: filteredProducts

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


module.exports = {
    getFilteredProducts
};
