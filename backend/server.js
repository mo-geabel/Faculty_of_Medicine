import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import router from "./Routers/AnnouncementRouter.js";
import EmergencyRouter from "./Routers/EmergencyRouter.js";
import MembersRouter from "./Routers/MemberRoutes.js";
import AssistantRouter from "./Routers/AssistantRouter.js";
import LoginRouter from "./Routers/UserRouter.js";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
app.use("/", router);
app.use("/emergency", EmergencyRouter);
app.use("/Members", MembersRouter);
app.use("/assistant", AssistantRouter);
app.use("/login", LoginRouter);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT, () => {
      console.log(`Server started on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error.reason);
  });

app.use(express.static(path.join(__dirname, "../Frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/dist", "index.html"));
});
