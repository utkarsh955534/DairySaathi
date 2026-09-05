const { z } = require("zod");

const parentSource = z.enum([
    "EXISTING",
    "EXTERNAL",
    "UNKNOWN",
]);

const createAnimalSchema = z.object({
    name: z.string().min(2).max(100),
    tagNumber: z.string().min(1).max(50),

    species: z.enum(["COW", "BUFFALO"]),
    sex: z.enum(["FEMALE", "MALE"]),
    lifeStage: z.enum(["CALF", "HEIFER", "ADULT"]),

    breed: z.string().optional(),
    dateOfBirth: z.string().optional(),
    weight: z.coerce.number().positive().optional(),

    motherSource: parentSource.optional(),
    motherId: z.coerce.number().int().positive().optional(),
    motherExternalName: z.string().optional(),
    motherExternalBreed: z.string().optional(),
    motherExternalTag: z.string().optional(),

    fatherSource: parentSource.optional(),
    fatherId: z.coerce.number().int().positive().optional(),
    fatherExternalName: z.string().optional(),
    fatherExternalBreed: z.string().optional(),
    fatherExternalTag: z.string().optional(),

    productionStatus: z
        .enum(["LACTATING", "DRY", "NOT_APPLICABLE"])
        .optional(),

    lactationNumber: z.coerce.number().int().positive().optional(),
    lactationStartDate: z.string().optional(),
    currentMilkProduction: z.coerce.number().nonnegative().optional(),

    pregnancyStatus: z
        .enum([
            "NOT_APPLICABLE",
            "NOT_PREGNANT",
            "PREGNANT",
        ])
        .optional(),

    lastCalvingDate: z.string().optional(),
    expectedCalvingDate: z.string().optional(),

    notes: z.string().optional(),
});

module.exports = {
    createAnimalSchema,
};