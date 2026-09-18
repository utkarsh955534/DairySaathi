const { z } = require("zod");

const createMilkRecordSchema = z.object({
    recordDate: z.string().datetime(),

    morning: z
        .number()
        .min(0, "Morning milk cannot be negative")
        .optional(),

    evening: z
        .number()
        .min(0, "Evening milk cannot be negative")
        .optional(),

    notes: z
        .string()
        .trim()
        .max(500, "Notes cannot exceed 500 characters")
        .optional(),
});

module.exports = {
    createMilkRecordSchema,
};