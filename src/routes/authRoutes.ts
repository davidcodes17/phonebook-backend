//importing auth route packages
import express from "express";
import { userCreationValidationRules } from "../utils/userValidationRules";
import { createUser } from "../controllers/userController";
import { body } from "express-validator";

//creating the router instance
export const router = express.Router();

//route to handle login request
router.route("/login").post();

//route to handle signup request
router.post("/signup", userCreationValidationRules, createUser)
export default router;
