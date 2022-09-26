import express from "express";
import {
  updateUser,
  getUser,
  deleteUser,
  getUsers,
} from "../controllers/user.js";
import { verifyToken,verifyUser,verifyAdmin } from "../utils/verifyToken.js";
const router = express.Router();

router.get("/checkauthentication", verifyToken, (req, res, next) => {
  res.send("Hey you are logged in!");
});

router.get("/checkuser/:id", verifyUser, (req, res, next) => {
  res.send("Hey you are logged in and can delete your account!");
});

router.get("/checkadmin/:id", verifyAdmin, (req, res, next) => {
  res.send("Hey Admin, you are logged in and can delete all accounts!");
});
/*The moment a user hits an API request at checkauthentication it calls the verify Token middleware.
As the process is successful it calls the next middleware and so it executes res.send().*/

//UPDATE
router.put("/:id", verifyUser,updateUser);
/*Only a particular user can update User information of his/her's.*/

/*updateUser middleware basically finds a user by that id passed 
as a parameter and updates the user with the username written 
in the body.*/

//DELETE
router.delete("/:id",verifyUser, deleteUser);
/*Only a particular user can Delete User information of his/her's.*/

//GET
router.get("/find/:id", getUser);
/*Only a particular user can get User information of his/her's.*/

//GET ALL
router.get("/",verifyAdmin, getUsers);
/*An Admin can get the information of all Users. */

export default router;
