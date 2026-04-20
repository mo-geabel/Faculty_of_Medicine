import Announcement from "../Modules/AnnouncementModule.js";
import Achievement from "../Modules/AchievenentsModule.js";
import mongoose from "mongoose";
const getAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.find();
    if (announcement.length === 0) {
      return res.status(404).json({ message: "No announcement found" });
    }
    res
      .status(200)
      .json({ message: "The announcement was gotten", data: announcement });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const createAnnouncement = async (req, res) => {
  const announcements = req.body; // Expecting an array of announcements in the request body

  try {
    // Use insertMany to add multiple announcements
    const insertedAnnouncements = await Announcement.insertMany(announcements);

    res.status(200).json({
      message: "Announcements created successfully",
      data: insertedAnnouncements, // Return the inserted documents
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create announcements",
      error: error.message,
    });
  }
};

const updateAnnouncement = async (req, res) => {
  const { id: _id } = req.params;
  const announcement = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("No announcement with that id");
  }
  try {
    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      _id,
      { ...announcement, _id },
      { new: true }
    );
    res.json({ message: "Announcement is updated", data: updatedAnnouncement });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deleteAnnouncement = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send("No announcement with that id");
  }
  try {
    const deletedAnnouncement = await Announcement.findById(id);
    await Announcement.findByIdAndDelete(id);
    res
      .status(200)
      .json({ message: "Announcement is deleted", data: deletedAnnouncement });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAchievment = async (req, res) => {
  try {
    const achievement = await Achievement.find();
    if (achievement.length === 0) {
      return res.status(404).json({ message: "No achievement found" });
    }
    res
      .status(200)
      .json({ message: "The achievement was gotten", data: achievement });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const createAchievement = async (req, res) => {
  const achievement = req.body;
  try {
    const insertedAnnouncements = await Achievement.insertMany(achievement);

    res.status(201).json({
      message: "The achievement was created",
      data: insertedAnnouncements,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateAchievement = async (req, res) => {
  const { id: _id } = req.params;
  const achievement = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("No achievement with that id");
  }
  try {
    const updatedAchievement = await Achievement.findByIdAndUpdate(
      _id,
      { ...achievement, _id },
      { new: true }
    );
    res.json({ message: "Achievement is updated", data: updatedAchievement });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deleteAchievement = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send("No achievement with that id");
  }
  try {
    const deletedAchievement = await Achievement.findById(id);
    await Achievement.findByIdAndDelete(id);
    res
      .status(200)
      .json({ message: "Achievement is deleted", data: deletedAchievement });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export {
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getAchievment,
  createAchievement,
  updateAchievement,
  deleteAchievement,
};
