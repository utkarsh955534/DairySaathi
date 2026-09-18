const authService = require("./auth.service");


// =========================
// REGISTER
// =========================

const register = async (req, res, next) => {
    try {
        const result = await authService.register(req.body);

        return res.status(201).json({
            success: true,
            message: "Registration successful",
            data: result,
        });

    } catch (error) {
        next(error);
    }
};


// =========================
// LOGIN WITH EMAIL
// =========================

const loginWithEmail = async (req, res, next) => {
    try {
        const result = await authService.loginWithEmail(req.body);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: result,
        });

    } catch (error) {
        next(error);
    }
};


// =========================
// GET CURRENT USER
// =========================

const getMe = async (req, res, next) => {
    try {
        const user = await authService.getMe(
            req.user.id
        );

        return res.status(200).json({
            success: true,
            data: user,
        });

    } catch (error) {
        next(error);
    }
};


// =========================
// UPDATE PROFILE
// =========================

const updateProfile = async (req, res, next) => {
    try {
        const user = await authService.updateProfile(
            req.user.id,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: user,
        });

    } catch (error) {
        next(error);
    }
};


// =========================
// CHANGE PASSWORD
// =========================

const changePassword = async (req, res, next) => {
    try {
        const {
            currentPassword,
            newPassword,
        } = req.body;

        const result =
            await authService.changePassword(
                req.user.id,
                currentPassword,
                newPassword
            );

        return res.status(200).json({
            success: true,
            message: result.message,
        });

    } catch (error) {
        next(error);
    }
};


// =========================
// EXPORTS
// =========================

module.exports = {
    register,
    loginWithEmail,
    getMe,
    updateProfile,
    changePassword,
};