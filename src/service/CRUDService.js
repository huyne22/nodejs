const { query } = require("express");
const connection = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // Đảm bảo bạn import jwt từ thư viện jwt

//muối để băm
const salt = bcrypt.genSaltSync(10);

const generalAcessToken = (data) => {
  const access_token = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "20s",
  });
  return access_token;
};

const generalRefreshToken = (data) => {
  const access_token = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "365d",
  });
  return access_token;
};

const refreshTokenService = (token) => {
  return new Promise((resolve, reject) => {
    try {
      jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, function (err, user) {
        if (err) {
          resolve(404).json({
            message: "The user is not authemtication",
          });
        }
        if (user) {
          const newAcessToken = generalAcessToken({
            isAdmin: user.isAdmin,
            _id: user._id,
          });
          resolve({
            status: "OK",
            access_token: newAcessToken,
          });
        } else {
          resolve({
            message: "The user is not authemtication",
          });
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};
//api
//xử lí khi người dùng đăng nhập
const handleUserLogin = (TenDangNhap, MatKhau) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};

      let isExist = await checkUserEmail(TenDangNhap); //check TenDN
      if (isExist) {
        console.log(isExist);
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
            const access_token = generalAcessToken({
              isAdmin: user[0].isAdmin,
              _id: user[0]._id,
            });
            const refresh_token = generalRefreshToken({
              isAdmin: user[0].isAdmin,
              _id: user[0]._id,
            });
            userData.errCode = 0;
            userData.errMessage = "OK. Chào mừng admin";
            userData.user = user[0];
            userData.data = {
              access_token,
              refresh_token,
            };
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
// const handleUserLogin = (TenDangNhap, MatKhau) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       let userData = {};

//       let isExist = await checkUserEmail(TenDangNhap);

//       if (isExist) {
//         const sql = "SELECT * FROM NguoiDung WHERE TenDangNhap = ?";
//         let user = await (await connection).query(sql, [TenDangNhap]);

//         // Kiểm tra người dùng và mật khẩu
//         if (user.length > 0 && bcrypt.compareSync(MatKhau, user[0].MatKhau)) {
//           const access_token = generalAcessToken({
//             isAdmin: user[0].isAdmin,
//             _id: user[0]._id,
//           });

//           const refresh_token = generalRefreshToken({
//             isAdmin: user[0].isAdmin,
//             _id: user[0]._id,
//           });

//           userData.errCode = 0;
//           userData.errMessage = "OK. Chào mừng admin";
//           userData.user = user[0];
//           userData.data = {
//             access_token,
//             refresh_token,
//           };
//         } else {
//           userData.errCode = 3;
//           userData.errMessage = "Sai mật khẩu";
//         }
//       } else {
//         userData.errCode = 2;
//         userData.errMessage = `Không tìm thấy người dùng`;
//       }

//       resolve(userData);
//     } catch (e) {
//       reject(e);
//     }
//   });
// };

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

const deleteUser = async (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = {};
      //tìm bệnh nhân
      let sql = "SELECT * FROM NguoiDung bn WHERE MaNguoiDung =?";
      let people = await (await connection).query(sql, [userId]);
      if (people[0]?.length) {
        //xóa ở đây
        let sql1 = "DELETE FROM NguoiDung WHERE MaNguoiDung = ?";
        await (await connection).query(sql1, [userId]);
        (user.errCode = 0), (user.errMessage = "Xóa người dùng thành công!");
      } else {
        (user.errCode = 1), (user.errMessage = "Không tìm thấy người dùng!");
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

const createNewDoctor = (
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
) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = {};
      let sql = `SELECT MaBS FROM BacSi WHERE MaBS = ?`;
      let sql2 = `SELECT MaNguoiDung FROM NguoiDung WHERE MaNguoiDung = ?`;
      let doctor = await (await connection).query(sql, [MaBS]);
      let check = await (await connection).query(sql2, [MaNguoiDung]);
      if (check[0].length === 0) {
        (user.errCode = 3), (user.errMessage = "Mã người dùng chưa tạo!");
      } else {
        if (doctor[0]?.length == 0) {
          const sql1 =
            "INSERT INTO BacSi (MaBS, HoBS, TenBS, SoDT, Email, BangCap, ChuyenMon, GioiTinh, MaNguoiDung, GhiChu) VALUES (?, ?,?,?,?,?,?,?,?,?)";
          await (
            await connection
          ).query(sql1, [
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
          ]);
          user.errCode = 0;
          user.errMessage = "OK! Tạo bác sĩ thành công!";
        } else {
          (user.errCode = 2), (user.errMessage = "Mã bác sĩ đã tồn tại!");
        }
      }
      resolve(user);
    } catch (e) {
      reject(e);
    }
  });
};

const updateDoctor = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("data", data);
      let user = {};
      let sql = "SELECT * FROM BacSi bn WHERE MaBS =?";
      let tamp = await (await connection).query(sql, [data?.MaBS]);
      // console.log(tamp[0]?.length);
      if (tamp[0]?.length) {
        if (
          data?.HoBS ||
          data?.TenBS ||
          data?.SoDT ||
          data?.Email ||
          data?.BangCap ||
          data?.ChuyenMon ||
          data?.GioiTinh ||
          data?.MaNguoiDung ||
          data?.GhiChu
        ) {
          // console.log("a");
          let sql = "UPDATE BacSi SET ";
          const params = [];
          const placeholders = [];

          if (data?.HoBS) {
            placeholders?.push("HoBS=?");
            params?.push(data?.HoBS);
          }
          if (data?.TenBS) {
            placeholders?.push("TenBS=?");
            params?.push(data?.TenBS);
          }
          if (data?.SoDT) {
            placeholders?.push("SoDT=?");
            params?.push(data?.SoDT);
          }
          if (data?.Email) {
            placeholders?.push("Email=?");
            params?.push(data?.Email);
          }
          if (data?.BangCap) {
            placeholders?.push("BangCap=?");
            params?.push(data?.BangCap);
          }
          if (data?.ChuyenMon) {
            placeholders?.push("ChuyenMon=?");
            params?.push(data?.ChuyenMon);
          }
          if (data?.GioiTinh) {
            placeholders?.push("GioiTinh=?");
            params?.push(data?.GioiTinh);
          }
          if (data?.MaNguoiDung) {
            placeholders?.push("MaNguoiDung=?");
            params?.push(data?.MaNguoiDung);
          }
          if (data?.GhiChu) {
            placeholders?.push("GhiChu=?");
            params?.push(data?.GhiChu);
          }

          // console.log("check params", params);
          // console.log("check placeholders", placeholders);

          // Xây dựng câu lệnh SQL
          sql += placeholders?.join(", ") + " WHERE MaBS=?";
          params?.push(data?.MaBS);
          // console.log("check sql", sql);
          // console.log("check params", params);
          await (await connection)?.query(sql, params);
          (user.errCode = 0),
            (user.errMessage = "Cập nhật thông tin bác sĩ thành công!");
        } else {
          (user.errCode = 3),
            (user.errMessage = "Không có trường dữ liệu nào được cập nhật!");
        }
      } else {
        (user.errCode = 2), (user.errMessage = "Không tim thấy MaBS!");
      }
      resolve(user);
    } catch (e) {
      reject(e);
    }
  });
};

