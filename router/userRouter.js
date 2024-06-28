import express from "express"
import { addNewAdmin, addNewDoctor, getAllDocters, getUserDetails, login, logoutAdmin, logoutPatient, patientRegister } from "../controllers/userController.js";
import {isAdminAuthendicated,isPatientAuthendicated} from "../middlewear/authentication.js"

const router= express.Router();

router.post("/patient/rigister",patientRegister);
router.post("/login",login)
router.post("/admin/addnew",isAdminAuthendicated,addNewAdmin)
router.get("/docters",getAllDocters);
router.get("/patient/me",isPatientAuthendicated,getUserDetails);
router.get("/admin/me",isAdminAuthendicated,getUserDetails);
router.get("/admin/logout",isAdminAuthendicated,logoutAdmin);
router.get("/patient/logout",isPatientAuthendicated,logoutPatient);
router.post("/doctor/addnew",isAdminAuthendicated,addNewDoctor);

export default router