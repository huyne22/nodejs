const connection = require("../config/database");
const {
  handleUserLogin,
  createNewUser,
  createNewPatient,
  getAllUser,
  updateUser,
  updatePatient,
  getAllPatient,
  deletePatient,
  createMedicalService,
  updateMedicalService,
  getAllMedicalService,
  deleteMedicalService,
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
  createNewNurseSchedule,
  updateNurseSchedule,
  getAllNurseSchedule,
  deleteNurseSchedule,
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
  getPatientSearch,
  getPatientApointmentSearch,
  getMedicalExaminationSearch,
  getDoctorScheduleSearch,
  getPatientMedicalServiceSearch,
  getMedicalServiceSearch,
  getDoctorSearch,
  getUserSearch,
  getNurseSearch,
  getMedicineSearch,
  createNewMedicine,
  updateMedicine,
  getAllMedicine,
  deleteMedicine,
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
  let access_token = userData?.data?.access_token;
  res.cookie("access_token", access_token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  return res.status(200).json({
    errCode: userData.errCode,
    errMessage: userData.errMessage,
    data: userData?.user ? userData?.user : {},
    token: userData?.data ? userData?.data : {},
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

const handleUpdateUser = async (req, res) => {
  console.log("check body", req.body.data);
  console.log("check body", req.body);
  if (!req.body?.data?.MaNguoiDung && !req.body?.MaNguoiDung) {
    return res.status(500).json({
      errCode: 1,
      errMessage: "Thiếu mã người dùng!",
    });
  } else {
    let data = req.body.data ? req.body.data : req.body;
    let message = await updateUser(data);

    console.log(message);

    return res.status(200).json({
      errCode: message?.errCode,
      errMessage: message?.errMessage,
    });
  }
};
let handleGetAllUser = async (req, res) => {
  let id = req.query.id;
  console.log("check req.query", req.query);
  //ko có id
  if (!id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Thiếu tham số đầu vào",
      users: [],
    });
  }
  //có id
  let users = await getAllUser(req.query);

  return res.status(200).json({
    errCode: users.errCode,
    errMessage: users.errMessage,
    data: users.user,
    pagination: users?.pagination,
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
  console.log("check req.query", req.query);
  //ko có id
  if (!id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Thiếu tham số đầu vào",
      users: [],
    });
  }
  //có id
  let patients = await getAllPatient(req.query);

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
    pagination: patients?.pagination,
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
  let services = await getAllMedicalService(req.query);
  return res.status(200).json({
    errCode: services.errCode,
    errMessage: services.errMessage,
    data: services.service,
    pagination: services?.pagination,
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

// const userRefreshTokenController = async (req, res) => {
//   try {
//     const refreshTolken = req.headers.token.split(" ")[1];
//     if (refreshTolken) {
//       const response = await refreshTokenService(refreshTolken);
//       return res.json(response);
//     } else {
//       return res.json({
//         message: "The refreshTolken is not valid",
//       });
//     }
//   } catch (err) {
//     return res.json({
//       status: "err",
//       message: err,
//     });
//   }
// };

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
  let doctors = await getAllDoctor(req.query);

  return res.status(200).json({
    errCode: doctors.errCode,
    errMessage: doctors.errMessage,
    data: doctors.doctor,
    pagination: doctors?.pagination,
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
  let nurses = await getAllNurse(req.query);

  return res.status(200).json({
    errCode: nurses.errCode,
    errMessage: nurses.errMessage,
    data: nurses.nurse,
    pagination: nurses?.pagination,
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
  let schedules = await getAllDoctorSchedule(req.query);

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
    pagination: schedules?.pagination,
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

const handleCreateNurseSchedule = async (req, res) => {
  const { Ngay, Buoi, MaYTa, SoLuongBNToiDa, GhiChu } = req.body;
  if (!Ngay || !Buoi || !MaYTa || !SoLuongBNToiDa || !GhiChu) {
    return res.status(500).json({
      errCode: 1,
      errMessage: "Thiếu tham số đầu vào!",
    });
  } else {
    let message = await createNewNurseSchedule(
      Ngay,
      Buoi,
      MaYTa,
      SoLuongBNToiDa,
      GhiChu
    );
    return res.status(200).json({
      errCode: message?.errCode,
      errMessage: message?.errMessage,
    });
  }
};

const handleUpdateNurseSchedule = async (req, res) => {
  console.log("check", req.body);
  console.log("check", req.body?.data);
  let Ngay = req.body.data.Ngay ? req.body.data.Ngay : req.body.Ngay;
  let Buoi = req.body.data.Buoi ? req.body.data.Buoi : req.body.Buoi;
  let MaYTa = req.body.data.MaYTa ? req.body.data.MaYTa : req.body.MaYTa;
  if (!Ngay && !Buoi && !MaYTa) {
    return res.status(500).json({
      errCode: 1,
      errMessage: "Thiếu tham số đầu vào!",
    });
  } else {
    let data = req.body?.data ? req.body?.data : req.body;

    let message = await updateNurseSchedule(data);

    console.log(message);

    return res.status(200).json({
      errCode: message?.errCode,
      errMessage: message?.errMessage,
    });
  }
};

const handleGetAllNurseSchedule = async (req, res) => {
  let id = req.query.id;
  //ko có id
  if (!id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Thiếu tham số đầu vào",
      users: [],
    });
  }
  let schedules = await getAllNurseSchedule(req.query);

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
    pagination: schedules?.pagination,
  });
};

const handleDeleteNurseSchedule = async (req, res) => {
  console.log("check del", req.body);
  let { Ngay, Buoi, MaYTa } = req.body;
  if (!Ngay || !Buoi || !MaYTa) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Thiếu tham số đầu vào!",
    });
  }

  let message = await deleteNurseSchedule(Ngay, Buoi, MaYTa);
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
  let appointments = await getAllPatientAppointment(req.query);

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
    pagination: appointments?.pagination,
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
  // const { MaBN, MaDV, Ngay, Buoi, SoLuong, GhiChu } = req.body;
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
  const { MaBN, MaDV, Ngay, Buoi } = req.body.data;
  // const { MaBN, MaDV, Ngay, Buoi } = req.body;
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
  let patient_medicals = await getAllPatientMedicalService(req.query);

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
    pagination: patient_medicals?.pagination,
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
  const {
    MaBS,
    MaBN,
    Ngay,
    Buoi,
    MaYTa,
    KetQuaChuanDoanBenh,
    GhiChu,
    MaThuoc,
    ThanhToan,
  } = req.body;
  if (
    !MaBS ||
    !MaBN ||
    !Ngay ||
    !Buoi ||
    !MaYTa ||
    !KetQuaChuanDoanBenh ||
    !GhiChu ||
    !MaThuoc ||
    !ThanhToan
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
      GhiChu,
      MaThuoc,
      ThanhToan
    );
    return res.status(200).json({
      errCode: message?.errCode,
      errMessage: message?.errMessage,
    });
  }
};

const handleUpdateMedicalExamination = async (req, res) => {
  // console.log("check update", req.body);
  console.log("check update", req.body?.data);
  // const {
  //   MaBS,
  //   MaBN,
  //   Ngay,
  //   Buoi,
  //   MaYTa,
  //   KetQuaChuanDoanBenh,
  //   GhiChu,
  //   MaThuoc,
  //   ThanhToan,
  // } = req.body;
  const {
    MaBS,
    MaBN,
    Ngay,
    Buoi,
    MaYTa,
    KetQuaChuanDoanBenh,
    GhiChu,
    MaThuoc,
    ThanhToan,
  } = req.body.data;
  if (
    !MaBS &&
    !MaBN &&
    !Ngay &&
    !Buoi &&
    !MaYTa &&
    !KetQuaChuanDoanBenh &&
    !GhiChu &&
    !MaThuoc &&
    !ThanhToan
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
  console.log("check", req.query);
  //ko có id
  if (!id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Thiếu tham số đầu vào",
      users: [],
    });
  }
  let medical_examinations = await getAllMedicalExamination(req.query);

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
    pagination: medical_examinations?.pagination,
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

const handlePatientSearch = async (req, res) => {
  let SoDT = req.body.sdt;
  // let SoDT = req.body;
  console.log("check sdt", req.body);
  //ko có id
  if (!SoDT) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Thiếu tham số đầu vào",
      users: [],
    });
  }
  let search_patient = await getPatientSearch(SoDT);

  return res.status(200).json({
    errCode: search_patient.errCode,
    errMessage: search_patient.errMessage,
    data: search_patient.tamp,
  });
};

