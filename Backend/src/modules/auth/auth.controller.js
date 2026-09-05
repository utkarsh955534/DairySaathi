const authService = require("./auth.service");

const register = async (req, res, next) => {

    try {

        const result =
            await authService.register(req.body);

        res.status(201).json({
            success: true,
            message:
                "Registration successful. Please verify OTP.",
            data: result,
        });

    } catch (error) {
        next(error);
    }
};


const verifyOtp = async (req, res, next) => {

    try {

        const result =
            await authService.verifyOtp(req.body);

        res.status(200).json({
            success: true,
            ...result,
        });

    } catch (error) {
        next(error);
    }
};


const loginWithEmail = async (req, res, next) => {

    try {

        const result =
            await authService.loginWithEmail(req.body);

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result,
        });

    } catch (error) {
        next(error);
    }
};


const requestPhoneLoginOtp =
    async (req, res, next) => {

        try {

            const result =
                await authService
                    .requestPhoneLoginOtp(
                        req.body.phone
                    );

            res.status(200).json({
                success: true,
                ...result,
            });

        } catch (error) {
            next(error);
        }
    };


const loginWithPhoneOtp =
    async (req, res, next) => {

        try {

            const result =
                await authService.loginWithPhoneOtp({
                    phone:req.body.phone,
                    otp:req.body.otp,
                });

            res.status(200).json({
                success: true,
                message: "Login successful",
                data: result,
            });

        } catch (error) {
            next(error);
        }
    };

    const getMe = async (req, res, next) => {
    try {
        const user = req.user;

        return res.status(200).json({
            success: true,
            message: "Authenticated user",

            data: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                role: user.role,
                emailVerified: user.emailVerified,
                phoneVerified: user.phoneVerified,
                isActive: user.isActive,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });

    } catch (error) {
        next(error);
    }
};


const updateProfile = async (
    req,
    res,
    next
) => {
    try {

        const user =
            await authService.updateProfile(
                req.user.id,
                req.body
            );

        return res.status(200).json({
            success: true,
            message:
                "Profile updated successfully",
            data: user,
        });

    } catch (error) {
        next(error);
    }
};

const changePassword = async (
    req,
    res,
    next
) => {
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
            message:
                result.message,
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    verifyOtp,
    loginWithEmail,
    requestPhoneLoginOtp,
    loginWithPhoneOtp,
    getMe,
    updateProfile,
    changePassword
};