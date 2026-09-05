const prisma = require("../../config/db");

const createAnimal = async (userId, data) => {
    const {
        name,
        tagNumber,
        species,
        sex,
        lifeStage,
        breed,
        dateOfBirth,
        weight,

        motherSource = "UNKNOWN",
        motherId,
        motherExternalName,
        motherExternalBreed,
        motherExternalTag,

        fatherSource = "UNKNOWN",
        fatherId,
        fatherExternalName,
        fatherExternalBreed,
        fatherExternalTag,

        productionStatus = "NOT_APPLICABLE",
        lactationNumber,
        lactationStartDate,
        currentMilkProduction,

        pregnancyStatus = "NOT_APPLICABLE",
        lastCalvingDate,
        expectedCalvingDate,

        notes,
    } = data;

    const existing = await prisma.animal.findFirst({
        where: {
            userId,
            tagNumber,
        },
    });

    if (existing) {
        throw new Error(
            "Animal with this tag number already exists"
        );
    }

    // Validate internal mother
    if (motherSource === "EXISTING") {
        if (!motherId) {
            throw new Error(
                "Mother is required when source is EXISTING"
            );
        }

        const mother = await prisma.animal.findFirst({
            where: {
                id: Number(motherId),
                userId,
                sex: "FEMALE",
            },
        });

        if (!mother) {
            throw new Error(
                "Selected mother not found"
            );
        }
    }

    // Validate internal father
    if (fatherSource === "EXISTING") {
        if (!fatherId) {
            throw new Error(
                "Father is required when source is EXISTING"
            );
        }

        const father = await prisma.animal.findFirst({
            where: {
                id: Number(fatherId),
                userId,
                sex: "MALE",
            },
        });

        if (!father) {
            throw new Error(
                "Selected father not found"
            );
        }
    }

    // External parent validation
    if (
        motherSource === "EXTERNAL" &&
        !motherExternalName
    ) {
        throw new Error(
            "External mother name is required"
        );
    }

    if (
        fatherSource === "EXTERNAL" &&
        !fatherExternalName
    ) {
        throw new Error(
            "External father name is required"
        );
    }

    return prisma.animal.create({
        data: {
            userId,

            name,
            tagNumber,
            species,
            sex,
            lifeStage,

            breed: breed || null,
            dateOfBirth: dateOfBirth
                ? new Date(dateOfBirth)
                : null,
            weight: weight ?? null,

            motherSource,
            motherId:
                motherSource === "EXISTING"
                    ? Number(motherId)
                    : null,

            motherExternalName:
                motherSource === "EXTERNAL"
                    ? motherExternalName || null
                    : null,

            motherExternalBreed:
                motherSource === "EXTERNAL"
                    ? motherExternalBreed || null
                    : null,

            motherExternalTag:
                motherSource === "EXTERNAL"
                    ? motherExternalTag || null
                    : null,

            fatherSource,
            fatherId:
                fatherSource === "EXISTING"
                    ? Number(fatherId)
                    : null,

            fatherExternalName:
                fatherSource === "EXTERNAL"
                    ? fatherExternalName || null
                    : null,

            fatherExternalBreed:
                fatherSource === "EXTERNAL"
                    ? fatherExternalBreed || null
                    : null,

            fatherExternalTag:
                fatherSource === "EXTERNAL"
                    ? fatherExternalTag || null
                    : null,

            productionStatus,

            lactationNumber:
                lactationNumber ?? null,

            lactationStartDate:
                lactationStartDate
                    ? new Date(lactationStartDate)
                    : null,

            currentMilkProduction:
                currentMilkProduction ?? null,

            pregnancyStatus,

            lastCalvingDate:
                lastCalvingDate
                    ? new Date(lastCalvingDate)
                    : null,

            expectedCalvingDate:
                expectedCalvingDate
                    ? new Date(expectedCalvingDate)
                    : null,

            notes: notes || null,
        },
    });
};

const getAnimals = async (userId) => {
    return prisma.animal.findMany({
        where: { userId },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            mother: {
                select: {
                    id: true,
                    name: true,
                    tagNumber: true,
                },
            },
            father: {
                select: {
                    id: true,
                    name: true,
                    tagNumber: true,
                },
            },
        },
    });
};

const getAnimalById = async (userId, id) => {
    const animal = await prisma.animal.findFirst({
        where: {
            id: Number(id),
            userId,
        },
        include: {
            mother: true,
            father: true,
            childrenByMother: true,
            childrenByFather: true,
        },
    });

    if (!animal) {
        throw new Error("Animal not found");
    }

    return animal;
};

const deleteAnimal = async (userId, id) => {
    const animal = await prisma.animal.findFirst({
        where: {
            id: Number(id),
            userId,
        },
    });

    if (!animal) {
        throw new Error("Animal not found");
    }

    return prisma.animal.delete({
        where: {
            id: animal.id,
        },
    });
};

const updateAnimal = async (userId, id, data) => {
    const animal = await prisma.animal.findFirst({
        where: {
            id: Number(id),
            userId,
        },
    });

    if (!animal) {
        throw new Error("Animal not found");
    }

    return prisma.animal.update({
        where: {
            id: animal.id,
        },
        data,
    });
};

module.exports = {
    createAnimal,
    getAnimals,
    getAnimalById,
    deleteAnimal,
    updateAnimal
};