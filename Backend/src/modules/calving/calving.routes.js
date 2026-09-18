const express = require("express");

const router = express.Router();

const {
    createCalving,
    getCalvingRecords,
    linkExistingCalf,
    createNewCalf,
} = require("./calving.controller");

const authMiddleware = require("../../middlewares/auth.middleware");

const validate = require("../../middlewares/validate.middleware");

const {
    createCalvingSchema,
    linkExistingCalfSchema,
    createNewCalfSchema,
} = require("./calving.validator");

// Get all calving records of mother
router.get(
    "/animals/:animalId",
    authMiddleware,
    getCalvingRecords
);

// Create a new calving event
router.post(
    "/animals/:animalId",
    authMiddleware,
    validate(createCalvingSchema),
    createCalving
);

// Link already existing animal as calf
router.put(
    "/:calvingId/calf/existing",
    authMiddleware,
    validate(linkExistingCalfSchema),
    linkExistingCalf
);

// Create new calf using only farmer's tag
router.post(
    "/:calvingId/calf/new",
    authMiddleware,
    validate(createNewCalfSchema),
    createNewCalf
);

module.exports = router;