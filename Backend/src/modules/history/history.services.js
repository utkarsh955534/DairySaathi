const prisma = require("../../config/db");

const getAnimalHistory = async (userId, animalId) => {
    const numericUserId = Number(userId);
    const numericAnimalId = Number(animalId);

    // =====================================================
    // ANIMAL
    // =====================================================

    const animal = await prisma.animal.findFirst({
        where: {
            id: numericAnimalId,
            userId: numericUserId,
        },
        select: {
            id: true,
            name: true,
            tagNumber: true,
            species: true,
            sex: true,
            lifeStage: true,
            breed: true,
            dateOfBirth: true,
            weight: true,
            photoUrl: true,

            motherId: true,
            mother: {
                select: {
                    id: true,
                    name: true,
                    tagNumber: true,
                },
            },

            fatherId: true,
            father: {
                select: {
                    id: true,
                    name: true,
                    tagNumber: true,
                },
            },

            createdAt: true,
            updatedAt: true,
        },
    });

    if (!animal) {
        throw new Error("Animal not found");
    }

    const events = [];

    // =====================================================
    // ANIMAL CREATED
    // =====================================================

    events.push({
        type: "ANIMAL_CREATED",
        date: animal.createdAt,
        title: "Animal Added",
        description: `${animal.name} (${animal.tagNumber}) was added to the livestock.`,
        details: {
            species: animal.species,
            sex: animal.sex,
            lifeStage: animal.lifeStage,
            breed: animal.breed,
        },
    });

    // =====================================================
    // MILK RECORDS
    // =====================================================

    const milkRecords =
        await prisma.milkRecord.findMany({
            where: {
                animalId: numericAnimalId,
            },
            orderBy: {
                recordDate: "desc",
            },
        });

    milkRecords.forEach((record) => {
        events.push({
            type: "MILK_RECORD",
            date: record.recordDate,
            title: "Milk Record",
            description: `Total milk production was ${record.total} L.`,
            details: {
                morning: record.morning,
                evening: record.evening,
                total: record.total,
                notes: record.notes,
            },
        });
    });

    // =====================================================
    // WEIGHT RECORDS
    // =====================================================

    const weightRecords =
        await prisma.weightRecord.findMany({
            where: {
                animalId: numericAnimalId,
            },
            orderBy: {
                recordDate: "desc",
            },
        });

    weightRecords.forEach((record) => {
        events.push({
            type: "WEIGHT_RECORD",
            date: record.recordDate,
            title: "Weight Record",
            description: `Animal weight was ${record.weight} kg.`,
            details: {
                weight: `${record.weight} kg`,
                notes: record.notes,
            },
        });
    });

    // =====================================================
    // HEALTH RECORDS
    // =====================================================

    const healthRecords =
        await prisma.healthRecord.findMany({
            where: {
                animalId: numericAnimalId,
            },
            orderBy: {
                recordDate: "desc",
            },
        });

    healthRecords.forEach((record) => {
        let title = "Health Record";
        let description = "";

        switch (record.type) {
            case "VACCINATION":
                title =
                    record.vaccineName ||
                    "Vaccination";

                description =
                    "Vaccination recorded.";
                break;

            case "DEWORMING":
                title =
                    record.dewormerName ||
                    "Deworming";

                description =
                    "Deworming recorded.";
                break;

            case "TREATMENT":
                title =
                    record.problem ||
                    "Treatment";

                description =
                    record.diagnosis ||
                    "Treatment recorded.";
                break;

            case "CHECKUP":
                title =
                    record.checkupType ||
                    "Health Checkup";

                description =
                    record.findings ||
                    "Health checkup recorded.";
                break;

            case "OTHER":
                title =
                    record.title ||
                    "Other Health Event";

                description =
                    record.details ||
                    "Other health event recorded.";
                break;

            default:
                description =
                    "Health record added.";
        }

        events.push({
            type: "HEALTH_RECORD",
            date: record.recordDate,
            title,
            description,
            details: {
                type: record.type,
                vaccineName:
                    record.vaccineName,
                dewormerName:
                    record.dewormerName,
                problem: record.problem,
                diagnosis: record.diagnosis,
                medicine:
                    record.treatmentMedicine ||
                    null,
                dose:
                    record.dose ||
                    record.treatmentDose ||
                    null,
                checkupType:
                    record.checkupType,
                findings: record.findings,
                nextDue: record.nextDue,
                nextReview:
                    record.treatmentNextReview,
                notes: record.notes,
            },
        });
    });

    // =====================================================
    // BREEDING RECORDS
    // =====================================================

    const breedingRecords =
        await prisma.breedingRecord.findMany({
            where: {
                animalId: numericAnimalId,
            },
            orderBy: {
                recordDate: "desc",
            },
        });

    breedingRecords.forEach((record) => {
        let title = "Breeding Record";
        let description = "";

        switch (record.type) {
            case "HEAT":
                title = "Heat Detected";

                description =
                    record.heatObservation ||
                    "Heat event recorded.";
                break;

            case "INSEMINATION":
                title = "Insemination";

                description =
                    "Artificial insemination recorded.";
                break;

            case "PREGNANCY_CHECK":
                title =
                    record.pregnancyResult
                        ? "Pregnancy Confirmed"
                        : "Pregnancy Not Confirmed";

                description =
                    record.pregnancyResult
                        ? "Pregnancy check was positive."
                        : "Pregnancy check was negative.";
                break;

            default:
                description =
                    "Breeding event recorded.";
        }

        events.push({
            type: "BREEDING_RECORD",
            date: record.recordDate,
            title,
            description,
            details: {
                type: record.type,
                heatObservation:
                    record.heatObservation,
                semenCode: record.semenCode,
                technician: record.technician,
                pregnancyResult:
                    record.pregnancyResult,
                notes: record.notes,
            },
        });
    });

    // =====================================================
    // CALVING AS MOTHER
    // =====================================================

    const calvingsAsMother =
        await prisma.calvingRecord.findMany({
            where: {
                motherId: numericAnimalId,
            },
            orderBy: {
                calvingDate: "desc",
            },
            include: {
                calf: {
                    select: {
                        id: true,
                        name: true,
                        tagNumber: true,
                    },
                },
            },
        });

    calvingsAsMother.forEach((record) => {
        events.push({
            type: "CALVING_RECORD",
            date: record.calvingDate,
            title: "Calving",
            description: record.calf
                ? `Calf ${record.calf.tagNumber} was linked to this calving.`
                : "Calving recorded. Calf has not been added to livestock.",
            details: {
                calf:
                    record.calf?.tagNumber ||
                    "Not linked",
                notes: record.notes,
            },
        });
    });

    // =====================================================
    // CALVING AS CALF
    // =====================================================

    const calvingAsCalf =
        await prisma.calvingRecord.findMany({
            where: {
                calfId: numericAnimalId,
            },
            orderBy: {
                calvingDate: "desc",
            },
            include: {
                mother: {
                    select: {
                        id: true,
                        name: true,
                        tagNumber: true,
                    },
                },
            },
        });

    calvingAsCalf.forEach((record) => {
        events.push({
            type: "CALVING_RECORD",
            date: record.calvingDate,
            title: "Birth / Calving",
            description: `Born from mother ${record.mother.tagNumber}.`,
            details: {
                mother:
                    record.mother.tagNumber,
                notes: record.notes,
            },
        });
    });

    // =====================================================
    // LACTATION RECORDS
    // =====================================================

    const lactationRecords =
        await prisma.lactationRecord.findMany({
            where: {
                animalId: numericAnimalId,
            },
            orderBy: {
                startDate: "desc",
            },
            include: {
                calf: {
                    select: {
                        tagNumber: true,
                    },
                },
            },
        });

    lactationRecords.forEach((record) => {
        events.push({
            type: "LACTATION_RECORD",
            date: record.startDate,
            title: `Lactation #${record.lactationNumber}`,

            description: record.endDate
                ? `Lactation completed on ${formatDate(
                      record.endDate
                  )}.`
                : "Lactation is currently active.",

            details: {
                lactationNumber:
                    record.lactationNumber,

                startDate:
                    record.startDate,

                endDate:
                    record.endDate,

                totalMilk:
                    record.totalMilk,

                peakMilk:
                    record.peakMilk,

                calf:
                    record.calf?.tagNumber ||
                    "Not linked",

                notes: record.notes,
            },
        });
    });

    // =====================================================
    // SORT ALL EVENTS
    // =====================================================

    events.sort(
        (a, b) =>
            new Date(b.date).getTime() -
            new Date(a.date).getTime()
    );

    return {
        animal,
        events,
    };
};

// =====================================================
// HELPER
// =====================================================

function formatDate(date) {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    );
}

module.exports = {
    getAnimalHistory,
};