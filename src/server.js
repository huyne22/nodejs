const cookieParser = require("cookie-parser");
require("dotenv").config();
const express = require("express");
const path = require("path");
const configViewEngine = require("./config/viewEngine");
const { router: exportRoute } = require("./route/admin");
const app = express();
const port = process.env.PORT || 8080;

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
// Sử dụng middleware express.json() để xử lý JSON body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

configViewEngine(app);
app.use("/", exportRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
