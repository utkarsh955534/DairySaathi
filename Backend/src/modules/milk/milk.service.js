const prisma = require("../../config/db");

const createMilkRecord = async (
    userId,
    animalId,
    data
) => {
    const animal = await prisma.animal.findFirst({
        where: {
            id: Number(animalId),
            userId: Number(userId),
        },
    });

    if (!animal) {
        throw new Error("Animal not found");
    }

    const morning = data.morning ?? 0;
    const evening = data.evening ?? 0;

    if (morning === 0 && evening === 0) {
        throw new Error(
            "At least morning or evening milk is required"
        );
    }

    const total = morning + evening;

    const existingRecord =
        await prisma.milkRecord.findUnique({
            where: {
                animalId_recordDate: {
                    animalId: Number(animalId),
                    recordDate: new Date(data.recordDate),
                },
            },
        });

    if (existingRecord) {
        throw new Error(
            "Milk record already exists for this date"
        );
    }

    return prisma.milkRecord.create({
        data: {
            animalId: Number(animalId),
            recordDate: new Date(data.recordDate),
            morning:
                data.morning ?? null,
            evening:
                data.evening ?? null,
            total,
            notes: data.notes || null,
        },
    });
};

const getMilkRecords = async (
    userId,
    animalId
) => {
    const animal = await prisma.animal.findFirst({
        where: {
            id: Number(animalId),
            userId: Number(userId),
        },
    });

    if (!animal) {
        throw new Error("Animal not found");
    }

    return prisma.milkRecord.findMany({
        where: {
            animalId: Number(animalId),
        },
        orderBy: {
            recordDate: "desc",
        },
    });
};

module.exports = {
    createMilkRecord,
    getMilkRecords,
};