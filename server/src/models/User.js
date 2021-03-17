const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const CustomerSchema = new mongoose.Schema({
  stripeId: {
    type: String,
    required: true,
  },
  subscriptionId: {
    type: String,
    required: false,
  },
  subscribedDate: {
    type: Date,
    required: false,
  },
  defaultPaymentId: {
    type: String,
    required: false,
  },
});

const UserSchema = new mongoose.Schema(
  {
    displayName: { type: String },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    password: { type: String },
    gender: { type: String, enum: ["male", "female", "neutral"] },
    age: Number,
    photoUrl: String,
    address: String,
    roles: {
      type: [
        {
          type: String,
          enum: ["administrator", "moderator", "member"],
          lowercase: true,
        },
      ],
      default: ["member"],
    },
    isRequestShop: { type: Boolean, default: false },
    isShopOwner: { type: Boolean, default: false },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },
    customer: {
      type: CustomerSchema,
      default: null,
      required: false,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", function (next) {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods = {
  isValidPassword: function (password) {
    try {
      return bcrypt.compareSync(password, this.password);
    } catch (error) {
      throw error;
    }
  },
};

module.exports = mongoose.model("User", UserSchema);
