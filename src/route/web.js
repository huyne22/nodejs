const express = require("express");
const router = express.Router();
const {
  handleLogin,
  handleCreateNewUser,
  handleDeleteUser,
  handleCreateNewPatient,
  handleUpdatePatient,
  handleGetAllPatient,
  handleDeletePatient,
  handleCreateMedicalService,
  handleUpdateMedicalService,
  handleGetAllMedicalService,
  handleDeleteMedicalService,
  userRefreshTokenController,
  handleCreateDoctor,
  handleUpdateDoctor,
  handleGetAllDoctor,
  handleDeleteDoctor,
  handleCreateNurse,
  handleUpdateNurse,
  handleGetAllNurse,
  handleDeleteNurse,
  handleCreateDoctorSchedule,
  handleUpdateDoctorSchedule,
  handleGetAllDoctorSchedule,
  handleDeleteDoctorSchedule,
  handleCreatePatientAppointment,
  handleGetAllPatientAppointment,
  handleDeletePatientAppointment,
  handleCreatePatientMedicalService,
  handleUpdatePatientMedicalService,
  handleGetAllPatientMedicalService,
  handleDeletePatientMedicalService,
  handleCreateMedicalExamination,
  handleUpdateMedicalExamination,
  handleGetAllMedicalExamination,
  handleDeleteMedicalExamination,
} = require("../controller/homeController");
// middleware that is specific to this router
//api
router.post("/api/login", handleLogin);
router.post("/api/create-new-user", handleCreateNewUser);
router.post("/api/delete-user", handleDeleteUser);

router.post("/api/create-patient", handleCreateNewPatient);
router.post("/api/update-patient", handleUpdatePatient);
router.get("/api/get-all-patient", handleGetAllPatient);
router.post("/api/delete-patient", handleDeletePatient);

router.post("/api/create-medical-service", handleCreateMedicalService);
router.post("/api/update-medical-service", handleUpdateMedicalService);
router.get("/api/get-all-medical-service", handleGetAllMedicalService);
router.post("/api/delete-medical-service", handleDeleteMedicalService);

router.post("/refreshToken", userRefreshTokenController);

router.post("/api/create-doctor", handleCreateDoctor);
router.post("/api/update-doctor", handleUpdateDoctor);
router.get("/api/get-all-doctor", handleGetAllDoctor);
router.post("/api/delete-doctor", handleDeleteDoctor);

router.post("/api/create-nurse", handleCreateNurse);
router.post("/api/update-nurse", handleUpdateNurse);
router.get("/api/get-all-nurse", handleGetAllNurse);
router.post("/api/delete-nurse", handleDeleteNurse);

router.post("/api/create-doctor-schedule", handleCreateDoctorSchedule);
router.post("/api/update-doctor-schedule", handleUpdateDoctorSchedule);
router.get("/api/get-all-doctor-schedule", handleGetAllDoctorSchedule);
router.post("/api/delete-doctor-schedule", handleDeleteDoctorSchedule);

router.post("/api/create-patient-appointment", handleCreatePatientAppointment);
router.get("/api/get-all-patient-appointment", handleGetAllPatientAppointment);
router.post("/api/delete-patient-appointment", handleDeletePatientAppointment);

router.post(
  "/api/create-patient-medical-service",
  handleCreatePatientMedicalService
);
router.post(
  "/api/update-patient-medical-service",
  handleUpdatePatientMedicalService
);
router.get(
  "/api/get-all-patient-medical-service",
  handleGetAllPatientMedicalService
);
router.post(
  "/api/delete-patient-medical-service",
  handleDeletePatientMedicalService
);
//

router.post("/api/create-medical-examination", handleCreateMedicalExamination);
router.post("/api/update-medical-examination", handleUpdateMedicalExamination);
router.get("/api/get-all-medical-examination", handleGetAllMedicalExamination);
router.post("/api/delete-medical-examination", handleDeleteMedicalExamination);

module.exports = router;
// Patient Appointments
