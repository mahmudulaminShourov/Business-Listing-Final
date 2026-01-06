const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "reviewed", "resolved"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
