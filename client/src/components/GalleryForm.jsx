import React, { useState } from "react";
import axios from "axios";
import { Button, TextInput } from "flowbite-react";  // Use TextInput instead of Input

const GalleryForm = ({ onSave }) => {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [imageURL, setImageURL] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newGalleryItem = { name, city, imageURL };
    
    try {
      await axios.post("/api/gallery", newGalleryItem);
      onSave();  // Call the parent function to refresh the gallery list
      setName(""); // Reset form fields
      setCity("");
      setImageURL("");
    } catch (error) {
      console.log("Error adding gallery item:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextInput  // Change Input to TextInput
        type="text"
        placeholder="Gallery Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextInput  // Change Input to TextInput
        type="text"
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <TextInput  // Change Input to TextInput
        type="text"
        placeholder="Image URL"
        value={imageURL}
        onChange={(e) => setImageURL(e.target.value)}
      />
      <Button type="submit" className="bg-[#F4AC20] text-white">
        Add Gallery Item
      </Button>
    </form>
  );
};

export default GalleryForm;
