const express = require("express");

const router = express.Router();

const {
    createWeightRecord,
    getWeightRecords,
} = require("./weight.controller");

const authMiddleware = require("../../middlewares/auth.middleware");

const validate = require("../../middlewares/validate.middleware");

const {
    createWeightRecordSchema,
} = require("./weight.validator");

router.get(
    "/animals/:animalId",
    authMiddleware,
    getWeightRecords
);

router.post(
    "/animals/:animalId",
    authMiddleware,
    validate(createWeightRecordSchema),
    createWeightRecord
);

module.exports = router;



















