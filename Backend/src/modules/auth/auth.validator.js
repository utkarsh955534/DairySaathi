const { z } = require("zod");

const registerSchema = z.object({
    fullName: z
        .string()
        .min(2, "Name must contain at least 2 characters")
        .max(100),

    email: z
        .string()
        .email("Invalid email address")
        .optional(),

    phone: z
        .string()
        .regex(
            /^\+?[1-9]\d{9,14}$/,
            "Invalid phone number"
        )
        .optional(),

    password: z
        .string()
        .min(8, "Password must contain at least 8 characters")
}).refine(
    (data) => data.email || data.phone,
    {
        message: "Email or phone number is required",
        path: ["email"],
    }
);

const verifyOtpSchema = z.object({
    identifier: z.string().min(1),

    otp: z
        .string()
        .regex(/^\d{6}$/, "OTP must be 6 digits"),
});

const emailLoginSchema = z.object({
    email: z
        .string()
        .email("Invalid email address"),

    password: z
        .string()
        .min(1, "Password is required"),
});

const phoneLoginSchema = z.object({
    phone: z
        .string()
        .regex(
            /^\+?[1-9]\d{9,14}$/,
            "Invalid phone number"
        ),
});

module.exports = {
    registerSchema,
    verifyOtpSchema,
    emailLoginSchema,
    phoneLoginSchema,
};