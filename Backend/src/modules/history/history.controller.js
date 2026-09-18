const historyService = require("./history.services");

const getAnimalHistory = async (req, res, next) => {
    try {
        const { animalId } = req.params;

        const result = await historyService.getAnimalHistory(
            req.user.id,
            animalId
        );

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAnimalHistory,
};