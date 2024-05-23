import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

export const generateToken = (payload : object) => {
  const accessToken = jwt.sign( payload, process.env.ACCESS_TOKEN_SECRET as string );

  return accessToken;
}

export default generateToken;