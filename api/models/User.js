import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } /*Just displays the created and updated at time. */
);

export default mongoose.model("User", UserSchema);
/*Create a new collection with the name User which will be saved in the MONGO_DB Database as users which is defined with the 
UserSchema. */
