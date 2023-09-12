const connection = require("../config/database");
const {
  handleUserLogin,
  createNewUser,
  createNewPatient,
  updatePatient,
  getAllPatient,
  deletePatient,
} = require("../service/CRUDService");
const bcrypt = require("bcryptjs");

const salt = bcrypt.genSaltSync(10);

//api
const handleLogin = async (req, res) => {
  console.log("body", req.body);
  const { TenDangNhap, MatKhau } = req.body;
  if (!TenDangNhap || !MatKhau) {
    return res.status(500).json({
      errCode: 1,
      errMessage: "Thiếu tham số đầu vào!",
    });
  }

  let userData = await handleUserLogin(TenDangNhap, MatKhau);
  console.log(userData);
  //check email tồn tại
  //so sánh password

  return res.status(200).json({
    errCode: userData.errCode,
    errMessage: userData.errMessage,
    user: userData.user ? userData.user : {},
  });
};

const handleCreateNewUser = async (req, res) => {
  const { TenDangNhap, MatKhau } = req.body;
  if (!TenDangNhap || !MatKhau) {
    return res.status(500).json({
      errCode: 1,
      errMessage: "Thiếu tham số đầu vào!",
    });
  }
  let message = await createNewUser(TenDangNhap, MatKhau);
  //   console.log(req.body);
  return res.status(200).json(message);
};

const handleCreateNewPatient = async (req, res) => {
  const { MaBN, HoBN, TenBN, SoDT, Email, NgaySinh, GioiTinh, DiaChi } =
    req.body;
  if (
    !MaBN ||
    !HoBN ||
    !TenBN ||
    !SoDT ||
    !Email ||
    !NgaySinh ||
    !GioiTinh ||
    !DiaChi
  ) {
    return res.status(500).json({
      errCode: 1,
      errMessage: "Thiếu tham số đầu vào!",
    });
  }
  let message = await createNewPatient(
    MaBN,
    HoBN,
    TenBN,
    SoDT,
    Email,
    NgaySinh,
    GioiTinh,
    DiaChi
  );
  console.log(req.body);
  return res.status(200).json(message);
};

const handleUpdatePatient = async (req, res) => {
  let message = await updatePatient(req.body);
  console.log("message", message);
  return res.status(200).json(message);
};

let handleGetAllPatient = async (req, res) => {
  let id = req.query.id;
  //ko có id
  if (!id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Thiếu tham số đầu vào",
      users: [],
    });
  }
  //có id
  let patients = await getAllPatient(id);
  return res.status(200).json({
    patients,
  });
};

let handleDeletePatient = async (req, res) => {
  let patientId = req.body.MaBN;
  if (!patientId) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Thiếu tham số đầu vào!",
    });
  }
  let message = await deletePatient(patientId);
  return res.status(200).json(message);
};

module.exports = {
  handleLogin,
  handleCreateNewUser,
  handleCreateNewPatient,
  handleUpdatePatient,
  handleGetAllPatient,
  handleDeletePatient,
};
