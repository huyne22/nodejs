const express = require("express");
const router = express.Router();
const {
  handleLogin,
  handleCreateNewUser,
  handleCreateNewPatient,
  handleUpdatePatient,
  handleGetAllPatient,
  handleDeletePatient,
} = require("../controller/homeController");
// middleware that is specific to this router

//api
router.post("/api/login", handleLogin);
router.post("/api/create-new-user", handleCreateNewUser);
router.post("/api/create-patient", handleCreateNewPatient);
router.post("/api/update-patient", handleUpdatePatient);
router.get("/api/get-all-patient", handleGetAllPatient);
router.post("/api/delete-patient", handleDeletePatient);

module.exports = router;
