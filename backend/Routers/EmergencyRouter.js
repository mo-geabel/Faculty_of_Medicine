import express from "express";
import {
  getEmergency,
  createEmergency,
  updateEmergency,
  deleteEmergency,
} from "../Controllers/EmergencyC.js";
import { protect } from "../middleware/Protected.js";
const EmergencyRouter = express.Router();

EmergencyRouter.get("/", getEmergency);
EmergencyRouter.post("/", createEmergency);
EmergencyRouter.delete("/:id", protect, deleteEmergency);
EmergencyRouter.patch("/:id", protect, updateEmergency);

export default EmergencyRouter;
