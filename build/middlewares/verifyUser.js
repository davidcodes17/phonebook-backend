"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const statusConfig_1 = __importDefault(require("../config/statusConfig"));
dotenv_1.default.config();
const verifyUser = (req, res, next) => {
    var _a;
    //getting the request header
    const header = req.headers;
    //getting the request jwt token
    const token = (_a = header.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        return res.sendStatus(statusConfig_1.default.unauthorized);
    }
    try {
        //verifying the header token
        jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            //sending an error message the token id is invalid
            if (err) {
                return res.status(statusConfig_1.default.unauthorized).json({ err: "Invalid Token" });
            }
            //setting the request user
            req.user = {
                id: decoded.id,
                email: decoded.email,
            };
        });
    }
    catch (err) {
        if (err) {
            return res.sendStatus(statusConfig_1.default.serverError);
        }
    }
    next();
};
exports.verifyUser = verifyUser;
