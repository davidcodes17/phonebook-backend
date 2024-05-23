//importing auth route packages
import express from "express";

//creating the router instance
export const router = express.Router();

//route to handle get contact request
router.route("/").get();

export default router;
