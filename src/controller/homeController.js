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
  refreshTokenService,
  createNewDoctor,
  updateDoctor,
  getAllDoctor,
  deleteDoctor,
  createNewNurse,
  updateNurse,
  getAllNurse,
  deleteNurse,
  createNewDoctorSchedule,
  updateDoctorSchedule,
  getAllDoctorSchedule,
  deleteDoctorSchedule,
  createNewPatientAppointment,
  getAllPatientAppointment,
  deletePatientAppointment,
  deleteUser,
  createNewPatientMedicalService,
  updatePatientMedicalService,
  getAllPatientMedicalService,
  deletePatientMedicalService,
  createNewMedicalExamination,
  updateMedicalExamination,
  getAllMedicalExamination,
  deleteMedicalExamination,
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
  let refreshToken = userData?.data?.refresh_token;
  res.cookie("refreshToken", refreshToken, { httpOnly: true });
  return res.status(200).json({
    errCode: userData.errCode,
    errMessage: userData.errMessage,
    data: userData?.user ? userData?.user : {},
    access_token: userData?.data?.access_token
      ? userData?.data?.access_token
      : {},
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
  console.log(req.body);
  return res.status(200).json({
    errCode: message.errCode,
    errMessage: message.errMessage,
  });
};

let handleDeleteUser = async (req, res) => {
  console.log("check body", req.body);
  let userId = req.body?.MaNguoiDung;
  if (!userId) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Thiếu tham số đầu vào!",
    });
  }
  let message = await deleteUser(userId);
  console.log("check message", message);
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

const userRefreshTokenController = async (req, res) => {
  try {
    const refreshTolken = req.headers.token.split(" ")[1];
    if (refreshTolken) {
      const response = await refreshTokenService(refreshTolken);
      return res.json(response);
    } else {
      return res.json({
        message: "The refreshTolken is not valid",
      });
    }
  } catch (err) {
    return res.json({
      status: "err",
      message: err,
    });
  }
};

const handleCreateDoctor = async (req, res) => {
  const {
    MaBS,
    HoBS,
    TenBS,
    SoDT,
    Email,
    BangCap,
    ChuyenMon,
    GioiTinh,
    MaNguoiDung,
    GhiChu,
  } = req.body;
  if (
    !MaBS ||
    !HoBS ||
    !TenBS ||
    !SoDT ||
    !Email ||
    !BangCap ||
    !ChuyenMon ||
    !GioiTinh ||
    !MaNguoiDung ||
    !GhiChu
  ) {
    return res.status(500).json({
      errCode: 1,
      errMessage: "Thiếu tham số đầu vào!",
    });
  } else {
    let message = await createNewDoctor(
      MaBS,
      HoBS,
      TenBS,
      SoDT,
      Email,
      BangCap,
      ChuyenMon,
      GioiTinh,
      MaNguoiDung,
      GhiChu
    );
    return res.status(200).json({
      errCode: message?.errCode,
      errMessage: message?.errMessage,
    });
  }
};

const handleUpdateDoctor = async (req, res) => {
  console.log("check body", req.body.data);
  console.log("check body", req.body);
  if (!req.body?.data?.MaBS && !req.body?.MaBS) {
    return res.status(500).json({
      errCode: 1,
      errMessage: "Thiếu mã bác sĩ!",
    });
  } else {
    let data = req.body.data ? req.body.data : req.body;
    let message = await updateDoctor(data);

    console.log(message);

    return res.status(200).json({
      errCode: message?.errCode,
      errMessage: message?.errMessage,
    });
  }
};

const handleGetAllDoctor = async (req, res) => {
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
  let doctors = await getAllDoctor(id);

  return res.status(200).json({
    errCode: doctors.errCode,
    errMessage: doctors.errMessage,
    data: doctors.doctor,
  });
};

let handleDeleteDoctor = async (req, res) => {
  console.log("check body", req.body);
  let doctorId = req.body?.data?.MaBS ? req.body?.data?.MaBS : req.body.MaBS;
  if (!doctorId) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Thiếu tham số đầu vào!",
    });
  }
  let message = await deleteDoctor(doctorId);
  console.log("check message", message);
  return res.status(200).json({
    errCode: message.errCode,
    errMessage: message.errMessage,
  });
};

