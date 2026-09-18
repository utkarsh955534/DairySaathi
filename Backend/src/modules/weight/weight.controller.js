const weightService = require("./weight.service");

const createWeightRecord = async (
    req,
    res,
    next
) => {
    try {
        const { animalId } = req.params;

        const record =
            await weightService.createWeightRecord(
                req.user.id,
                animalId,
                req.body
            );

        return res.status(201).json({
            success: true,
            message:
                "Weight record created successfully",
            data: record,
        });
    } catch (error) {
        next(error);
    }
};

const getWeightRecords = async (
    req,
    res,
    next
) => {
    try {
        const { animalId } = req.params;

        const records =
            await weightService.getWeightRecords(
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
    createWeightRecord,
    getWeightRecords,
};