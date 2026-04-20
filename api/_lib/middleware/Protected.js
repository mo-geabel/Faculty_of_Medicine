import jwt from "jsonwebtoken";
import Members from "../Modules/MembersModule.js";
import Assistant from "../Modules/AssistantModule.js";
export const protect = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "You must be logged in" });
  }
  const token = authorization.split(" ")[1];
  const { _id } = jwt.verify(token, process.env.SECRET);
  try {
    const Member = await Members.findOne({ _id }).select("_id");
    const Assistants = await Assistant.findOne({ _id }).select("_id");
    req.User = Member || Assistants;
    if (!req.User) {
      return res.status(401).json({ error: "wrong user" });
    }
    next();
  } catch (err) {
    res.status(401).json({ error: "error with loggin" });
  }
};
export const Onlymember = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "You must be logged in" });
  }
  const token = authorization.split(" ")[1];
  const { _id } = jwt.verify(token, process.env.SECRET);
  try {
    const Member = await Members.findOne({ _id }).select("_id");
    if (!Member) {
      return res.status(401).json({ error: "wrong user" });
    }
    req.User = Member;
    next();
  } catch (err) {
    res.status(401).json({ error: "error with loggin" });
  }
};
