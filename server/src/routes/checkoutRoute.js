const express = require("express");
const router = express.Router();
const CheckoutCrtl = require("../controllers/checkout");
const { verifyAccessToken } = require("../helpers/jwt");

router.get("/district", CheckoutCrtl.GetDistrict);
router.post("/createIntent", CheckoutCrtl.CreatePayment);
router.post("/createOrder", verifyAccessToken, CheckoutCrtl.PlaceOrder);

module.exports = router;
