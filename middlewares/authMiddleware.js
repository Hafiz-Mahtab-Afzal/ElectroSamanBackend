import jwt from "jsonwebtoken";
import { error } from "../utils/messages.js";
// import { JWT_SECRET } from "../config/config.js";

export const requriedLoggedIn = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader)
      return res.status(401).json({ message: "No token provided!" });

    const token = authHeader.split(" ")[1];
    if (!token)
      return res.status(401).json({ message: "Invalid token!" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Token is not valid!" });
  }
};

export const checkrole = (req, res, next) => {
  try {
    if(req.user.role == "admin"){
        next();
    }
    else{
      res.json({
         error:"You are not authorized"
      })
    }
    
  } catch (err) {
    res.status(403).json({ message: "Token is not valid!" });
  }
}