const handlePatientApointmentSearch = async (req, res) => {
  let ngay = req.body.ngay;
  // let ngay = req.body;
  console.log("check ngay", req.body);
  //ko có id
  if (!ngay) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Thiếu tham số đầu vào",
      users: [],
    });
  }
  let search_patient_apointments = await getPatientApointmentSearch(ngay);
  if (
    search_patient_apointments &&
    search_patient_apointments.search_patient_apointment &&
    search_patient_apointments.search_patient_apointment.length > 0
  ) {
    for (
      let i = 0;
      i < search_patient_apointments.search_patient_apointment.length;
      i++
    ) {
      let ngayGio = new Date(
        search_patient_apointments.search_patient_apointment[i].Ngay
      );

      // Tăng thêm 1 ngày
      ngayGio.setDate(ngayGio.getDate() + 1);

      // Định dạng lại ngày thành chuỗi ngày tháng (ví dụ: "YYYY-MM-DD")
      let ngayMoi = ngayGio.toISOString().split("T")[0];

      // Cập nhật Ngay thành ngày mới
      search_patient_apointments.search_patient_apointment[i].Ngay = ngayMoi;
    }
  }
  return res.status(200).json({
    errCode: search_patient_apointments.errCode,
    errMessage: search_patient_apointments.errMessage,
    data: search_patient_apointments.search_patient_apointment,
  });
};

