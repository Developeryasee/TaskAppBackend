const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.header("Authorization");

  // Check if token exists
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }

  // Extract token
  const token = authHeader.split(" ")[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request
    next(); // Proceed to next middleware or route
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};
