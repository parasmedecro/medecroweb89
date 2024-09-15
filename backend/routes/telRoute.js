import { sendAppointMessage,sendPresMessage } from '../controllers/telegramController.js';
import express from "express";
import authUser from '../middleware/authUser.js';
const telRouter = express.Router();

telRouter.post("/sendtelappointmentmsg", sendAppointMessage)
telRouter.post("/sendtelprescription", sendPresMessage)



export default telRouter;