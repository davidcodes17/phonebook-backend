import { body } from "express-validator"

export const contactValidationRules = [
  body('firstName').trim().notEmpty().withMessage('Firstname is required'),
  body('lastName').trim().notEmpty().withMessage('Lastname is required'),
  body("middleName").optional(),
  body("numbers").isArray().withMessage("No phone number is provided"),
  body("emails").isArray().withMessage("No email is provided"),
  body("websites").isArray().withMessage("No website link is provided")
]