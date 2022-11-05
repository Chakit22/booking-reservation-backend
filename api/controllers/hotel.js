import Hotel from "../models/Hotel.js";

/*The below written functions are all callback functions. */
/*We can also use res.status(200).send(savedHotel) instead of .json(savedHotel) */
export const createHotel = async (req, res, next) => {
  console.log("createHotel middleware in controllers called.\n");
  const newHotel = new Hotel(req.body);
  /*newHotel is an object of type Hotel which passes req.body as a parameter. req is request which is taken from the user
  wheh he reached to that particular endpoint.*/
  try {
    const savedHotel = await newHotel.save();
    /*.save is a method defined in mongoose and basically inserts our data into the MONGODB Database.*/
    /*newHotel.save returns a Promise which if resolved will execute the statements below this else will catch an error. */
    res.status(200).json(savedHotel);
  } catch (err) {
    next(err);
    /*goes to the next middleware stopping the execution at this point and goes to middleware that passes err as an parameter.*/
  }
};

export const updateHotel = async (req, res, next) => {
  console.log("updateHotel middleware in controllers called.\n");
  /*req.body simply prints the whole request given by the user.*/
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },

      /*first this function finds the hotel by the id passed as req.params.id and then updates the hotel using the 
      set method.*/

      { new: true }

      /*new is used as findByIdand Update will return the previous document and not the updated one. */
    );
    res.status(200).json(updatedHotel);
    /*.json converts json into Javascript Object.*/
  } catch (err) {
    next(err);
  }
};

export const deleteHotel = async (req, res, next) => {
  console.log("deleteHotel middleware in controllers called.\n");
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    res.status(200).json("Hotel has been deleted.");
  } catch (err) {
    next(err);
  }
};

export const getHotel = async (req, res, next) => {
  console.log("getHotel middleware in controllers called.\n");
  try {
    const hotel = await Hotel.findById(req.params.id);
    res.status(200).json(hotel);
  } catch (err) {
    next(err);
  }
};

/*Query strigs are very useful as those only will be used for filtering the available hotels on those particular dates and which are
featured or which have the price range entered by the user.*/

export const getHotels = async (req, res, next) => {
  console.log("getHotels middleware in controllers called.\n");
  const { min, max, ...others } = req.query;
  /*By default themin and max values are set from 1 to 999.*/
  /*Used a destructor to destruct the min and max key value pairs from the URL entered.*/

  try {
    /*http://localhost:8800/api/hotels?featured=true, If the URL is like this then featured=true is the query string in the request.*/
    // console.log(req.query); //This basically prints the query after the '?'

    const hotels = await Hotel.find({
      ...others,
      cheapestPrice: { $gt: min || 1, $lt: max || 999 },

      /* 'lt' refers to lesser than and 'gt' refers to greater than. This basically states that fetch those Hotels based on the 
      others and the hotels having their rooms cheapestPrice between min and max.*/
    }).limit(req.query.limit);

    /*Finds the hotels based on that particular query and req.query.limit fetches me the limit key's value in the URL and limits the 
    output to those no of hotels.
    For ex: http://localhost:8800/api/hotels?featured=true&limit=2 This fetches me maximum of 2 hotels.*/

    res.status(200).json(hotels);
  } catch (err) {
    next(err);
  }
};

export const countByCity = async (req, res, next) => {
  console.log("countByCity middleware in controllers called.\n");
  const cities = req.query.cities.split(","); /*This will return a 
  set of cities seperated by commas.*/

  /*query string is nothing but a string written as value to a '?' key.*/
  try {
    const list = await Promise.all(
      cities.map((city) => {
        return Hotel.countDocuments({ city: city });
      })
      /*The above statement iterates through all the possible cities
      and for each city counts the no of Hotels and returns it.
      If one of the promises is rejected then the whole Promise.all
      returns an error. .countDocuments returns the count of values 
      by particular value specifies in the brackets.
      */
    );
    res.status(200).send(list);
  } catch (err) {
    next(err);
  }
};

export const countByType = async (req, res, next) => {
  try {
    console.log(req.query);
    const hotelCount = await Hotel.countDocuments({ type: "hotel" });
    const apartmentCount = await Hotel.countDocuments({ type: "apartment" });
    const resortCount = await Hotel.countDocuments({ type: "resort" });
    const villaCount = await Hotel.countDocuments({ type: "villa" });
    const cabinCount = await Hotel.countDocuments({ type: "cabin" });
    /*Gives me the count by that particular type.*/

    res.status(200).json([
      { type: "hotel", count: hotelCount },
      { type: "apartment", count: apartmentCount },
      { type: "resort", count: resortCount },
      { type: "villa", count: villaCount },
      { type: "cabin", count: cabinCount },
      /*This is returning a JSON Format File with the key value pair.*/
    ]);
  } catch (err) {
    next(err);
  }
};

export const getHotelRooms = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    const list = await Promise.all(
      hotel.rooms.map((room) => {
        return Room.findById(room);
      })
    );
    res.status(200).json(list)
  } catch (err) {
    next(err);
  }
};