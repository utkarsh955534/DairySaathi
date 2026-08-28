const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authRoutes =
    require("./modules/auth/auth.routes");

const app = express();

app.use(helmet());

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true,
}));


app.get("/api/v1/health", (req, res) => {

    res.status(200).json({
        success: true,
        message: "DairySaathi API is running",
    });

});


app.use(
    "/api/v1/auth",
    authRoutes
);


module.exports = app;