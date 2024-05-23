//importing auth route packages
import express from "express";
import { getContactList } from "../controllers/contactController";
import { createContact } from "../controllers/contactController";
import { contactValidationRules } from "../utils/contactValidationRules";

//creating the router instance
export const router = express.Router();

//route to handle get contact request
router.route("/")
  .get(getContactList)
  .post(contactValidationRules, createContact)


export default router;