const getAllDoctor = (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      //xét 2 Th cho nó
      let doctor = "";
      if (doctorId === "ALL") {
        let sql = "SELECT * FROM BacSi ";
        let tampAllDoctor = await (await connection).query(sql);
        doctor = tampAllDoctor[0];
        resolve({
          errCode: 0,
          errMessage: "Thông tin của tất cả bác sĩ là!",
          doctor,
        });
      }

      if (doctorId && Number.isSafeInteger(Number(doctorId))) {
        let sql = "SELECT * FROM BacSi bn WHERE MaBS = ?";
        let tampAllDoctor = await (await connection).query(sql, [doctorId]);
        doctor = tampAllDoctor[0];
        resolve({
          errCode: 0,
          errMessage: "Thông tin của bác sĩ trên là!",
          doctor,
        });
      } else {
        resolve({
          errCode: 3,
          errMessage: "Mã bác sĩ không hợp lệ!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const deleteDoctor = async (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = {};
      //tìm bệnh nhân
      let sql = "SELECT * FROM BacSi bn WHERE MaBS =?";
      let doctor = await (await connection).query(sql, [doctorId]);
      if (doctor[0]?.length) {
        //xóa ở đây
        let sql1 = "DELETE FROM BacSi WHERE MaBS = ?";
        await (await connection).query(sql1, [doctorId]);
        (user.errCode = 0), (user.errMessage = "Xóa bác sĩ thành công!");
      } else {
        (user.errCode = 1), (user.errMessage = "Không tìm thấy bác sĩ!");
      }
      resolve(user);
    } catch (e) {
      reject(e);
    }
  });
};

