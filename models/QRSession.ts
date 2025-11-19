import mongoose, { Schema, models } from "mongoose";
interface QRSessionType {
  _id: string;
  createdAt: string;   // ⭐ REQUIRED
  updatedAt: string;   // ⭐ Optional but recommended
  code?: string;
  expiresAt?: string;
}


const QRSessionSchema = new Schema(
  {
    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // One-time unique QR token (prevents screenshots)
    qrToken: {
      type: String,
      required: true,
    },

    // QR expires after 10–20 sec
    expiresAt: {
      type: Date,
      required: true,
    },

    // Mark session active/inactive
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Prevent model overwrite on HMR
export const QRSession =
  models.QRSession || mongoose.model("QRSession", QRSessionSchema);

export default QRSession;
