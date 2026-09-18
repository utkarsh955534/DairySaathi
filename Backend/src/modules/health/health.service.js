const prisma = require("../../config/db");

const createHealthRecord = async (
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

    const record = await prisma.healthRecord.create({
        data: {
            animalId: numericAnimalId,
            type: data.type,
            recordDate: new Date(data.recordDate),

            // Vaccination
            vaccineName: data.vaccineName || null,

            // Deworming
            dewormerName: data.dewormerName || null,

            // Treatment
            problem: data.problem || null,
            diagnosis: data.diagnosis || null,
            treatmentMedicine:
                data.treatmentMedicine || null,
            treatmentDose:
                data.treatmentDose || null,
            treatmentNextReview:
                data.treatmentNextReview
                    ? new Date(data.treatmentNextReview)
                    : null,

            // Checkup
            checkupType:
                data.checkupType || null,
            findings:
                data.findings || null,

            // Vaccination / Deworming
            dose: data.dose || null,
            nextDue: data.nextDue
                ? new Date(data.nextDue)
                : null,

            // Other
            title: data.title || null,
            details: data.details || null,

            // Common
            notes: data.notes || null,
        },
    });

    return record;
};

const getHealthRecords = async (
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

    return prisma.healthRecord.findMany({
        where: {
            animalId: numericAnimalId,
        },
        orderBy: {
            recordDate: "desc",
        },
    });
};

module.exports = {
    createHealthRecord,
    getHealthRecords,
};