const createNewNurse = (
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
) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = {};
      let sql = `SELECT MaYT FROM YTa WHERE MaYT = ?`;
      let sql2 = `SELECT MaNguoiDung FROM NguoiDung WHERE MaNguoiDung = ?`;
      let nurse = await (await connection).query(sql, [MaYT]);
      let check = await (await connection).query(sql2, [MaNguoiDung]);
      if (check[0].length === 0) {
        (user.errCode = 3), (user.errMessage = "Mã người dùng chưa tạo!");
      } else {
        if (nurse[0]?.length == 0) {
          const sql1 =
            "INSERT INTO YTa (MaYT, HoYT, TenYT, SoDT, Email, BangCap, ChuyenMon, GioiTinh, MaNguoiDung, GhiChu) VALUES (?, ?,?,?,?,?,?,?,?,?)";
          await (
            await connection
          ).query(sql1, [
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
          ]);
          user.errCode = 0;
          user.errMessage = "OK! Tạo y tá thành công!";
        } else {
          (user.errCode = 2), (user.errMessage = "Mã y tá đã tồn tại!");
        }
      }
      resolve(user);
    } catch (e) {
      reject(e);
    }
  });
};

const updateNurse = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("data", data);
      let user = {};
      let sql = "SELECT * FROM YTa bn WHERE MaYT =?";
      let tamp = await (await connection).query(sql, [data?.MaYT]);
      // console.log(tamp[0]?.length);
      if (tamp[0]?.length) {
        if (
          data?.HoYT ||
          data?.TenYT ||
          data?.SoDT ||
          data?.Email ||
          data?.BangCap ||
          data?.ChuyenMon ||
          data?.GioiTinh ||
          data?.MaNguoiDung ||
          data?.GhiChu
        ) {
          // console.log("a");
          let sql = "UPDATE YTa SET ";
          const params = [];
          const placeholders = [];

          if (data?.HoYT) {
            placeholders?.push("HoYT=?");
            params?.push(data?.HoYT);
          }
          if (data?.TenYT) {
            placeholders?.push("TenYT=?");
            params?.push(data?.TenYT);
          }
          if (data?.SoDT) {
            placeholders?.push("SoDT=?");
            params?.push(data?.SoDT);
          }
          if (data?.Email) {
            placeholders?.push("Email=?");
            params?.push(data?.Email);
          }
          if (data?.BangCap) {
            placeholders?.push("BangCap=?");
            params?.push(data?.BangCap);
          }
          if (data?.ChuyenMon) {
            placeholders?.push("ChuyenMon=?");
            params?.push(data?.ChuyenMon);
          }
          if (data?.GioiTinh) {
            placeholders?.push("GioiTinh=?");
            params?.push(data?.GioiTinh);
          }
          if (data?.MaNguoiDung) {
            placeholders?.push("MaNguoiDung=?");
            params?.push(data?.MaNguoiDung);
          }
          if (data?.GhiChu) {
            placeholders?.push("GhiChu=?");
            params?.push(data?.GhiChu);
          }

          // console.log("check params", params);
          // console.log("check placeholders", placeholders);

          // Xây dựng câu lệnh SQL
          sql += placeholders?.join(", ") + " WHERE MaYT=?";
          params?.push(data?.MaYT);
          console.log("check sql", sql);
          console.log("check params", params);
          await (await connection)?.query(sql, params);
          (user.errCode = 0),
            (user.errMessage = "Cập nhật thông tin y tá thành công!");
        } else {
          (user.errCode = 3),
            (user.errMessage = "Không có trường dữ liệu nào được cập nhật!");
        }
      } else {
        (user.errCode = 2), (user.errMessage = "Không tim thấy MaYT!");
      }
      resolve(user);
    } catch (e) {
      reject(e);
    }
  });
};

