const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

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
  // userRefreshTokenController,
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
  handlePatientSearch,
  handlePatientApointmentSearch,
  handleMedicalExaminationSearch,
  handleDoctorScheduleSearch,
  handlePatientMedicalServiceSearch,
  handleMedicalServiceSearch,
  handleDoctorSearch,
  handleNurseSearch,
  handleMedicineSearch,
  handleCreateMedicine,
  handleUpdateMedicine,
  handleGetAllMedicine,
  handleDeleteMedicine,
} = require("../controller/homeController");
router.get("/", (req, res) => {
  res.send("huy");
});

// middleware that is specific to this router
//api
router.post("/api/login", handleLogin);
router.post("/api/create-new-user", handleCreateNewUser);
router.post("/api/delete-user", handleDeleteUser);

router.post("/api/create-patient", handleCreateNewPatient);
router.post("/api/update-patient", handleUpdatePatient);
router.get("/api/get-all-patient", authMiddleware, handleGetAllPatient);
router.post("/api/delete-patient", handleDeletePatient);

router.post("/api/create-medical-service", handleCreateMedicalService);
router.post("/api/update-medical-service", handleUpdateMedicalService);
router.get("/api/get-all-medical-service", handleGetAllMedicalService);
router.post("/api/delete-medical-service", handleDeleteMedicalService);

// router.post("/refreshToken", userRefreshTokenController);

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

//search
//search phone
router.post("/api/get-patient-search", handlePatientSearch);
//search date
router.post(
  "/api/get-patient-apointment-search",
  handlePatientApointmentSearch
);
router.post(
  "/api/get-medical-examination-search",
  handleMedicalExaminationSearch
);
router.post("/api/get-doctor-schedule-search", handleDoctorScheduleSearch);
router.post(
  "/api/get-patient-medical-service-search",
  handlePatientMedicalServiceSearch
);
//search name
router.post("/api/get-medical-service-search", handleMedicalServiceSearch);
router.post("/api/get-doctor-search", handleDoctorSearch);
router.post("/api/get-nurse-search", handleNurseSearch);
router.post("/api/get-medicine-search", handleMedicineSearch);

//medicine
router.post("/api/create-medicine", handleCreateMedicine);
router.post("/api/update-medicine", handleUpdateMedicine);
router.get("/api/get-all-medicine", handleGetAllMedicine);
router.post("/api/delete-medicine", handleDeleteMedicine);

module.exports = {
  router,
};
// Patient Appointments
