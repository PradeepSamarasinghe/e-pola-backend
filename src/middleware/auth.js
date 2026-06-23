const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Auth Error" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_here");
    req.user = decoded;
    next();
  } catch (e) {
    res.status(500).json({ message: "Invalid Token" });
  }
};
