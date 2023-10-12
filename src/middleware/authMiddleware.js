const { render } = require("ejs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (requiredRole) => (req, res, next) => {
  const token = req.cookies.access_token;
  console.log("check", req.cookies);
  // Kiểm tra token có tồn tại không
  if (!token) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }

  // Xác thực token sử dụng secret key
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, user) {
    if (err) {
      console.error("JWT verification error:", err);
      return res.status(403).json({
        message: "Invalid token",
      });
    }

    // Kiểm tra xem user có quyền admin hay không
    if (user.isRole) {
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      console.log("check", decodedToken.isRole);
      if (requiredRole.includes(decodedToken.isRole)) {
        req.user = decodedToken;
        next(); // Cho phép tiếp tục xử lý request
      } else {
        return res.status(403).json({ message: "Permission denied" });
      }
    } else {
      return res.status(403).json({
        message: "User is not authorized",
      });
    }
  });
};

module.exports = authMiddleware;
