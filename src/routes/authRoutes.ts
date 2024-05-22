//importing auth route packages
import express from "express";
import { userCreationValidationRules } from "../utils/userValidationRules";
import { userValidationRules } from "../utils/userValidationRules";
import { createUser } from "../controllers/userController";
import { validateUser } from "../controllers/userController";

//creating the router instance
export const router = express.Router();

//route to handle login request
router.route("/login").post(userValidationRules, validateUser);

//route to handle signup request
router.route("/signup").post(userCreationValidationRules, createUser);
export default router;
