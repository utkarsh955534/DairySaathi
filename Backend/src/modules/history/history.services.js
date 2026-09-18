const prisma = require("../../config/db");

const getAnimalHistory = async (userId, animalId) => {
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

            motherSource: true,
            motherId: true,
            motherExternalName: true,
            motherExternalBreed: true,
            motherExternalTag: true,

            fatherSource: true,
            fatherId: true,
            fatherExternalName: true,
            fatherExternalBreed: true,
            fatherExternalTag: true,

            productionStatus: true,
            lactationNumber: true,
            lactationStartDate: true,
            currentMilkProduction: true,

            pregnancyStatus: true,
            lastCalvingDate: true,
            expectedCalvingDate: true,

            notes: true,

            createdAt: true,
            updatedAt: true,
        },
    });

    if (!animal) {
        throw new Error("Animal not found");
    }

    // =========================
    // MILK RECORDS
    // =========================

    const milkRecords = await prisma.milkRecord.findMany({
        where: {
            animalId: numericAnimalId,
        },

        orderBy: {
            recordDate: "desc",
        },
    });

    // =========================
    // ANIMAL CREATED EVENT
    // =========================

    const events = [
        {
            type: "ANIMAL_CREATED",
            date: animal.createdAt,
            title: "Animal Added",
            description: `${animal.name} (${animal.tagNumber}) was added to the farm.`,
            details: {
                species: animal.species,
                sex: animal.sex,
                lifeStage: animal.lifeStage,
                breed: animal.breed,
            },
        },
    ];

    // =========================
    // MILK EVENTS
    // =========================

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

    // =========================
    // SORT ALL EVENTS
    // =========================

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

module.exports = {
    getAnimalHistory,
};