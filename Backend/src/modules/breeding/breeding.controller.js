const breedingService = require("./breeding.service");

const createBreedingRecord = async (
    req,
    res,
    next
) => {
    try {
        const { animalId } = req.params;

        const record =
            await breedingService.createBreedingRecord(
                req.user.id,
                animalId,
                req.body
            );

        return res.status(201).json({
            success: true,
            message:
                "Breeding record created successfully",
            data: record,
        });
    } catch (error) {
        next(error);
    }
};

const getBreedingRecords = async (
    req,
    res,
    next
) => {
    try {
        const { animalId } = req.params;

        const records =
            await breedingService.getBreedingRecords(
                req.user.id,
                animalId
            );

        return res.status(200).json({
            success: true,
            data: records,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createBreedingRecord,
    getBreedingRecords,
};