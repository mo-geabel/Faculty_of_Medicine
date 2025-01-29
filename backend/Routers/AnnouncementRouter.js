import express from "express";
import {
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getAchievment,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} from "../Controllers/AnnouncementC.js";
import { Onlymember } from "../middleware/Protected.js";
const router = express.Router();

// Announcement routes
router.get("/announcement", getAnnouncement);
router.post("/announcement", Onlymember, createAnnouncement);
router.patch("/announcement/:id", Onlymember, updateAnnouncement);
router.delete("/announcement/:id", Onlymember, deleteAnnouncement);

// Achievement routes
router.get("/achievement", getAchievment);
router.post("/achievement", Onlymember, createAchievement);
router.patch("/achievement/:id", Onlymember, updateAchievement);
router.delete("/achievement/:id", Onlymember, deleteAchievement);

export default router;
