// ==========================================
// PRODUCT ROUTES
// ==========================================

const express = require("express");

const router =
    express.Router();


const {
    getFilteredProducts
} = require("../controllers/productController");


// ==========================================
// GET PRODUCTS
// ==========================================

// GET /api/products
//
// Optional query parameters:
//
// categories
// minPrice
// maxPrice
// rating
//
// Example:
//
// /api/products?categories=Electronics
//
// /api/products?minPrice=1000&maxPrice=3000
//
// /api/products?rating=4
//
// /api/products?categories=Electronics,Footwear&minPrice=1000&maxPrice=3000&rating=4

router.get(
    "/products",
    getFilteredProducts
);


module.exports = router;
