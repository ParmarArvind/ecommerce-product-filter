// ==========================================
// PRODUCT ROUTES
// ==========================================

const express =
    require("express");


const router =
    express.Router();


const {
    getFilteredProducts
} =
    require("../controllers/productController");


// ==========================================
// GET PRODUCTS
// ==========================================
//
// GET /api/products
//
// Optional parameters:
//
// categories
// minPrice
// maxPrice
// rating
// sortBy
//
// Examples:
//
// /api/products
//
// /api/products?categories=Electronics
//
// /api/products?minPrice=1000&maxPrice=3000
//
// /api/products?rating=4
//
// /api/products?sortBy=price-low-high
//
// /api/products?sortBy=top-rated
//
// /api/products?categories=Electronics,Footwear&minPrice=1000&maxPrice=3000&rating=4&sortBy=price-low-high


router.get(
    "/products",
    getFilteredProducts
);


// ==========================================
// EXPORT
// ==========================================

module.exports =
    router;
