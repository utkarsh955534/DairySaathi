const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = require("../../config/db");


// =========================
// REGISTER
// =========================

const register = async ({
    fullName,
    email,
    password,
}) => {

    if (!fullName || !fullName.trim()) {
        throw new Error("Full name is required");
    }

    if (!email || !email.trim()) {
        throw new Error("Email is required");
    }

    if (!password) {
        throw new Error("Password is required");
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check existing email
    const existingUser = await prisma.user.findUnique({
        where: {
            email: normalizedEmail,
        },
    });

    if (existingUser) {
        throw new Error(
            "Email already registered. Please try to log in."
        );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(
        password,
        12
    );

    // Create user
    const user = await prisma.user.create({
        data: {
            fullName: fullName.trim(),
            email: normalizedEmail,
            passwordHash,

            // No OTP verification now
            emailVerified: true,
            isActive: true,
        },
    });

    return {
        user: sanitizeUser(user),
    };
};


// =========================
// LOGIN WITH EMAIL
// =========================

const loginWithEmail = async ({
    email,
    password,
}) => {

    if (!email || !email.trim()) {
        throw new Error("Email is required");
    }

    if (!password) {
        throw new Error("Password is required");
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
        where: {
            email: normalizedEmail,
        },
    });

    if (!user) {
        throw new Error(
            "Invalid email or password"
        );
    }

    if (!user.isActive) {
        throw new Error(
            "Account is inactive"
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


// =========================
// GET CURRENT USER
// =========================

const getMe = async (userId) => {

    const user = await prisma.user.findUnique({
        where: {
            id: Number(userId),
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    return sanitizeUser(user);
};


// =========================
// GENERATE JWT
// =========================

const generateToken = (user) => {

    if (!process.env.JWT_SECRET) {
        throw new Error(
            "JWT_SECRET is not configured"
        );
    }

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


// =========================
// SANITIZE USER
// =========================

const sanitizeUser = (user) => {

    return {
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
    };
};


// =========================
// UPDATE PROFILE
// =========================

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

    const normalizedEmail =
        email?.trim().toLowerCase() || null;

    const normalizedPhone =
        phone?.trim() || null;


    // Check duplicate email
    if (normalizedEmail) {

        const existingEmail =
            await prisma.user.findFirst({
                where: {
                    email: normalizedEmail,
                    NOT: {
                        id: Number(userId),
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
    if (normalizedPhone) {

        const existingPhone =
            await prisma.user.findFirst({
                where: {
                    phone: normalizedPhone,
                    NOT: {
                        id: Number(userId),
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
                id: Number(userId),
            },

            data: {
                fullName: fullName.trim(),
                email: normalizedEmail,
                phone: normalizedPhone,
            },
        });

    return sanitizeUser(user);
};


// =========================
// CHANGE PASSWORD
// =========================

const changePassword = async (
    userId,
    currentPassword,
    newPassword
) => {

    if (!currentPassword) {
        throw new Error(
            "Current password is required"
        );
    }

    if (!newPassword) {
        throw new Error(
            "New password is required"
        );
    }

    if (newPassword.length < 8) {
        throw new Error(
            "New password must contain at least 8 characters"
        );
    }


    const user =
        await prisma.user.findUnique({
            where: {
                id: Number(userId),
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


    const newPasswordHash =
        await bcrypt.hash(
            newPassword,
            12
        );


    await prisma.user.update({
        where: {
            id: Number(userId),
        },

        data: {
            passwordHash: newPasswordHash,
        },
    });


    return {
        message:
            "Password changed successfully",
    };
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