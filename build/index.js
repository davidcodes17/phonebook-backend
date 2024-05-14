"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//server imports
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const statusConfig_1 = __importDefault(require("./config/statusConfig"));
//main server setup
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
//main server configurations
app.use(express_1.default.json());
app.use(express_1.default.urlencoded());
//welcome message
app.get("/", (_, res) => {
    res.status(statusConfig_1.default.ok).json({ msg: "Welcome to the PhoneBook APi" });
});
//start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
