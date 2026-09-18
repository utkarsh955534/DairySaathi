const express = require("express");

const router = express.Router();

const {
    createBreedingRecord,
    getBreedingRecords,
} = require("./breeding.controller");

const authMiddleware = require("../../middlewares/auth.middleware");

const validate = require("../../middlewares/validate.middleware");

const {
    createBreedingRecordSchema,
} = require("./breeding.validator");

router.get(
    "/animals/:animalId",
    authMiddleware,
    getBreedingRecords
);

router.post(
    "/animals/:animalId",
    authMiddleware,
    validate(createBreedingRecordSchema),
    createBreedingRecord
);

module.exports = router;