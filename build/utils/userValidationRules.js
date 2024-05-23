"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordRules = exports.forgotPasswordValidationRules = exports.userValidationRules = void 0;
const express_validator_1 = require("express-validator");
exports.userValidationRules = [
    (0, express_validator_1.body)('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email'),
    (0, express_validator_1.body)('password').trim().notEmpty().withMessage('Password is required'),
];
exports.forgotPasswordValidationRules = [
    (0, express_validator_1.body)('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email'),
];
exports.resetPasswordRules = [
    (0, express_validator_1.body)("token").trim().notEmpty().withMessage("Token is required"),
    (0, express_validator_1.body)('password').trim().notEmpty().withMessage('Password is required'),
];
