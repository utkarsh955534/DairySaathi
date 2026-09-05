const express = require("express");

const router = express.Router();

const {
    register,
    verifyOtp,
    loginWithEmail,
    requestPhoneLoginOtp,
    loginWithPhoneOtp,
    getMe,
    updateProfile,
    changePassword,
} = require("./auth.controller");

const validate =
    require("../../middlewares/validate.middleware");

const {
    registerSchema,
    verifyOtpSchema,
    emailLoginSchema,
    phoneLoginSchema,
    phoneLoginOtpSchema,
} = require("./auth.validator");


const authMiddleware = require("../../middlewares/auth.middleware");
router.get(
  "/me",
  authMiddleware,
  getMe
);



router.post(
    "/register",
    validate(registerSchema),
    register
);


router.post(
    "/verify-otp",
    validate(verifyOtpSchema),
    verifyOtp
);


router.post(
    "/login/email",
    validate(emailLoginSchema),
    loginWithEmail
);


router.post(
    "/login/phone/request-otp",
    validate(phoneLoginSchema),
    requestPhoneLoginOtp
);


router.post(
    "/login/phone/verify-otp",
    validate(phoneLoginOtpSchema),
    loginWithPhoneOtp
);


router.put(
    "/profile",
    authMiddleware,
    updateProfile,
    
);

router.put(
    "/change-password",
    authMiddleware,
    changePassword
);

module.exports = router;