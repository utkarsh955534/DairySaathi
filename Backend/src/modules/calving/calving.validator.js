const { z } = require("zod");

const createCalvingSchema = z.object({
    calvingDate: z.string().datetime(),

    notes: z
        .string()
        .trim()
        .max(500, "Notes cannot exceed 500 characters")
        .optional(),
});

const linkExistingCalfSchema = z.object({
    calfId: z
        .number()
        .int()
        .positive("Invalid calf ID"),
});

const createNewCalfSchema = z.object({
    tagNumber: z
        .string()
        .trim()
        .min(1, "Calf tag number is required")
        .max(50, "Calf tag number is too long"),
});

module.exports = {
    createCalvingSchema,
    linkExistingCalfSchema,
    createNewCalfSchema,
};