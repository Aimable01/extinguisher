import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import Admin from "../models/Admin";
import OTP from "../models/OTP";

import { generateOTP } from "../utils/generateOTP";
import { generateToken } from "../utils/generateToken";

import { sendEmail } from "../services/emailService";
import { logger } from "../utils/logger";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({
      email: email.toLowerCase(),
    });

    if (!admin) {
      logger.warn(`Login attempt with non-existent email: ${email}`);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      logger.warn(`Failed login attempt for email: ${email}`);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const otp = generateOTP();

    await OTP.create({
      email,
      code: otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      used: false,
    });

    await sendEmail(
      email,
      "Your OTP Code",
      `
      <h2>Company XYZ Login OTP</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>Expires in 10 minutes.</p>
      `,
    );

    logger.info(`OTP sent successfully to: ${email}`);

    return res.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    logger.error("Login failed", error);
    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    const record = await OTP.findOne({
      email,
      code: otp,
      used: false,
    });

    if (!record) {
      return res.status(401).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (new Date() > record.expiresAt) {
      return res.status(401).json({
        success: false,
        message: "OTP expired",
      });
    }

    record.used = true;
    await record.save();

    const admin = await Admin.findOne({
      email,
    });

    const token = generateToken(admin!._id.toString(), admin!.email);

    return res.json({
      success: true,
      token,
      admin: {
        id: admin!._id,
        name: admin!.name,
        email: admin!.email,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "OTP verification failed",
    });
  }
};

export const resendOtp = async (req: any, res: Response) => {
  const { email } = req.body;

  const otp = generateOTP();

  await OTP.create({
    email,
    code: otp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  await sendEmail(email, "OTP Code", `<h1>${otp}</h1>`);

  return res.json({
    success: true,
    message: "OTP resent successfully",
  });
};

export const me = async (req: any, res: Response) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");

    return res.json({
      success: true,
      data: admin,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  logger.info("User logged out");
  return res.json({
    success: true,
    message: "Logged out successfully",
  });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });

    if (existingAdmin) {
      logger.warn(`Registration attempt with existing email: ${email}`);
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await Admin.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    logger.info(`New admin registered: ${email}`);

    return res.status(201).json({
      success: true,
      message: "Registration successful. Please login.",
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    logger.error("Registration failed", error);
    return res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      logger.warn(`Password reset requested for non-existent email: ${email}`);
      return res.status(404).json({
        success: false,
        message: "No account found with this email",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    admin.resetToken = resetToken;
    admin.resetTokenExpiry = resetTokenExpiry;
    await admin.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await sendEmail(
      email,
      "Password Reset Request",
      `
      <h2>Password Reset Request</h2>
      <p>You requested a password reset for your account.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}" style="background: #2F2F2F; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Reset Password</a>
      <p>This link will expire in 30 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
      `,
    );

    logger.info(`Password reset email sent to: ${email}`);

    return res.json({
      success: true,
      message: "Password reset email sent",
    });
  } catch (error) {
    logger.error("Forgot password failed", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send reset email",
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    const admin = await Admin.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!admin) {
      logger.warn(`Invalid or expired reset token used`);
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    admin.password = hashedPassword;
    admin.resetToken = undefined;
    admin.resetTokenExpiry = undefined;
    await admin.save();

    logger.info(`Password reset successful for: ${admin.email}`);

    await sendEmail(
      admin.email,
      "Password Reset Successful",
      `
      <h2>Password Reset Successful</h2>
      <p>Your password has been successfully reset.</p>
      <p>If you did not make this change, please contact support immediately.</p>
      `,
    );

    return res.json({
      success: true,
      message:
        "Password reset successful. Please login with your new password.",
    });
  } catch (error) {
    logger.error("Reset password failed", error);
    return res.status(500).json({
      success: false,
      message: "Password reset failed",
    });
  }
};

export const updateProfile = async (req: any, res: Response) => {
  try {
    const { name, email } = req.body;

    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    if (email && email.toLowerCase() !== admin.email) {
      const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });

      if (existingAdmin) {
        return res.status(400).json({
          success: false,
          message: "Email already in use",
        });
      }

      admin.email = email.toLowerCase();
    }

    if (name) {
      admin.name = name;
    }

    await admin.save();

    logger.info(`Profile updated for: ${admin.email}`);

    return res.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    logger.error("Update profile failed", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

export const changePassword = async (req: any, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);

    if (!isMatch) {
      logger.warn(`Incorrect current password for: ${admin.email}`);
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    admin.password = hashedPassword;
    await admin.save();

    logger.info(`Password changed for: ${admin.email}`);

    await sendEmail(
      admin.email,
      "Password Changed Successfully",
      `
      <h2>Password Changed</h2>
      <p>Your password has been successfully changed.</p>
      <p>If you did not make this change, please contact support immediately.</p>
      `,
    );

    return res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    logger.error("Change password failed", error);
    return res.status(500).json({
      success: false,
      message: "Failed to change password",
    });
  }
};
