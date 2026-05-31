import { body } from "express-validator";

export const loginValidation = [
  body("email").isEmail().withMessage("Valid email required"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 chars"),
];

export const verifyOtpValidation = [
  body("email").isEmail(),

  body("otp")
    .isLength({
      min: 6,
      max: 6,
    })
    .withMessage("OTP must be 6 digits"),
];
