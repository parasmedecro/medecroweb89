import express from 'express';
import { loginDoctor, appointmentsDoctor, appointmentCancel, doctorList, changeAvailablity, appointmentComplete, doctorDashboard, doctorProfile, updateDoctorProfile,PatientProfile,patientList,getProfile,updateProfile,savePrescription,getSavedPrescriptions } from '../controllers/doctorController.js';
import analysisreport from '../controllers/reportanalysis.js';
import {addCustomField} from '../controllers/reportanalysis.js';
import authDoctor from '../middleware/authDoctor.js';
import upload from '../middleware/multer.js';
const doctorRouter = express.Router();

doctorRouter.get("/get-profile", authDoctor, getProfile)
doctorRouter.post("/update-uprofile", upload.single('image'), authDoctor, updateProfile)
doctorRouter.post("/login", loginDoctor)
doctorRouter.post("/cancel-appointment", authDoctor, appointmentCancel)
doctorRouter.get("/appointments", authDoctor, appointmentsDoctor)
doctorRouter.get("/list", doctorList)
doctorRouter.post("/change-availability", authDoctor, changeAvailablity)
doctorRouter.post("/complete-appointment", authDoctor, appointmentComplete)
doctorRouter.get("/dashboard", authDoctor, doctorDashboard)
doctorRouter.get("/profile", authDoctor, doctorProfile)
doctorRouter.post("/update-profile", authDoctor, updateDoctorProfile)
doctorRouter.get("/patient/:id", authDoctor, PatientProfile)
doctorRouter.get("/patients", authDoctor, patientList)
doctorRouter.post("/prescriptions", authDoctor, savePrescription)
doctorRouter.get("/prescriptions/:id", authDoctor,getSavedPrescriptions)
doctorRouter.post("/report/:id",upload.single('file'), authDoctor,analysisreport)
doctorRouter.post("/addtodb/:id", authDoctor,addCustomField)



export default doctorRouter;