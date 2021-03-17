const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
    description: { type: String },
    price: {
      discount: { type: Number, default: 0 },
      old: { type: Number, required: true },
      reduced: { type: Number },
      new: { type: Number },
    },
    imageUrl: { type: String, required: true },
    shipping: { type: Boolean },
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    shop: { type: Schema.Types.ObjectId, ref: "Shop" },
    cloudinary: { type: String },
  },
  { timestamps: true }
);

productSchema.pre(["save"], function (next) {
  try {
    const reducedPrice = (this.price.old * this.price.discount) / 100;
    const newPrice = this.price.old - reducedPrice;
    this.price.reduced = reducedPrice;
    this.price.new = newPrice;
    next();
  } catch (error) {
    next(error);
  }
});

productSchema.pre(["findByIdAndUpdate", "findOneAndUpdate"], function (next) {
  try {
    const reducedPrice =
      (this._update.price.old * this._update.price.discount) / 100;
    const newPrice = this._update.price.old - reducedPrice;
    this._update.price.reduced = reducedPrice;
    this._update.price.new = newPrice;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Product", productSchema);
