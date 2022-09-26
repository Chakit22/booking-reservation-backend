import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  /*This is again a middleware which is an arrow function. A middleware always accepts three parameters, request,response and next.*/
  console.log("register middleware in controllers called.\n");
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    // console.log(hash);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash,
    });
    /*We haven't directly passed req.body as I am using this hashed
    password. */

    const new_user = await newUser.save();
    /*new_user stores the newly added user's information. */
    console.log(new_user);
    res.status(200).send("User has been created.");
    /*The above statement is same as 
    res.status(200);
    res.send("User has been created"); */
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  console.log("login middleware in controllers called.\n");
  try {
    const user = await User.findOne({ username: req.body.username });
    /*This finds by the user with the username entered and stores the user info in user variable.*/
    // console.log(user);
    if (!user) return next(createError(404, "User not found!"));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
 
    if (!isPasswordCorrect)
      return next(createError(400, "Wrong password or username!"));

    const token = await jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT
    );
    /*jwt.sign method basically creates a unique json web token based on the data passed. */
    // console.log(token);
    // res.status(200).send(user);
    /*Until and unless a res.send reuqest is not sent back this middleware keeps on executing the webpage keeps on loading. */
    const { password, isAdmin, ...otherDetails } =
      user._doc; /*This is because user._doc contains all the details. */
    /*Set the name of the cookie as access token. */

    /*The moment a user hits an API request a session is created and a particular session ID is 
    added with a header and sent back to the user and then it is stored in the form of a cookie
    on the browser and when the same user again requests something the same cookie is sent back
    to the server and the server validates it and displays personalized content to that 
    particular user.*/
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .send({ details: { ...otherDetails } });
    /*The above statements are same as writing :
      res.cookie();
      res.status(200)
      res.send(). */
  } catch (err) {
    next(err);
  }
};
/*JWT is used for authentication whether for ex: if I have logined 
then with the help of JWT, I am getting to know whether is that the 
same person who has logined and is using that requested page.*/
/*Basically a unique token is created for that user and that token
gets passed each time user accesses that web page and wth the help
of that the browser validates whether it is a genuine user or not. */

/*HTTP is a stateless protocol meaning it does not store any data. To store user's information cookies are used. */
