import app from "./app.js";
import { AppDataSource } from "./config/data-source.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { User } from "./entities/User.js";


dotenv.config();

const PORT = process.env.PORT || 5000;

async function createDefaultAdmin() {
    if (!AppDataSource.isInitialized) {
        console.log("DataSource not initialized yet for admin creation. Will try after init.");
        return;
    }
    const userRepository = AppDataSource.getRepository(User);
    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    try {
        let admin = await userRepository.findOneBy({ username: adminUsername });
        if (!admin) {
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            admin = userRepository.create({
                username: adminUsername,
                password: hashedPassword,
                role: "Admin",
            });
            await userRepository.save(admin);
            console.log("Default admin user created.");
        } else {
            // console.log("Default admin user already exists.");
        }
    } catch (error) {
        console.error("Error creating default admin user:", error);
    }
}


AppDataSource.initialize()
    .then(async () => { // Add async here
        console.log("Data Source has been initialized!");
        await createDefaultAdmin(); // Call after initialization
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err);
    });
