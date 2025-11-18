import mongoose, { Schema, models } from "mongoose";

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

    qrToken: {
      type: String, // random one-time token
      required: true,
    },

    expiresAt: {
      type: Date, // 20-30 sec expiry
      required: true,
    },
  },
  { timestamps: true }
);

export default models.QRSession || mongoose.model("QRSession", QRSessionSchema);
