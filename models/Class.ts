import mongoose, { Schema, models } from "mongoose";

const ClassSchema = new Schema(
  {
    className: {
      type: String,
      required: true,
    },

    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    students: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export default models.Class || mongoose.model("Class", ClassSchema);
