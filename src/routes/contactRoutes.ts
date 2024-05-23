//importing auth route packages
import express from "express";
import { getContactList } from "../controllers/contactController";

//creating the router instance
export const router = express.Router();

//route to handle get contact request
router.route("/").get(getContactList);

export default router;
