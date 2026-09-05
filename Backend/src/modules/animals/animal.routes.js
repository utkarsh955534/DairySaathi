const express = require("express");
const multer = require("multer");

const router = express.Router();

const authMiddleware = require("../../middlewares/auth.middleware");
const validate = require("../../middlewares/validate.middleware");

const {
    createAnimal,
    getAnimals,
    getAnimalById,
    deleteAnimal,
    updateAnimal
} = require("./animal.controller");

const {
    createAnimalSchema,
} = require("./animal.validator");

const upload = multer({
    storage: multer.memoryStorage(),
});

router.use(authMiddleware);

router.post(
    "/",
    upload.single("photo"),
    validate(createAnimalSchema),
    createAnimal
);

router.get("/", getAnimals);

router.get("/:id", getAnimalById);

router.delete("/:id", deleteAnimal);
router.put("/:id",updateAnimal)

module.exports = router;