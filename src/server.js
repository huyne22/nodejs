require("dotenv").config();
const express = require("express");
const path = require("path");
const configViewEngine = require("./config/viewEngine");
const exportRoute = require("./route/web");
const app = express();
const port = process.env.PORT || 8080;
const hostname = process.env.HOST_NAME;
const connection = require("./config/database");

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", process.env.URL_REACT);

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

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

app.use("/", exportRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
