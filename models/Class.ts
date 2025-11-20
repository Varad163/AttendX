// models/Class.ts
import mongoose, { Schema, models } from "mongoose";

const ClassSchema = new Schema(
  {
    name: {
      type: String,
      required: true, // e.g. "SE-A", "FE-B", "DSA Lab"
    },
    code: {
      type: String, // optional, like "SE-A-DSA"
    },
    year: {
      type: String, // optional: "FE", "SE", "TE", "BE"
    },
    division: {
      type: String, // optional: "A", "B", etc.
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const ClassModel = models.Class || mongoose.model("Class", ClassSchema);
export default ClassModel;
