import mongoose from "mongoose";
import Members from "../Modules/MembersModule.js";
import Assistant from "../Modules/AssistantModule.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "1d" });
};

const postLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the account exists in either Members or Assistant
    const member = await Members.findOne({ email });
    const assistant = await Assistant.findOne({ email });

    if (!member && !assistant) {
      return res.status(400).json({ error: "The account can't be found." });
    }

    // Identify the user type and get the hashed password
    const user = member || assistant;
    const userRole = member ? "Member" : "Assistant"; // Determine the role
    const hashedPassword = user.password;

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    // Generate a token
    const token = createToken(user._id);

    // Respond with the token, user details, and role
    res.status(200).json({
      email: user.email,
      role: userRole, // Include the role in the response
      token: token,
    });
  } catch (error) {
    console.error("Error in postLogin:", error);
    return res
      .status(500)
      .json({ error: "An unexpected error occurred." + error });
  }
};

export default postLogin;
