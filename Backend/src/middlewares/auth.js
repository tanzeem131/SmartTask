const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let token = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ error: "Authentication required." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { _id: decoded.userId, email: decoded.email };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};

module.exports = { authenticateToken };
