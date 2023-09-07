const connection = require('../config/database');
const {getAllUser,getUserById} = require('../service/CRUDService');

const getHomePage = async(req, res) => {
    let results = await getAllUser();
    // console.log('results',results)
    return res.render('home.ejs', {listUser: results})
}
const getUpdatePage = async(req, res) => {
    const userId = req.params.id;
    const user =  await getUserById(userId);
    console.log(user)
    return res.render('edit.ejs', {userEdit: user})
}

const postCreateUser = async(req, res) => {
    const {TenDangNhap, MatKhau,GhiChu} = req.body;
    console.log('>>req.body ', req.body)
    // connection.query(
    // ` INSERT INTO 
    //     NguoiDung(TenDangNhap,MatKhau,GhiChu)
    //     VALUES (?, ?, ?)`,
    //         [TenDangNhap, MatKhau,GhiChu],
    //         function(err, results) {
    //             console.log(results);
    //             res.send("Create a new user");
    //         }
    // );
    let [results, fields] = await (await connection).query(
        ` INSERT INTO NguoiDung(TenDangNhap,MatKhau,GhiChu) VALUES (?, ?, ?)`, [TenDangNhap, MatKhau,GhiChu]
    ) ;
    res.send("Create a new user");

}

module.exports = {
    getHomePage,postCreateUser,getUpdatePage
}