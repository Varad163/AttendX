
import mongoose, { Schema, models } from "mongoose";

const ClassSchema = new Schema(
  {
    name: {
      type: String,
      required: true, 
    },
    code: {
      type: String,
    },
    year: {
      type: String, 
    },
    division: {
      type: String, 
    },
    teacherId: 
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const ClassModel = models.Class || mongoose.model("Class", ClassSchema);
export default ClassModel;
