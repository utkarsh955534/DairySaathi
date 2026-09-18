const prisma = require("../../config/db");

const createBreedingRecord = async (
    userId,
    animalId,
    data
) => {
    const numericUserId = Number(userId);
    const numericAnimalId = Number(animalId);

    // =========================
    // CHECK ANIMAL
    // =========================

    const animal = await prisma.animal.findFirst({
        where: {
            id: numericAnimalId,
            userId: numericUserId,
        },
    });

    if (!animal) {
        throw new Error("Animal not found");
    }

    // =========================
    // TYPE VALIDATION
    // =========================

    if (
        data.type === "HEAT" &&
        !data.heatObservation?.trim()
    ) {
        throw new Error(
            "Heat observation is required"
        );
    }

    if (
        data.type === "INSEMINATION" &&
        !data.semenCode?.trim()
    ) {
        throw new Error(
            "Semen code is required"
        );
    }

    if (
        data.type === "PREGNANCY_CHECK" &&
        typeof data.pregnancyResult !== "boolean"
    ) {
        throw new Error(
            "Pregnancy result is required"
        );
    }

    // =========================
    // CREATE RECORD
    // =========================

    const record =
        await prisma.breedingRecord.create({
            data: {
                animalId: numericAnimalId,

                type: data.type,

                recordDate: new Date(
                    data.recordDate
                ),

                heatObservation:
                    data.heatObservation?.trim() ||
                    null,

                semenCode:
                    data.semenCode?.trim() ||
                    null,

                technician:
                    data.technician?.trim() ||
                    null,

                pregnancyResult:
                    data.pregnancyResult ??
                    null,

                notes:
                    data.notes?.trim() ||
                    null,
            },
        });

    // =========================
    // UPDATE ANIMAL STATUS
    // =========================

    if (
        data.type === "PREGNANCY_CHECK"
    ) {
        await prisma.animal.update({
            where: {
                id: numericAnimalId,
            },
            data: {
                pregnancyStatus:
                    data.pregnancyResult
                        ? "PREGNANT"
                        : "NOT_PREGNANT",
            },
        });
    }

    return record;
};

const getBreedingRecords = async (
    userId,
    animalId
) => {
    const numericUserId = Number(userId);
    const numericAnimalId = Number(animalId);

    // =========================
    // CHECK ANIMAL
    // =========================

    const animal = await prisma.animal.findFirst({
        where: {
            id: numericAnimalId,
            userId: numericUserId,
        },
    });

    if (!animal) {
        throw new Error("Animal not found");
    }

    // =========================
    // GET RECORDS
    // =========================

    return prisma.breedingRecord.findMany({
        where: {
            animalId: numericAnimalId,
        },
        orderBy: {
            recordDate: "desc",
        },
    });
};

module.exports = {
    createBreedingRecord,
    getBreedingRecords,
};