const handleCreateNurse = async (req, res) => {
  const {
    MaYT,
    HoYT,
    TenYT,
    SoDT,
    Email,
    BangCap,
    ChuyenMon,
    GioiTinh,
    MaNguoiDung,
    GhiChu,
  } = req.body;
  console.log("req", req.body);
  if (
    !MaYT ||
    !HoYT ||
    !TenYT ||
    !SoDT ||
    !Email ||
    !BangCap ||
    !ChuyenMon ||
    !GioiTinh ||
    !MaNguoiDung ||
    !GhiChu
  ) {
    return res.status(500).json({
      errCode: 1,
      errMessage: "Thiếu tham số đầu vào!",
    });
  } else {
    let message = await createNewNurse(
      MaYT,
      HoYT,
      TenYT,
      SoDT,
      Email,
      BangCap,
      ChuyenMon,
      GioiTinh,
      MaNguoiDung,
      GhiChu
    );

    return res.status(200).json({
      errCode: message?.errCode,
      errMessage: message?.errMessage,
    });
  }
};

const handleUpdateNurse = async (req, res) => {
  console.log("check update", req.body.data);
  console.log("check update", req.body);
  if (!req.body?.data?.MaYT && !req.body?.MaYT) {
    return res.status(500).json({
      errCode: 1,
      errMessage: "Thiếu mã y tá!",
    });
  } else {
    let data = req.body.data ? req.body.data : req.body;
    let message = await updateNurse(data);

    console.log(message);

    return res.status(200).json({
      errCode: message?.errCode,
      errMessage: message?.errMessage,
    });
  }
};

const handleGetAllNurse = async (req, res) => {
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
  let nurses = await getAllNurse(id);

  return res.status(200).json({
    errCode: nurses.errCode,
    errMessage: nurses.errMessage,
    data: nurses.nurse,
  });
};

let handleDeleteNurse = async (req, res) => {
  console.log("check body", req.body);
  let nurseId = req.body?.data?.MaYT ? req.body?.data?.MaYT : req.body.MaYT;
  if (!nurseId) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Thiếu tham số đầu vào!",
    });
  }
  let message = await deleteNurse(nurseId);
  console.log("check message", message);
  return res.status(200).json({
    errCode: message.errCode,
    errMessage: message.errMessage,
  });
};

const handleCreateDoctorSchedule = async (req, res) => {
  const { Ngay, Buoi, MaBS, SoLuongBNToiDa, GhiChu } = req.body;
  if (!Ngay || !Buoi || !MaBS || !SoLuongBNToiDa || !GhiChu) {
    return res.status(500).json({
      errCode: 1,
      errMessage: "Thiếu tham số đầu vào!",
    });
  } else {
    let message = await createNewDoctorSchedule(
      Ngay,
      Buoi,
      MaBS,
      SoLuongBNToiDa,
      GhiChu
    );
    return res.status(200).json({
      errCode: message?.errCode,
      errMessage: message?.errMessage,
    });
  }
};

const handleUpdateDoctorSchedule = async (req, res) => {
  console.log("check", req.body);
  console.log("check", req.body?.data);
  let Ngay = req.body.data.Ngay ? req.body.data.Ngay : req.body.Ngay;
  let Buoi = req.body.data.Buoi ? req.body.data.Buoi : req.body.Buoi;
  let MaBS = req.body.data.MaBS ? req.body.data.MaBS : req.body.MaBS;
  if (!Ngay && !Buoi && !MaBS) {
    return res.status(500).json({
      errCode: 1,
      errMessage: "Thiếu tham số đầu vào!",
    });
  } else {
    let data = req.body?.data ? req.body?.data : req.body;

    let message = await updateDoctorSchedule(data);

    console.log(message);

    return res.status(200).json({
      errCode: message?.errCode,
      errMessage: message?.errMessage,
    });
  }
};