const handleMedicalExaminationSearch = async (req, res) => {
  let ngay = req.body.ngay;
  // let ngay = req.body;
  console.log("check ngay", req.body);
  //ko có id
  if (!ngay) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Thiếu tham số đầu vào",
      users: [],
    });
  }
  let search_medical_examinations = await getMedicalExaminationSearch(ngay);
  if (
    search_medical_examinations &&
    search_medical_examinations.search_medical_examination &&
    search_medical_examinations.search_medical_examination.length > 0
  ) {
    for (
      let i = 0;
      i < search_medical_examinations.search_medical_examination.length;
      i++
    ) {
      let ngayGio = new Date(
        search_medical_examinations.search_medical_examination[i].Ngay
      );

      // Tăng thêm 1 ngày
      ngayGio.setDate(ngayGio.getDate() + 1);

      // Định dạng lại ngày thành chuỗi ngày tháng (ví dụ: "YYYY-MM-DD")
      let ngayMoi = ngayGio.toISOString().split("T")[0];

      // Cập nhật Ngay thành ngày mới
      search_medical_examinations.search_medical_examination[i].Ngay = ngayMoi;
    }
  }
  return res.status(200).json({
    errCode: search_medical_examinations.errCode,
    errMessage: search_medical_examinations.errMessage,
    data: search_medical_examinations.search_medical_examination,
  });
};

