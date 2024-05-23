"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//importing prsma client for connecting to the databae
const client_1 = require("@prisma/client");
//creating a database instance to work easily with the prisma client
const db = new client_1.PrismaClient();
//exporting the database instance for other parts of the server to make use of it
exports.default = db;
