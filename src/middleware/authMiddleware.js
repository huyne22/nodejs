const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Lấy token từ header và bỏ phần "Bearer "
  // const token1 = req.headers["Authorization"];
  const token2 = req.headers.cookie;
  const token = token2?.split(" ")[1];
  // Kiểm tra token có tồn tại không
  console.log("token", req.headers.access_token);
  if (!token) {
    return res.status(404).json({
      message: "Token is valid",
    });
  }
  // Xác thực token sử dụng secret key
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, user) {
    console.log("err", err);
    if (err) {
      return res.status(404).json({
        message: "The user is not authemtication1",
      });
    }
    // Kiểm tra xem user có quyền admin hay không
    if (user.isAdmin) {
      next(); // Cho phép tiếp tục xử lý request
    } else {
      return res.status(404).json({
        message: "The user is not authemtication2",
      });
    }
  });
};

module.exports = authMiddleware;
