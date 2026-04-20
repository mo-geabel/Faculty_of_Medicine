import express from "express";
import {
  getMember,
  createMember,
  deleteMember,
  updateMember,
} from "../Controllers/MemberC.js";
const MembersRouter = express.Router();

MembersRouter.get("/", getMember);
MembersRouter.post("/", createMember);
MembersRouter.delete("/:id", deleteMember);
MembersRouter.patch("/:id", updateMember);

export default MembersRouter;
