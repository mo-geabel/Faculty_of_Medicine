import express from "express";
import postLogin from "../Controllers/LoginC.js";

const LoginRouter = express.Router();

LoginRouter.post("/", postLogin);

export default LoginRouter;
