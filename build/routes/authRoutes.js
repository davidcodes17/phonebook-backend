"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
//importing auth route packages
const express_1 = __importDefault(require("express"));
const userValidationRules_1 = require("../utils/userValidationRules");
const userValidationRules_2 = require("../utils/userValidationRules");
const userValidationRules_3 = require("../utils/userValidationRules");
const userController_1 = require("../controllers/userController");
const userController_2 = require("../controllers/userController");
const userController_3 = require("../controllers/userController");
const userController_4 = require("../controllers/userController");
//creating the router instance
exports.router = express_1.default.Router();
//route to handle login request
exports.router.route("/login").post(userValidationRules_1.userValidationRules, userController_2.validateUser);
//route to handle signup request
exports.router.route("/signup").post(userValidationRules_1.userValidationRules, userController_1.createUser);
//route to handle forgottenPassword request
exports.router
    .route("/forgot-password")
    .post(userValidationRules_2.forgotPasswordValidationRules, userController_3.forgotPassword);
exports.router.route("/reset-password").post(userValidationRules_3.resetPasswordRules, userController_4.resetPassword);
exports.default = exports.router;
