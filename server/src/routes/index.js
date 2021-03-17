const express = require("express");
const router = express.Router();

router.use("/auth", require("./authRoute"));
router.use("/shop", require("./shopRoute"));
router.use("/products", require("./productRoute"));
router.use("/checkout", require("./checkoutRoute"));

module.exports = router;
