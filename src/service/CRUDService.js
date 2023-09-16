const { query } = require("express");
const connection = require("../config/database");
const bcrypt = require("bcryptjs");

//muối để băm
const salt = bcrypt.genSaltSync(10);

//api
//xử lí khi người dùng đăng nhập
const handleUserLogin = (TenDangNhap, MatKhau) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};

      let isExist = await checkUserEmail(TenDangNhap); //check TenDN
      if (isExist) {
        //người dùng đã tồn tại
        const sql = "SELECT * FROM NguoiDung WHERE TenDangNhap = ?";
        let user = await (await connection).query(sql, [TenDangNhap]);
        //lấy mk băm từ database ra
        let dbMatKhau = user[0][0].MatKhau;

        if (user) {
          console.log(dbMatKhau);
          //so sánh 2 mật khẩu
          let check = await bcrypt.compareSync(MatKhau, dbMatKhau);
          if (check) {
            userData.errCode = 0;
            userData.errMessage = "OK. Chào mừng admin";
            userData.user = user[0];
          } else {
            userData.errCode = 3;
            userData.errMessage = "Sai mật khẩu";
          }
        } else {
          userData.errCode = 2;
          userData.errMessage = `Không tìm thấy người dùng`;
        }
      } else {
        userData.errCode = 1;
        userData.errMessage = `TenDN của bạn không hợp lệ. Vui lòng thử TenDN khác.`;
      }

      resolve(userData);
    } catch (e) {
      reject(e);
    }
  });
};
//check email
let checkUserEmail = (TenDangNhap) => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT TenDangNhap FROM NguoiDung WHERE TenDangNhap = ?`;
      let user = await (await connection).query(sql, [TenDangNhap]);
      if (user[0].length > 0) {
        resolve(true); //TenDN tồn tại
      } else {
        resolve(false); //TenDN ko tồn tại
      }
    } catch (e) {
      reject(e);
    }
  });
};

//băm password
const hashUserPassword = (MatKhau) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(MatKhau, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};

//tạo mới người dùng
let createNewUser = (TenDangNhap, MatKhau) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = {};
      //check TenDN đã có chưa
      let check = await checkUserEmail(TenDangNhap);
      if (check) {
        (user.errCode = 1),
          (user.errMessage =
            "Email của bạn đã được sử dụng, Vui lòng thử một địa chỉ email khác!");
        //có tồn tại
      } else {
        //chưa có TenDN
        let hashPasswordFromBcrypt = await hashUserPassword(MatKhau);
        // Thực hiện truy vấn SQL để thêm người dùng mới vào cơ sở dữ liệu
        const sql =
          "INSERT INTO NguoiDung (TenDangNhap, MatKhau) VALUES (?, ?)";
        await (
          await connection
        ).query(sql, [TenDangNhap, hashPasswordFromBcrypt]);
        (user.errCode = 0),
          (user.errMessage = "OK! Tạo người dùng thành công!");
      }
      resolve(user);
    } catch (e) {
      reject(e);
    }
  });
};

const createNewPatient = (
  MaBN,
  HoBN,
  TenBN,
  SoDT,
  Email,
  NgaySinh,
  GioiTinh,
  DiaChi,
  GhiChu
) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = {};
      // if (!Number.isSafeInteger(Number(MaBN))) {
      //   resolve({
      //     errCode: 3,
      //     errMessage: "MaBN bắt buộc là số nguyên!",
      //   });
      // }
      let sql = `SELECT MaBN FROM BenhNhan WHERE MaBN = ?`;
      let patient = await (await connection).query(sql, [MaBN]);
      if (patient[0]?.length == 0) {
        const sql1 =
          "INSERT INTO BenhNhan (MaBN, HoBN, TenBN, SoDT, Email, NgaySinh, GioiTinh, DiaChi, GhiChu) VALUES (?, ?,?,?,?,?,?,?,?)";
        await (
          await connection
        ).query(sql1, [
          MaBN,
          HoBN,
          TenBN,
          SoDT,
          Email,
          NgaySinh,
          GioiTinh,
          DiaChi,
          GhiChu,
        ]);
        (user.errCode = 0), (user.errMessage = "OK! Tạo bênh nhân thành công!");
      } else {
        (user.errCode = 2), (user.errMessage = "Mã bệnh nhân đã tồn tại!");
      }
      resolve(user);
    } catch (e) {
      reject(e);
    }
  });
};

const updatePatient = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("data", data);
      let user = {};
      let sql = "SELECT * FROM BenhNhan bn WHERE MaBN =?";
      let tamp = await (await connection).query(sql, [data?.MaBN]);
      // console.log(tamp[0]?.length);
      if (tamp[0]?.length) {
        if (
          data?.HoBN ||
          data?.TenBN ||
          data?.SoDT ||
          data?.Email ||
          data?.NgaySinh ||
          data?.GioiTinh ||
          data?.DiaChi
        ) {
          // console.log("a");
          let sql = "UPDATE BenhNhan SET ";
          const params = [];
          const placeholders = [];

          if (data?.HoBN) {
            placeholders?.push("HoBN=?");
            params?.push(data?.HoBN);
          }
          if (data?.TenBN) {
            placeholders?.push("TenBN=?");
            params?.push(data?.TenBN);
          }
          if (data?.SoDT) {
            placeholders?.push("SoDT=?");
            params?.push(data?.SoDT);
          }
          if (data?.Email) {
            placeholders?.push("Email=?");
            params?.push(data?.Email);
          }
          if (data?.NgaySinh) {
            placeholders?.push("NgaySinh=?");
            params?.push(data?.NgaySinh);
          }
          if (data?.GioiTinh) {
            placeholders?.push("GioiTinh=?");
            params?.push(data?.GioiTinh);
          }
          if (data?.DiaChi) {
            placeholders?.push("DiaChi=?");
            params?.push(data?.DiaChi);
          }
          // console.log("check params", params);
          // console.log("check placeholders", placeholders);

          // Xây dựng câu lệnh SQL
          sql += placeholders?.join(", ") + " WHERE MaBN=?";
          params?.push(data?.MaBN);
          // console.log("check sql", sql);
          // console.log("check params", params);
          await (await connection)?.query(sql, params);
          (user.errCode = 0),
            (user.errMessage = "Cập nhật thông tin bệnh nhân thành công!");
        } else {
          (user.errCode = 3),
            (user.errMessage = "Không có trường dữ liệu nào được cập nhật!");
        }
      } else {
        (user.errCode = 2), (user.errMessage = "Không tim thấy MaBN!");
      }
      resolve(user);
    } catch (e) {
      reject(e);
    }
  });
};

const getAllPatient = (patientId) => {
  return new Promise(async (resolve, reject) => {
    try {
      //xét 2 Th cho nó
      let patient = "";
      if (patientId === "ALL") {
        let sql = "SELECT * FROM BenhNhan bn ";
        let tampAllPatient = await (await connection).query(sql);
        patient = tampAllPatient[0];
        resolve({
          errCode: 0,
          errMessage: "Thông tin của tất cả bệnh nhân là!",
          patient,
        });
      }

      if (patientId && Number.isSafeInteger(Number(patientId))) {
        let sql = "SELECT * FROM BenhNhan bn WHERE MaBN = ?";
        let tampAllPatient = await (await connection).query(sql, [patientId]);
        patient = tampAllPatient[0];
        resolve({
          errCode: 0,
          errMessage: "Thông tin của bệnh nhân trên là!",
          patient,
        });
      } else {
        resolve({
          errCode: 3,
          errMessage: "Mã Bệnh Nhân không hợp lệ!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const deletePatient = async (patientId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = {};
      //tìm bệnh nhân
      let sql = "SELECT * FROM BenhNhan bn WHERE MaBN =?";
      let patient = await (await connection).query(sql, [patientId]);
      if (patient[0]?.length) {
        //xóa ở đây
        let sql1 = "DELETE FROM BenhNhan WHERE MaBN = ?";
        await (await connection).query(sql1, [patientId]);
        (user.errCode = 0), (user.errMessage = "Xóa bệnh nhân thành công!");
      } else {
        (user.errCode = 1), (user.errMessage = "Không tìm thấy bệnh nhân!");
      }
      resolve(user);
    } catch (e) {
      reject(e);
    }
  });
};

const createMedicalService = (MaDV, TenDV, MoTaDV, GiaTien, GhiChu) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = {};

      let sql = `SELECT MaDV FROM DichVuYTe WHERE MaDV = ?`;
      let service = await (await connection).query(sql, [MaDV]);
      if (service[0]?.length == 0) {
        const sql1 =
          "INSERT INTO DichVuYTe (MaDV, TenDV, MoTaDV, GiaTien, GhiChu) VALUES (?, ?,?,?,?)";
        await (
          await connection
        ).query(sql1, [MaDV, TenDV, MoTaDV, GiaTien, GhiChu]);
        (user.errCode = 0), (user.errMessage = "OK! Tạo dịch vụ thành công!");
      } else {
        (user.errCode = 2), (user.errMessage = "Mã dịch vụ đã tồn tại!");
      }
      resolve(user);
    } catch (e) {
      reject(e);
    }
  });
};

const updateMedicalService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("data", data);
      let user = {};
      let sql = "SELECT * FROM DichVuYTe WHERE MaDV =?";
      let tamp = await (await connection).query(sql, [data?.MaDV]);
      // console.log(tamp[0]?.length);
      if (tamp[0]?.length) {
        if (data?.TenDV || data?.MoTaDV || data?.GiaTien || data?.GhiChu) {
          // console.log("a");
          let sql = "UPDATE DichVuYTe SET ";
          const params = [];
          const placeholders = [];

          if (data?.TenDV) {
            placeholders?.push("TenDV=?");
            params?.push(data?.TenDV);
          }
          if (data?.MoTaDV) {
            placeholders?.push("MoTaDV=?");
            params?.push(data?.MoTaDV);
          }
          if (data?.GiaTien) {
            placeholders?.push("GiaTien=?");
            params?.push(data?.GiaTien);
          }
          if (data?.GhiChu) {
            placeholders?.push("GhiChu=?");
            params?.push(data?.GhiChu);
          }
          console.log("check params", params);
          console.log("check placeholders", placeholders);

          // Xây dựng câu lệnh SQL
          sql += placeholders?.join(", ") + " WHERE MaDV=?";
          params?.push(data?.MaDV);
          console.log("check sql", sql);
          console.log("check params", params);
          await (await connection)?.query(sql, params);
          (user.errCode = 0),
            (user.errMessage = "Cập nhật thông tin dịch vụ thành công!");
        } else {
          (user.errCode = 3),
            (user.errMessage = "Không có trường dữ liệu nào được cập nhật!");
        }
      } else {
        (user.errCode = 2), (user.errMessage = "Không tim thấy MaDV!");
      }
      resolve(user);
    } catch (e) {
      reject(e);
    }
  });
};

const getAllMedicalService = (serviceId) => {
  return new Promise(async (resolve, reject) => {
    try {
      //xét 2 Th cho nó
      let service = "";
      if (serviceId === "ALL") {
        let sql = "SELECT * FROM DichVuYTe ";
        let tampAllService = await (await connection).query(sql);
        service = tampAllService[0];
        resolve({
          errCode: 0,
          errMessage: "Thông tin của tất cả dịch vụ là!",
          service,
        });
      }

      if (serviceId && Number.isSafeInteger(Number(serviceId))) {
        let sql = "SELECT * FROM DichVuYTe WHERE MaDV = ?";
        let tampAllService = await (await connection).query(sql, [serviceId]);
        service = tampAllService[0];
        resolve({
          errCode: 0,
          errMessage: "Thông tin của dịch vụ trên là!",
          service,
        });
      } else {
        resolve({
          errCode: 3,
          errMessage: "Mã Dịch vụ không hợp lệ!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const deleteMedicalService = async (serviceId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = {};
      //tìm
      let sql = "SELECT * FROM DichVuYTe WHERE MaDV =?";
      let service = await (await connection).query(sql, [serviceId]);
      if (service[0]?.length) {
        //xóa ở đây
        let sql1 = "DELETE FROM DichVuYTe WHERE MaDV = ?";
        await (await connection).query(sql1, [serviceId]);
        (user.errCode = 0), (user.errMessage = "Xóa dịch vụ thành công!");
      } else {
        (user.errCode = 1), (user.errMessage = "Không tìm thấy dịch vụ!");
      }
      resolve(user);
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
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
};
