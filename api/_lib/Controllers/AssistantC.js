import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Assistant from "../Modules/AssistantModule.js";
import validator from "validator";
import dotenv from "dotenv";
dotenv.config();
const getAssistant = async (req, res) => {
  try {
    const response = await Assistant.find();
    if (response.length === 0) {
      return res.status(404).json({ message: "there is no cases in DB" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

const createAssistant = async (req, res) => {
  const { email, password, ...data } = req.body;

  try {
    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: "Invalid email address. Please provide a valid email.",
      });
    }

    // Validate password
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        message:
          "Your password must be at least 8 characters long and include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.",
      });
    }

    // Hash the password
    const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 10; // Default to 10 if not set
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (!hashedPassword) {
      return res.status(500).json({
        message: "Error occurred while hashing the password.",
      });
    }

    console.log("Hashed Password:", hashedPassword);

    // Check if the email already exists
    const existingAssistant = await Assistant.findOne({ email });
    if (existingAssistant) {
      return res.status(400).json({
        message: "An account with this email already exists.",
      });
    }

    // Create the Assistant record in the database
    const newAssistant = await Assistant.create({
      ...data,
      email,
      password: hashedPassword,
    });

    // Return the created Assistant (without the password for security)
    res.status(200).json({
      message: "Account successfully created.",
      Assistant: {
        id: newAssistant._id,
        email: newAssistant.email,
        ...data,
      },
    });
  } catch (error) {
    // Log the error for debugging
    console.error("Error creating Assistant:", error);

    // Return a generic error message
    res.status(500).json({ message: "Failed to create Assistant record." });
  }
};
const addShiftToAssistant = async (req, res) => {
  const { assistantId, department, shiftStartTime, shiftEndTime } = req.body;

  try {
    // Validate input
    if (!assistantId || !department || !shiftStartTime || !shiftEndTime) {
      return res.status(400).json({
        message:
          "All fields (assistantId, department, shiftStartTime, shiftEndTime) are required.",
      });
    }

    // Find the assistant by ID
    const assistant = await Assistant.findById(assistantId);
    if (!assistant) {
      return res.status(404).json({ message: "Assistant not found." });
    }

    // Add the shift to the shifts array
    assistant.shifts.push({
      assistantId,
      department,
      shiftStartTime,
      shiftEndTime,
    });

    // Save the updated assistant document
    await assistant.save();

    res.status(200).json({ message: "Shift added successfully.", assistant });
  } catch (error) {
    console.error("Error adding shift:", error);
    res.status(500).json({ message: "Failed to add shift.", error: error });
  }
};

const deleteShiftFromAssistant = async (req, res) => {
  const { id } = req.params;
  const { assistantId } = req.body;

  try {
    // Validate input
    if (!assistantId || !id) {
      return res.status(400).json({
        message: "Both assistantId and shiftId are required.",
      });
    }

    // Find the assistant by ID
    const assistant = await Assistant.findById(assistantId);
    if (!assistant) {
      return res.status(404).json({ message: "Assistant not found." });
    }

    // Filter out the shift with the given shiftId
    const initialShiftCount = assistant.shifts.length;
    assistant.shifts = assistant.shifts.filter(
      (shift) => shift._id.toString() !== id
    );

    // Check if the shift was actually removed
    if (assistant.shifts.length === initialShiftCount) {
      return res.status(404).json({ message: "Shift not found." });
    }

    // Save the updated assistant document
    await assistant.save();

    res.status(200).json({ message: "Shift deleted successfully.", assistant });
  } catch (error) {
    console.error("Error deleting shift:", error);
    res.status(500).json({ message: "Failed to delete shift.", error: error });
  }
};

const deleteAssistant = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }
  try {
    const response = await Assistant.findByIdAndDelete(id);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error Deleting Assistant:", error);

    res.status(500).json({ message: "Failed to delete memeber record" });
  }
};

const updateAssistant = async (req, res) => {
  const { id } = req.params;
  const { password, ...updateData } = req.body; // Destructure password and other fields from the body

  try {
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID." });
    }

    // Check if password needs to be updated
    if (password) {
      const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 10; // Default to 10 if not set
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);

      if (!hashedPassword) {
        return res.status(500).json({
          message: "Error occurred while hashing the password.",
        });
      }

      // Add the hashed password to the updateData
      updateData.password = hashedPassword;
    }

    // Update the assistant record
    const updatedAssistant = await Assistant.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true } // Return the updated document
    );

    // Handle case where the assistant is not found
    if (!updatedAssistant) {
      return res.status(404).json({ message: "Assistant record not found." });
    }

    // Respond with the updated assistant
    res.status(200).json({
      message: "Assistant updated successfully.",
      assistant: updatedAssistant,
    });
  } catch (error) {
    // Log the error for debugging
    console.error("Error updating assistant:", error);

    // Respond with a user-friendly error message
    res.status(500).json({ message: "Failed to update assistant record." });
  }
};

export {
  getAssistant,
  createAssistant,
  updateAssistant,
  deleteAssistant,
  addShiftToAssistant,
  deleteShiftFromAssistant,
};