const getAllNurse = (nurseId) => {
  return new Promise(async (resolve, reject) => {
    try {
      //xét 2 Th cho nó
      let nurse = "";
      if (nurseId === "ALL") {
        let sql = "SELECT * FROM YTa ";
        let tampAllNurse = await (await connection).query(sql);
        nurse = tampAllNurse[0];
        resolve({
          errCode: 0,
          errMessage: "Thông tin của tất cả y tá là!",
          nurse,
        });
      }

      if (nurseId && Number.isSafeInteger(Number(nurseId))) {
        let sql = "SELECT * FROM YTa bn WHERE MaYT = ?";
        let tampAllNurse = await (await connection).query(sql, [nurseId]);
        nurse = tampAllNurse[0];
        resolve({
          errCode: 0,
          errMessage: "Thông tin của y tá trên là!",
          nurse,
        });
      } else {
        resolve({
          errCode: 3,
          errMessage: "Mã y tá không hợp lệ!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const deleteNurse = async (nurseId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = {};
      //tìm bệnh nhân
      let sql = "SELECT * FROM YTa bn WHERE MaYT =?";
      let nurse = await (await connection).query(sql, [nurseId]);
      if (nurse[0]?.length) {
        //xóa ở đây
        let sql1 = "DELETE FROM YTa WHERE MaYT = ?";
        await (await connection).query(sql1, [nurseId]);
        (user.errCode = 0), (user.errMessage = "Xóa y tá thành công!");
      } else {
        (user.errCode = 1), (user.errMessage = "Không tìm thấy y tá!");
      }
      resolve(user);
    } catch (e) {
      reject(e);
    }
  });
};

const checkRecordExists = async (Ngay, Buoi, MaBS) => {
  try {
    const sql = `
      SELECT COUNT(*) AS count
      FROM BuoiTrucCuaBacSi
      WHERE Ngay = ? AND Buoi = ? AND MaBS = ?
    `;
    const [rows] = await (await connection).query(sql, [Ngay, Buoi, MaBS]);
    const count = rows[0].count;
    return count > 0;
  } catch (error) {
    console.error("Error checking if the record exists:", error.message);
    throw error;
  }
};

const createNewDoctorSchedule = (Ngay, Buoi, MaBS, SoLuongBNToiDa, GhiChu) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = {};
      const recordExists = await checkRecordExists(Ngay, Buoi, MaBS);
      if (!recordExists) {
        const sql = `
        INSERT INTO BuoiTrucCuaBacSi (Ngay, Buoi, MaBS, SoLuongBNToiDa, GhiChu)
        VALUES (?, ?, ?, ?, ?)
      `;
        await (
          await connection
        ).query(sql, [Ngay, Buoi, MaBS, SoLuongBNToiDa, GhiChu]);
        user.errCode = 0;
        user.errMessage = "OK! Tạo lịch trực thành công!";
      } else {
        user.errCode = 3;
        user.errMessage = "Đã tồn tại Lịch trực";
      }
      resolve(user);
    } catch (e) {
      reject(e);
    }
  });
};