const handleGetAllDoctorSchedule = async (req, res) => {
  let id = req.query.id;
  //ko có id
  if (!id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Thiếu tham số đầu vào",
      users: [],
    });
  }
  let schedules = await getAllDoctorSchedule(id);

  if (schedules && schedules.schedule && schedules.schedule.length > 0) {
    for (let i = 0; i < schedules.schedule.length; i++) {
      let ngayGio = new Date(schedules.schedule[i].Ngay);

      // Tăng thêm 1 ngày
      ngayGio.setDate(ngayGio.getDate() + 1);

      // Định dạng lại ngày thành chuỗi ngày tháng (ví dụ: "YYYY-MM-DD")
      let ngayMoi = ngayGio.toISOString().split("T")[0];

      // Cập nhật Ngay thành ngày mới
      schedules.schedule[i].Ngay = ngayMoi;
    }
  }
  //có id

  return res.status(200).json({
    errCode: schedules.errCode,
    errMessage: schedules.errMessage,
    data: schedules.schedule,
  });
};

const handleDeleteDoctorSchedule = async (req, res) => {
  console.log("check del", req.body);
  let { Ngay, Buoi, MaBS } = req.body;
  if (!Ngay || !Buoi || !MaBS) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Thiếu tham số đầu vào!",
    });
  }

  let message = await deleteDoctorSchedule(Ngay, Buoi, MaBS);
  console.log("check message", message);
  return res.status(200).json({
    errCode: message.errCode,
    errMessage: message.errMessage,
  });
};

const handleCreatePatientAppointment = async (req, res) => {
  console.log("check add", req.body);
  const { Ngay, Buoi, MaBS, MaBN } = req.body;
  if (!Ngay || !Buoi || !MaBS || !MaBN) {
    return res.status(500).json({
      errCode: 1,
      errMessage: "Thiếu tham số đầu vào!",
    });
  } else {
    let message = await createNewPatientAppointment(Ngay, Buoi, MaBS, MaBN);
    return res.status(200).json({
      errCode: message?.errCode,
      errMessage: message?.errMessage,
    });
  }
};

const handleGetAllPatientAppointment = async (req, res) => {
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
  let appointments = await getAllPatientAppointment(id);

  if (
    appointments &&
    appointments.appointment &&
    appointments.appointment.length > 0
  ) {
    for (let i = 0; i < appointments.appointment.length; i++) {
      let ngayGio = new Date(appointments.appointment[i].Ngay);

      // Tăng thêm 1 ngày
      ngayGio.setDate(ngayGio.getDate() + 1);

      // Định dạng lại ngày thành chuỗi ngày tháng (ví dụ: "YYYY-MM-DD")
      let ngayMoi = ngayGio.toISOString().split("T")[0];

      // Cập nhật Ngay thành ngày mới
      appointments.appointment[i].Ngay = ngayMoi;
    }
  }
  return res.status(200).json({
    errCode: appointments.errCode,
    errMessage: appointments.errMessage,
    data: appointments.appointment,
  });
};

const handleDeletePatientAppointment = async (req, res) => {
  console.log("check del", req.body);
  const { Ngay, Buoi, MaBS, MaBN } = req.body;
  if (!Ngay || !Buoi || !MaBS || !MaBN) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Thiếu tham số đầu vào!",
    });
  }
  let message = await deletePatientAppointment(Ngay, Buoi, MaBS, MaBN);
  console.log("check message", message);
  return res.status(200).json({
    errCode: message.errCode,
    errMessage: message.errMessage,
  });
};

const handleCreatePatientMedicalService = async (req, res) => {
  console.log("check add", req.body);
  const { MaBN, MaDV, Ngay, Buoi, SoLuong, GhiChu } = req.body;
  if (!MaBN || !MaDV || !Ngay || !Buoi || !SoLuong || !GhiChu) {
    return res.status(500).json({
      errCode: 1,
      errMessage: "Thiếu tham số đầu vào!",
    });
  } else {
    let message = await createNewPatientMedicalService(
      MaBN,
      MaDV,
      Ngay,
      Buoi,
      SoLuong,
      GhiChu
    );
    return res.status(200).json({
      errCode: message?.errCode,
      errMessage: message?.errMessage,
    });
  }
};

