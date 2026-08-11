const express = require("express");

const router = express.Router();

const {
    getFilteredProducts
} = require("../controllers/productController");


router.get("/products", getFilteredProducts);


module.exports = router;
