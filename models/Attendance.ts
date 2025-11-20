import mongoose, { Schema, models } from "mongoose";

const AttendanceSchema = new Schema(
  {
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: "QRSession",
      required: true,
    },

    studentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    studentEmail: {
      type: String,
      required: true,
    },

    studentUsername: {
      type: String,
      required: true,
    },

    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    status: {
      type: String,
      enum: ["present", "late", "rejected"],
      default: "present",
    },
  },
  { timestamps: true }
);

export default models.Attendance ||
  mongoose.model("Attendance", AttendanceSchema);