const handleUpdatePatientMedicalService = async (req, res) => {
  console.log("check update", req.body);
  console.log("check update", req.body?.data);
  const { MaBN, MaDV, Ngay, Buoi } = req.body;
  // let MaBN = req.body.data.MaBN ? req.body.data.MaBN : req.body.MaBN;
  // let MaDV = req.body.data.MaDV ? req.body.data.MaDV : req.body.MaDV;
  // let Ngay = req.body.data.Ngay ? req.body.data.Ngay : req.body.Ngay;
  // let Buoi = req.body.data.Buoi ? req.body.data.Buoi : req.body.Buoi;
  if (!MaBN && !MaDV && !Ngay && !Buoi) {
    return res.status(500).json({
      errCode: 1,
      errMessage: "Thiếu tham số đầu vào!",
    });
  } else {
    let data = req.body?.data ? req.body?.data : req.body;

    let message = await updatePatientMedicalService(data);

    console.log(message);

    return res.status(200).json({
      errCode: message?.errCode,
      errMessage: message?.errMessage,
    });
  }
};

const handleGetAllPatientMedicalService = async (req, res) => {
  let id = req.query.id;
  //ko có id
  if (!id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Thiếu tham số đầu vào",
      users: [],
    });
  }
  let patient_medicals = await getAllPatientMedicalService(id);

  if (
    patient_medicals &&
    patient_medicals.patient_medical &&
    patient_medicals.patient_medical.length > 0
  ) {
    for (let i = 0; i < patient_medicals.patient_medical.length; i++) {
      let ngayGio = new Date(patient_medicals.patient_medical[i].Ngay);

      // Tăng thêm 1 ngày
      ngayGio.setDate(ngayGio.getDate() + 1);

      // Định dạng lại ngày thành chuỗi ngày tháng (ví dụ: "YYYY-MM-DD")
      let ngayMoi = ngayGio.toISOString().split("T")[0];

      // Cập nhật Ngay thành ngày mới
      patient_medicals.patient_medical[i].Ngay = ngayMoi;
    }
  }
  //có id

  return res.status(200).json({
    errCode: patient_medicals.errCode,
    errMessage: patient_medicals.errMessage,
    data: patient_medicals.patient_medical,
  });
};

const handleDeletePatientMedicalService = async (req, res) => {
  console.log("check del", req.body);
  let { MaBN, MaDV, Ngay, Buoi } = req.body;
  if (!MaBN || !MaDV || !Ngay || !Buoi) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Thiếu tham số đầu vào!",
    });
  }

  let message = await deletePatientMedicalService(MaBN, MaDV, Ngay, Buoi);
  console.log("check message", message);
  return res.status(200).json({
    errCode: message.errCode,
    errMessage: message.errMessage,
  });
};

const handleCreateMedicalExamination = async (req, res) => {
  console.log("check add", req.body);
  const { MaBS, MaBN, Ngay, Buoi, MaYTa, KetQuaChuanDoanBenh, GhiChu } =
    req.body;
  if (
    !MaBS ||
    !MaBN ||
    !Ngay ||
    !Buoi ||
    !MaYTa ||
    !KetQuaChuanDoanBenh ||
    !GhiChu
  ) {
    return res.status(500).json({
      errCode: 1,
      errMessage: "Thiếu tham số đầu vào!",
    });
  } else {
    let message = await createNewMedicalExamination(
      MaBS,
      MaBN,
      Ngay,
      Buoi,
      MaYTa,
      KetQuaChuanDoanBenh,
      GhiChu
    );
    return res.status(200).json({
      errCode: message?.errCode,
      errMessage: message?.errMessage,
    });
  }
};

