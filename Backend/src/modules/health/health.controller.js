const healthService = require("./health.service");

const createHealthRecord = async (
    req,
    res,
    next
) => {
    try {
        const { animalId } = req.params;

        const record =
            await healthService.createHealthRecord(
                req.user.id,
                animalId,
                req.body
            );

        return res.status(201).json({
            success: true,
            message:
                "Health record created successfully",
            data: record,
        });
    } catch (error) {
        next(error);
    }
};

const getHealthRecords = async (
    req,
    res,
    next
) => {
    try {
        const { animalId } = req.params;

        const records =
            await healthService.getHealthRecords(
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
    createHealthRecord,
    getHealthRecords,
};