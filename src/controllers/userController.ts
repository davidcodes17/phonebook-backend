import { Request, Response } from "express"


export const createUser = async( req:Request, res:Response ) => {
  try {
    const { username, email, password } = req.body;
    // Create a new user in your database
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
}