const handleUpdateMedicalExamination = async (req, res) => {
  console.log("check update", req.body);
  console.log("check update", req.body?.data);
  const { MaBS, MaBN, Ngay, Buoi, MaYTa, KetQuaChuanDoanBenh, GhiChu } =
    req.body;
  // let MaBS = req.body.data.MaBS ? req.body.data.MaBS : req.body.MaBS;
  // let MaBN = req.body.data.MaBN ? req.body.data.MaBN : req.body.MaBN;
  // let Ngay = req.body.data.Ngay ? req.body.data.Ngay : req.body.Ngay;
  // let Buoi = req.body.data.Buoi ? req.body.data.Buoi : req.body.Buoi;
  if (
    !MaBS &&
    !MaBN &&
    !Ngay &&
    !Buoi &&
    !MaYTa &&
    !KetQuaChuanDoanBenh &&
    !GhiChu
  ) {
    return res.status(500).json({
      errCode: 1,
      errMessage: "Thiếu tham số đầu vào!",
    });
  } else {
    let data = req.body?.data ? req.body?.data : req.body;

    let message = await updateMedicalExamination(data);

    console.log(message);

    return res.status(200).json({
      errCode: message?.errCode,
      errMessage: message?.errMessage,
    });
  }
};

const handleGetAllMedicalExamination = async (req, res) => {
  let id = req.query.id;
  //ko có id
  if (!id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Thiếu tham số đầu vào",
      users: [],
    });
  }
  let medical_examinations = await getAllMedicalExamination(id);

  if (
    medical_examinations &&
    medical_examinations.medical_examination &&
    medical_examinations.medical_examination.length > 0
  ) {
    for (let i = 0; i < medical_examinations.medical_examination.length; i++) {
      let ngayGio = new Date(medical_examinations.medical_examination[i].Ngay);

      // Tăng thêm 1 ngày
      ngayGio.setDate(ngayGio.getDate() + 1);

      // Định dạng lại ngày thành chuỗi ngày tháng (ví dụ: "YYYY-MM-DD")
      let ngayMoi = ngayGio.toISOString().split("T")[0];

      // Cập nhật Ngay thành ngày mới
      medical_examinations.medical_examination[i].Ngay = ngayMoi;
    }
  }
  //có id

  return res.status(200).json({
    errCode: medical_examinations.errCode,
    errMessage: medical_examinations.errMessage,
    data: medical_examinations.medical_examination,
  });
};

const handleDeleteMedicalExamination = async (req, res) => {
  console.log("check del", req.body);
  let { MaBS, MaBN, Ngay, Buoi } = req.body;
  if (!MaBS || !MaBN || !Ngay || !Buoi) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Thiếu tham số đầu vào!",
    });
  }

  let message = await deleteMedicalExamination(MaBS, MaBN, Ngay, Buoi);
  console.log("check message", message);
  return res.status(200).json({
    errCode: message.errCode,
    errMessage: message.errMessage,
  });
};
module.exports = {
  handleLogin,
  handleCreateNewUser,
  handleDeleteUser,
  handleCreateNewPatient,
  handleUpdatePatient,
  handleGetAllPatient,
  handleDeletePatient,
  handleCreateMedicalService,
  handleUpdateMedicalService,
  handleGetAllMedicalService,
  handleDeleteMedicalService,
  userRefreshTokenController,
  handleCreateDoctor,
  handleUpdateDoctor,
  handleGetAllDoctor,
  handleDeleteDoctor,
  handleCreateNurse,
  handleUpdateNurse,
  handleGetAllNurse,
  handleDeleteNurse,
  handleCreateDoctorSchedule,
  handleUpdateDoctorSchedule,
  handleGetAllDoctorSchedule,
  handleDeleteDoctorSchedule,
  handleCreatePatientAppointment,
  handleGetAllPatientAppointment,
  handleDeletePatientAppointment,
  handleCreatePatientMedicalService,
  handleUpdatePatientMedicalService,
  handleGetAllPatientMedicalService,
  handleDeletePatientMedicalService,
  handleCreateMedicalExamination,
  handleUpdateMedicalExamination,
  handleGetAllMedicalExamination,
  handleDeleteMedicalExamination,
};
