"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//server imports
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const statusConfig_1 = __importDefault(require("./config/statusConfig"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const verifyUser_1 = require("./middlewares/verifyUser");
//route imports
const authRoutes_1 = require("./routes/authRoutes");
const contactRoutes_1 = require("./routes/contactRoutes");
//main server setup
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
//setting up cors
const corsOption = {
    origin: process.env.CORS_ORIGIN,
    optionsSuccessStatus: 200,
};
app.use((0, cookie_parser_1.default)());
//web security middlewares
app.use((0, cors_1.default)(corsOption));
app.use((0, helmet_1.default)());
//main server configurations
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
//app routes
app.use("/v1/api/auth", authRoutes_1.router);
app.use(verifyUser_1.verifyUser);
app.use("/v1/api/contacts", contactRoutes_1.router);
//welcome message
app.get("/", (_, res) => {
    res.status(statusConfig_1.default.ok).json({ msg: "Welcome to the PhoneBook API" });
});
//start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
