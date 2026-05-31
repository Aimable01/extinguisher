import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import Admin from "../models/Admin";
import OTP from "../models/OTP";

import { generateOTP } from "../utils/generateOTP";
import { generateToken } from "../utils/generateToken";

import { sendEmail } from "../services/emailService";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({
      email: email.toLowerCase(),
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
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

    return res.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error(error);

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
  return res.json({
    success: true,
    message: "Logged out successfully",
  });
};
