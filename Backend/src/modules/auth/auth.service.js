const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = require("../../config/db");

const {
    generateOtp,
    hashOtp,
} = require("../../utils/otp");
const { getMe } = require("./auth.controller");

const register = async ({
    fullName,
    email,
    phone,
    password,
}) => {

    if (!email && !phone) {
        throw new Error(
            "Email or phone number is required"
        );
    }

     
    // CHECK EXISTING EMAIL
     

    if (email) {
        const existingEmail =
            await prisma.user.findUnique({
                where: {
                    email,
                },
            });

        if (existingEmail) {
            throw new Error(
                "Email already registered. Please try to log in."
            );
        }
    }

     
    // CHECK EXISTING PHONE
     

    if (phone) {
        const existingPhone =
            await prisma.user.findUnique({
                where: {
                    phone,
                },
            });

        if (existingPhone) {
            throw new Error(
                "Phone number already registered. Please try to log in."
            );
        }
    }

    
    // HASH PASSWORD
    

    const passwordHash =
        await bcrypt.hash(password, 12);

     
    // CREATE USER
     

    const user = await prisma.user.create({
        data: {
            fullName,
            email,
            phone,
            passwordHash,
        },
    });

     
    // GENERATE OTP
     

    const otp = generateOtp();

    const otpHash = hashOtp(otp);

    const otpType = email
        ? "EMAIL_VERIFICATION"
        : "PHONE_VERIFICATION";

    await prisma.otpVerification.create({
        data: {
            userId: user.id,
            otpHash,
            type: otpType,
            expiresAt: new Date(
                Date.now() + 5 * 60 * 1000
            ),
        },
    });

    // DEVELOPMENT ONLY
    console.log(
        `[DEV OTP] ${otpType}: ${otp}`
    );

    return {
        userId: user.id,
        verificationRequired: true,
        verificationType: email
            ? "EMAIL"
            : "PHONE",
    };
};




