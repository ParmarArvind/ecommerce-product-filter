const products = require("../data/products");

function getFilteredProducts(req, res) {

    const {
        categories,
        minPrice,
        maxPrice,
        rating
    } = req.query;


    // Category filter
    const selectedCategories = categories
        ? categories
            .split(",")
            .map(category => category.trim())
            .filter(category => category !== "")
        : [];


    // Price filters
    const minimumPrice =
        minPrice !== undefined && minPrice !== ""
            ? Number(minPrice)
            : null;

    const maximumPrice =
        maxPrice !== undefined && maxPrice !== ""
            ? Number(maxPrice)
            : null;


    // Rating filter
    const minimumRating =
        rating !== undefined && rating !== ""
            ? Number(rating)
            : null;


    // Apply all active filters
    const filteredProducts = products.filter(product => {

        const categoryMatch =
            selectedCategories.length === 0 ||
            selectedCategories.includes(product.category);


        const minPriceMatch =
            minimumPrice === null ||
            product.price >= minimumPrice;


        const maxPriceMatch =
            maximumPrice === null ||
            product.price <= maximumPrice;


        const ratingMatch =
            minimumRating === null ||
            product.rating >= minimumRating;


        return (
            categoryMatch &&
            minPriceMatch &&
            maxPriceMatch &&
            ratingMatch
        );
    });


    res.json({
        success: true,
        count: filteredProducts.length,
        data: filteredProducts
    });
}


module.exports = {
    getFilteredProducts
};