const updateDoctorSchedule = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("data", data);
      let user = {};
      let sql =
        "SELECT * FROM BuoiTrucCuaBacSi WHERE Ngay =? AND Buoi =? AND MaBS =?";
      let tamp = await (
        await connection
      ).query(sql, [data?.Ngay, data?.Buoi, data?.MaBS]);
      console.log(tamp[0][0]);
      if (tamp[0]?.length) {
        if (data?.SoLuongBNToiDa || data?.GhiChu) {
          // console.log("a");
          let sql = "UPDATE BuoiTrucCuaBacSi SET ";
          const params = [];
          const placeholders = [];

          if (data?.SoLuongBNToiDa) {
            placeholders?.push("SoLuongBNToiDa=?");
            params?.push(data?.SoLuongBNToiDa);
          }
          if (data?.GhiChu) {
            placeholders?.push("GhiChu=?");
            params?.push(data?.GhiChu);
          }

          // console.log("check params", params);
          // console.log("check placeholders", placeholders);

          // Xây dựng câu lệnh SQL
          sql +=
            placeholders?.join(", ") + " WHERE Ngay=? AND Buoi =? AND MaBS =?";
          params?.push(data?.Ngay, data?.Buoi, data?.MaBS);
          // console.log("check sql", sql);
          // console.log("check params", params);
          await (await connection)?.query(sql, params);
          (user.errCode = 0),
            (user.errMessage =
              "Cập nhật thông tin lịch trực bác sĩ thành công!");
        } else {
          (user.errCode = 3),
            (user.errMessage = "Không có trường dữ liệu nào được cập nhật!");
        }
      } else {
        (user.errCode = 2), (user.errMessage = "Không tim thấy lịch trực!");
      }
      resolve(user);
    } catch (e) {
      reject(e);
    }
  });
};

const getAllDoctorSchedule = (scheduleId) => {
  return new Promise(async (resolve, reject) => {
    try {
      //xét 2 Th cho nó
      let schedule = "";
      if (scheduleId === "ALL") {
        let sql = "SELECT * FROM BuoiTrucCuaBacSi ";
        let tampAllSchedule = await (await connection).query(sql);
        schedule = tampAllSchedule[0];
        resolve({
          errCode: 0,
          errMessage: "Thông tin của tất cả lịch trực là!",
          schedule,
        });
      } else {
        resolve({
          errCode: 2,
          errMessage: "",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const deleteDoctorSchedule = async (Ngay, Buoi, MaBS) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = {};
      //tìm bệnh nhân
      let sql =
        "SELECT * FROM BuoiTrucCuaBacSi WHERE Ngay =? AND Buoi =? AND MaBS =?";
      let schedule = await (await connection).query(sql, [Ngay, Buoi, MaBS]);
      if (schedule[0]?.length) {
        //xóa ở đây
        let sql1 =
          "DELETE FROM BuoiTrucCuaBacSi WHERE Ngay = ? AND Buoi =? AND MaBS =?";
        await (await connection).query(sql1, [Ngay, Buoi, MaBS]);
        (user.errCode = 0), (user.errMessage = "Xóa buổi trực thành công!");
      } else {
        (user.errCode = 1), (user.errMessage = "Không tìm thấy buổi trực!");
      }
      resolve(user);
    } catch (e) {
      reject(e);
    }
  });
};

const checkRecordExists2 = async (Ngay, Buoi, MaBS, MaBN) => {
  try {
    const sql = `
      SELECT COUNT(*) AS count
      FROM LichHenBenhNhan
      WHERE Ngay = ? AND Buoi = ? AND MaBS = ? AND MaBN = ?
    `;
    const [rows] = await (
      await connection
    ).query(sql, [Ngay, Buoi, MaBS, MaBN]);
    const count = rows[0].count;
    return count > 0;
  } catch (error) {
    console.error("Error checking if the record exists:", error.message);
    throw error;
  }
};
const createNewPatientAppointment = (Ngay, Buoi, MaBS, MaBN) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = {};
      const recordExists = await checkRecordExists2(Ngay, Buoi, MaBS, MaBN);
      if (!recordExists) {
        const sql = `
        INSERT INTO LichHenBenhNhan (Ngay, Buoi, MaBS, MaBN)
        VALUES (?, ?, ?, ?)
      `;
        await (await connection).query(sql, [Ngay, Buoi, MaBS, MaBN]);
        user.errCode = 0;
        user.errMessage = "OK! Tạo lịch hẹn bệnh nhân thành công!";
      } else {
        user.errCode = 3;
        user.errMessage = "Đã tồn tại Lịch hẹn bệnh nhân";
      }
      resolve(user);
    } catch (e) {
      reject(e);
    }
  });
};

