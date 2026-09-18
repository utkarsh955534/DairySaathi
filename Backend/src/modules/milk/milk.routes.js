const express = require("express");

const router = express.Router();

const {
    createMilkRecord,
    getMilkRecords,
} = require("./milk.controller");

const authMiddleware = require("../../middlewares/auth.middleware");

const validate = require("../../middlewares/validate.middleware");

const {
    createMilkRecordSchema,
} = require("./milk.validator");

router.get(
    "/animals/:animalId",
    authMiddleware,
    getMilkRecords
);

router.post(
    "/animals/:animalId",
    authMiddleware,
    validate(createMilkRecordSchema),
    createMilkRecord
);

module.exports = router;