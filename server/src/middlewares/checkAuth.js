const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  try {
    if (!authorization) throw "Forbidden!!";
    const token = authorization.split(" ")[1];
    if (!token) throw "No Token Provided.";
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) throw "Token expired";
      const userData = {
        ...decoded,
        roles: decoded.roles.map((role) => role.roleName),
      };
      req.user = userData;
      req.token = token;
      next();
    });
  } catch (error) {
    res.status(401).json({
      message: error || "Authorized Failed",
      error,
    });
  }
};
