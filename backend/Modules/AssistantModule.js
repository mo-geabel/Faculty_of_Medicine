import mongoose from "mongoose";

const ShiftSchema = new mongoose.Schema({
  assistantId: { type: String, required: true },
  department: { type: String, required: true },
  shiftStartTime: { type: String, required: true },
  shiftEndTime: { type: String, required: true },
});
const assistantSchema = new mongoose.Schema({
  img: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  shifts: [ShiftSchema],
});

const Assistant = mongoose.model("Assistant", assistantSchema);

export default Assistant;
