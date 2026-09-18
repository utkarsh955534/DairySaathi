const { z } = require("zod");

const breedingTypes = [
    "HEAT",
    "INSEMINATION",
    "PREGNANCY_CHECK",
];

const createBreedingRecordSchema = z.object({
    type: z.enum(breedingTypes),

    recordDate: z.string().datetime(),

    // Heat
    heatObservation: z
        .string()
        .trim()
        .max(
            500,
            "Heat observation is too long"
        )
        .optional(),

    // Insemination
    semenCode: z
        .string()
        .trim()
        .max(
            100,
            "Semen code is too long"
        )
        .optional(),

    technician: z
        .string()
        .trim()
        .max(
            150,
            "Technician name is too long"
        )
        .optional(),

    // Pregnancy check
    pregnancyResult: z
        .boolean()
        .optional(),

    notes: z
        .string()
        .trim()
        .max(
            500,
            "Notes cannot exceed 500 characters"
        )
        .optional(),
});

module.exports = {
    createBreedingRecordSchema,
};