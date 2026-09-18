const prisma = require("../../config/db");

// =====================================================
// START LACTATION
// =====================================================

const createLactation = async (
    userId,
    animalId,
    data
) => {
    const numericUserId = Number(userId);
    const numericAnimalId = Number(animalId);

    const animal = await prisma.animal.findFirst({
        where: {
            id: numericAnimalId,
            userId: numericUserId,
        },
    });

    if (!animal) {
        throw new Error("Animal not found");
    }

    if (animal.sex !== "FEMALE") {
        throw new Error(
            "Lactation can only be recorded for a female animal"
        );
    }

    const activeLactation =
        await prisma.lactationRecord.findFirst({
            where: {
                animalId: numericAnimalId,
                endDate: null,
            },
        });

    if (activeLactation) {
        throw new Error(
            "Animal already has an active lactation"
        );
    }

    // Generate next lactation number
    const lastLactation =
        await prisma.lactationRecord.findFirst({
            where: {
                animalId: numericAnimalId,
            },
            orderBy: {
                lactationNumber: "desc",
            },
        });

    const lactationNumber =
        (lastLactation?.lactationNumber || 0) + 1;

    // Validate calf if supplied
    let calfId = null;

    if (data.calfId) {
        const calf = await prisma.animal.findFirst({
            where: {
                id: Number(data.calfId),
                userId: numericUserId,
            },
        });

        if (!calf) {
            throw new Error("Calf animal not found");
        }

        calfId = calf.id;
    }

    const startDate = new Date(data.startDate);

    const result = await prisma.$transaction(
        async (tx) => {
            const lactation =
                await tx.lactationRecord.create({
                    data: {
                        animalId: numericAnimalId,

                        lactationNumber,

                        startDate,

                        calfId,

                        notes:
                            data.notes?.trim() ||
                            null,
                    },

                    include: {
                        calf: {
                            select: {
                                tagNumber: true,
                            },
                        },
                    },
                });

            await tx.animal.update({
                where: {
                    id: numericAnimalId,
                },

                data: {
                    productionStatus: "LACTATING",
                    lactationNumber,
                    lactationStartDate: startDate,
                },
            });

            return lactation;
        }
    );

    return result;
};

// =====================================================
// GET LACTATIONS
// =====================================================

const getLactationRecords = async (
    userId,
    animalId
) => {
    const numericUserId = Number(userId);
    const numericAnimalId = Number(animalId);

    const animal = await prisma.animal.findFirst({
        where: {
            id: numericAnimalId,
            userId: numericUserId,
        },
    });

    if (!animal) {
        throw new Error("Animal not found");
    }

    return prisma.lactationRecord.findMany({
        where: {
            animalId: numericAnimalId,
        },

        orderBy: {
            lactationNumber: "desc",
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
};

// =====================================================
// CLOSE LACTATION
// =====================================================

const closeLactation = async (
    userId,
    lactationId,
    data
) => {
    const numericUserId = Number(userId);
    const numericLactationId =
        Number(lactationId);

    const lactation =
        await prisma.lactationRecord.findFirst({
            where: {
                id: numericLactationId,

                animal: {
                    userId: numericUserId,
                },
            },

            include: {
                animal: true,
            },
        });

    if (!lactation) {
        throw new Error(
            "Lactation record not found"
        );
    }

    if (lactation.endDate) {
        throw new Error(
            "Lactation is already closed"
        );
    }

    const endDate = new Date(data.endDate);

    if (endDate < lactation.startDate) {
        throw new Error(
            "End date cannot be before start date"
        );
    }

    const result = await prisma.$transaction(
        async (tx) => {
            const updated =
                await tx.lactationRecord.update({
                    where: {
                        id: numericLactationId,
                    },

                    data: {
                        endDate,

                        totalMilk:
                            data.totalMilk ??
                            null,

                        peakMilk:
                            data.peakMilk ??
                            null,

                        notes:
                            data.notes?.trim() ||
                            lactation.notes,
                    },
                });

            await tx.animal.update({
                where: {
                    id: lactation.animalId,
                },

                data: {
                    productionStatus: "DRY",
                },
            });

            return updated;
        }
    );

    return result;
};

module.exports = {
    createLactation,
    getLactationRecords,
    closeLactation,
};