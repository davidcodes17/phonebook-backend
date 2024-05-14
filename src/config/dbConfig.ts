//importing prsma client for connecting to the databae
import { PrismaClient } from "@prisma/client";

//creating a database instance to work easily with the prisma client
const db = new PrismaClient()

//exporting the database instance for other parts of the server to make use of it
export default db;