import mongoose from "mongoose";
import Emergency from "../Modules/EmergencyModule.js";

const getEmergency = async (req, res) => {
  try {
    const response = await Emergency.find();
    if (response.length === 0) {
      return res.status(404).json({ message: "there is no cases in DB" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};
const createEmergency = async (req, res) => {
  const data = req.body;

  try {
    // Create the emergency record in the database
    const response = await Emergency.create(data);

    // Return the created record
    res.status(201).json(response);
  } catch (error) {
    // Log the error for debugging
    console.error("Error creating emergency:", error);

    // Return a user-friendly error message
    res.status(500).json({ message: "Failed to create emergency record" });
  }
};
const deleteEmergency = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }
  try {
    const response = await Emergency.findByIdAndDelete(id);

    res.status(200).json(response);
  } catch (error) {
    console.error("Error creating emergency:", error);

    res.status(500).json({ message: "Failed to create emergency record" });
  }
};
const updateEmergency = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    // Update the emergency record
    const response = await Emergency.findByIdAndUpdate(id, data, { new: true });

    // Handle case where document is not found
    if (!response) {
      return res.status(404).json({ message: "Emergency record not found" });
    }

    // Respond with the updated document
    res.status(200).json(response);
  } catch (error) {
    // Log the error for debugging
    console.error("Error updating emergency:", error);

    // Return a user-friendly error message
    res.status(500).json({ message: "Failed to update emergency record" });
  }
};
export { getEmergency, deleteEmergency, updateEmergency, createEmergency };
