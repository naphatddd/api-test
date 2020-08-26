const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    photo: { type: String, required: true, trim: true },
    location: {
      lat: Number,
      lgn: Number,
    },
  },
  {
    toJSON: { virtuals: true },
    timestamps: true,
    collection: "shops",
  }
);
schema.virtual("menus", {
  ref: "Menu",
  localField: "_id",
  foreignField: "shop",
});
const shop = mongoose.model("Shop", schema);

module.exports = shop;
