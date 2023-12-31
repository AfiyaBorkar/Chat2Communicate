const jwt = require("jsonwebtoken");
const User = require("../modals/UserModel");

const protect = async (req, res, next) => {
  try {
    // Check if the Authorization header exists
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")) {
      throw new Error("Not authorized, request failed");
    }

    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the user ID is present in the decoded token
    if (!decoded.id) {
      throw new Error("Invalid token, user ID not found");
    }

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      throw new Error("User not found");
    }

    next();
  } catch (error) {
    console.error("Error in protect middleware:", error);
    res.status(401).json({ message: "Not authorized, request failed" });
  }
};

module.exports = protect;