const getAllPatientAppointment = (appointmentId) => {
  return new Promise(async (resolve, reject) => {
    try {
      //xét 2 Th cho nó
      let appointment = "";
      if (appointmentId === "ALL") {
        let sql = "SELECT * FROM LichHenBenhNhan ";
        let tampAllAppointment = await (await connection).query(sql);
        appointment = tampAllAppointment[0];
        resolve({
          errCode: 0,
          errMessage: "Thông tin của tất cả lịch hẹn bệnh nhân là!",
          appointment,
        });
      } else {
        resolve({
          errCode: 2,
          errMessage: "",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const deletePatientAppointment = async (Ngay, Buoi, MaBS, MaBN) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = {};
      //tìm bệnh nhân
      let sql =
        "SELECT * FROM LichHenBenhNhan WHERE Ngay =? AND Buoi =? AND MaBS =? AND MaBN =?";
      let appointment = await (
        await connection
      ).query(sql, [Ngay, Buoi, MaBS, MaBN]);
      if (appointment[0]?.length) {
        //xóa ở đây
        let sql1 =
          "DELETE FROM LichHenBenhNhan WHERE Ngay = ? AND Buoi =? AND MaBS =? AND MaBN =?";
        await (await connection).query(sql1, [Ngay, Buoi, MaBS, MaBN]);
        (user.errCode = 0),
          (user.errMessage = "Xóa lịch hẹn bệnh nhân thành công!");
      } else {
        (user.errCode = 1),
          (user.errMessage = "Không tìm thấy lịch hẹn bệnh nhân!");
      }
      resolve(user);
    } catch (e) {
      reject(e);
    }
  });
};

const checkRecordExists1 = async (MaBN, MaDV, Ngay, Buoi) => {
  try {
    const sql = `
      SELECT COUNT(*) AS count
      FROM BenhNhan_DichVuYTe
      WHERE MaBN = ? AND MaDV = ? AND Ngay = ? AND Buoi = ?
    `;
    const [rows] = await (
      await connection
    ).query(sql, [MaBN, MaDV, Ngay, Buoi]);
    const count = rows[0].count;
    return count > 0;
  } catch (error) {
    console.error("Error checking if the record exists:", error.message);
    throw error;
  }
};

const createNewPatientMedicalService = (
  MaBN,
  MaDV,
  Ngay,
  Buoi,
  SoLuong,
  GhiChu
) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = {};
      const recordExists = await checkRecordExists1(MaBN, MaDV, Ngay, Buoi);
      if (!recordExists) {
        const sql = `
        INSERT INTO BenhNhan_DichVuYTe (MaBN, MaDV, Ngay, Buoi, SoLuong, GhiChu)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
        await (
          await connection
        ).query(sql, [MaBN, MaDV, Ngay, Buoi, SoLuong, GhiChu]);
        user.errCode = 0;
        user.errMessage = "OK! Tạo bệnh nhân - dịch vụ y tế thành công!";
      } else {
        user.errCode = 3;
        user.errMessage = "Đã tồn tại bệnh nhân - dịch vụ y tế";
      }
      resolve(user);
    } catch (e) {
      reject(e);
    }
  });
};

const updatePatientMedicalService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("data", data);
      let user = {};
      let sql =
        "SELECT * FROM BenhNhan_DichVuYTe WHERE MaBN =? AND MaDV =? AND Ngay =? AND Buoi =?";
      let tamp = await (
        await connection
      ).query(sql, [data?.MaBN, data?.MaDV, data?.Ngay, data?.Buoi]);
      console.log(tamp[0][0]);
      if (tamp[0]?.length) {
        if (data?.SoLuong || data?.GhiChu) {
          // console.log("a");
          let sql = "UPDATE BenhNhan_DichVuYTe SET ";
          const params = [];
          const placeholders = [];

          if (data?.SoLuong) {
            placeholders?.push("SoLuong=?");
            params?.push(data?.SoLuong);
          }
          if (data?.GhiChu) {
            placeholders?.push("GhiChu=?");
            params?.push(data?.GhiChu);
          }

          // console.log("check params", params);
          // console.log("check placeholders", placeholders);

          // Xây dựng câu lệnh SQL
          sql +=
            placeholders?.join(", ") +
            " WHERE MaBN=? AND MaDV =? AND Ngay =? AND Buoi =?";
          params?.push(data?.MaBN, data?.MaDV, data?.Ngay, data?.Buoi);
          // console.log("check sql", sql);
          // console.log("check params", params);
          await (await connection)?.query(sql, params);
          (user.errCode = 0),
            (user.errMessage =
              "Cập nhật thông tin bệnh nhân - dịch vụ y tế thành công!");
        } else {
          (user.errCode = 3),
            (user.errMessage = "Không có trường dữ liệu nào được cập nhật!");
        }
      } else {
        (user.errCode = 2),
          (user.errMessage = "Không tim thấy bệnh nhân - dịch vụ y tế!");
      }
      resolve(user);
    } catch (e) {
      reject(e);
    }
  });
};

const getAllPatientMedicalService = (patient_medicalId) => {
  return new Promise(async (resolve, reject) => {
    try {
      //xét 2 Th cho nó
      let patient_medical = "";
      if (patient_medicalId === "ALL") {
        let sql = "SELECT * FROM BenhNhan_DichVuYTe ";
        let tampAllPatientMedical = await (await connection).query(sql);
        patient_medical = tampAllPatientMedical[0];
        resolve({
          errCode: 0,
          errMessage: "Thông tin của tất cả bệnh nhân-dịch vụ y tế là!",
          patient_medical,
        });
      } else {
        resolve({
          errCode: 2,
          errMessage: "",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const deletePatientMedicalService = async (MaBN, MaDV, Ngay, Buoi) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = {};
      //tìm bệnh nhân
      let sql =
        "SELECT * FROM BenhNhan_DichVuYTe WHERE MaBN =? AND MaDV =? AND Ngay =? AND Buoi =?";
      let patient_medical = await (
        await connection
      ).query(sql, [MaBN, MaDV, Ngay, Buoi]);
      if (patient_medical[0]?.length) {
        //xóa ở đây
        let sql1 =
          "DELETE FROM BenhNhan_DichVuYTe WHERE MaBN = ? AND MaDV =? AND Ngay =? AND Buoi =?";
        await (await connection).query(sql1, [MaBN, MaDV, Ngay, Buoi]);
        (user.errCode = 0),
          (user.errMessage = "Xóa bệnh nhân - dịch vụ y tế thành công!");
      } else {
        (user.errCode = 1),
          (user.errMessage = "Không tìm thấy bệnh nhân - dịch vụ y tế!");
      }
      resolve(user);
    } catch (e) {
      reject(e);
    }
  });
};

const checkRecordExists3 = async (MaBS, MaBN, Ngay, Buoi) => {
  try {
    const sql = `
      SELECT COUNT(*) AS count
      FROM KhamBenh
      WHERE MaBS = ? AND MaBN = ? AND Ngay = ? AND Buoi = ?
    `;
    const [rows] = await (
      await connection
    ).query(sql, [MaBS, MaBN, Ngay, Buoi]);
    const count = rows[0].count;
    return count > 0;
  } catch (error) {
    console.error("Error checking if the record exists:", error.message);
    throw error;
  }
};

const createNewMedicalExamination = (
  MaBS,
  MaBN,
  Ngay,
  Buoi,
  MaYTa,
  KetQuaChuanDoanBenh,
  GhiChu
) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = {};
      const recordExists = await checkRecordExists3(MaBS, MaBN, Ngay, Buoi);
      if (!recordExists) {
        const sql = `
        INSERT INTO KhamBenh (MaBS, MaBN, Ngay, Buoi, MaYTa, KetQuaChuanDoanBenh, GhiChu)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
        await (
          await connection
        ).query(sql, [
          MaBS,
          MaBN,
          Ngay,
          Buoi,
          MaYTa,
          KetQuaChuanDoanBenh,
          GhiChu,
        ]);
        user.errCode = 0;
        user.errMessage = "OK! Tạo phiếu khám bệnh thành công!";
      } else {
        user.errCode = 3;
        user.errMessage = "Đã tồn tại phiếu khám bệnh";
      }
      resolve(user);
    } catch (e) {
      reject(e);
    }
  });
};

