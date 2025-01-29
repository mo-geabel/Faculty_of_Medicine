import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Members from "../Modules/MembersModule.js";
import validator from "validator";
import dotenv from "dotenv";
dotenv.config();
const getMember = async (req, res) => {
  try {
    const response = await Members.find();
    if (response.length === 0) {
      return res.status(404).json({ message: "there is no cases in DB" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

const createMember = async (req, res) => {
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
    const existingMember = await Members.findOne({ email });
    if (existingMember) {
      return res.status(400).json({
        message: "An account with this email already exists.",
      });
    }

    // Create the member record in the database
    const newMember = await Members.create({
      ...data,
      email,
      password: hashedPassword,
    });

    // Return the created member (without the password for security)
    res.status(201).json({
      message: "Account successfully created.",
      member: {
        id: newMember._id,
        email: newMember.email,
        ...data,
      },
    });
  } catch (error) {
    // Log the error for debugging
    console.error("Error creating member:", error);

    // Return a generic error message
    res.status(500).json({ message: "Failed to create member record." });
  }
};
const deleteMember = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }
  try {
    const response = await Members.findByIdAndDelete(id);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error Deleting member:", error);

    res.status(500).json({ message: "Failed to delete memeber record" });
  }
};

const updateMember = async (req, res) => {
  const { id } = req.params;
  const { password, ...updateData } = req.body; // Destructure password and other fields

  try {
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    // Handle password update if provided
    if (password) {
      const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 10; // Default to 10 if not set
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);

      if (!hashedPassword) {
        return res.status(500).json({
          message: "Error occurred while hashing the password.",
        });
      }

      // Add hashed password to the updateData
      updateData.password = hashedPassword;
    }

    // Update the member record
    const updatedMember = await Members.findByIdAndUpdate(
      id,
      { $set: updateData }, // Only update the provided fields
      { new: true } // Return the updated document
    );

    // Handle case where document is not found
    if (!updatedMember) {
      return res.status(404).json({ message: "Member record not found." });
    }

    // Respond with the updated document
    res.status(200).json({
      message: "Member updated successfully.",
      member: updatedMember,
    });
  } catch (error) {
    // Log the error for debugging
    console.error("Error updating member:", error);

    // Return a user-friendly error message
    res.status(500).json({ message: "Failed to update member record." });
  }
};

export { getMember, createMember, updateMember, deleteMember };
