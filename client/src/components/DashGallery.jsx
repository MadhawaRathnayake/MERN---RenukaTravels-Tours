import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import GalleryForm from "./GalleryForm";  // Assuming GalleryForm is a component for adding new gallery items

const GalleryTable = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false);  // State for toggling the form

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    const response = await axios.get("/api/gallery");
    setGalleryItems(response.data);
  };

  const deleteGalleryItem = async (id) => {
    await axios.delete(`/api/gallery/${id}`);
    fetchGalleryItems();
  };

  const toggleForm = () => {
    setShowForm(!showForm);  // Toggle form visibility
  };

  return (
    <section className="container mx-auto mt-10 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Gallery Management</h2>
        <Button
          className="bg-[#F4AC20] text-white py-1 px-4 rounded-lg hover:bg-[#f49120]"
          onClick={toggleForm}
        >
          {showForm ? "Hide Form" : "Add New Gallery Item"}
        </Button>
      </div>

      {showForm && <GalleryForm onSave={fetchGalleryItems} />}  {/* Conditionally render the form */}

      <Table hoverable={true} className="w-full">
        <Table.Head>
          <Table.HeadCell>Date</Table.HeadCell>
          <Table.HeadCell>Image</Table.HeadCell>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Delete</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {galleryItems.map((item) => (
            <Table.Row key={item._id} className="bg-white">
              <Table.Cell>{new Date(item.createdAt).toLocaleDateString()}</Table.Cell>  {/* Display formatted date */}
              <Table.Cell>
                <img
                  src={item.imageURL}
                  alt={item.name}
                  className="w-20 h-12 object-cover"
                />
              </Table.Cell>
              <Table.Cell>{item.name}</Table.Cell>
              <Table.Cell>
                <Button
                  color=""
                  style={{ color: "red" }}
                  size="xs"
                  onClick={() => {
                    setShowModal(true);
                    setSelectedGalleryItem(item);
                  }}
                >
                  Delete
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-red-500 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg font-semibold text-gray-700">
              Are you sure you want to delete this gallery item?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => {
                  deleteGalleryItem(selectedGalleryItem._id);
                  setShowModal(false);
                  setSelectedGalleryItem(null); // Clear selection after deleting
                }}
              >
                Yes, Delete
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </section>
  );
};

export default GalleryTable;
