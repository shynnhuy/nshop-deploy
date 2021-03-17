const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  items: {
    type: [{ type: Object }],
    required: true,
  },
  total: { type: Number, required: true },
  customer: { type: Object, required: true },
  shipping: { type: Object },
  status: {
    type: String,
    enum: ["pending", "succeeded", "failed"],
    default: "pending",
  },
  payment_id: String,
});

module.exports = mongoose.model("Order", orderSchema);
