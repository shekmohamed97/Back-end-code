import express from "express";
import { deleteAppointment, getAllAppointments, postAppointment, updateAppointmentStatus } from "../controllers/appointmentController.js";
import {isAdminAuthendicated} from "../middlewear/authentication.js"

const router = express.Router();

router.post("/post",postAppointment);
router.get("/getall",isAdminAuthendicated,getAllAppointments)
router.put("/update/:id",isAdminAuthendicated,updateAppointmentStatus);
router.delete("/delete/:id",isAdminAuthendicated,deleteAppointment);

export default router;