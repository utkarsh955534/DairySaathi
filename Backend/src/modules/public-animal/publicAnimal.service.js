const crypto = require("crypto");

const prisma = require("../../config/db");

// =====================================================
// GENERATE QR
// =====================================================

const generateAnimalQr = async (
    userId,
    animalId
) => {
    const animal = await prisma.animal.findFirst({
        where: {
            id: animalId,
            userId,
        },
        select: {
            tagNumber: true,
            publicToken: true,
        },
    });

    if (!animal) {
        const error = new Error(
            "Animal not found"
        );

        error.statusCode = 404;

        throw error;
    }

    // -------------------------------------------------
    // Generate public token only once
    // -------------------------------------------------

    let publicToken = animal.publicToken;

    if (!publicToken) {
        publicToken = crypto
            .randomBytes(24)
            .toString("hex");

        await prisma.animal.update({
            where: {
                id: animalId,
            },
            data: {
                publicToken,
            },
        });
    }

    // -------------------------------------------------
    // Create public URL
    // -------------------------------------------------

    const frontendUrl =
        process.env.FRONTEND_URL ||
        "http://localhost:3000";

    const publicUrl =
        `${frontendUrl}/animal/${publicToken}`;

    return {
        tagNumber: animal.tagNumber,
        publicToken,
        publicUrl,
    };
};

// =====================================================
// GET PUBLIC ANIMAL HISTORY
// =====================================================

const getPublicAnimalHistory = async (
    publicToken
) => {
    if (!publicToken) {
        throw new Error(
            "Public token is required"
        );
    }

    // =====================================================
    // FIND ANIMAL
    // =====================================================

    const animal =
        await prisma.animal.findUnique({
            where: {
                publicToken,
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

                mother: {
                    select: {
                        tagNumber: true,
                        name: true,
                    },
                },

                father: {
                    select: {
                        tagNumber: true,
                        name: true,
                    },
                },

                productionStatus: true,
                lactationNumber: true,
                lactationStartDate: true,
                currentMilkProduction: true,

                pregnancyStatus: true,
                lastCalvingDate: true,
                expectedCalvingDate: true,

                notes: true,

                createdAt: true,
            },
        });

    if (!animal) {
        throw new Error(
            "Animal not found"
        );
    }

    // =====================================================
    // MILK
    // =====================================================

    const milkRecords =
        await prisma.milkRecord.findMany({
            where: {
                animalId: animal.id,
            },
            orderBy: {
                recordDate: "desc",
            },
        });

    // =====================================================
    // WEIGHT
    // =====================================================

    const weightRecords =
        await prisma.weightRecord.findMany({
            where: {
                animalId: animal.id,
            },
            orderBy: {
                recordDate: "desc",
            },
        });

    // =====================================================
    // HEALTH
    // =====================================================

    const healthRecords =
        await prisma.healthRecord.findMany({
            where: {
                animalId: animal.id,
            },
            orderBy: {
                recordDate: "desc",
            },
        });

    // =====================================================
    // BREEDING
    // =====================================================

    const breedingRecords =
        await prisma.breedingRecord.findMany({
            where: {
                animalId: animal.id,
            },
            orderBy: {
                recordDate: "desc",
            },
        });

    // =====================================================
    // CALVING
    // =====================================================

    const calvingRecords =
        await prisma.calvingRecord.findMany({
            where: {
                motherId: animal.id,
            },
            orderBy: {
                calvingDate: "desc",
            },
            include: {
                calf: {
                    select: {
                        name: true,
                        tagNumber: true,
                    },
                },
            },
        });

    // =====================================================
    // LACTATION
    // =====================================================

    const lactationRecords =
        await prisma.lactationRecord.findMany({
            where: {
                animalId: animal.id,
            },
            orderBy: {
                startDate: "desc",
            },
            include: {
                calf: {
                    select: {
                        name: true,
                        tagNumber: true,
                    },
                },
            },
        });

    // =====================================================
    // RESPONSE
    // =====================================================

    return {
        animal,
        history: {
            milk: milkRecords,
            weight: weightRecords,
            health: healthRecords,
            breeding: breedingRecords,
            calving: calvingRecords,
            lactation: lactationRecords,
        },
    };
};

module.exports = {
    generateAnimalQr,
    getPublicAnimalHistory,
};