const express = require("express");
const router = express.Router();

const AuthCrtl = require("../controllers/auth");

const { verifyAccessToken } = require("../helpers/jwt");

router.post("/register", AuthCrtl.Register);
router.post("/login", AuthCrtl.Login);
router.post("/refreshToken", AuthCrtl.RefreshToken);
router.patch("/userData", verifyAccessToken, AuthCrtl.ChangeUserData);
router.get("/userData", verifyAccessToken, AuthCrtl.GetUserData);
router.get("/users", verifyAccessToken, AuthCrtl.GetAllUsers);
router.patch("/:id", verifyAccessToken, AuthCrtl.UpdateUserData);
router.delete("/:id", verifyAccessToken, AuthCrtl.DeleteUser);

module.exports = router;
