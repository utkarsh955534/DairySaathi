const { z } = require("zod");

const healthTypes = [
    "DEWORMING",
    "VACCINATION",
    "TREATMENT",
    "CHECKUP",
    "OTHER",
];

const createHealthRecordSchema = z.object({
    type: z.enum(healthTypes),

    recordDate: z.string().datetime(),

    // =========================
    // VACCINATION
    // =========================

    vaccineName: z
        .string()
        .trim()
        .max(200, "Vaccine name is too long")
        .optional(),

    // =========================
    // DEWORMING
    // =========================

    dewormerName: z
        .string()
        .trim()
        .max(200, "Dewormer name is too long")
        .optional(),

    // =========================
    // TREATMENT
    // =========================

    problem: z
        .string()
        .trim()
        .max(300, "Problem description is too long")
        .optional(),

    diagnosis: z
        .string()
        .trim()
        .max(300, "Diagnosis is too long")
        .optional(),

    treatmentMedicine: z
        .string()
        .trim()
        .max(200, "Medicine name is too long")
        .optional(),

    treatmentDose: z
        .string()
        .trim()
        .max(100, "Treatment dose is too long")
        .optional(),

    treatmentNextReview: z
        .string()
        .datetime()
        .optional(),

    // =========================
    // CHECKUP
    // =========================

    checkupType: z
        .string()
        .trim()
        .max(100, "Checkup type is too long")
        .optional(),

    findings: z
        .string()
        .trim()
        .max(1000, "Findings are too long")
        .optional(),

    // =========================
    // COMMON VACCINATION /
    // DEWORMING
    // =========================

    dose: z
        .string()
        .trim()
        .max(100, "Dose is too long")
        .optional(),

    nextDue: z
        .string()
        .datetime()
        .optional(),

    // =========================
    // OTHER
    // =========================

    title: z
        .string()
        .trim()
        .max(200, "Title is too long")
        .optional(),

    details: z
        .string()
        .trim()
        .max(1000, "Details are too long")
        .optional(),

    // =========================
    // COMMON
    // =========================

    notes: z
        .string()
        .trim()
        .max(500, "Notes cannot exceed 500 characters")
        .optional(),
});

module.exports = {
    createHealthRecordSchema,
};