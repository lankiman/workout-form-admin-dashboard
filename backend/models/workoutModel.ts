import mongoose from "mongoose";

const Schema = mongoose.Schema;

const workoutSchema = new Schema(
  {
    tittle: {
      type: String,
      required: true,
    },
    reps: {
      type: Number,
      required: true,
    },
    load: {
      type: Number,
      requried: true,
    },
    user_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
export default mongoose.model("workout", workoutSchema);
