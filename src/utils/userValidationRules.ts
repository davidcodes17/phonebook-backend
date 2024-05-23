import { body } from "express-validator"

export const userValidationRules = [
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email'),
  body('password').trim().notEmpty().withMessage('Password is required'),
]

export const forgotPasswordValidationRules = [
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email'),
]

export const resetPasswordRules = [
  body("token").trim().notEmpty().withMessage("Token is required"),
  body('password').trim().notEmpty().withMessage('Password is required'),
]