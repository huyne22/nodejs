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

// const refreshTokenService = (token) => {
//   return new Promise((resolve, reject) => {
//     try {
//       jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, function (err, user) {
//         if (err) {
//           resolve(404).json({
//             message: "The user is not authemtication",
//           });
//         }
//         if (user) {
//           const newAcessToken = generalAcessToken({
//             isAdmin: user.isAdmin,
//             _id: user._id,
//           });
//           resolve({
//             status: "OK",
//             access_token: newAcessToken,
//           });
//         } else {
//           resolve({
//             message: "The user is not authemtication",
//           });
//         }
//       });
//     } catch (error) {
//       reject(error);
//     }
//   });
// };
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
          data?.DiaChi ||
          data?.GhiChu
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
          if (data?.GhiChu) {
            placeholders?.push("GhiChu=?");
            params?.push(data?.GhiChu);
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

const getAllPatient = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      //xét 2 Th cho nó
      let id = data?.id;
      let limit = data?.limit ? data?.limit : 4;
      let page = data?.page ? data?.page : 1;
      let patient = "";
      if (id === "ALL") {
        let offset = (page - 1) * limit;
        let sql = "SELECT * FROM BenhNhan bn limit ? offset ? ";
        let tampAllPatient = await (
          await connection
        ).query(sql, [+limit, +offset]);
        patient = tampAllPatient[0];
        let totalPageData = await (
          await connection
        ).query(`SELECT COUNT(*) as count from BenhNhan`);
        let totalpage = Math.ceil(+totalPageData[0][0]?.count / limit);
        let total = totalPageData[0][0].count;
        resolve({
          errCode: 0,
          errMessage: "Thông tin của tất cả bệnh nhân là!",
          patient,
          pagination: {
            page: +page,
            limit: +limit,
            totalpage,
            total,
          },
        });
      }

      if (id && Number.isSafeInteger(Number(id))) {
        let sql = "SELECT * FROM BenhNhan bn WHERE MaBN = ?";
        let tampAllPatient = await (await connection).query(sql, [id]);
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

const getAllMedicalService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      //xét 2 Th cho nó
      let id = data?.id;
      let limit = data?.limit ? data?.limit : 4;
      let page = data?.page ? data?.page : 1;
      let service = "";
      if (id === "ALL") {
        let offset = (page - 1) * limit;
        let sql = "SELECT * FROM DichVuYTe limit ? offset ? ";
        let tampAllService = await (
          await connection
        ).query(sql, [+limit, +offset]);
        service = tampAllService[0];
        let totalPageData = await (
          await connection
        ).query(`SELECT COUNT(*) as count from DichVuYTe`);
        let totalpage = Math.ceil(+totalPageData[0][0]?.count / limit);
        let total = totalPageData[0][0].count;
        resolve({
          errCode: 0,
          errMessage: "Thông tin của tất cả dịch vụ là!",
          service,
          pagination: {
            page: +page,
            limit: +limit,
            totalpage,
            total,
          },
        });
      }

      if (id && Number.isSafeInteger(Number(id))) {
        let sql = "SELECT * FROM DichVuYTe WHERE MaDV = ?";
        let tampAllService = await (await connection).query(sql, [id]);
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

const getAllDoctor = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      //xét 2 Th cho nó
      let id = data?.id;
      let limit = data?.limit ? data?.limit : 4;
      let page = data?.page ? data?.page : 1;
      let doctor = "";
      if (id === "ALL") {
        let offset = (page - 1) * limit;
        let sql = "SELECT * FROM BacSi limit ? offset ? ";
        let tampAllDoctor = await (
          await connection
        ).query(sql, [+limit, +offset]);
        doctor = tampAllDoctor[0];
        let totalPageData = await (
          await connection
        ).query(`SELECT COUNT(*) as count from BacSi`);
        let totalpage = Math.ceil(+totalPageData[0][0]?.count / limit);
        let total = totalPageData[0][0].count;
        resolve({
          errCode: 0,
          errMessage: "Thông tin của tất cả bác sĩ là!",
          doctor,
          pagination: {
            page: +page,
            limit: +limit,
            totalpage,
            total,
          },
        });
      }

      if (id && Number.isSafeInteger(Number(id))) {
        let sql = "SELECT * FROM BacSi bn WHERE MaBS = ?";
        let tampAllDoctor = await (await connection).query(sql, [id]);
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

const getAllNurse = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let id = data?.id;
      let limit = data?.limit ? data?.limit : 4;
      let page = data?.page ? data?.page : 1;
      //xét 2 Th cho nó
      let nurse = "";
      if (id === "ALL") {
        let offset = (page - 1) * limit;
        let sql = "SELECT * FROM YTa limit ? offset ? ";
        let tampAllNurse = await (
          await connection
        ).query(sql, [+limit, +offset]);
        nurse = tampAllNurse[0];
        let totalPageData = await (
          await connection
        ).query(`SELECT COUNT(*) as count from YTa`);
        let totalpage = Math.ceil(+totalPageData[0][0]?.count / limit);
        let total = totalPageData[0][0].count;
        resolve({
          errCode: 0,
          errMessage: "Thông tin của tất cả y tá là!",
          nurse,
          pagination: {
            page: +page,
            limit: +limit,
            totalpage,
            total,
          },
        });
      }

      if (id && Number.isSafeInteger(Number(id))) {
        let sql = "SELECT * FROM YTa bn WHERE MaYT = ?";
        let tampAllNurse = await (await connection).query(sql, [id]);
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

const getAllDoctorSchedule = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      //xét 2 Th cho nó
      let id = data?.id;
      let limit = data?.limit ? data?.limit : 4;
      let page = data?.page ? data?.page : 1;
      let schedule = "";
      if (id === "ALL") {
        let offset = (page - 1) * limit;
        let sql = "SELECT * FROM BuoiTrucCuaBacSi limit ? offset ? ";
        let tampAllSchedule = await (
          await connection
        ).query(sql, [+limit, +offset]);
        schedule = tampAllSchedule[0];
        let totalPageData = await (
          await connection
        ).query(`SELECT COUNT(*) as count from BuoiTrucCuaBacSi`);
        let totalpage = Math.ceil(+totalPageData[0][0]?.count / limit);
        let total = totalPageData[0][0].count;
        resolve({
          errCode: 0,
          errMessage: "Thông tin của tất cả lịch trực là!",
          schedule,
          pagination: {
            page: +page,
            limit: +limit,
            totalpage,
            total,
          },
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

const getAllPatientAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      //xét 2 Th cho nó
      let id = data?.id;
      let limit = data?.limit ? data?.limit : 4;
      let page = data?.page ? data?.page : 1;
      let appointment = "";
      if (id === "ALL") {
        let offset = (page - 1) * limit;
        let sql = "SELECT * FROM LichHenBenhNhan limit ? offset ? ";
        let tampAllAppointment = await (
          await connection
        ).query(sql, [+limit, +offset]);
        appointment = tampAllAppointment[0];
        let totalPageData = await (
          await connection
        ).query(`SELECT COUNT(*) as count from LichHenBenhNhan`);
        let totalpage = Math.ceil(+totalPageData[0][0]?.count / limit);
        let total = totalPageData[0][0].count;
        resolve({
          errCode: 0,
          errMessage: "Thông tin của tất cả lịch hẹn bệnh nhân là!",
          appointment,
          pagination: {
            page: +page,
            limit: +limit,
            totalpage,
            total,
          },
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

const getAllPatientMedicalService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      //xét 2 Th cho nó
      let id = data?.id;
      let limit = data?.limit ? data?.limit : 4;
      let page = data?.page ? data?.page : 1;
      let patient_medical = "";
      if (id === "ALL") {
        let offset = (page - 1) * limit;
        let sql = "SELECT * FROM BenhNhan_DichVuYTe limit ? offset ? ";
        let tampAllPatientMedical = await (
          await connection
        ).query(sql, [+limit, +offset]);
        patient_medical = tampAllPatientMedical[0];
        let totalPageData = await (
          await connection
        ).query(`SELECT COUNT(*) as count from BenhNhan_DichVuYTe`);
        let totalpage = Math.ceil(+totalPageData[0][0]?.count / limit);
        let total = totalPageData[0][0].count;
        resolve({
          errCode: 0,
          errMessage: "Thông tin của tất cả bệnh nhân-dịch vụ y tế là!",
          patient_medical,
          pagination: {
            page: +page,
            limit: +limit,
            totalpage,
            total,
          },
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
  GhiChu,
  MaThuoc,
  ThanhToan
) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("date", Ngay);
      let user = {};
      const recordExists = await checkRecordExists3(MaBS, MaBN, Ngay, Buoi);
      if (!recordExists) {
        const sql1 = `
          SELECT SoLuong  FROM Thuoc WHERE MaThuoc = ?`;
        let tamp = await (await connection).query(sql1, [MaThuoc]);
        let quantity = tamp[0][0]?.SoLuong;
        console.log("quantity", quantity);

        if (quantity !== 0) {
          const sql = `
            INSERT INTO KhamBenh (MaBS, MaBN, Ngay, Buoi, MaYTa, KetQuaChuanDoanBenh, GhiChu, MaThuoc,ThanhToan)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)
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
            MaThuoc,
            ThanhToan,
          ]);

          const sql2 = `UPDATE Thuoc 
            SET SoLuong = SoLuong -1
            WHERE MaThuoc = ${MaThuoc}`;
          let ab = await (await connection).query(sql2);
          console.log("check ab", ab);

          user.errCode = 0;
          user.errMessage = "OK! Tạo phiếu khám bệnh thành công!";
          resolve(user);
        } else {
          user.errCode = 2;
          user.errMessage = "Thuốc này hiện đã hết!";
          resolve(user);
        }
      } else {
        user.errCode = 3;
        user.errMessage = "Đã tồn tại phiếu khám bệnh";
        resolve(user);
      }
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
        if (
          data?.MaYTa ||
          data?.KetQuaChuanDoanBenh ||
          data?.GhiChu ||
          data?.MaThuoc ||
          data?.ThanhToan
        ) {
          // console.log("a");
          let sql = "UPDATE KhamBenh SET ";
          const params = [];
          const placeholders = [];
          if (data?.MaBS) {
            placeholders?.push("MaBS=?");
            params?.push(data?.MaBS);
          }
          if (data?.MaBN) {
            placeholders?.push("MaBN=?");
            params?.push(data?.MaBN);
          }
          if (data?.Ngay) {
            placeholders?.push("Ngay=?");
            params?.push(data?.Ngay);
          }
          if (data?.Buoi) {
            placeholders?.push("Buoi=?");
            params?.push(data?.Buoi);
          }
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
          if (data?.MaThuoc) {
            placeholders?.push("MaThuoc=?");
            params?.push(data?.MaThuoc);
          }
          if (data?.ThanhToan) {
            placeholders?.push("ThanhToan=?");
            params?.push(data?.ThanhToan);
          }

          // console.log("check params", params);
          // console.log("check placeholders", placeholders);

          // Xây dựng câu lệnh SQL
          sql +=
            placeholders?.join(", ") +
            " WHERE MaBS=? AND MaBN =? AND Ngay =? AND Buoi =?";
          params?.push(data?.MaBS, data?.MaBN, data?.Ngay, data?.Buoi);
          console.log("check sql", sql);
          console.log("check params", params);
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

const getAllMedicalExamination = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      //xét 2 Th cho nó
      let id = data?.id;
      let limit = data?.limit ? data?.limit : 4;
      let page = data?.page ? data?.page : 1;
      let medical_examination = "";
      if (id === "ALL") {
        let offset = (page - 1) * limit;
        let sql = "SELECT * FROM KhamBenh limit ? offset ? ";
        let tampAllMedicalExamination = await (
          await connection
        ).query(sql, [+limit, +offset]);
        medical_examination = tampAllMedicalExamination[0];
        let totalPageData = await (
          await connection
        ).query(`SELECT COUNT(*) as count from KhamBenh`);
        let totalpage = Math.ceil(+totalPageData[0][0]?.count / limit);
        let total = totalPageData[0][0].count;
        resolve({
          errCode: 0,
          errMessage: "Thông tin của tất cả phiếu khám là!",
          medical_examination,
          pagination: {
            page: +page,
            limit: +limit,
            totalpage,
            total,
          },
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

const getPatientSearch = (sdt) => {
  return new Promise(async (resolve, reject) => {
    try {
      //xét 2 Th cho nó
      let tamp = "";
      if (sdt !== undefined) {
        let sql = `SELECT * FROM BenhNhan WHERE SoDT = ? `;
        let tampSdt = await (await connection).query(sql, [sdt.SoDT]);
        console.log("sql", sql);
        tamp = tampSdt[0];
        resolve({
          errCode: 0,
          errMessage: "Thông tin của sdt trên là!",
          tamp,
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

const getPatientApointmentSearch = (ngay) => {
  return new Promise(async (resolve, reject) => {
    try {
      //xét 2 Th cho nó

      let search_patient_apointment = "";
      if (ngay !== undefined) {
        let sql = `SELECT * FROM LichHenBenhNhan WHERE Ngay = ? `;
        let tampNgay = await (await connection).query(sql, [ngay.Ngay]);

        search_patient_apointment = tampNgay[0];
        // console.log("tamp", tampSdt);
        resolve({
          errCode: 0,
          errMessage: "Thông tin của ngày trên là!",
          search_patient_apointment,
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

const getMedicalExaminationSearch = (ngay) => {
  return new Promise(async (resolve, reject) => {
    try {
      //xét 2 Th cho nó

      let search_medical_examination = "";
      if (ngay !== undefined) {
        let sql = `SELECT * FROM KhamBenh WHERE Ngay = ? `;
        let tampNgay = await (await connection).query(sql, [ngay.Ngay]);

        search_medical_examination = tampNgay[0];
        // console.log("tamp", tampSdt);
        resolve({
          errCode: 0,
          errMessage: "Thông tin của ngày trên là!",
          search_medical_examination,
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

const getDoctorScheduleSearch = (ngay) => {
  return new Promise(async (resolve, reject) => {
    try {
      //xét 2 Th cho nó

      let search_doctor_schedule = "";
      if (ngay !== undefined) {
        let sql = `SELECT * FROM BuoiTrucCuaBacSi WHERE Ngay = ? `;
        let tampNgay = await (await connection).query(sql, [ngay.Ngay]);

        search_doctor_schedule = tampNgay[0];
        // console.log("tamp", tampSdt);
        resolve({
          errCode: 0,
          errMessage: "Thông tin của ngày trên là!",
          search_doctor_schedule,
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

const getPatientMedicalServiceSearch = (ngay) => {
  return new Promise(async (resolve, reject) => {
    try {
      //xét 2 Th cho nó

      let search_patient_medical_service = "";
      if (ngay !== undefined) {
        let sql = `SELECT * FROM BenhNhan_DichVuYTe WHERE Ngay = ? `;
        let tampNgay = await (await connection).query(sql, [ngay.Ngay]);

        search_patient_medical_service = tampNgay[0];
        // console.log("tamp", tampSdt);
        resolve({
          errCode: 0,
          errMessage: "Thông tin của ngày trên là!",
          search_patient_medical_service,
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

const getMedicalServiceSearch = (ten) => {
  return new Promise(async (resolve, reject) => {
    try {
      //xét 2 Th cho nó

      let search_medical_service = "";
      if (ten !== undefined) {
        let sql = `SELECT * FROM DichVuYTe WHERE TenDV LIKE '%${ten}%' `;
        let tampName = await (await connection).query(sql);

        search_medical_service = tampName[0];
        // console.log("tamp", tampSdt);
        resolve({
          errCode: 0,
          errMessage: "Thông tin của dịch vụ trên là!",
          search_medical_service,
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

const getDoctorSearch = (ten) => {
  return new Promise(async (resolve, reject) => {
    try {
      //xét 2 Th cho nó

      let search_doctor = "";
      if (ten !== undefined) {
        let sql = `SELECT * FROM BacSi WHERE TenBS LIKE '%${ten}%' `;
        let tampName = await (await connection).query(sql);

        search_doctor = tampName[0];
        // console.log("tamp", tampSdt);
        resolve({
          errCode: 0,
          errMessage: "Thông tin của bác sĩ trên là!",
          search_doctor,
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

const getNurseSearch = (ten) => {
  return new Promise(async (resolve, reject) => {
    try {
      //xét 2 Th cho nó

      let search_nurse = "";
      if (ten !== undefined) {
        let sql = `SELECT * FROM YTa WHERE TenYT LIKE '%${ten}%' `;
        let tampName = await (await connection).query(sql);

        search_nurse = tampName[0];
        // console.log("tamp", tampSdt);
        resolve({
          errCode: 0,
          errMessage: "Thông tin của y tá trên là!",
          search_nurse,
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

const getMedicineSearch = (ten) => {
  return new Promise(async (resolve, reject) => {
    try {
      //xét 2 Th cho nó

      let search_medicine = "";
      if (ten !== undefined) {
        let sql = `SELECT * FROM Thuoc WHERE TenThuoc LIKE '%${ten}%' `;
        let tampName = await (await connection).query(sql);

        search_medicine = tampName[0];
        // console.log("tamp", tampSdt);
        resolve({
          errCode: 0,
          errMessage: "Thông tin của thuốc trên là!",
          search_medicine,
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

const createNewMedicine = (
  MaThuoc,
  TenThuoc,
  CongDung,
  DonVi,
  SoLuong,
  GhiChu
) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = {};
      let sql = `SELECT MaThuoc FROM Thuoc WHERE MaThuoc = ?`;
      let medicine = await (await connection).query(sql, [MaThuoc]);
      if (medicine[0]?.length == 0) {
        const sql1 =
          "INSERT INTO Thuoc (MaThuoc, TenThuoc, CongDung, DonVi, SoLuong, GhiChu) VALUES (?, ?,?,?,?,?)";
        await (
          await connection
        ).query(sql1, [MaThuoc, TenThuoc, CongDung, DonVi, SoLuong, GhiChu]);
        (user.errCode = 0), (user.errMessage = "OK! Tạo thuốc thành công!");
      } else {
        (user.errCode = 2), (user.errMessage = "Mã thuốc đã tồn tại!");
      }
      resolve(user);
    } catch (e) {
      reject(e);
    }
  });
};

const updateMedicine = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("data", data);
      let user = {};
      let sql = "SELECT * FROM Thuoc WHERE MaThuoc=?";
      let tamp = await (await connection).query(sql, [data?.MaThuoc]);
      console.log(tamp[0][0]);
      if (tamp[0]?.length) {
        if (
          data?.TenThuoc ||
          data?.CongDung ||
          data?.DonVi ||
          data?.SoLuong ||
          data?.GhiChu
        ) {
          // console.log("a");
          let sql = "UPDATE Thuoc SET ";
          const params = [];
          const placeholders = [];
          if (data?.MaThuoc) {
            placeholders?.push("MaThuoc=?");
            params?.push(data?.MaThuoc);
          }
          if (data?.TenThuoc) {
            placeholders?.push("TenThuoc=?");
            params?.push(data?.TenThuoc);
          }
          if (data?.CongDung) {
            placeholders?.push("CongDung=?");
            params?.push(data?.CongDung);
          }
          if (data?.DonVi) {
            placeholders?.push("DonVi=?");
            params?.push(data?.DonVi);
          }
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
          sql += placeholders?.join(", ") + " WHERE MaThuoc=?";
          params?.push(
            data?.MaThuoc,
            data?.TenThuoc,
            data?.CongDung,
            data?.DonVi,
            data?.SoLuong,
            data?.GhiChu
          );
          // console.log("check sql", sql);
          // console.log("check params", params);
          await (await connection)?.query(sql, params);
          (user.errCode = 0),
            (user.errMessage = "Cập nhật thông tin thuốc thành công!");
        } else {
          (user.errCode = 3),
            (user.errMessage = "Không có trường dữ liệu nào được cập nhật!");
        }
      } else {
        (user.errCode = 2), (user.errMessage = "Không tim thấy phiếu thuốc!");
      }
      resolve(user);
    } catch (e) {
      reject(e);
    }
  });
};

const getAllMedicine = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      //xét 2 Th cho nó
      let id = data?.id;
      let limit = data?.limit ? data?.limit : 4;
      let page = data?.page ? data?.page : 1;
      let medicine = "";
      if (id === "ALL") {
        let offset = (page - 1) * limit;
        let sql = "SELECT * FROM Thuoc limit ? offset ? ";
        let tampAllMedicine = await (
          await connection
        ).query(sql, [+limit, +offset]);
        medicine = tampAllMedicine[0];
        let totalPageData = await (
          await connection
        ).query(`SELECT COUNT(*) as count from Thuoc`);
        let totalpage = Math.ceil(+totalPageData[0][0]?.count / limit);
        let total = totalPageData[0][0].count;
        resolve({
          errCode: 0,
          errMessage: "Thông tin của tất cả thuốc là!",
          medicine,
          pagination: {
            page: +page,
            limit: +limit,
            totalpage,
            total,
          },
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

const deleteMedicine = async (MaThuoc) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = {};
      //tìm bệnh nhân
      let sql = "SELECT * FROM Thuoc WHERE MaThuoc =?";
      let medicine = await (await connection).query(sql, [MaThuoc]);
      if (medicine[0]?.length) {
        //xóa ở đây
        let sql1 = "DELETE FROM Thuoc WHERE MaThuoc=?";
        await (await connection).query(sql1, [MaThuoc]);
        (user.errCode = 0), (user.errMessage = "Xóa phiếu thuốc thành công!");
      } else {
        (user.errCode = 1), (user.errMessage = "Không tìm thấy phiếu thuốc!");
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
  // refreshTokenService,
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
  getPatientSearch,
  getPatientApointmentSearch,
  getMedicalExaminationSearch,
  getDoctorScheduleSearch,
  getPatientMedicalServiceSearch,
  getMedicalServiceSearch,
  getDoctorSearch,
  getNurseSearch,
  getMedicineSearch,
  createNewMedicine,
  updateMedicine,
  getAllMedicine,
  deleteMedicine,
};
