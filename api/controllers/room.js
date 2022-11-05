import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
/*Room model is imported because we have to 
add room ID's as values into the rooms keys in
the Room model.*/
import { createError } from "../utils/error.js";

export const createRoom = async (req, res, next) => {
  console.log("createRoom middleware in controllers called.\n");
  const hotelId = req.params.hotelid;
  /*req.params always prints whatever is written in the parameter part of the API endpoint or
  the URL. So as we have written hotelid parameter in the routes/rooms.js file so access the '.hotelid key' key not '.id key'.*/
  const newRoom = new Room(req.body);

  try {
    const savedRoom = await newRoom.save(); /*Updates the room in the Database.*/
    try {
      const updated_hotel = await Hotel.findByIdAndUpdate(hotelId, {
        /*For that particular hotelID it has to update the rooms key in that Hotel so use MONGODB push method to push the 
        saved room's ID into the Databse of that particular Hotel.*/
        $push: { rooms: savedRoom._id },
      });
      // console.log(updated_hotel);
    } catch (err) {
      next(err);
    }
    return res.status(200).json(savedRoom);
  } catch (err) {
    next(err);
  }
};

export const updateRoom = async (req, res, next) => {
  console.log("updateRoom middleware in controllers called.\n");
  /*req.body simply prints the whole request given by the user.*/
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      /*first this function finds the Room by the id passed as req.params.id and then updates the Room using the 
        set method.*/
      { new: true }
      /*new method when set to true basically while using Insomnia or Postman will also update the Room while 
        showing the output in Insomnia or Postman.*/
    );
    res.status(200).json(updatedRoom);
    /*.json converts json into Javascript Object.*/
  } catch (err) {
    next(err);
  }
};
export const updateRoomAvailability = async (req, res, next) => {
  try {
    await Room.updateOne(
      { "roomNumbers._id": req.params.id },
      {
        $push: {
          "roomNumbers.$.unavailableDates": req.body.dates
        },
      }
    );
    res.status(200).json("Room status has been updated.");
  } catch (err) {
    next(err);
  }
};
export const deleteRoom = async (req, res, next) => {
  console.log("deleteRoom middleware in controllers called.\n");
  const hotelId = req.params.hotelid;
  /*Gets the ID of the hotel in which we have to delete the room.*/
  try {
    await Room.findByIdAndDelete(req.params.id);/*finds the room by req.params.id and deletes it in the Database.*/
    try {
      const updated_hotel = await Hotel.findByIdAndUpdate(hotelId, {
        /*For that particular hotelID it has to update the rooms key in that Hotel so use MONGODB push method to push the 
        saved room's ID into the Databse of that particular Hotel.*/
        $pull: { rooms: req.params.id},
      });
      /*As the room has been deleted it should also be updated in the Hotels Data part so, pull the room in the particular hotelID and 
      and delete it.*/
      // console.log(updated_hotel);
    } catch (err) {
      next(err);
    }
    res.status(200).json("Room has been deleted.");
  } catch (err) {
    next(err);
  }
};

export const getRoom = async (req, res, next) => {
  console.log("getRoom middleware in controllers called.\n");
  try {
    const room = await Room.findById(req.params.id);
    res.status(200).json(room);
  } catch (err) {
    next(err);
  }
};

export const getRooms = async (req, res, next) => {
  console.log("getRooms middleware in controllers called.\n");
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (err) {
    next(err);
  }
};
