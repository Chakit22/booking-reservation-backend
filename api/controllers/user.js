import User from "../models/User.js";

/*The below written functions are all callback functions. */

export const updateUser  = async (req, res, next) => {
  console.log("updateUser middleware in controllers called.\n");
  console.log(req);
    /*req.body simply prints the whole request given by the user.*/
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id, 
      /*req.params.id will find the user with this id and set the 
      that user with the inforamtion passed.*/
      { $set: req.body },
      { new: true }
    );
    res.status(200).send(updatedUser);
    /*.json converts json into Javascript Object.*/
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  console.log("deleteUser middleware in controllers called.\n");
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted.");
  } catch (err) {
    next(err);
  }
};

export const getUser = async (req, res, next) => {
  console.log("getUser middleware in controllers called.\n");
  try {
    const User = await User.findById(req.params.id);
    res.status(200).json(User);
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (req, res, next) => {
  console.log("getUsers middleware in controllers called.\n");
  try {
    const Users = await User.find();
    res.status(200).json(Users);
  } catch (err) {
    next(err);
  }
};
