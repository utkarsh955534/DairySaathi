const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authRoutes =
    require("./modules/auth/auth.routes");

const app = express();


// ===============================
// SECURITY
// ===============================

app.use(helmet());


// ===============================
// CORS
// ===============================

app.use(cors());


// ===============================
// BODY PARSER
// ===============================

app.use(express.json());

app.use(express.urlencoded({
    extended: true,
}));


// ===============================
// HEALTH CHECK
// ===============================

app.get("/api/v1/health", (req, res) => {

    res.status(200).json({
        success: true,
        message: "DairySaathi API is running",
    });

});


// ===============================
// AUTH ROUTES
// ===============================

app.use(
    "/api/v1/auth",
    authRoutes
);


// ===============================
// GLOBAL ERROR HANDLER
// ===============================

app.use((err, req, res, next) => {

    console.error("ERROR:", err);

    return res.status(
        err.statusCode || 400
    ).json({
        success: false,
        message:
            err.message ||
            "Something went wrong",
    });

});


module.exports = app;