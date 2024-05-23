import { Response } from "express";
import STATUS from "../config/statusConfig";
import db from "../config/dbConfig";


export const getContactList = async( req: any, res: Response ) => {
  //get the id of the user
  const userID = req.user.id;

  //check the validity of the user id
  if( !userID || userID.trim() === "" ){
    return res.status(STATUS.authRequired).json({ err: "User is not logged in" });
  }

  try{

    //checking if user with the id exists
    const user = db.user.findUnique({
      where: {
        id: userID
      }
    })

    //sending an error message if the user does not exist
    if(!user){
      return res.status(STATUS.notFound).json({ err: "User does not exist" })
    }

    //getting the contact list
    const contacts = await db.contact.findMany({
      where:{
        userId: userID
      }
    })

    //sending an error message if there is no user found for the user
    if(!contacts[0]){
      return res.status(STATUS.notFound).json({ err: "You have not created any contacts yet" })
    }

    //sending a success message with the contact list if the operation is successful
    res.status(STATUS.ok).json({ msg: "Contacts fetched successfully", contacts: contacts })

  }catch(err){
    //sending an error message if the operation as any issues
    if(err){
      return res.sendStatus(STATUS.serverError)
    }
  }

}

export const createContact = () => {

}