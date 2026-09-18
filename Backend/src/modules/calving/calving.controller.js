const calvingService = require("./calving.service");

// =====================================================
// CREATE CALVING
// =====================================================

const createCalving = async (
    req,
    res,
    next
) => {
    try {
        const { animalId } =
            req.params;

        const result =
            await calvingService.createCalving(
                req.user.id,
                animalId,
                req.body
            );

        return res.status(201).json({
            success: true,
            message:
                "Calving record created successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

// =====================================================
// GET CALVINGS
// =====================================================

const getCalvingRecords = async (
    req,
    res,
    next
) => {
    try {
        const { animalId } =
            req.params;

        const records =
            await calvingService.getCalvingRecords(
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

// =====================================================
// LINK EXISTING CALF
// =====================================================

const linkExistingCalf = async (
    req,
    res,
    next
) => {
    try {
        const { calvingId } =
            req.params;

        const { calfId } =
            req.body;

        const result =
            await calvingService.linkExistingCalf(
                req.user.id,
                calvingId,
                calfId
            );

        return res.status(200).json({
            success: true,
            message:
                "Existing calf linked successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

// =====================================================
// ADD NEW CALF
// =====================================================

const createNewCalf = async (
    req,
    res,
    next
) => {
    try {
        const { calvingId } =
            req.params;

        const { tagNumber } =
            req.body;

        const result =
            await calvingService.createNewCalf(
                req.user.id,
                calvingId,
                tagNumber
            );

        return res.status(201).json({
            success: true,
            message:
                "Calf added to livestock successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createCalving,
    getCalvingRecords,
    linkExistingCalf,
    createNewCalf,
};