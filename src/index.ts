//server imports
import express from "express";
import dotenv from "dotenv";
import STATUS from "./config/statusConfig";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { verifyUser } from "./middlewares/verifyUser";

//route imports
import { router as authRoutes } from "./routes/authRoutes";
import { router as contactRoutes } from "./routes/contactRoutes";

//main server setup
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

//setting up cors
const corsOption = {
  origin: process.env.CORS_ORIGIN,
  optionsSuccessStatus: 200,
};

app.use(cookieParser());
//web security middlewares
app.use(cors(corsOption));
app.use(helmet());

//main server configurations
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//app routes
app.use("/v1/api/auth", authRoutes);

app.use(verifyUser);
app.use("/v1/api/contacts", contactRoutes);

//welcome message
app.get("/", (_, res) => {
  res.status(STATUS.ok).json({ msg: "Welcome to the PhoneBook API" });
});

//start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