const verifyOtp = async ({
    identifier,
    otp,
}) => {

    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { email: identifier },
                { phone: identifier },
            ],
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    const otpRecord =
        await prisma.otpVerification.findFirst({
            where: {
                userId: user.id,
                verifiedAt: null,
                expiresAt: {
                    gt: new Date(),
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

    if (!otpRecord) {
        throw new Error(
            "OTP expired or not found"
        );
    }

    if (otpRecord.attempts >= 5) {
        throw new Error(
            "Maximum OTP attempts exceeded"
        );
    }

    const otpHash = hashOtp(otp);

    if (otpHash !== otpRecord.otpHash) {

        await prisma.otpVerification.update({
            where: {
                id: otpRecord.id,
            },
            data: {
                attempts: {
                    increment: 1,
                },
            },
        });

        throw new Error("Invalid OTP");
    }

    await prisma.otpVerification.update({
        where: {
            id: otpRecord.id,
        },
        data: {
            verifiedAt: new Date(),
        },
    });

    const updateData = {};

    if (user.email === identifier) {
        updateData.emailVerified = true;
    }

    if (user.phone === identifier) {
        updateData.phoneVerified = true;
    }

    updateData.isActive = true;

    await prisma.user.update({
        where: {
            id: user.id,
        },
        data: updateData,
    });

    return {
        message: "Account verified successfully",
    };
};


const loginWithEmail = async ({
    email,
    password,
}) => {

    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (!user) {
        throw new Error(
            "Invalid email or password"
        );
    }

    if (!user.emailVerified) {
        throw new Error(
            "Please verify your email first"
        );
    }

    const passwordMatch =
        await bcrypt.compare(
            password,
            user.passwordHash
        );

    if (!passwordMatch) {
        throw new Error(
            "Invalid email or password"
        );
    }

    const token = generateToken(user);

    return {
        token,
        user: sanitizeUser(user),
    };
};





const generateToken = (user) => {

    return jwt.sign(
        {
            userId: user.id,
            role: user.role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn:
                process.env.JWT_EXPIRES_IN || "7d",
        }
    );
};


const sanitizeUser = (user) => {

    return {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
    };
};




const requestPhoneLoginOtp = async (phone) => {

    const user = await prisma.user.findUnique({
        where: {
            phone,
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    if (!user.phoneVerified) {
        throw new Error(
            "Phone number is not verified"
        );
    }

    const otp = generateOtp();

    const otpHash = hashOtp(otp);

    await prisma.otpVerification.create({
        data: {
            userId: user.id,
            otpHash,
            type: "PHONE_LOGIN",
            expiresAt: new Date(
                Date.now() + 5 * 60 * 1000
            ),
        },
    });

    // DEVELOPMENT ONLY
    console.log(`[DEV LOGIN OTP]: ${otp}`);

    return {
        message: "Login OTP sent successfully",
    };
};



const loginWithPhoneOtp = async ({
    phone,
    otp,
}) => {

    const user = await prisma.user.findUnique({
        where: {
            phone:phone,
        },
    });

    if (!user) {
        throw new Error("User not found");
    }
    if (!user.phoneVerified) {
    throw new Error("Phone number is not verified");
  }

  if (!user.isActive) {
    throw new Error("Account is inactive");
  }

    const otpRecord =
        await prisma.otpVerification.findFirst({
            where: {
                userId: user.id,
                type: "PHONE_LOGIN",
                verifiedAt: null,
                expiresAt: {
                    gt: new Date(),
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

    if (!otpRecord) {
        throw new Error(
            "OTP expired or not found"
        );
    }

    if (otpRecord.attempts >= 5) {
        throw new Error(
            "Maximum OTP attempts exceeded"
        );
    }

    if (
        hashOtp(otp) !== otpRecord.otpHash
    ) {

        await prisma.otpVerification.update({
            where: {
                id: otpRecord.id,
            },
            data: {
                attempts: {
                    increment: 1,
                },
            },
        });

        throw new Error("Invalid OTP");
    }

    await prisma.otpVerification.update({
        where: {
            id: otpRecord.id,
        },
        data: {
            verifiedAt: new Date(),
        },
    });

    const token = generateToken(user);

    return {
        token,
        user: sanitizeUser(user),
    };
};

const updateProfile = async (
    userId,
    {
        fullName,
        email,
        phone,
    }
) => {
    if (!fullName || !fullName.trim()) {
        throw new Error(
            "Full name is required"
        );
    }

    // Check duplicate email
    if (email) {
        const existingEmail =
            await prisma.user.findFirst({
                where: {
                    email: email.trim(),
                    NOT: {
                        id: userId,
                    },
                },
            });

        if (existingEmail) {
            throw new Error(
                "Email already registered"
            );
        }
    }

    // Check duplicate phone
    if (phone) {
        const existingPhone =
            await prisma.user.findFirst({
                where: {
                    phone: phone.trim(),
                    NOT: {
                        id: userId,
                    },
                },
            });

        if (existingPhone) {
            throw new Error(
                "Phone number already registered"
            );
        }
    }

    const user =
        await prisma.user.update({
            where: {
                id: userId,
            },

            data: {
                fullName:
                    fullName.trim(),

                email:
                    email?.trim() || null,

                phone:
                    phone?.trim() || null,
            },
        });

    return {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        emailVerified:
            user.emailVerified,
        phoneVerified:
            user.phoneVerified,
        isActive:
            user.isActive,
        createdAt:
            user.createdAt,
        updatedAt:
            user.updatedAt,
    };
};



const changePassword = async (
    userId,
    currentPassword,
    newPassword
) => {
    const user =
        await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

    if (!user) {
        throw new Error(
            "User not found"
        );
    }

    const passwordMatch =
        await bcrypt.compare(
            currentPassword,
            user.passwordHash
        );

    if (!passwordMatch) {
        throw new Error(
            "Current password is incorrect"
        );
    }

    if (newPassword.length < 8) {
        throw new Error(
            "New password must contain at least 8 characters"
        );
    }

    const newPasswordHash =
        await bcrypt.hash(
            newPassword,
            12
        );

    await prisma.user.update({
        where: {
            id: userId,
        },

        data: {
            passwordHash:
                newPasswordHash,
        },
    });

    return {
        message:
            "Password changed successfully",
    };
};

module.exports = {
    register,
    verifyOtp,
    loginWithEmail,
    requestPhoneLoginOtp,
    loginWithPhoneOtp,
    getMe,
    updateProfile,
    changePassword,
};