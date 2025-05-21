// backend/src/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/data-source.js";
import { User } from "../entities/User.js";
import dotenv from "dotenv";

dotenv.config();
const userRepository = AppDataSource.getRepository(User);

export const signup = async (req, res) => {
    // Destructure 'role' from req.body
    const { username, password, role } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Optional: Validate the provided role if you want to be strict
    const allowedRoles = ["Employee", "Manager" /*, "Admin" */]; // Define which roles can be set via this signup
    if (role && !allowedRoles.includes(role)) {
        return res.status(400).json({ message: "Invalid role specified." });
    }

    try {
        const existingUser = await userRepository.findOneBy({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = userRepository.create({
            username,
            password: hashedPassword,
            // Use the provided 'role', or default to 'Employee' if 'role' is not sent
            // or if you want to enforce a default despite the frontend sending something.
            // For this example, we'll use the role from the request, falling back to 'Employee'.
            role: role || "Employee", 
        });
        await userRepository.save(newUser);

        res.status(201).json({ message: "User registered successfully", userId: newUser.id });
    } catch (error) {
        console.error("Signup error:", error);
        // Check for specific database errors if needed, e.g., enum constraint violation
        if (error.message && error.message.includes('invalid input value for enum roles_role_enum')) {
             return res.status(400).json({ message: "Invalid role specified." });
        }
        res.status(500).json({ message: "Server error during registration" });
    }
};

// ... (login function remains the same)

export const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        const user = await userRepository.findOneBy({ username });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials (user not found)" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials (password mismatch)" });
        }

        const tokenPayload = {
            id: user.id,
            username: user.username,
            role: user.role,
        };

        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
            expiresIn: "1h", 
        });

        res.json({
            message: "Login successful",
            token,
            user: { 
                id: user.id,
                username: user.username,
                role: user.role,
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error during login" });
    }
};