const updateMedicalExamination = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("data", data);
      let user = {};
      let sql =
        "SELECT * FROM KhamBenh WHERE MaBS =? AND MaBN =? AND Ngay =? AND Buoi =?";
      let tamp = await (
        await connection
      ).query(sql, [data?.MaBS, data?.MaBN, data?.Ngay, data?.Buoi]);
      console.log(tamp[0][0]);
      if (tamp[0]?.length) {
        if (data?.MaYTa || data?.KetQuaChuanDoanBenh || data?.GhiChu) {
          // console.log("a");
          let sql = "UPDATE KhamBenh SET ";
          const params = [];
          const placeholders = [];

          if (data?.MaYTa) {
            placeholders?.push("MaYTa=?");
            params?.push(data?.MaYTa);
          }
          if (data?.KetQuaChuanDoanBenh) {
            placeholders?.push("KetQuaChuanDoanBenh=?");
            params?.push(data?.KetQuaChuanDoanBenh);
          }
          if (data?.GhiChu) {
            placeholders?.push("GhiChu=?");
            params?.push(data?.GhiChu);
          }

          // console.log("check params", params);
          // console.log("check placeholders", placeholders);

          // Xây dựng câu lệnh SQL
          sql +=
            placeholders?.join(", ") +
            " WHERE MaBS=? AND MaBN =? AND Ngay =? AND Buoi =?";
          params?.push(data?.MaBS, data?.MaBN, data?.Ngay, data?.Buoi);
          // console.log("check sql", sql);
          // console.log("check params", params);
          await (await connection)?.query(sql, params);
          (user.errCode = 0),
            (user.errMessage =
              "Cập nhật thông tin phiếu khám bệnh thành công!");
        } else {
          (user.errCode = 3),
            (user.errMessage = "Không có trường dữ liệu nào được cập nhật!");
        }
      } else {
        (user.errCode = 2),
          (user.errMessage = "Không tim thấy phiếu khám bệnh!");
      }
      resolve(user);
    } catch (e) {
      reject(e);
    }
  });
};

