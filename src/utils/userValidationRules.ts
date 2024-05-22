import { body } from "express-validator"

export const userCreationValidationRules = [
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email'),
  body('password').trim().notEmpty().withMessage('Password is required'),
]

export const userValidationRules = [
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email'),
  body('password').trim().notEmpty().withMessage('Password is required'),
]