const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const admin = authMiddleware(["admin"]);
const doctor = authMiddleware(["doctor", "admin"]);
const nurse = authMiddleware(["nurse", "admin"]);
const all = authMiddleware(["nurse", "admin", "doctor"]);
const {
  handleLogin,
  handleCreateNewUser,
  handleDeleteUser,
  handleGetAllUser,
  handleUpdateUser,
  handleCreateNewPatient,
  handleUpdatePatient,
  handleGetAllPatient,
  handleDeletePatient,
  handleCreateMedicalService,
  handleUpdateMedicalService,
  handleGetAllMedicalService,
  handleDeleteMedicalService,
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
  handleCreateNurseSchedule,
  handleUpdateNurseSchedule,
  handleGetAllNurseSchedule,
  handleDeleteNurseSchedule,
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
  handleUserSearch,
  handleNurseSearch,
  handleMedicineSearch,
  handleCreateMedicine,
  handleUpdateMedicine,
  handleGetAllMedicine,
  handleDeleteMedicine,
} = require("../controller/homeController");

//api
router.post("/api/login", handleLogin);
router.post("/api/create-new-user", admin, handleCreateNewUser);
router.post("/api/update-user", admin, handleUpdateUser);
router.get("/api/get-all-user", admin, handleGetAllUser);
router.post("/api/delete-user", admin, handleDeleteUser);

router.post("/api/create-patient", admin, handleCreateNewPatient);
router.post("/api/update-patient", admin, handleUpdatePatient);
router.get("/api/get-all-patient", all, handleGetAllPatient);
router.post("/api/delete-patient", admin, handleDeletePatient);

router.post("/api/create-medical-service", admin, handleCreateMedicalService);
router.post("/api/update-medical-service", admin, handleUpdateMedicalService);
router.get("/api/get-all-medical-service", all, handleGetAllMedicalService);
router.post("/api/delete-medical-service", admin, handleDeleteMedicalService);

router.post("/api/create-doctor", admin, handleCreateDoctor);
router.post("/api/update-doctor", admin, handleUpdateDoctor);
router.get("/api/get-all-doctor", all, handleGetAllDoctor);
router.post("/api/delete-doctor", admin, handleDeleteDoctor);

router.post("/api/create-nurse", admin, handleCreateNurse);
router.post("/api/update-nurse", admin, handleUpdateNurse);
router.get("/api/get-all-nurse", all, handleGetAllNurse);
router.post("/api/delete-nurse", admin, handleDeleteNurse);

router.post("/api/create-doctor-schedule", doctor, handleCreateDoctorSchedule);
router.post("/api/update-doctor-schedule", doctor, handleUpdateDoctorSchedule);
router.get("/api/get-all-doctor-schedule", all, handleGetAllDoctorSchedule);
router.post("/api/delete-doctor-schedule", doctor, handleDeleteDoctorSchedule);

router.post("/api/create-nurse-schedule", nurse, handleCreateNurseSchedule);
router.post("/api/update-nurse-schedule", nurse, handleUpdateNurseSchedule);
router.get("/api/get-all-nurse-schedule", all, handleGetAllNurseSchedule);
router.post("/api/delete-nurse-schedule", nurse, handleDeleteNurseSchedule);

router.post(
  "/api/create-patient-appointment",
  admin,
  handleCreatePatientAppointment
);
router.get(
  "/api/get-all-patient-appointment",
  all,
  handleGetAllPatientAppointment
);
router.post(
  "/api/delete-patient-appointment",
  admin,
  handleDeletePatientAppointment
);

router.post(
  "/api/create-patient-medical-service",
  admin,
  handleCreatePatientMedicalService
);
router.post(
  "/api/update-patient-medical-service",
  admin,
  handleUpdatePatientMedicalService
);
router.get(
  "/api/get-all-patient-medical-service",
  all,
  handleGetAllPatientMedicalService
);
router.post(
  "/api/delete-patient-medical-service",
  admin,
  handleDeletePatientMedicalService
);
//

router.post(
  "/api/create-medical-examination",
  admin,
  handleCreateMedicalExamination
);
router.post(
  "/api/update-medical-examination",
  admin,
  handleUpdateMedicalExamination
);
router.get(
  "/api/get-all-medical-examination",
  all,
  handleGetAllMedicalExamination
);
router.post(
  "/api/delete-medical-examination",
  admin,
  handleDeleteMedicalExamination
);

//search
//search phone
router.post("/api/get-patient-search", all, handlePatientSearch);
//search date
router.post(
  "/api/get-patient-apointment-search",
  all,
  handlePatientApointmentSearch
);
router.post(
  "/api/get-medical-examination-search",
  all,
  handleMedicalExaminationSearch
);
router.post("/api/get-doctor-schedule-search", all, handleDoctorScheduleSearch);
router.post(
  "/api/get-patient-medical-service-search",
  all,
  handlePatientMedicalServiceSearch
);
//search name
router.post("/api/get-medical-service-search", all, handleMedicalServiceSearch);
router.post("/api/get-doctor-search", all, handleDoctorSearch);
router.post("/api/get-user-search", admin, handleUserSearch);

router.post("/api/get-nurse-search", all, handleNurseSearch);
router.post("/api/get-medicine-search", all, handleMedicineSearch);

//medicine
router.post("/api/create-medicine", admin, handleCreateMedicine);
router.post("/api/update-medicine", admin, handleUpdateMedicine);
router.get("/api/get-all-medicine", all, handleGetAllMedicine);
router.post("/api/delete-medicine", admin, handleDeleteMedicine);

module.exports = {
  router,
};
