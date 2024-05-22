//controller imports
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import STATUS from "../config/statusConfig";
import db from "../config/dbConfig";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import generateToken from "../utils/generateToken";
import dotenv from "dotenv";
import checkUserExistence from "../utils/checkUserExistence";
import comparePassword from "../utils/comparePassword";

//dotenv config
dotenv.config();

//controller to crete user
export const createUser = async (req: Request, res: Response) => {
  //checking if theres any error in the user request body
  const error = validationResult(req);

  //returning an error if the request body error is not empty
  if (!error.isEmpty()) {
    return res
      .status(STATUS.notAcceptable)
      .json({ msg: "Invalid Values Provided" });
  }

  //getting the email and password from the request body
  const { email, password } = req.body;

  //checking if email and password values are not falsy and sending an error message if they are
  if (!email || !password) {
    return res
      .status(STATUS.notAcceptable)
      .json({ msg: "Invalid Values Provided" });
  }

  //checking if there is a user registered with the email
  try {
    const user = await checkUserExistence(email);

    //sending an error message if a user exists with the email
    if (user) {
      return res
        .status(STATUS.conflict)
        .json({ msg: "User with email already exists" });
    }
  } catch (err) {
    return res.sendStatus(STATUS.serverError);
  }

  //creating a new user object to house the user attributes
  const newUser = {
    id: uuid(),
    email: email,
    password: await bcrypt.hash(password, 12),
  };

  //inerting the user into the database
  try {
    //query to insert user into the database
    await db.user.create({
      data: {
        id: newUser.id,
        email: newUser.email,
        password: newUser.password,
      },
    });

    //generating an access token for the user
    const accessToken = generateToken({
      id: newUser.id,
      email: newUser.email,
    });

    //setting the access token as a cookie and sending a success message
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.status(STATUS.created).json({ msg: "User created successfully" });
  } catch (err) {
    res.sendStatus(STATUS.serverError);
  }
};

//controller to validate user login
export const validateUser = async (req: Request, res: Response) => {
  //checking if theres any error in the user request body
  const error = validationResult(req);

  //returning an error if the request body error is not empty
  if (!error.isEmpty()) {
    return res
      .status(STATUS.notAcceptable)
      .json({ msg: "Invalid Values Provided" });
  }

  //getting the email and password from the request body
  const { email, password } = req.body;

  //checking if email and password values are not falsy and sending an error message if they are
  if (!email || !password) {
    return res
      .status(STATUS.notAcceptable)
      .json({ msg: "Invalid Values Provided" });
  }

  //checking if there is a user registered with the email
  try {
    const user = await checkUserExistence(email);

    if (!user) {
      return res.status(STATUS.notFound).json({ err: "User does not exist" });
    }

    //checking if the password is correct
    const isPasswordCorrect = await comparePassword(
      password,
      user?.password as string
    );

    //sending an error if the passwords do not match
    if (!isPasswordCorrect) {
      return res
        .status(STATUS.notAcceptable)
        .json({ err: "Incorrect password" });
    }

    //generating a token for the user
    const accessToken = generateToken({
      id: user.id,
      email: user.email,
    });

    //setting the access token as a cookie and sending a success message
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.status(STATUS.created).json({ msg: "Login successful" });
  } catch (err) {
    return res.sendStatus(STATUS.serverError);
  }
};
