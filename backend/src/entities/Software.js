import { EntitySchema } from "typeorm";

export const Software = new EntitySchema({
    name: "Software",
    tableName: "software",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        name: {
            type: "varchar",
            unique: true,
        },
        description: {
            type: "text",
        },
        accessLevels: {
            type: "simple-array", // Stores as comma-separated string
        },
    },
    relations: {
        requests: {
            type: "one-to-many",
            target: "Request", // Target RequestEntity
            inverseSide: "software",
        },
    },
});
