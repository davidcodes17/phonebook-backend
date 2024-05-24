import { Response } from "express";
import STATUS from "../config/statusConfig";
import db from "../config/dbConfig";
import { validationResult } from "express-validator";
import { v4 as uuid } from "uuid";

  //the number type
  type Number = {
    id: string;
    number: string;
    isPrimary: boolean;
    contactId: string;
  };

  //the email type
  type Email = {
    id: string;
    email: string;
    isPrimary: boolean;
    contactId: string;
  };

  //the website type
  type Website = {
    id: string;
    website: string;
    isPrimary: boolean;
    contactId: string;
  };


export const getContactList = async (req: any, res: Response) => {
  //get the id of the user
  const userID = req.user.id;

  //check the validity of the user id
  if (!userID || userID.trim() === "") {
    return res
      .status(STATUS.authRequired)
      .json({ err: "User is not logged in" });
  }

  try {
    //checking if user with the id exists
    const user = db.user.findUnique({
      where: {
        id: userID,
      },
    });

    //sending an error message if the user does not exist
    if (!user) {
      return res.status(STATUS.notFound).json({ err: "User does not exist" });
    }

    //getting the contact list
    const contacts = await db.contact.findMany({
      where: {
        userId: userID,
      },
      include:{
        numbers: true,
        emails: true,
        websites: true
      }
    });

    //sending an error message if there is no user found for the user
    if (!contacts[0]) {
      return res
        .status(STATUS.notFound)
        .json({ err: "You have not created any contacts yet" });
    }

    //sending a success message with the contact list if the operation is successful
    res
      .status(STATUS.ok)
      .json({ msg: "Contacts fetched successfully", contacts: contacts });
  } catch (err) {
    //sending an error message if the operation as any issues
    if (err) {
      return res.sendStatus(STATUS.serverError);
    }
  }
};

export const createContact = async (req: any, res: Response) => {
  //get the id of the user
  const userID = req.user.id;

  //checking the if the request body is valid
  const error = validationResult(req);

  //sending an error if the request body is not valid
  if (!error.isEmpty()) {
    return res
      .status(STATUS.notAcceptable)
      .json({ err: "Invalid values provided" });
  }

  //getting the request body values
  const { firstName, lastName, middleName, numbers, emails, websites } =
    req.body;

  //checking if the required values are provided
  if (!firstName || !lastName || !numbers || !emails || !websites) {
    return res
      .status(STATUS.notAcceptable)
      .json({ err: "Invalid values provided" });
  }

  //check the validity of the user id
  if (!userID || userID.trim() === "") {
    return res
      .status(STATUS.authRequired)
      .json({ err: "User is not logged in" });
  }

  try {
    //checking if user with the id exists
    const user = await db.user.findUnique({
      where: {
        id: userID,
      },
    });

    //sending an error message if the user does not exist
    if (!user) {
      return res.status(STATUS.notFound).json({ err: "User does not exist" });
    }

    //object to hold the contacts attribute
    const contact = {
      id: uuid(),
      firstName: firstName,
      lastName: lastName,
      middleName: middleName || "",
      userID: user.id,
    };

    //query to add the contact to the database
    await db.contact.create({
      data: {
        id: contact.id,
        firstName: contact.firstName,
        lastName: contact.lastName,
        middleName: contact.middleName,
        userId: user.id,
        numbers: {
          createMany: {
            data: numbers.map((number: Number) => ({
              id: uuid(),
              number: number.number,
              isPrimary: number.isPrimary || false,
            })),
          },
        },
        emails: {
          createMany: {
            data: emails.map((email: Email) => ({
              id: uuid(),
              email: email.email,
              isPrimary: email.isPrimary || false,
            })),
          },
        },
        websites: {
          createMany: {
            data: websites.map((website: Website) => ({
              id: uuid(),
              website: website.website,
              isPrimary: website.isPrimary || false,
            })),
          },
        },
      },
    });

    //sending a success message with the contact list if the operation is successful
    res.status(STATUS.ok).json({ msg: "Contact created successfully" });
  } catch (err) {
    //sending an error message if the operation as any issues
    if (err) {
      console.log(err);
      return res.sendStatus(STATUS.serverError);
    }
  }
};

//a controller function to delete a contact
export const deleteContact = async (req: any, res: Response) => {
  //getting the id of the contact that is to be deleted
  const contactID = req.params?.id;

  try {
    //check if the contact exists
    const contact = await db.contact.findUnique({
      where: {
        id: contactID,
      },
    });

    //return an error message if no contact is found with the specified id
    if (!contact) {
      return res
        .status(STATUS.notFound)
        .json({ err: "No contact found with the given id" });
    }

    //query to delete the contact
    await db.$transaction([
      db.number.deleteMany({
        where: {
          contactId: contactID,
        },
      }),
      db.email.deleteMany({
        where: {
          contactId: contactID,
        },
      }),
      db.website.deleteMany({
        where: {
          contactId: contactID,
        },
      }),
      db.contact.delete({
        where: {
          id: contactID,
        },
      }),
    ]);

    //returning a success message upon successful completion of the operation
    res.status(STATUS.noContent).json({ msg: "Contact deleted successfully" });
  } catch (err) {
    //returning an error message if any error occurs with the operation
    console.log(err);
    return res.sendStatus(STATUS.serverError);
  }
};

export const editContact = async (req: any, res: Response) => {

  //getting the contact id
  const contactID = req.params.id

  //checking the if the request body is valid
  const error = validationResult(req);

  //sending an error if the request body is not valid
  if (!error.isEmpty()) {
    return res
      .status(STATUS.notAcceptable)
      .json({ err: "Invalid values provided" });
  }

  //getting the request body values
  const { firstName, lastName, middleName, numbers, emails, websites } =
    req.body;

  //checking if the required values are provided
  if (!firstName || !lastName || !numbers || !emails || !websites) {
    return res
      .status(STATUS.notAcceptable)
      .json({ err: "Invalid values provided" });
  }

  try {
    await db.contact.update({
      where: {
        id: contactID
      },
      data:{
        firstName: firstName,
        lastName: lastName,
        middleName: middleName || "",
        emails:{
          upsert: emails.map((email: Email) => ({
            where: {
              id: email.id ? email.id : ""
            },
            create:{
              id: uuid(),
              email: email.email,
              isPrimary: email.isPrimary || false,
            },
            update:{
              email: email.email,
              isPrimary: email.isPrimary || false
            }
          })) 
        },
        numbers:{
          upsert: numbers.map((number: Number) => ({
            where: {
              id: number.id ? number.id : ""
            },
            create:{
              id: uuid(),
              number: number.number,
              isPrimary: number.isPrimary || false,
            },
            update:{
              number: number.number,
              isPrimary: number.isPrimary || false
            } 
          })) 
        },
        websites:{
          upsert: websites.map((website: Website) => ({
            where: {
              id: website.id ? website.id : ""
            },
            create:{
              id: uuid(),
              website: website.website,
              isPrimary: website.isPrimary || false
            },
            update:{
              website: website.website,
              isPrimary: website.isPrimary || false
            }
          })) 
        }
      }
    })

    res.status(STATUS.ok).json({ msg: "Contact updated successfully" })
  } catch (err) {
    if(err){
      console.log(err)
      return res.sendStatus(STATUS.serverError)
    }
  }

}