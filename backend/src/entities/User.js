import { EntitySchema } from "typeorm";

export const User = new EntitySchema({
    name: "User",
    tableName: "users",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        username: {
            type: "varchar",
            unique: true,
        },
        password: {
            type: "varchar",
        },
        role: {
            type: "enum",
            enum: ["Employee", "Manager", "Admin"],
            default: "Employee",
        },
    },
    relations: {
        requests: {
            type: "one-to-many",
            target: "Request", // Target RequestEntity
            inverseSide: "user",
        },
    },
});
