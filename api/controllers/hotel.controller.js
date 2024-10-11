import Hotel from "../models/hotel.model.js";

// Create a new hotel (POST)
export const createHotel = async (req, res) => {
  try {
    const hotel = new Hotel(req.body);
    await hotel.save();
    res.status(201).send(hotel); // 201 for resource creation success
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get all hotels (GET)
export const getHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.status(200).send(hotels); // 200 for success
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get a single hotel by ID (GET)
export const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).send("Hotel not found");
    res.send(hotel);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update a hotel by ID (PUT)
export const updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!hotel) return res.status(404).send("Hotel not found");
    res.send(hotel);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a hotel by ID (DELETE)
export const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!hotel) return res.status(404).send("Hotel not found");
    res.send(hotel);
  } catch (error) {
    res.status(500).send(error);
  }
};
