const milkService = require("./milk.service");

const createMilkRecord = async (
    req,
    res,
    next
) => {
    try {
        const { animalId } = req.params;

        const record =
            await milkService.createMilkRecord(
                req.user.id,
                animalId,
                req.body
            );

        return res.status(201).json({
            success: true,
            message:
                "Milk record created successfully",
            data: record,
        });
    } catch (error) {
        next(error);
    }
};

const getMilkRecords = async (
    req,
    res,
    next
) => {
    try {
        const { animalId } = req.params;

        const records =
            await milkService.getMilkRecords(
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
    createMilkRecord,
    getMilkRecords,
};