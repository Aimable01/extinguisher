import jwt from "jsonwebtoken";

export const generateToken = (id: string, email: string) => {
  return jwt.sign(
    {
      id,
      email,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  );
};
