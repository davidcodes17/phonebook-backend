"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactValidationRules = void 0;
const express_validator_1 = require("express-validator");
exports.contactValidationRules = [
    (0, express_validator_1.body)('firstName').trim().notEmpty().withMessage('Firstname is required'),
    (0, express_validator_1.body)('lastName').trim().notEmpty().withMessage('Lastname is required'),
    (0, express_validator_1.body)("middleName").optional(),
    (0, express_validator_1.body)("numbers").isArray().withMessage("No phone number is provided"),
    (0, express_validator_1.body)("emails").isArray().withMessage("No email is provided"),
    (0, express_validator_1.body)("websites").isArray().withMessage("No website link is provided")
];
