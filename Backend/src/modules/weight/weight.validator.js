const { z } = require("zod");

const createWeightRecordSchema = z.object({
    recordDate: z.string().datetime(),

    weight: z
        .number()
        .positive("Weight must be greater than 0"),

    notes: z
        .string()
        .trim()
        .max(500, "Notes cannot exceed 500 characters")
        .optional(),
});

module.exports = {
    createWeightRecordSchema,
};