import React, { useEffect, useState } from "react";
import axios from "axios";
import HotelForm from "./hotelpages/InputHotel"; // Ensure this path is correct

const HotelTable = () => {
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null); // This will store the hotel object for editing or null

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    const response = await axios.get("/api/hotels");
    setHotels(response.data);
  };

  const deleteHotel = async (id) => {
    await axios.delete(`/api/hotels/${id}`);
    fetchHotels();
  };

  const toggleForm = () => {
    // This toggles the form's visibility and clears any selected hotel if the form is being hidden
    if (selectedHotel) {
      setSelectedHotel(null);
    } else {
      setSelectedHotel({});
    }
  };

  const handleEditClick = (hotel) => {
    setSelectedHotel(hotel);
  };

  return (
    <div className="container mx-auto mt-10">
      <button
        className="mb-4 bg-[#F4AC20] hover:bg-[#f4ad20e7] text-white font-bold py-2 px-4 rounded"
        onClick={toggleForm}
      >
        {selectedHotel ? "Hide Form" : "Add a Hotel"}
      </button>
      {selectedHotel && (
        <HotelForm
          onSave={() => {
            toggleForm();
            fetchHotels();
          }}
          initialValues={selectedHotel}
        />
      )}
      {!selectedHotel && (
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">Hotel Name</th>
              <th className="px-4 py-2">City</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {hotels.map((hotel) => (
              <tr key={hotel._id}>
                <td className="border px-4 py-2">{hotel.name}</td>
                <td className="border px-4 py-2">{hotel.city}</td>
                <td className="border px-64 py-2 gap-4">
                  <button
                    className="bg-[#6bb53d] hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                    onClick={() => handleEditClick(hotel)}
                  >
                    Update
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-2"
                    onClick={() => deleteHotel(hotel._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default HotelTable;
