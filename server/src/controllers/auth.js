const Joi = require("joi");
const { StatusCodes } = require("http-status-codes");

const Helper = require("../helpers");

const _ = require("lodash");

const mongoose = require("mongoose");
const { createStripeCustomer } = require("../utils/stripe");
const User = mongoose.model("User");

const createError = require("http-errors");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  verifyAccessToken,
} = require("../helpers/jwt");

module.exports = {
  async Register(req, res, next) {
    const schema = Joi.object({
      displayName: Joi.string().min(4).required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
      email: Joi.string()
        .email({
          minDomainSegments: 2,
          tlds: { allow: ["com", "net", "org"] },
        })
        .required(),
      gender: Joi.string().valid("male", "female", "neutral"),
      age: Joi.number().min(14),
      photoUrl: Joi.string(),
      address: Joi.string(),
    });
    try {
      const result = await schema.validateAsync(req.body);

      const { email, password, displayName, gender, age, address } = result;

      const doesExist = await User.findOne({ email });

      if (doesExist) {
        throw createError.Conflict(`${email} is already been registered!`);
      }

      const stripeCustomer = await createStripeCustomer({
        email: Helper.lowerCase(email),
      });

      const newUser = new User({
        email,
        password,
        displayName,
        gender,
        age,
        address,
        customer: {
          stripeId: stripeCustomer.id,
        },
      });

      const savedUser = await newUser.save();

      const accessToken = await signAccessToken(savedUser.id);
      const refreshToken = await signRefreshToken(savedUser.id);

      res.status(StatusCodes.CREATED).json({
        message: `${savedUser.displayName} created successfully ✅`,
        token: { accessToken, refreshToken },
        user: _.omit(savedUser.toObject(), ["password"]),
      });
    } catch (error) {
      next(error);
    }
  },

  async Login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) throw createError.NotFound("User not registered!");

      if (!user.isValidPassword(password)) {
        throw createError.Unauthorized("Wrong password!");
      }

      const accessToken = await signAccessToken(user.id);
      const refreshToken = await signRefreshToken(user.id);

      res.json({
        message: `Logged in as ${user.displayName} ✅`,
        token: { accessToken, refreshToken },
        user: _.omit(user.toObject(), ["password"]),
      });
    } catch (error) {
      if (error.isJoi) {
        return next(createError.BadRequest("Invalid Email or Password!"));
      }
      next(error);
    }
  },

  RefreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) throw createError.BadRequest();

      const userId = await verifyRefreshToken(refreshToken);

      const accessToken = await signAccessToken(userId);
      const refToken = await signRefreshToken(userId);

      res.send({ accessToken, refreshToken: refToken });
    } catch (error) {
      next(error);
    }
  },

  async GetUserData(req, res, next) {
    const { aud } = req.payload;
    try {
      const user = await User.findById(aud);
      res.json({
        message: "User data loaded ✅",
        user: _.omit(user.toObject(), ["password"]),
      });
    } catch (error) {
      next(error);
    }
  },

  async GetAllUsers(req, res, next) {
    try {
      const users = await User.find().select("-password");
      res.json(users);
    } catch (error) {
      next(error);
    }
  },

  async ChangeUserData(req, res, next) {
    const schema = Joi.object({
      displayName: Joi.string().alphanum().min(4).max(16).required(),
      email: Joi.string()
        .email({
          minDomainSegments: 2,
          tlds: { allow: ["com", "net", "org"] },
        })
        .required(),
      gender: Joi.string().valid("male", "female", "neutral"),
      age: Joi.number().min(14),
      address: Joi.string(),
    });

    const { error, value } = schema.validate(req.body);

    if (error && error.details) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: error.details });
    }
    User.updateOne({ _id: req.user.id }, { ...value }, (err, raw) => {
      if (err) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "Something error + " + err });
      }

      res
        .status(StatusCodes.OK)
        .json({ message: `Your profile has been updated!` });
    });
  },

  UpdateUserData: async (req, res, next) => {
    try {
      const { id } = req.params;
      const updated = await User.findByIdAndUpdate(
        id,
        { ...req.body },
        { new: true }
      );

      res.json({
        message: `${req.body.displayName || "User"} details updated`,
        result: updated,
      });
    } catch (error) {
      next(error);
    }
  },

  DeleteUser: async (req, res, next) => {
    try {
      const { id } = req.params;
      await User.findByIdAndDelete(id);

      res.json({
        message: `User ${id} has been deleted`,
      });
    } catch (error) {
      next(error);
    }
  },
};
