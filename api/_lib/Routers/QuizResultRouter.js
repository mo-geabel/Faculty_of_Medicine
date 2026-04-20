import express from "express";
import { createResult, getAllResults, deleteResult, deleteAllResults } from "../Controllers/QuizResultC.js";

const router = express.Router();

// GET all results
router.get("/", getAllResults);

// POST a new result
router.post("/", createResult);

// DELETE all results
router.delete("/all", deleteAllResults);

// DELETE a result
router.delete("/:id", deleteResult);

export default router;
