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
            delete user.MatKhau;
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
        userData.errMessage = `TenDN của bạn không tồn tại trong hệ thống. Vui lòng thử TenDN khác.`;
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
      //check TenDN đã có chưa
      let check = await checkUserEmail(TenDangNhap);
      if (check) {
        //có tồn tại
        resolve({
          errCode: 1,
          errMessage:
            "Email của bạn đã được sử dụng, Vui lòng thử một địa chỉ email khác!",
        });
      } else {
        //chưa có TenDN
        //hash MatKhau
        let hashPasswordFromBcrypt = await hashUserPassword(MatKhau);
        // Thực hiện truy vấn SQL để thêm người dùng mới vào cơ sở dữ liệu
        const sql =
          "INSERT INTO NguoiDung (TenDangNhap, MatKhau) VALUES (?, ?)";
        await (
          await connection
        ).query(sql, [TenDangNhap, hashPasswordFromBcrypt]);
        resolve({
          errCode: 0,
          errMessage: "OK! Tạo người dùng thành công!",
        });
      }
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
  DiaChi
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql =
        "INSERT INTO BenhNhan (MaBN, HoBN, TenBN, SoDT, Email, NgaySinh, GioiTinh, DiaChi) VALUES (?, ?,?,?,?,?,?,?)";
      await (
        await connection
      ).query(sql, [
        MaBN,
        HoBN,
        TenBN,
        SoDT,
        Email,
        NgaySinh,
        GioiTinh,
        DiaChi,
      ]);
      resolve({
        errCode: 0,
        errMessage: "OK! Tạo bênh nhân thành công!",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updatePatient = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      //TH ko truyền id
      if (!data.MaBN) {
        resolve({
          errCode: 2,
          errMessage: "Thiếu Mã Bệnh Nhân!",
        });
      } else {
        let sql = "SELECT * FROM BenhNhan bn WHERE MaBN =?";
        let tamp = await (await connection).query(sql, [data.MaBN]);
        if (tamp[0].length) {
          if (
            data.HoBN ||
            data.TenBN ||
            data.SoDT ||
            data.Email ||
            data.NgaySinh ||
            data.GioiTinh ||
            data.DiaChi
          ) {
            let sql = "UPDATE BenhNhan SET ";
            const params = [];
            const placeholders = [];

            if (data.HoBN) {
              placeholders.push("HoBN=?");
              params.push(data.HoBN);
            }
            if (data.TenBN) {
              placeholders.push("TenBN=?");
              params.push(data.TenBN);
            }
            if (data.SoDT) {
              placeholders.push("SoDT=?");
              params.push(data.SoDT);
            }
            if (data.Email) {
              placeholders.push("Email=?");
              params.push(data.Email);
            }
            if (data.NgaySinh) {
              placeholders.push("NgaySinh=?");
              params.push(data.NgaySinh);
            }
            if (data.GioiTinh) {
              placeholders.push("GioiTinh=?");
              params.push(data.GioiTinh);
            }
            if (data.DiaChi) {
              placeholders.push("DiaChi=?");
              params.push(data.DiaChi);
            }

            // Xây dựng câu lệnh SQL
            sql += placeholders.join(", ") + " WHERE MaBN=?";
            params.push(data.MaBN);

            await (await connection).query(sql, params);

            resolve({
              errCode: 0,
              errMessage: "Cập nhật thông tin bệnh nhân thành công!",
            });
          } else {
            resolve({
              errCode: 3,
              errMessage: "Không có trường dữ liệu nào được cập nhật!",
            });
          }
        } else {
          resolve({
            errCode: 2,
            errMessage: "Không tim thấy MaBN!",
          });
        }
        // Kiểm tra xem có ít nhất một trường dữ liệu cần cập nhật không
      }
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
      //tìm bệnh nhân
      let sql = "SELECT * FROM BenhNhan bn WHERE MaBN =?";
      let patient = await (await connection).query(sql, [patientId]);
      if (patient[0].length) {
        //xóa ở đây
        let sql1 = "DELETE FROM BenhNhan WHERE MaBN = ?";
        await (await connection).query(sql1, [patientId]);
        resolve({
          errCode: 0,
          errMessage: "Xóa bệnh nhân thành công!",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "Không tìm thấy bệnh nhân!",
        });
      }
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
};
