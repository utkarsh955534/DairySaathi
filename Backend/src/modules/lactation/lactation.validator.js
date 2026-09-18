const { z } = require("zod");

const createLactationSchema = z.object({
    startDate: z.string().datetime(),

    calfId: z
        .number()
        .int()
        .positive()
        .optional(),

    notes: z
        .string()
        .trim()
        .max(500, "Notes cannot exceed 500 characters")
        .optional(),
});

const closeLactationSchema = z.object({
    endDate: z.string().datetime(),

    totalMilk: z
        .number()
        .nonnegative()
        .optional(),

    peakMilk: z
        .number()
        .nonnegative()
        .optional(),

    notes: z
        .string()
        .trim()
        .max(500)
        .optional(),
});

module.exports = {
    createLactationSchema,
    closeLactationSchema,
};