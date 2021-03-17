const cloudinary = require("../utils/cloudinary");
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const _ = require("lodash");
const Category = require("../models/Category");
const User = require("../models/User");
const Product = require("../models/Product");
const createHttpError = require("http-errors");

module.exports = {
  async GetCategory(req, res, next) {
    try {
      const categories = await Category.find();
      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  },
  async CreateCategory(req, res, next) {
    const { name } = req.body;
    // console.log(req.file);
    try {
      const uploaded = await cloudinary.uploadSingle(req.file.path, "category");
      if (!uploaded) {
        return res.status(403).json({ message: "Upload failed" });
      }

      const existCategory = await Category.findOne({ name });
      if (existCategory) {
        return res
          .status(409)
          .json({ message: `Category name [${name}] is already exists!` });
      }

      const newCategory = new Category({
        name,
        code: _.camelCase(name),
        imageUrl: uploaded.url,
      });
      newCategory.save().then((newDoc) => {
        if (!newDoc) {
          return res.status(500).json({ message: "Something went wrong" });
        }
        res.status(201).json({
          message: `Category [${newDoc.name}] created.`,
          result: newDoc,
        });
      });
    } catch (err) {
      next(err);
    }
  },

  UpdateCategory: async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
      let oldCategory = await Category.findById(id);
      // Delete image from cloudinary
      await cloudinary.destroyImage(oldCategory.cloudinary);
      const uploaded = await cloudinary.uploadSingle(req.file.path, "category");
      if (!uploaded) {
        return next(createHttpError.InternalServerError("Upload failed"));
      }

      // console.log(uploaded);

      const updatedCategory = await Category.findByIdAndUpdate(
        id,
        {
          name,
          code: _.camelCase(name),
          imageUrl: uploaded.url,
          cloudinary: uploaded.public_id,
        },
        { new: true }
      );

      res.status(201).json({
        message: `Category [${updatedCategory.name}] updated.`,
        result: updatedCategory,
      });
    } catch (err) {
      next(err);
    }
  },

  async CreateProduct(req, res, next) {
    const productSchema = Joi.object({
      name: Joi.string().min(3).required(),
      description: Joi.string().min(10).required(),
      price: {
        discount: Joi.number(),
        old: Joi.number().required(),
      },
      shipping: Joi.boolean(),
      category: Joi.objectId(),
      shop: Joi.objectId(),
      // image: Joi.required(),
    });

    try {
      const result = await productSchema.validateAsync(req.body);
      console.log(result);
      const uploaded = await cloudinary.uploadSingle(req.file.path, "products");
      if (!uploaded) {
        return next(createHttpError.NotFound("Upload image error"));
      }
      const { name, description, shipping, price, category, shop } = result;
      const camelName = _.camelCase(result.name);
      const newProduct = new Product({
        name,
        description,
        shipping,
        shop,
        code: removeAccents(camelName),
        price: {
          discount: price.discount || 0,
          old: price.old,
        },
        category,
        imageUrl: uploaded.url,
      });

      await newProduct.save();

      res.json({ message: "New product created", result: newProduct });
    } catch (err) {
      next(err);
    }
  },

  async UpdateProduct(req, res, next) {
    const productSchema = Joi.object({
      name: Joi.string().min(3).required(),
      description: Joi.string().min(10).required(),
      price: {
        discount: Joi.number(),
        old: Joi.number().required(),
      },
      shipping: Joi.boolean(),
      category: Joi.objectId(),
      shop: Joi.objectId(),
      // image: Joi.required(),
    });

    try {
      const { id } = req.params;
      const result = await productSchema.validateAsync(req.body);
      // let oldProduct = await Product.findById(id);
      // await cloudinary.destroyImage(oldProduct.cloudinary);
      const uploaded = await cloudinary.uploadSingle(req.file.path, "products");
      if (!uploaded) {
        return next(createHttpError.NotFound("Upload image error"));
      }
      const { name, description, shipping, price, category, shop } = result;
      const camelName = _.camelCase(result.name);
      const newProduct = {
        name,
        description,
        shipping,
        shop,
        code: removeAccents(camelName),
        price: {
          discount: price.discount || 0,
          old: price.old,
        },
        category,
        imageUrl: uploaded.url,
      };

      // console.log("New: ", newProduct);

      const updatedProduct = await Product.findByIdAndUpdate(id, newProduct, {
        new: true,
      });

      console.log(updatedProduct);

      res.json({ message: `${name} updated`, result: updatedProduct });
    } catch (err) {
      next(err);
    }
  },
  async GetProduct(req, res) {
    try {
      const { id } = req.params;
      if (id) {
        const product = await Product.findById(id).populate([
          { path: "category", select: "name" },
          { path: "shop", select: "name" },
        ]);
        return res.status(200).json(product);
      }
    } catch (error) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Error when fetching product!", error });
    }
  },
  async GetAllProducts(req, res, next) {
    try {
      let { category, shop } = req.query;
      let products = [];

      if (shop) {
        products = await Product.find({ shop })
          .populate("shop", ["name", "address", "_id"])
          .sort({ createdAt: "desc" })
          .exec();
        return res.status(200).json(products);
      }

      if (category === "all") {
        products = await Product.find()
          .populate("shop", ["name", "address", "_id"])
          .sort({ createdAt: "desc" })
          .exec();
      } else {
        products = await Product.find({ category })
          .populate("shop", ["name", "address", "_id"])
          .sort({ createdAt: "desc" })
          .exec();
      }
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  },
  async GetProductsByShop(req, res) {
    try {
      const { shop } = req.query;
      const products = await Product.find({ shop })
        .populate("shop", ["name", "address", "_id"])
        .sort({ createdAt: "desc" })
        .exec();
      res.status(StatusCodes.OK).json(products);
    } catch (error) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Error when fetching shop products!", error });
    }
  },
};

function removeAccents(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}
