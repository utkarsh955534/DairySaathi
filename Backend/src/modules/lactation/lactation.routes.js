const express = require("express");

const router = express.Router();

const {
    createLactation,
    getLactationRecords,
    closeLactation,
} = require("./lactation.controller");

const authMiddleware =
    require("../../middlewares/auth.middleware");

const validate =
    require("../../middlewares/validate.middleware");

const {
    createLactationSchema,
    closeLactationSchema,
} = require("./lactation.validator");

router.get(
    "/animals/:animalId",
    authMiddleware,
    getLactationRecords
);

router.post(
    "/animals/:animalId",
    authMiddleware,
    validate(createLactationSchema),
    createLactation
);

router.put(
    "/:lactationId/close",
    authMiddleware,
    validate(closeLactationSchema),
    closeLactation
);

module.exports = router;