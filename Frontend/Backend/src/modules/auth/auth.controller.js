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
                await authService
                    .loginWithPhoneOtp(req.body);

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
    res.status(200).json({
      success: true,
      message: "Authenticated user",
      user: req.user,
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
};