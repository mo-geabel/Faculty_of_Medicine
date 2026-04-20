import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  img: { type: String, required: true },
  name: { type: String, required: true },
  department: { type: String, required: true },
  title: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
});

const Members = mongoose.model("Members", memberSchema);
export default Members;
