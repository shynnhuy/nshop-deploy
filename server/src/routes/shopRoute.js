const express = require("express");
const router = express.Router();

const ShopCtrl = require("../controllers/shop");
const { verifyAccessToken } = require("../helpers/jwt");

router.get("/", verifyAccessToken, ShopCtrl.GetAllShop);
router.post("/", verifyAccessToken, ShopCtrl.CreateShop);
router.get("/products", ShopCtrl.GetShopProducts);
router.get("/:id", verifyAccessToken, ShopCtrl.GetShop);
router.patch("/:id", verifyAccessToken, ShopCtrl.ChangeShopStatus);

module.exports = router;
