const express = require("express");
const cors = require("cors");

const productRoutes = require("./routes/productRoutes");


const app = express();

const PORT = 5000;


// Middleware
app.use(cors());

app.use(express.json());


// API routes
app.use("/api", productRoutes);


// Test route
app.get("/", (req, res) => {

    res.json({
        message: "Product Filter API is running"
    });

});


// Start server
app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});
