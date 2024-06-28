import express from "express";
import {getAllMessages, sendingMessageHospital} from "../controllers/messageController.js"
import {isAdminAuthendicated} from "../middlewear/authentication.js"

const router = express.Router();

router.post("/send", sendingMessageHospital);
router.get("/getall",isAdminAuthendicated,getAllMessages)

export default router;