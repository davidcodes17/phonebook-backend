//importing auth route packages
import express from "express";
import { getContactList } from "../controllers/contactController";
import { createContact } from "../controllers/contactController";
import { contactValidationRules } from "../utils/contactValidationRules";
import { deleteContact } from "../controllers/contactController";

//creating the router instance
export const router = express.Router();

//route to handle get contact request
router.route("/")
  .get(getContactList)
  .post(contactValidationRules, createContact)

router.route("/:id")
  .delete(deleteContact)

export default router;
