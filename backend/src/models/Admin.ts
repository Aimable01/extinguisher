import mongoose, { Document, Schema } from "mongoose";

export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
}

const adminSchema = new Schema<IAdmin>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    resetToken: {
      type: String,
    },

    resetTokenExpiry: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IAdmin>("Admin", adminSchema);
