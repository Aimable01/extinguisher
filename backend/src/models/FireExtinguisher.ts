import mongoose, { Document, Schema } from "mongoose";

export interface IFireExtinguisher extends Document {
  extinguisherId: string;
  ownerName: string;
  ownerIdNumber: string;
  ownerEmail: string;
  ownerPhone: string;
  dateOfIssue: Date;
  expirationDate: Date;
  status: string;
  alertSentAt: Date | null;
  reminderSentAt: Date | null;
  policeNotifiedAt: Date | null;
  notes: string;
}

const extinguisherSchema = new Schema<IFireExtinguisher>(
  {
    extinguisherId: {
      type: String,
      unique: true,
      required: true,
    },

    ownerName: {
      type: String,
      required: true,
    },

    ownerIdNumber: {
      type: String,
      required: true,
    },

    ownerEmail: {
      type: String,
      required: true,
    },

    ownerPhone: {
      type: String,
      required: true,
    },

    dateOfIssue: {
      type: Date,
      required: true,
    },

    expirationDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "expired", "reported", "police_notified"],
      default: "active",
    },

    alertSentAt: {
      type: Date,
      default: null,
    },

    reminderSentAt: {
      type: Date,
      default: null,
    },

    policeNotifiedAt: {
      type: Date,
      default: null,
    },

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

extinguisherSchema.index({
  extinguisherId: 1,
});

extinguisherSchema.index({
  ownerEmail: 1,
});

extinguisherSchema.index({
  status: 1,
});

extinguisherSchema.index({
  expirationDate: 1,
});

export default mongoose.model<IFireExtinguisher>(
  "FireExtinguisher",
  extinguisherSchema,
);
