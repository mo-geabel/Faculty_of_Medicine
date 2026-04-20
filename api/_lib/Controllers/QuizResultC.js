import QuizResult from "../Modules/QuizResultModule.js";

// Save a new result
export const createResult = async (req, res) => {
  const { studentName, score, totalQuestions } = req.body;

  try {
    const newResult = new QuizResult({
      studentName,
      score,
      totalQuestions,
    });
    const savedResult = await newResult.save();
    res.status(201).json(savedResult);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Fetch all results for members
export const getAllResults = async (req, res) => {
  try {
    // Sort by date descending to show latest results first
    const results = await QuizResult.find({}).sort({ date: -1 });
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Delete a specific result
export const deleteResult = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedResult = await QuizResult.findByIdAndDelete(id);
    if (!deletedResult) {
      return res.status(404).json({ error: "Result not found" });
    }
    res.status(200).json({ message: "Result deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Delete all results
export const deleteAllResults = async (req, res) => {
  try {
    await QuizResult.deleteMany({});
    res.status(200).json({ message: "All results deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
