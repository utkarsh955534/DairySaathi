const prisma = require("../../config/db");

const createWeightRecord = async (
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
    // CHECK DUPLICATE
    // =========================

    const recordDate = new Date(data.recordDate);

    const existingRecord =
        await prisma.weightRecord.findUnique({
            where: {
                animalId_recordDate: {
                    animalId: numericAnimalId,
                    recordDate,
                },
            },
        });

    if (existingRecord) {
        throw new Error(
            "Weight record already exists for this date"
        );
    }

    // =========================
    // CREATE RECORD
    // =========================

    const record = await prisma.weightRecord.create({
        data: {
            animalId: numericAnimalId,
            recordDate,
            weight: data.weight,
            notes: data.notes?.trim() || null,
        },
    });

    // =========================
    // UPDATE CURRENT WEIGHT
    // =========================

    await prisma.animal.update({
        where: {
            id: numericAnimalId,
        },
        data: {
            weight: data.weight,
        },
    });

    return record;
};

const getWeightRecords = async (
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

    return prisma.weightRecord.findMany({
        where: {
            animalId: numericAnimalId,
        },
        orderBy: {
            recordDate: "desc",
        },
    });
};

module.exports = {
    createWeightRecord,
    getWeightRecords,
};