const express = require("express");

const router = express.Router();

const {
    getPublicAnimalHistory,
    generateAnimalQr,
} = require("./publicAnimal.controller");

const authMiddleware =
    require("../../middlewares/auth.middleware");

router.get(
    "/public/animal/:token",
    getPublicAnimalHistory
);

router.post(
    "/qr/animals/:animalId",
    authMiddleware,
    generateAnimalQr
);

module.exports = router;