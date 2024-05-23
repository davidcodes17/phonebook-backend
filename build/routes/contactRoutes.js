"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
//importing auth route packages
const express_1 = __importDefault(require("express"));
const contactController_1 = require("../controllers/contactController");
const contactController_2 = require("../controllers/contactController");
const contactValidationRules_1 = require("../utils/contactValidationRules");
const contactController_3 = require("../controllers/contactController");
//creating the router instance
exports.router = express_1.default.Router();
//route to handle get contact request
exports.router.route("/")
    .get(contactController_1.getContactList)
    .post(contactValidationRules_1.contactValidationRules, contactController_2.createContact);
exports.router.route("/:id")
    .delete(contactController_3.deleteContact);
exports.default = exports.router;
