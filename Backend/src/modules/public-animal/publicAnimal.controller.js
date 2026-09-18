const publicAnimalService =
    require("./publicAnimal.service");

const getPublicAnimalHistory = async (
    req,
    res,
    next
) => {
    try {
        const { token } = req.params;

        const result =
            await publicAnimalService.getPublicAnimalHistory(
                token
            );

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const generateAnimalQr = async (
    req,
    res,
    next
) => {
    try {
        const { animalId } = req.params;

        const result =
            await publicAnimalService.generateAnimalQr(
                req.user.id,
                Number(animalId)
            );

        return res.status(200).json({
            success: true,
            message: "QR generated successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getPublicAnimalHistory,
    generateAnimalQr,
};