const handleDoctorScheduleSearch = async (req, res) => {
  let ngay = req.body.ngay;
  // let ngay = req.body;
  console.log("check ngay", req.body);
  //ko có id
  if (!ngay) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Thiếu tham số đầu vào",
      users: [],
    });
  }
  let search_doctor_schedules = await getDoctorScheduleSearch(ngay);
  if (
    search_doctor_schedules &&
    search_doctor_schedules.search_doctor_schedule &&
    search_doctor_schedules.search_doctor_schedule.length > 0
  ) {
    for (
      let i = 0;
      i < search_doctor_schedules.search_doctor_schedule.length;
      i++
    ) {
      let ngayGio = new Date(
        search_doctor_schedules.search_doctor_schedule[i].Ngay
      );

      // Tăng thêm 1 ngày
      ngayGio.setDate(ngayGio.getDate() + 1);

      // Định dạng lại ngày thành chuỗi ngày tháng (ví dụ: "YYYY-MM-DD")
      let ngayMoi = ngayGio.toISOString().split("T")[0];

      // Cập nhật Ngay thành ngày mới
      search_doctor_schedules.search_doctor_schedule[i].Ngay = ngayMoi;
    }
  }
  return res.status(200).json({
    errCode: search_doctor_schedules.errCode,
    errMessage: search_doctor_schedules.errMessage,
    data: search_doctor_schedules.search_doctor_schedule,
  });
};

const handlePatientMedicalServiceSearch = async (req, res) => {
  let ngay = req.body.ngay;
  // let ngay = req.body;
  console.log("check ngay", req.body);
  //ko có id
  if (!ngay) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Thiếu tham số đầu vào",
      users: [],
    });
  }
  let search_patient_medical_services = await getPatientMedicalServiceSearch(
    ngay
  );
  if (
    search_patient_medical_services &&
    search_patient_medical_services.search_patient_medical_service &&
    search_patient_medical_services.search_patient_medical_service.length > 0
  ) {
    for (
      let i = 0;
      i < search_patient_medical_services.search_patient_medical_service.length;
      i++
    ) {
      let ngayGio = new Date(
        search_patient_medical_services.search_patient_medical_service[i].Ngay
      );

      // Tăng thêm 1 ngày
      ngayGio.setDate(ngayGio.getDate() + 1);

      // Định dạng lại ngày thành chuỗi ngày tháng (ví dụ: "YYYY-MM-DD")
      let ngayMoi = ngayGio.toISOString().split("T")[0];

      // Cập nhật Ngay thành ngày mới
      search_patient_medical_services.search_patient_medical_service[i].Ngay =
        ngayMoi;
    }
  }
  return res.status(200).json({
    errCode: search_patient_medical_services.errCode,
    errMessage: search_patient_medical_services.errMessage,
    data: search_patient_medical_services.search_patient_medical_service,
  });
};
const handleCreateMedicine = async (req, res) => {
  console.log("check add", req.body);
  const { MaThuoc, TenThuoc, CongDung, DonVi, SoLuong, GhiChu } = req.body;
  if (!MaThuoc || !TenThuoc || !CongDung || !DonVi || !SoLuong || !GhiChu) {
    return res.status(500).json({
      errCode: 1,
      errMessage: "Thiếu tham số đầu vào!",
    });
  } else {
    let message = await createNewMedicine(
      MaThuoc,
      TenThuoc,
      CongDung,
      DonVi,
      SoLuong,
      GhiChu
    );
    return res.status(200).json({
      errCode: message?.errCode,
      errMessage: message?.errMessage,
    });
  }
};

const handleUpdateMedicine = async (req, res) => {
  console.log("check update", req.body);
  console.log("check update", req.body?.data);
  // const { MaThuoc, TenThuoc, CongDung, DonVi, SoLuong, GhiChu } = req.body;
  const { MaThuoc, TenThuoc, CongDung, DonVi, SoLuong, GhiChu } = req.body.data;
  if (!MaThuoc && !TenThuoc && !CongDung && !DonVi && !SoLuong && !GhiChu) {
    return res.status(500).json({
      errCode: 1,
      errMessage: "Thiếu tham số đầu vào!",
    });
  } else {
    let data = req.body?.data ? req.body?.data : req.body;

    let message = await updateMedicine(data);

    console.log(message);

    return res.status(200).json({
      errCode: message?.errCode,
      errMessage: message?.errMessage,
    });
  }
};

const handleGetAllMedicine = async (req, res) => {
  let id = req.query.id;
  //ko có id
  if (!id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Thiếu tham số đầu vào",
      users: [],
    });
  }
  let medicines = await getAllMedicine(req.query);
  return res.status(200).json({
    errCode: medicines.errCode,
    errMessage: medicines.errMessage,
    data: medicines.medicine,
    pagination: medicines?.pagination,
  });
};

