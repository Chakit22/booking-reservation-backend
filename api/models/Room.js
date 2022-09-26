import mongoose from "mongoose";
const RoomSchema = new mongoose.Schema(
  {
    title: {
      /*define the name of the room.*/ type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    price: {
      /*Defines the price of this room.*/ type: Number,
      required: true,
    },
    maxPeople: {
      /*Maximum no of people who can stay
    in this room.*/
      type: Number,
      required: true,
    },
    roomNumbers: [{ number: Number, unavailableDates: { type: [Date] } }],
  },
  { timestamps: true } /*Just displays the created and updated at time. */
);

export default mongoose.model("Room", RoomSchema);
/*Create a new collection with the name Room which will be saved in the MONGO_DB Database as Rooms which is defined with the 
RoomSchema. */
