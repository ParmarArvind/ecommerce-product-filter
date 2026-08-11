// ==========================================
// EXPRESS SERVER
// ==========================================

const express = require("express");

const cors = require("cors");

const productRoutes =
    require("./routes/productRoutes");


// ==========================================
// CREATE APP
// ==========================================

const app =
    express();


const PORT = 5000;


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
    cors()
);


app.use(
    express.json()
);


// ==========================================
// API ROUTES
// ==========================================

app.use(
    "/api",
    productRoutes
);


// ==========================================
// HEALTH CHECK
// ==========================================

app.get(
    "/",
    (req, res) => {

        res.status(200).json({

            success: true,

            message:
                "Product Filter API is running."

        });

    }
);


// ==========================================
// 404 HANDLER
// ==========================================

app.use(
    (req, res) => {

        res.status(404).json({

            success: false,

            message:
                "Route not found."

        });

    }
);


// ==========================================
// ERROR HANDLER
// ==========================================

app.use(
    (error, req, res, next) => {

        console.error(error);

        res.status(500).json({

            success: false,

            message:
                "Something went wrong on the server."

        });

    }
);


// ==========================================
// START SERVER
// ==========================================

app.listen(
    PORT,
    () => {

        console.log(
            `Server running on http://localhost:${PORT}`
        );

    }
);
