const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    salary: { type: Number },
  },
  {
    timestamps: true,
    collection: "staffs",
  }
);

const staff = mongoose.model("Staff", schema);

module.exports = staff;
