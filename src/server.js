require('dotenv').config()
const express = require('express')
const path = require('path');
const configViewEngine = require('./config/viewEngine')
const exportRoute = require('./route/web')
const app = express()
const port = process.env.PORT || 8080;
const hostname = process.env.HOST_NAME;
const connection = require('./config/database')


//config req.body
// Sử dụng middleware express.json() để xử lý JSON body
app.use(express.json());
// Sử dụng middleware express.urlencoded() để xử lý dữ liệu từ biểu mẫu HTML
app.use(express.urlencoded({ extended: true }));

configViewEngine(app);




//  connection.query(
//   'SELECT * FROM NguoiDung nd',
//   function(err, results, fields) {
//     console.log("results =",results); // results contains rows returned by server
//     console.log(fields); // fields contains extra meta data about results, if available

//   }
// );


app.use('/', exportRoute)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})