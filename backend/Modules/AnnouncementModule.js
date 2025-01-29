import mongoose from "mongoose";

const announcementblogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
});

const AnnouncementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  department: { type: String, required: true },
  content: { type: String, required: true },
  blog: [announcementblogSchema], // Keep as an array
});

const Announcement = mongoose.model("Announcement", AnnouncementSchema);
export default Announcement;
