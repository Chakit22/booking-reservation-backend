import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";

/*req always contains the body what the user has inputted through a web browser or Insomnia.*/
export const verifyToken = (req, res, next) => {
  console.log("verifyToken middleware in utils called.\n");
  // console.log(req.cookies);
  const token = req.cookies.access_token;
  /*access_token is the name of the cookie through which data was
  sent.Data is wrapped in the access token for that particular user.*/

  console.log(token);
  if (!token) {
    /*if return next() is written at this point then it goes to the next middleware and 
    displays User is an Admin in the routes/users.js file. */
    return next(createError(401, "You are not authenticated!"));
  }
  jwt.verify(token, process.env.JWT, (err, user) => {
    /*I fht everification is successfull err will be set to NULL and user.*/
    if (err) return next(createError(403, "Token is not valid!"));
    // console.log(user); /*If it succefully verifies the token it send the id of the user. */
    req.user_info = user;
    // return res.send(req.user_info);
    /*Create a new key named user_info and store the id of the user in it.*/
    next(); 
    /*if next is not written here then it won't jump to the next middleware until and unless
    next is called.*/
  });

  /*jwt.verify verifies that token and it actually returns the user information which was wrapped
  in the access_token. After verifying a callback function is invoked in which basically the returned
  value is passed to the user parameter.*/
};

export const verifyUser = (req, res, next) => {
  console.log("verifyUser middleware in utils called.\n");
  verifyToken(req, res, next, () => {
    if (req.user_info.id === req.params.id || req.user.isAdmin) {
      /*Matches the user_info._id which was stores in the request while 
      token verification and compares it with the parameter id entered in the endpoint. */
      next();
      /*If successfull calls the next middleware. */
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

export const verifyAdmin = (req, res, next) => {
  console.log("verifyAdmin middleware in utils called.\n");
  verifyToken(req, res, next, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};
