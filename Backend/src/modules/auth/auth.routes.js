const express = require("express");

const router = express.Router();

const {
    register,
    loginWithEmail,
    getMe,
    updateProfile,
    changePassword,
} = require("./auth.controller");

const validate = require("../../middlewares/validate.middleware");

const {
    registerSchema,
    emailLoginSchema,
} = require("./auth.validator");

const authMiddleware = require("../../middlewares/auth.middleware");


// =========================
// GET CURRENT USER
// =========================

router.get(
    "/me",
    authMiddleware,
    getMe
);


// =========================
// REGISTER
// =========================

router.post(
    "/register",
    validate(registerSchema),
    register
);


// =========================
// EMAIL LOGIN
// =========================

router.post(
    "/login/email",
    validate(emailLoginSchema),
    loginWithEmail
);


// =========================
// UPDATE PROFILE
// =========================

router.put(
    "/profile",
    authMiddleware,
    updateProfile
);


// =========================
// CHANGE PASSWORD
// =========================

router.put(
    "/change-password",
    authMiddleware,
    changePassword
);


module.exports = router;