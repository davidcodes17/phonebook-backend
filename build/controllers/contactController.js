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
exports.editContact = exports.deleteContact = exports.createContact = exports.getContactList = void 0;
const statusConfig_1 = __importDefault(require("../config/statusConfig"));
const dbConfig_1 = __importDefault(require("../config/dbConfig"));
const express_validator_1 = require("express-validator");
const uuid_1 = require("uuid");
const getContactList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //get the id of the user
    const userID = req.user.id;
    //check the validity of the user id
    if (!userID || userID.trim() === "") {
        return res
            .status(statusConfig_1.default.authRequired)
            .json({ err: "User is not logged in" });
    }
    try {
        //checking if user with the id exists
        const user = dbConfig_1.default.user.findUnique({
            where: {
                id: userID,
            },
        });
        //sending an error message if the user does not exist
        if (!user) {
            return res.status(statusConfig_1.default.notFound).json({ err: "User does not exist" });
        }
        //getting the contact list
        const contacts = yield dbConfig_1.default.contact.findMany({
            where: {
                userId: userID,
            },
            include: {
                numbers: true,
                emails: true,
                websites: true
            }
        });
        //sending an error message if there is no user found for the user
        if (!contacts[0]) {
            return res
                .status(statusConfig_1.default.notFound)
                .json({ err: "You have not created any contacts yet" });
        }
        //sending a success message with the contact list if the operation is successful
        res
            .status(statusConfig_1.default.ok)
            .json({ msg: "Contacts fetched successfully", contacts: contacts });
    }
    catch (err) {
        //sending an error message if the operation as any issues
        if (err) {
            return res.sendStatus(statusConfig_1.default.serverError);
        }
    }
});
exports.getContactList = getContactList;
const createContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //get the id of the user
    const userID = req.user.id;
    //checking the if the request body is valid
    const error = (0, express_validator_1.validationResult)(req);
    //sending an error if the request body is not valid
    if (!error.isEmpty()) {
        return res
            .status(statusConfig_1.default.notAcceptable)
            .json({ err: "Invalid values provided" });
    }
    //getting the request body values
    const { firstName, lastName, middleName, numbers, emails, websites } = req.body;
    //checking if the required values are provided
    if (!firstName || !lastName || !numbers || !emails || !websites) {
        return res
            .status(statusConfig_1.default.notAcceptable)
            .json({ err: "Invalid values provided" });
    }
    //check the validity of the user id
    if (!userID || userID.trim() === "") {
        return res
            .status(statusConfig_1.default.authRequired)
            .json({ err: "User is not logged in" });
    }
    try {
        //checking if user with the id exists
        const user = yield dbConfig_1.default.user.findUnique({
            where: {
                id: userID,
            },
        });
        //sending an error message if the user does not exist
        if (!user) {
            return res.status(statusConfig_1.default.notFound).json({ err: "User does not exist" });
        }
        //object to hold the contacts attribute
        const contact = {
            id: (0, uuid_1.v4)(),
            firstName: firstName,
            lastName: lastName,
            middleName: middleName || "",
            userID: user.id,
        };
        //query to add the contact to the database
        yield dbConfig_1.default.contact.create({
            data: {
                id: contact.id,
                firstName: contact.firstName,
                lastName: contact.lastName,
                middleName: contact.middleName,
                userId: user.id,
                numbers: {
                    createMany: {
                        data: numbers.map((number) => ({
                            id: (0, uuid_1.v4)(),
                            number: number.number,
                            isPrimary: number.isPrimary || false,
                        })),
                    },
                },
                emails: {
                    createMany: {
                        data: emails.map((email) => ({
                            id: (0, uuid_1.v4)(),
                            email: email.email,
                            isPrimary: email.isPrimary || false,
                        })),
                    },
                },
                websites: {
                    createMany: {
                        data: websites.map((website) => ({
                            id: (0, uuid_1.v4)(),
                            website: website.website,
                            isPrimary: website.isPrimary || false,
                        })),
                    },
                },
            },
        });
        //sending a success message with the contact list if the operation is successful
        res.status(statusConfig_1.default.ok).json({ msg: "Contact created successfully" });
    }
    catch (err) {
        //sending an error message if the operation as any issues
        if (err) {
            console.log(err);
            return res.sendStatus(statusConfig_1.default.serverError);
        }
    }
});
exports.createContact = createContact;
//a controller function to delete a contact
const deleteContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    //getting the id of the contact that is to be deleted
    const contactID = (_a = req.params) === null || _a === void 0 ? void 0 : _a.id;
    try {
        //check if the contact exists
        const contact = yield dbConfig_1.default.contact.findUnique({
            where: {
                id: contactID,
            },
        });
        //return an error message if no contact is found with the specified id
        if (!contact) {
            return res
                .status(statusConfig_1.default.notFound)
                .json({ err: "No contact found with the given id" });
        }
        //query to delete the contact
        yield dbConfig_1.default.$transaction([
            dbConfig_1.default.number.deleteMany({
                where: {
                    contactId: contactID,
                },
            }),
            dbConfig_1.default.email.deleteMany({
                where: {
                    contactId: contactID,
                },
            }),
            dbConfig_1.default.website.deleteMany({
                where: {
                    contactId: contactID,
                },
            }),
            dbConfig_1.default.contact.delete({
                where: {
                    id: contactID,
                },
            }),
        ]);
        //returning a success message upon successful completion of the operation
        res.status(statusConfig_1.default.noContent).json({ msg: "Contact deleted successfully" });
    }
    catch (err) {
        //returning an error message if any error occurs with the operation
        console.log(err);
        return res.sendStatus(statusConfig_1.default.serverError);
    }
});
exports.deleteContact = deleteContact;
const editContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //getting the contact id
    const contactID = req.params.id;
    //checking the if the request body is valid
    const error = (0, express_validator_1.validationResult)(req);
    //sending an error if the request body is not valid
    if (!error.isEmpty()) {
        return res
            .status(statusConfig_1.default.notAcceptable)
            .json({ err: "Invalid values provided" });
    }
    //getting the request body values
    const { firstName, lastName, middleName, numbers, emails, websites } = req.body;
    //checking if the required values are provided
    if (!firstName || !lastName || !numbers || !emails || !websites) {
        return res
            .status(statusConfig_1.default.notAcceptable)
            .json({ err: "Invalid values provided" });
    }
    try {
        yield dbConfig_1.default.contact.update({
            where: {
                id: contactID
            },
            data: {
                firstName: firstName,
                lastName: lastName,
                middleName: middleName || "",
                emails: {
                    upsert: emails.map((email) => ({
                        where: {
                            id: email.id ? email.id : ""
                        },
                        create: {
                            id: (0, uuid_1.v4)(),
                            email: email.email,
                            isPrimary: email.isPrimary || false,
                        },
                        update: {
                            email: email.email,
                            isPrimary: email.isPrimary || false
                        }
                    }))
                },
                numbers: {
                    upsert: numbers.map((number) => ({
                        where: {
                            id: number.id ? number.id : ""
                        },
                        create: {
                            id: (0, uuid_1.v4)(),
                            number: number.number,
                            isPrimary: number.isPrimary || false,
                        },
                        update: {
                            number: number.number,
                            isPrimary: number.isPrimary || false
                        }
                    }))
                },
                websites: {
                    upsert: websites.map((website) => ({
                        where: {
                            id: website.id ? website.id : ""
                        },
                        create: {
                            id: (0, uuid_1.v4)(),
                            website: website.website,
                            isPrimary: website.isPrimary || false
                        },
                        update: {
                            website: website.website,
                            isPrimary: website.isPrimary || false
                        }
                    }))
                }
            }
        });
        res.status(statusConfig_1.default.ok).json({ msg: "Contact updated successfully" });
    }
    catch (err) {
        if (err) {
            console.log(err);
            return res.sendStatus(statusConfig_1.default.serverError);
        }
    }
});
exports.editContact = editContact;
