import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "../entities/User.js";
import { Software } from "../entities/Software.js";
import { RequestEntity } from "../entities/Request.js"; // Changed name to avoid conflict

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true, // true for dev, false for prod (use migrations)
    logging: false, //  true for dev to see SQL queries
    entities: [User, Software, RequestEntity],
    migrations: [],
    subscribers: [],
});
