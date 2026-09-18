const express = require("express");

const router = express.Router();

const {
    createHealthRecord,
    getHealthRecords,
} = require("./health.controller");

const authMiddleware = require("../../middlewares/auth.middleware");

const validate = require("../../middlewares/validate.middleware");

const {
    createHealthRecordSchema,
} = require("./health.validator");

router.get(
    "/animals/:animalId",
    authMiddleware,
    getHealthRecords
);

router.post(
    "/animals/:animalId",
    authMiddleware,
    validate(createHealthRecordSchema),
    createHealthRecord
);

module.exports = router;