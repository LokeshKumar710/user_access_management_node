import { AppDataSource } from "../config/data-source.js";
import { Software } from "../entities/Software.js";

const softwareRepository = AppDataSource.getRepository(Software);

export const createSoftware = async (req, res) => {
    const { name, description, accessLevels } = req.body;

    if (!name || !description || !accessLevels || !Array.isArray(accessLevels) || accessLevels.length === 0) {
        return res.status(400).json({ message: "Name, description, and accessLevels (array) are required" });
    }
    const validLevels = ["Read", "Write", "Admin"];
    if (!accessLevels.every(level => validLevels.includes(level))) {
        return res.status(400).json({ message: `Access levels can only be: ${validLevels.join(', ')}` });
    }

    try {
        const existingSoftware = await softwareRepository.findOneBy({ name });
        if (existingSoftware) {
            return res.status(400).json({ message: "Software with this name already exists." });
        }

        const newSoftware = softwareRepository.create({
            name,
            description,
            accessLevels,
        });
        await softwareRepository.save(newSoftware);
        res.status(201).json({ message: "Software created successfully", software: newSoftware });
    } catch (error) {
        console.error("Create software error:", error);
        res.status(500).json({ message: "Server error creating software" });
    }
};

export const getAllSoftware = async (req, res) => {
    try {
        const allSoftware = await softwareRepository.find();
        res.json(allSoftware);
    } catch (error) {
        console.error("Get all software error:", error);
        res.status(500).json({ message: "Server error fetching software" });
    }
};
