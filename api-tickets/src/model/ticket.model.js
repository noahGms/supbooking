import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    concert: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Concert",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;