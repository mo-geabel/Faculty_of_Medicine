import express from "express";
import {
  addShiftToAssistant,
  getAssistant,
  createAssistant,
  deleteAssistant,
  updateAssistant,
  deleteShiftFromAssistant,
} from "../Controllers/AssistantC.js";
import { Onlymember } from "../middleware/Protected.js";
const AssistantRouter = express.Router();

AssistantRouter.get("/", getAssistant);
AssistantRouter.post("/", Onlymember, createAssistant);
AssistantRouter.post("/addshift", Onlymember, addShiftToAssistant);
AssistantRouter.delete("/:id", Onlymember, deleteAssistant);
AssistantRouter.delete(
  "/deleteshift/:id",
  Onlymember,
  deleteShiftFromAssistant
);
AssistantRouter.patch("/:id", Onlymember, updateAssistant);

export default AssistantRouter;
