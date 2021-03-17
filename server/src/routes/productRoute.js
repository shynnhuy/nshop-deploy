const express = require("express");
const router = express.Router();

const ProductCtrl = require("../controllers/product");

const upload = require("../utils/multer");

router.get("/category", ProductCtrl.GetCategory);

router.post(
  "/createCategory",
  upload.single("image"),
  ProductCtrl.CreateCategory
);

router.patch(
  "/category/:id",
  upload.single("image"),
  ProductCtrl.UpdateCategory
);

router.get("/", ProductCtrl.GetAllProducts);

router.get("/:id", ProductCtrl.GetProduct);

router.post("/create", upload.single("image"), ProductCtrl.CreateProduct);

router.patch("/:id", upload.single("image"), ProductCtrl.UpdateProduct);

module.exports = router;
