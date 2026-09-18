const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authRoutes = require("./modules/auth/auth.routes");

const animalRoutes = require("./modules/animals/animal.routes");
const historyRoutes = require("./modules/history/history.routes");
const milkRoutes = require("./modules/milk/milk.routes");
const weightRoutes = require("./modules/weight/weight.routes");
const healthRoutes = require("./modules/health/health.routes");
const breedingRoutes = require("./modules/breeding/breeding.routes");
const calvingRoutes = require("./modules/calving/calving.routes");
const lactationRoutes = require("./modules/lactation/lactation.routes");

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


// Animals route

 app.use("/api/v1/animals", animalRoutes);


// ===============================
// AUTH ROUTES
// ===============================

app.use(
    "/api/v1/auth",
    authRoutes
);


app.use("/api/v1/history", historyRoutes);
app.use("/api/v1/milk", milkRoutes);
app.use("/api/v1/weight", weightRoutes);
app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/breeding", breedingRoutes);
app.use("/api/v1/calving", calvingRoutes);
app.use("/api/v1/lactation", lactationRoutes);


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