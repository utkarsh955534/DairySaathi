const { z } = require("zod");


// =========================
// REGISTER
// =========================

const registerSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(
            2,
            "Name must contain at least 2 characters"
        )
        .max(
            100,
            "Name cannot exceed 100 characters"
        ),

    email: z
        .string()
        .trim()
        .email("Invalid email address"),

    phone: z
        .string()
        .trim()
        .regex(
            /^\+?[1-9]\d{9,14}$/,
            "Invalid phone number"
        )
        .optional(),

    password: z
        .string()
        .min(
            8,
            "Password must contain at least 8 characters"
        ),
});


// =========================
// EMAIL LOGIN
// =========================

const emailLoginSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Invalid email address"),

    password: z
        .string()
        .min(
            1,
            "Password is required"
        ),
});


module.exports = {
    registerSchema,
    emailLoginSchema,
};