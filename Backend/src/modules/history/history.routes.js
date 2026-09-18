const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middlewares/auth.middleware");

const {
    getAnimalHistory,
} = require("./history.controller");

router.use(authMiddleware);

router.get(
    "/animal/:animalId",
    getAnimalHistory
);

module.exports = router;