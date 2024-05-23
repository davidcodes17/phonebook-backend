"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.validateUser = exports.createUser = void 0;
const express_validator_1 = require("express-validator");
const statusConfig_1 = __importDefault(require("../config/statusConfig"));
const dbConfig_1 = __importDefault(require("../config/dbConfig"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const dotenv_1 = __importDefault(require("dotenv"));
const checkUserExistence_1 = __importDefault(require("../utils/checkUserExistence"));
const comparePassword_1 = __importDefault(require("../utils/comparePassword"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//dotenv config
dotenv_1.default.config();
//controller to crete user
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //checking if theres any error in the user request body
    const error = (0, express_validator_1.validationResult)(req);
    //returning an error if the request body error is not empty
    if (!error.isEmpty()) {
        return res
            .status(statusConfig_1.default.notAcceptable)
            .json({ msg: "Invalid Values Provided" });
    }
    //getting the email and password from the request body
    const { email, password } = req.body;
    //checking if email and password values are not falsy and sending an error message if they are
    if (!email || !password) {
        return res
            .status(statusConfig_1.default.notAcceptable)
            .json({ msg: "Invalid Values Provided" });
    }
    //checking if there is a user registered with the email
    try {
        const user = yield (0, checkUserExistence_1.default)(email);
        //sending an error message if a user exists with the email
        if (user) {
            return res
                .status(statusConfig_1.default.conflict)
                .json({ msg: "User with email already exists" });
        }
    }
    catch (err) {
        return res.sendStatus(statusConfig_1.default.serverError);
    }
    //creating a new user object to house the user attributes
    const newUser = {
        id: (0, uuid_1.v4)(),
        email: email,
        password: yield bcryptjs_1.default.hash(password, 12),
    };
    //inerting the user into the database
    try {
        //query to insert user into the database
        yield dbConfig_1.default.user.create({
            data: {
                id: newUser.id,
                email: newUser.email,
                password: newUser.password,
            },
        });
        //generating an access token for the user
        const accessToken = (0, generateToken_1.default)({
            id: newUser.id,
            email: newUser.email,
        });
        //sending the accessToken with a success message
        res
            .status(statusConfig_1.default.created)
            .json({ msg: "User created successfully", accessToken: accessToken });
    }
    catch (err) {
        res.sendStatus(statusConfig_1.default.serverError);
    }
});
exports.createUser = createUser;
//controller to validate user login
const validateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //checking if theres any error in the user request body
    const error = (0, express_validator_1.validationResult)(req);
    //returning an error if the request body error is not empty
    if (!error.isEmpty()) {
        return res
            .status(statusConfig_1.default.notAcceptable)
            .json({ msg: "Invalid Values Provided" });
    }
    //getting the email and password from the request body
    const { email, password } = req.body;
    //checking if email and password values are not falsy and sending an error message if they are
    if (!email || !password) {
        return res
            .status(statusConfig_1.default.notAcceptable)
            .json({ msg: "Invalid Values Provided" });
    }
    //checking if there is a user registered with the email
    try {
        const user = yield (0, checkUserExistence_1.default)(email);
        if (!user) {
            return res.status(statusConfig_1.default.notFound).json({ err: "User does not exist" });
        }
        //checking if the password is correct
        const isPasswordCorrect = yield (0, comparePassword_1.default)(password, user === null || user === void 0 ? void 0 : user.password);
        //sending an error if the passwords do not match
        if (!isPasswordCorrect) {
            return res
                .status(statusConfig_1.default.notAcceptable)
                .json({ err: "Incorrect password" });
        }
        //generating a token for the user
        const accessToken = (0, generateToken_1.default)({
            id: user.id,
            email: user.email,
        });
        //sending the accessToken with a success message
        res
            .status(statusConfig_1.default.ok)
            .json({ msg: "Login Successful", accessToken: accessToken });
    }
    catch (err) {
        return res.sendStatus(statusConfig_1.default.serverError);
    }
});
exports.validateUser = validateUser;
//a controller function to handle forgotten password request
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //checking if theres any error in the user request body
    const error = (0, express_validator_1.validationResult)(req);
    //returning an error if the request body error is not empty
    if (!error.isEmpty()) {
        return res
            .status(statusConfig_1.default.notAcceptable)
            .json({ msg: "Invalid Values Provided" });
    }
    //getting the email from the request body
    const { email } = req.body;
    //checking if email and password values are not falsy and sending an error message if they are
    if (!email) {
        return res
            .status(statusConfig_1.default.notAcceptable)
            .json({ msg: "Invalid Values Provided" });
    }
    //checking if user with the email exists
    try {
        const user = yield (0, checkUserExistence_1.default)(email);
        //sending an error message if user with the email does not exist
        if (!user) {
            return res
                .status(statusConfig_1.default.notFound)
                .json({ msg: "User with email does not exists" });
        }
        //generating a reset token for the reset session
        const resetToken = (0, generateToken_1.default)({
            email: email,
        });
        //sending a reset token with a success message
        res
            .status(statusConfig_1.default.ok)
            .json({
            msg: "Reset Token Generated Successfully",
            resetToken: resetToken,
        });
    }
    catch (err) {
        return res
            .status(statusConfig_1.default.serverError)
            .json({ err: "An unexpected error occured" });
    }
});
exports.forgotPassword = forgotPassword;
//a controller function to handle reset password request
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //checking if the request body is valid
    const errors = (0, express_validator_1.validationResult)(req);
    //returning an error message if there is an error present in the request body validation
    if (!errors.isEmpty()) {
        return res
            .status(statusConfig_1.default.notAcceptable)
            .json({ err: "Invalid values provided" });
    }
    //destructuring the token and password from the request body
    const { token, password } = req.body;
    //checking if the values are not falsy if they are return an error message
    if (!token || !password) {
        return res
            .status(statusConfig_1.default.notAcceptable)
            .json({ err: "Invalid values provided" });
    }
    //verifying the reset token
    try {
        jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
            //sending an error message if token is invalid
            if (err) {
                return res.status(statusConfig_1.default.unauthorized).json({ err: "Invalid Token" });
            }
            ;
            //checking if user with email exists
            const user = yield dbConfig_1.default.user.findUnique({
                where: {
                    email: decoded.email
                }
            });
            //sending an error message if user with the provided token exists
            if (!user) {
                return res.status(statusConfig_1.default.unauthorized).json({ err: "Invalid Token" });
            }
            //query to update the user password in the database
            yield dbConfig_1.default.user.update({
                where: {
                    email: decoded.email
                },
                data: {
                    password: yield bcryptjs_1.default.hash(password, 12)
                }
            });
            // sending a success message on successful completion of the operation
            res.status(statusConfig_1.default.ok).json({ msg: "Password updated successfully" });
        }));
    }
    catch (err) {
        //sending an error message if  there is any issue with the operation
        if (err) {
            return res.sendStatus(statusConfig_1.default.serverError);
        }
    }
});
exports.resetPassword = resetPassword;
