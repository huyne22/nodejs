const connection = require('../config/database');

const getAllUser =async () => {
    let [results, fields] = await(await connection).query('SELECT * FROM NguoiDung nd');
    return results;
}
const getUserById =async (userId) => {
    let [results, fields] = await(await connection).query('SELECT * FROM NguoiDung nd WHERE MaNguoiDung = ?', [userId]);
    let user = results && results.length > 0 ? results[0] : {};
    // console.log(user)
    return user;
}
module.exports = {
    getAllUser,getUserById
}