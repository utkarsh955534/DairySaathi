const prisma = require("../../config/db");

// =====================================================
// CREATE CALVING
// =====================================================

const createCalving = async (
    userId,
    motherId,
    data
) => {
    const numericUserId = Number(userId);
    const numericMotherId = Number(motherId);

    const mother = await prisma.animal.findFirst({
        where: {
            id: numericMotherId,
            userId: numericUserId,
        },
    });

    if (!mother) {
        throw new Error("Mother animal not found");
    }

    if (mother.sex !== "FEMALE") {
        throw new Error(
            "Calving can only be recorded for a female animal"
        );
    }

    const calvingDate = new Date(
        data.calvingDate
    );

    const calving = await prisma.calvingRecord.create({
        data: {
            motherId: numericMotherId,
            calvingDate,
            notes: data.notes?.trim() || null,
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

    return {
        id: calving.id,
        calvingDate: calving.calvingDate,
        notes: calving.notes,

        mother: {
            name: calving.mother.name,
            tagNumber: calving.mother.tagNumber,
        },

        calf: null,
    };
};

// =====================================================
// GET CALVINGS
// =====================================================

const getCalvingRecords = async (
    userId,
    motherId
) => {
    const numericUserId = Number(userId);
    const numericMotherId = Number(motherId);

    const mother = await prisma.animal.findFirst({
        where: {
            id: numericMotherId,
            userId: numericUserId,
        },
    });

    if (!mother) {
        throw new Error("Mother animal not found");
    }

    return prisma.calvingRecord.findMany({
        where: {
            motherId: numericMotherId,
        },

        orderBy: {
            calvingDate: "desc",
        },

        include: {
            mother: {
                select: {
                    name: true,
                    tagNumber: true,
                },
            },

            calf: {
                select: {
                    id: true,
                    name: true,
                    tagNumber: true,
                    species: true,
                    sex: true,
                    lifeStage: true,
                },
            },
        },
    });
};

// =====================================================
// LINK EXISTING CALF
// =====================================================

const linkExistingCalf = async (
    userId,
    calvingId,
    calfId
) => {
    const numericUserId = Number(userId);
    const numericCalvingId = Number(calvingId);
    const numericCalfId = Number(calfId);

    const calving =
        await prisma.calvingRecord.findFirst({
            where: {
                id: numericCalvingId,

                mother: {
                    userId: numericUserId,
                },
            },

            include: {
                mother: true,
            },
        });

    if (!calving) {
        throw new Error("Calving record not found");
    }

    const calf = await prisma.animal.findFirst({
        where: {
            id: numericCalfId,
            userId: numericUserId,
        },
    });

    if (!calf) {
        throw new Error("Calf animal not found");
    }

    if (calf.id === calving.motherId) {
        throw new Error(
            "Mother cannot be linked as her own calf"
        );
    }

    if (
        calf.motherId &&
        calf.motherId !== calving.motherId
    ) {
        throw new Error(
            "This animal is already linked to another mother"
        );
    }

    const result = await prisma.$transaction(
        async (tx) => {
            const updatedCalving =
                await tx.calvingRecord.update({
                    where: {
                        id: numericCalvingId,
                    },

                    data: {
                        calfId: numericCalfId,
                    },
                });

            await tx.animal.update({
                where: {
                    id: numericCalfId,
                },

                data: {
                    motherId: calving.motherId,
                    motherSource: "EXISTING",
                },
            });

            return updatedCalving;
        }
    );

    return result;
};

// =====================================================
// ADD NEW CALF
// =====================================================

const createNewCalf = async (
    userId,
    calvingId,
    tagNumber
) => {
    const numericUserId = Number(userId);
    const numericCalvingId = Number(calvingId);

    const cleanTagNumber =
        tagNumber.trim();

    const calving =
        await prisma.calvingRecord.findFirst({
            where: {
                id: numericCalvingId,

                mother: {
                    userId: numericUserId,
                },
            },

            include: {
                mother: true,
            },
        });

    if (!calving) {
        throw new Error("Calving record not found");
    }

    if (calving.calfId) {
        throw new Error(
            "A calf is already linked to this calving"
        );
    }

    const existingAnimal =
        await prisma.animal.findFirst({
            where: {
                userId: numericUserId,
                tagNumber: cleanTagNumber,
            },
        });

    if (existingAnimal) {
        throw new Error(
            "This tag number is already assigned to an animal"
        );
    }

    const result = await prisma.$transaction(
        async (tx) => {
            const calf =
                await tx.animal.create({
                    data: {
                        userId: numericUserId,

                        // Until farmer gives an actual name
                        name: cleanTagNumber,

                        tagNumber: cleanTagNumber,

                        // Derived from mother
                        species:
                            calving.mother.species,

                        lifeStage: "CALF",

                        dateOfBirth:
                            calving.calvingDate,

                        motherSource:
                            "EXISTING",

                        motherId:
                            calving.motherId,

                        productionStatus:
                            "NOT_APPLICABLE",

                        pregnancyStatus:
                            "NOT_APPLICABLE",
                    },
                });

            const updatedCalving =
                await tx.calvingRecord.update({
                    where: {
                        id: numericCalvingId,
                    },

                    data: {
                        calfId: calf.id,
                    },
                });

            return {
                calf,
                calving: updatedCalving,
            };
        }
    );

    return {
        calf: result.calf,
        calving: result.calving,
    };
};

module.exports = {
    createCalving,
    getCalvingRecords,
    linkExistingCalf,
    createNewCalf,
};