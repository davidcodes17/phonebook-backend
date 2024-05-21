//server imports
import express from "express"
import dotenv from "dotenv"
import STATUS from "./config/statusConfig";

//route imports
import { router as authRoutes } from "./routes/authRoutes";

//main server setup
dotenv.config()
const app = express();
const PORT = process.env.PORT || 3000

//main server configurations
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

//app routes
app.use("/v1/api/", authRoutes)

//welcome message
app.get("/", ( _, res ) => {
  res.status(STATUS.ok).json({ msg: "Welcome to the PhoneBook API" })
})

//start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})