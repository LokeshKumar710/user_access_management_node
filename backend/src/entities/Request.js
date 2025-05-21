import { EntitySchema } from "typeorm";

export const RequestEntity = new EntitySchema({ // Renamed to RequestEntity
    name: "Request", // This is the name TypeORM uses internally for relations
    tableName: "requests",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        accessType: {
            type: "enum",
            enum: ["Read", "Write", "Admin"],
        },
        reason: {
            type: "text",
        },
        status: {
            type: "enum",
            enum: ["Pending", "Approved", "Rejected"],
            default: "Pending",
        },
        requestedAt: {
            type: "timestamp",
            createDate: true,
        },
        updatedAt: {
            type: "timestamp",
            updateDate: true,
        }
    },
    relations: {
        user: {
            type: "many-to-one",
            target: "User",
            joinColumn: true,
            onDelete: "CASCADE",
        },
        software: {
            type: "many-to-one",
            target: "Software",
            joinColumn: true,
            onDelete: "CASCADE",
        },
    },
});
