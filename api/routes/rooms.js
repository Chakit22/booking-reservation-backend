import express from "express";
import {
  createRoom,
  updateRoom,
  getRoom,
  deleteRoom,
  getRooms,
} from "../controllers/room.js";
import { verifyAdmin } from "../utils/verifyToken.js";
const router = express.Router();

//CREATE
router.post("/:hotelid", verifyAdmin, createRoom);
/*Instead of 'hotelid' you can even write 'id' and that will be displayed when you console.log(req.params). */

//UPDATE
router.put("/:id", verifyAdmin, updateRoom);


//DELETE
router.delete("/:id/:hotelid", verifyAdmin, deleteRoom);
/*Get the two id's of hotel and the room and delete the room first and then delete the room from that particular hotels database. */

//GET
router.get("/find/:id", getRoom);

//GET ALL
router.get("/", verifyAdmin, getRooms);

export default router;
