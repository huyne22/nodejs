const connection = require("../config/database");
const {
  handleUserLogin,
  createNewUser,
  createNewPatient,
  updatePatient,
  getAllPatient,
  deletePatient,
  createMedicalService,
  updateMedicalService,
  getAllMedicalService,
  deleteMedicalService,
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
      data: {},
    });
  }

  let userData = await handleUserLogin(TenDangNhap, MatKhau);
  console.log(userData);
  //check email tồn tại
  //so sánh password

  return res.status(200).json({
    errCode: userData.errCode,
    errMessage: userData.errMessage,
    data: userData.user ? userData.user : {},
  });
};

const handleCreateNewUser = async (req, res) => {
  const { TenDangNhap, MatKhau } = req.body;
  if (!TenDangNhap || !MatKhau) {
    return res.status(500).json({
      errCode: 1,
      errMessage: "Thiếu tham số đầu vào!",
      data: {},
    });
  }
  let message = await createNewUser(TenDangNhap, MatKhau);
  //   console.log(req.body);
  return res.status(200).json({
    errCode: message.errCode,
    errMessage: message.errMessage,
  });
};

const handleCreateNewPatient = async (req, res) => {
  const { MaBN, HoBN, TenBN, SoDT, Email, NgaySinh, GioiTinh, DiaChi, GhiChu } =
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
  } else {
    let message = await createNewPatient(
      MaBN,
      HoBN,
      TenBN,
      SoDT,
      Email,
      NgaySinh,
      GioiTinh,
      DiaChi,
      GhiChu
    );
    return res.status(200).json({
      errCode: message?.errCode,
      errMessage: message?.errMessage,
    });
  }
};

const handleUpdatePatient = async (req, res) => {
  console.log("check body", req.body.data);
  console.log("check body", req.body);
  if (!req.body?.data?.MaBN && !req.body?.MaBN) {
    return res.status(500).json({
      errCode: 1,
      errMessage: "Thiếu mã bệnh nhân!",
    });
  } else {
    let data = req.body.data ? req.body.data : req.body;
    let message = await updatePatient(data);

    console.log(message);

    return res.status(200).json({
      errCode: message?.errCode,
      errMessage: message?.errMessage,
    });
  }
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

  if (patients && patients.patient && patients.patient.length > 0) {
    for (let i = 0; i < patients.patient.length; i++) {
      let ngayGio = new Date(patients.patient[i].NgaySinh);

      // Tăng thêm 1 ngày
      ngayGio.setDate(ngayGio.getDate() + 1);

      // Định dạng lại ngày thành chuỗi ngày tháng (ví dụ: "YYYY-MM-DD")
      let ngayMoi = ngayGio.toISOString().split("T")[0];

      // Cập nhật NgaySinh thành ngày mới
      patients.patient[i].NgaySinh = ngayMoi;
    }
  }

  return res.status(200).json({
    errCode: patients.errCode,
    errMessage: patients.errMessage,
    data: patients.patient,
  });
};

let handleDeletePatient = async (req, res) => {
  console.log("check body", req.body.data);
  let patientId = req.body?.data?.MaBN;
  if (!patientId) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Thiếu tham số đầu vào!",
    });
  }
  let message = await deletePatient(patientId);
  console.log("check message", message);
  return res.status(200).json({
    errCode: message.errCode,
    errMessage: message.errMessage,
  });
};

const handleCreateMedicalService = async (req, res) => {
  const { MaDV, TenDV, MoTaDV, GiaTien, GhiChu } = req.body;
  if (!MaDV || !TenDV || !MoTaDV || !GiaTien || !GhiChu) {
    return res.status(500).json({
      errCode: 1,
      errMessage: "Thiếu tham số đầu vào!",
    });
  } else {
    let message = await createMedicalService(
      MaDV,
      TenDV,
      MoTaDV,
      GiaTien,
      GhiChu
    );
    return res.status(200).json({
      errCode: message?.errCode,
      errMessage: message?.errMessage,
    });
  }
};

const handleUpdateMedicalService = async (req, res) => {
  // console.log("check body", req.body.data);
  console.log("check body", req.body);
  if (!req.body?.data?.MaDV && !req.body?.MaDV) {
    return res.status(500).json({
      errCode: 1,
      errMessage: "Thiếu mã dịch vụ!",
    });
  } else {
    let data = req.body.data ? req.body.data : req.body;
    let message = await updateMedicalService(data);

    console.log(message);

    return res.status(200).json({
      errCode: message?.errCode,
      errMessage: message?.errMessage,
    });
  }
};

const handleGetAllMedicalService = async (req, res) => {
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
  let services = await getAllMedicalService(id);
  return res.status(200).json({
    errCode: services.errCode,
    errMessage: services.errMessage,
    data: services.service,
  });
};

const handleDeleteMedicalService = async (req, res) => {
  // console.log("check body", req.body.data);
  console.log("check body", req.body);
  let serviceId = req.body?.data?.MaDV ? req.body?.data?.MaDV : req.body?.MaDV;
  if (!serviceId) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Thiếu tham số đầu vào!",
    });
  }
  let message = await deleteMedicalService(serviceId);
  console.log("check message", message);
  return res.status(200).json({
    errCode: message.errCode,
    errMessage: message.errMessage,
  });
};
module.exports = {
  handleLogin,
  handleCreateNewUser,
  handleCreateNewPatient,
  handleUpdatePatient,
  handleGetAllPatient,
  handleDeletePatient,
  handleCreateMedicalService,
  handleUpdateMedicalService,
  handleGetAllMedicalService,
  handleDeleteMedicalService,
};
