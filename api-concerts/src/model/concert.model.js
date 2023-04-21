import mongoose from "mongoose";

const concertSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    date: {
      type: Date,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    seats: {
      type: Number,
      required: true,
    },
  },
  {timestamps: true}
);

const Concert = mongoose.model("Concert", concertSchema);

export default Concert;