const animalService = require("./animal.service");

const createAnimal = async (req, res, next) => {
    try {
        const animal = await animalService.createAnimal(
            req.user.id,
            req.body
        );

        res.status(201).json({
            success: true,
            message: "Animal added successfully",
            data: animal,
        });
    } catch (error) {
        next(error);
    }
};

const getAnimals = async (req, res, next) => {
    try {
        const animals = await animalService.getAnimals(
            req.user.id
        );

        res.status(200).json({
            success: true,
            data: animals,
        });
    } catch (error) {
        next(error);
    }
};

const getAnimalById = async (req, res, next) => {
    try {
        const animal =
            await animalService.getAnimalById(
                req.user.id,
                req.params.id
            );

        res.status(200).json({
            success: true,
            data: animal,
        });
    } catch (error) {
        next(error);
    }
};

const deleteAnimal = async (req, res, next) => {
    try {
        await animalService.deleteAnimal(
            req.user.id,
            req.params.id
        );

        res.status(200).json({
            success: true,
            message: "Animal deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};


const updateAnimal = async (req, res, next) => {
    try {
        const animal = await animalService.updateAnimal(
            req.user.id,
            req.params.id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Animal updated successfully",
            data: animal,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createAnimal,
    getAnimals,
    getAnimalById,
    deleteAnimal,
    updateAnimal
};