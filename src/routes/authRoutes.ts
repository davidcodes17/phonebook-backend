//importing auth route packages
import express from "express";
import { userValidationRules } from "../utils/userValidationRules";
import { forgotPasswordValidationRules } from "../utils/userValidationRules";
import { resetPasswordRules } from "../utils/userValidationRules";
import { createUser } from "../controllers/userController";
import { validateUser } from "../controllers/userController";
import { forgotPassword } from "../controllers/userController";
import { resetPassword } from "../controllers/userController";

//creating the router instance
export const router = express.Router();

//route to handle login request
router.route("/login").post(userValidationRules, validateUser);

//route to handle signup request
router.route("/signup").post(userValidationRules, createUser);

//route to handle forgottenPassword request
router
  .route("/forgot-password")
  .post(forgotPasswordValidationRules, forgotPassword);

router.route("/reset-password/:id").post(resetPasswordRules, resetPassword);

export default router;