const getAllMedicalExamination = (medical_examinationId) => {
  return new Promise(async (resolve, reject) => {
    try {
      //xét 2 Th cho nó
      let medical_examination = "";
      if (medical_examinationId === "ALL") {
        let sql = "SELECT * FROM KhamBenh ";
        let tampAllMedicalExamination = await (await connection).query(sql);
        medical_examination = tampAllMedicalExamination[0];
        resolve({
          errCode: 0,
          errMessage: "Thông tin của tất cả phiếu khám là!",
          medical_examination,
        });
      } else {
        resolve({
          errCode: 2,
          errMessage: "",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const deleteMedicalExamination = async (MaBS, MaBN, Ngay, Buoi) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = {};
      //tìm bệnh nhân
      let sql =
        "SELECT * FROM KhamBenh WHERE MaBS =? AND MaBN =? AND Ngay =? AND Buoi =?";
      let medical_examination = await (
        await connection
      ).query(sql, [MaBS, MaBN, Ngay, Buoi]);
      if (medical_examination[0]?.length) {
        //xóa ở đây
        let sql1 =
          "DELETE FROM KhamBenh WHERE MaBS = ? AND MaBN =? AND Ngay =? AND Buoi =?";
        await (await connection).query(sql1, [MaBS, MaBN, Ngay, Buoi]);
        (user.errCode = 0),
          (user.errMessage = "Xóa phiếu khám bệnh thành công!");
      } else {
        (user.errCode = 1),
          (user.errMessage = "Không tìm thấy phiếu khám bệnh!");
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
  deleteUser,
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
  createNewPatientMedicalService,
  updatePatientMedicalService,
  getAllPatientMedicalService,
  deletePatientMedicalService,
  createNewMedicalExamination,
  updateMedicalExamination,
  getAllMedicalExamination,
  deleteMedicalExamination,
};
