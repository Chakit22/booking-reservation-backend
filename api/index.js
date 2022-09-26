import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
/*Using mongoose,a user can define the schema for the documents in a particular collection.*/
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import hotelsRoute from "./routes/hotels.js";
import roomsRoute from "./routes/rooms.js";
import cookieParser from "cookie-parser";
import cors from "cors";


/*When one function is passed as an argument to another function then the passed function is known as a callback function.
A callback function is a function which gets executed only when the other function gets executed. not before that even if a 
setTimeout function is written. */

const app = express(); //This creates an object of the class express.
dotenv.config();

/*await is always used with an async function. */
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    /*This is used to connect to the MongoDB Database.*/
    /*await waites until and unless the Promise returns a result.
    mongoose.connect is a Promise basically and if the promise is resolved then it executes the statement Connected
    to mongoDB.*/
    console.log("Connected to mongoDB.");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});

//middlewares
app.use(express.json()); /*This is an inbuilt method in express to recognize the incoming request as a JSON object.*/
app.use(cookieParser());
/*
app.use((req,res,next) => {
  console.log("Hii Iam a middleware");
  if next() is not written here it means that irrespective of a user visiting any endpoint it will not call any other 
  middleware.
  But if next() is called here then it goes to the called endpoint middleware.
})*/

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
/*hotelsRoute is a callback function which basically the moment a user arrives at that hotels endpoint then hotelsRoute function will
be called.*/
app.use("/api/rooms", roomsRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

/* app. listen() function is used to bind and listen the connections on the specified port. Basically it provides a medium through
which users can interact with the server and post his/her request.*/
app.listen(8800, () => {
  connect();
  console.log("Connected to backend.");
});
