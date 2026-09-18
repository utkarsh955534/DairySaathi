const lactationService =
    require("./lactation.service");

const createLactation = async (
    req,
    res,
    next
) => {
    try {
        const { animalId } = req.params;

        const result =
            await lactationService.createLactation(
                req.user.id,
                animalId,
                req.body
            );

        return res.status(201).json({
            success: true,
            message:
                "Lactation started successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const getLactationRecords = async (
    req,
    res,
    next
) => {
    try {
        const { animalId } = req.params;

        const records =
            await lactationService.getLactationRecords(
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

const closeLactation = async (
    req,
    res,
    next
) => {
    try {
        const { lactationId } =
            req.params;

        const result =
            await lactationService.closeLactation(
                req.user.id,
                lactationId,
                req.body
            );

        return res.status(200).json({
            success: true,
            message:
                "Lactation closed successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createLactation,
    getLactationRecords,
    closeLactation,
};