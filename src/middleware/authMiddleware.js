import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  // Lấy token từ header và bỏ phần "Bearer "
  const token = req.headers.token.split(" ")[1];
  // Kiểm tra token có tồn tại không
  if (!token) {
    return res.status(404).json({
      message: "Token is valid",
    });
  }
  // Xác thực token sử dụng secret key
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, user) {
    if (err) {
      return res.status(404).json({
        message: "The user is not authemtication",
      });
    }
    // Kiểm tra xem user có quyền admin hay không
    if (user.isAdmin) {
      next(); // Cho phép tiếp tục xử lý request
    } else {
      return res.status(404).json({
        message: "The user is not authemtication",
      });
    }
  });
};

export default authMiddleware;
