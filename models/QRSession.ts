import mongoose, { Schema, models } from "mongoose";

const QRSessionSchema = new Schema(
  {
    // 🔹 Make classId OPTIONAL and a STRING for now
    classId: {
      type: String,         // changed from Schema.Types.ObjectId
      required: false,      // changed from true
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
const QRSession =
  models.QRSession || mongoose.model("QRSession", QRSessionSchema);

export default QRSession;
