import { AppDataSource } from "../config/data-source.js";
import { RequestEntity } from "../entities/Request.js"; // Use RequestEntity
import { Software } from "../entities/Software.js";
import { User } from "../entities/User.js";

const requestRepository = AppDataSource.getRepository(RequestEntity);
const softwareRepository = AppDataSource.getRepository(Software);
const userRepository = AppDataSource.getRepository(User);

export const createRequest = async (req, res) => {
    const { softwareId, accessType, reason } = req.body;
    const userId = req.user.id; 

    if (!softwareId || !accessType || !reason) {
        return res.status(400).json({ message: "Software ID, access type, and reason are required" });
    }

    try {
        const software = await softwareRepository.findOneBy({ id: parseInt(softwareId) });
        if (!software) {
            return res.status(404).json({ message: "Software not found" });
        }
        if (!software.accessLevels.includes(accessType)) {
            return res.status(400).json({ message: `Access type '${accessType}' is not available for this software.`})
        }

        const user = await userRepository.findOneBy({ id: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found (should not happen if authenticated)" });
        }

        const newRequest = requestRepository.create({
            user,
            software,
            accessType,
            reason,
            status: "Pending", 
        });
        await requestRepository.save(newRequest);
        res.status(201).json({ message: "Access request submitted successfully", request: newRequest });
    } catch (error) {
        console.error("Create request error:", error);
        res.status(500).json({ message: "Server error submitting request" });
    }
};

export const getPendingRequests = async (req, res) => { 
    try {
        const pendingRequests = await requestRepository.find({
            where: { status: "Pending" },
            relations: ["user", "software"], 
            select: { 
                user: { id: true, username: true },
                software: { id: true, name: true },
                id: true, accessType: true, reason: true, status: true, requestedAt: true // explicit select for request
            }
        });
        res.json(pendingRequests);
    } catch (error) {
        console.error("Get pending requests error:", error);
        res.status(500).json({ message: "Server error fetching pending requests" });
    }
};

export const getUserRequests = async (req, res) => { 
    const userId = req.user.id;
    try {
        const userRequests = await requestRepository.find({
            where: { user: { id: userId } },
            relations: ["software"],
             select: {
                software: { id: true, name: true },
                id: true, accessType: true, reason: true, status: true, requestedAt: true // explicit select for request
            }
        });
        res.json(userRequests);
    } catch (error) {
        console.error("Get user requests error:", error);
        res.status(500).json({ message: "Server error fetching user requests" });
    }
};

export const updateRequestStatus = async (req, res) => { 
    const { id } = req.params;
    const { status } = req.body; 

    if (!status || !["Approved", "Rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status. Must be 'Approved' or 'Rejected'" });
    }

    try {
        const requestToUpdate = await requestRepository.findOneBy({ id: parseInt(id) });
        if (!requestToUpdate) {
            return res.status(404).json({ message: "Request not found" });
        }

        if (requestToUpdate.status !== "Pending") {
             return res.status(400).json({ message: "Request has already been processed." });
        }

        requestToUpdate.status = status;
        await requestRepository.save(requestToUpdate);
        res.json({ message: `Request ${status.toLowerCase()} successfully`, request: requestToUpdate });
    } catch (error) {
        console.error("Update request status error:", error);
        res.status(500).json({ message: "Server error updating request status" });
    }
};
