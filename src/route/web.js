const express = require("express");
const router = express.Router();
const {
  handleLogin,
  handleCreateNewUser,
  handleCreateNewPatient,
  handleUpdatePatient,
  handleGetAllPatient,
  handleDeletePatient,
  handleCreateMedicalService,
  handleUpdateMedicalService,
  handleGetAllMedicalService,
  handleDeleteMedicalService,
} = require("../controller/homeController");
// middleware that is specific to this router

//api
router.post("/api/login", handleLogin);
router.post("/api/create-new-user", handleCreateNewUser);

router.post("/api/create-patient", handleCreateNewPatient);
router.post("/api/update-patient", handleUpdatePatient);
router.get("/api/get-all-patient", handleGetAllPatient);
router.post("/api/delete-patient", handleDeletePatient);

router.post("/api/create-medical-service", handleCreateMedicalService);
router.post("/api/update-medical-service", handleUpdateMedicalService);
router.get("/api/get-all-medical-service", handleGetAllMedicalService);
router.post("/api/delete-medical-service", handleDeleteMedicalService);

module.exports = router;
