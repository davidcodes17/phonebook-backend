import jwt from "jsonwebtoken";
import { Secret } from "jsonwebtoken";
import dotenv from "dotenv";
import STATUS from "../config/statusConfig";
import { Request, Response, NextFunction } from "express";

dotenv.config();

export const verifyUser = (req: any, res: Response, next: NextFunction) => {
  //getting the request header
  const header = req.headers;

  //getting the request jwt token
  const token = header.authorization?.split(" ")[1];

  if(!token){
    return res.sendStatus(STATUS.unauthorized)
  }

  try {
    //verifying the header token
    jwt.verify(
      token as string,
      process.env.ACCESS_TOKEN_SECRET as Secret,
      (err: any, decoded: any) => {
        //sending an error message the token id is invalid
        if (err) {
          return res.status(STATUS.unauthorized).json({ err: "Invalid Token" });
        }

        //setting the request user
        req.user = {
          id: decoded.id,
          email: decoded.email,
        };
      }
    );
  } catch (err) {
    if (err) {
      return res.sendStatus(STATUS.serverError);
    }
  }

  next();
};
