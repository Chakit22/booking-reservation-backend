/*Representational State Transfer Apllication Programming Interface. */

import express from "express";
import {
  countByCity,
  countByType,
  createHotel,
  deleteHotel,
  getHotel,
  getHotels,
  updateHotel,
} from "../controllers/hotel.js";
import { verifyAdmin } from "../utils/verifyToken.js";
const router = express.Router();

/*Only an Admin can update create or delete hotels. */

//CREATE
router.post("/", verifyAdmin, createHotel);

//UPDATE
router.put("/:id", verifyAdmin, updateHotel);

//DELETE
router.delete("/:id", verifyAdmin, deleteHotel);

//GET
router.get("/find/:id", getHotel);

//GET ALL
router.get("/", getHotels);
router.get("/countByCity", countByCity); /*This route basically 
returns me the count of the Number of Hotels in that particular 
City.*/
router.get("/countByType", countByType);/*This basically returns me the */
router.get("/room/:id", getHotelRooms);

export default router;