const handleDeleteMedicine = async (req, res) => {
  console.log("check del", req.body);
  let { MaThuoc } = req?.body?.data;
  if (!MaThuoc) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Thiếu tham số đầu vào!",
    });
  }

  let message = await deleteMedicine(MaThuoc);
  console.log("check message", message);
  return res.status(200).json({
    errCode: message.errCode,
    errMessage: message.errMessage,
  });
};

const handleMedicalServiceSearch = async (req, res) => {
  let ten = req.body?.tenDV;
  // let ngay = req.body;
  // console.log("check ngay", req.body);
  //ko có id
  if (!ten) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Thiếu tham số đầu vào",
      users: [],
    });
  }
  let search_medical_services = await getMedicalServiceSearch(ten);
  return res.status(200).json({
    errCode: search_medical_services.errCode,
    errMessage: search_medical_services.errMessage,
    data: search_medical_services.search_medical_service,
  });
};

const handleDoctorSearch = async (req, res) => {
  let ten = req.body?.tenBS;
  // let ten = req.body;
  console.log("check ngay", req.body);
  //ko có id
  if (!ten) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Thiếu tham số đầu vào",
      users: [],
    });
  }
  let search_doctors = await getDoctorSearch(ten);
  return res.status(200).json({
    errCode: search_doctors.errCode,
    errMessage: search_doctors.errMessage,
    data: search_doctors.search_doctor,
  });
};

const handleUserSearch = async (req, res) => {
  let ten = req.body?.tenDangNhap;
  // let ten = req.body;
  console.log("check ngay", req.body);
  //ko có id
  if (!ten) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Thiếu tham số đầu vào",
      users: [],
    });
  }
  let search_users = await getUserSearch(ten);
  return res.status(200).json({
    errCode: search_users.errCode,
    errMessage: search_users.errMessage,
    data: search_users.search_user,
  });
};

const handleNurseSearch = async (req, res) => {
  let ten = req.body?.tenYT;
  // let ten = req.body;
  console.log("check ngay", req.body);
  //ko có id
  if (!ten) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Thiếu tham số đầu vào",
      users: [],
    });
  }
  let search_nurses = await getNurseSearch(ten);
  return res.status(200).json({
    errCode: search_nurses.errCode,
    errMessage: search_nurses.errMessage,
    data: search_nurses.search_nurse,
  });
};

const handleMedicineSearch = async (req, res) => {
  let ten = req.body?.TenThuoc;
  // let ten = req.body;
  console.log("check ngay", req.body);
  //ko có id
  if (!ten) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Thiếu tham số đầu vào",
      users: [],
    });
  }
  let search_medicines = await getMedicineSearch(ten);
  return res.status(200).json({
    errCode: search_medicines.errCode,
    errMessage: search_medicines.errMessage,
    data: search_medicines.search_medicine,
  });
};
module.exports = {
  handleLogin,
  handleCreateNewUser,
  handleDeleteUser,
  handleGetAllUser,
  handleUpdateUser,
  handleCreateNewPatient,
  handleUpdatePatient,
  handleGetAllPatient,
  handleDeletePatient,
  handleCreateMedicalService,
  handleUpdateMedicalService,
  handleGetAllMedicalService,
  handleDeleteMedicalService,
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
  handleCreateNurseSchedule,
  handleUpdateNurseSchedule,
  handleGetAllNurseSchedule,
  handleDeleteNurseSchedule,
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
  handlePatientSearch,
  handlePatientApointmentSearch,
  handleMedicalExaminationSearch,
  handleDoctorScheduleSearch,
  handlePatientMedicalServiceSearch,
  handleMedicalServiceSearch,
  handleDoctorSearch,
  handleUserSearch,
  handleNurseSearch,
  handleMedicineSearch,
  handleCreateMedicine,
  handleUpdateMedicine,
  handleGetAllMedicine,
  handleDeleteMedicine,
};
