import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import GalleryForm from "./galleryPage/GalleryForm"; // Adjust the path as needed

const GalleryTable = () => {
  const [galleries, setGalleries] = useState([]);
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false); // State to toggle the form visibility

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    const response = await axios.get("/api/gallery");
    setGalleries(response.data);
  };

  const deleteGallery = async (id) => {
    await axios.delete(`/api/gallery/${id}`);
    fetchGalleries();
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    setSelectedGallery(null); // Reset selectedGallery when toggling form
  };

  return (
    <section className="container mx-auto mt-10 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Gallery Management</h2>
        <Button
          className="bg-[#F4AC20] text-white py-1 px-4 rounded-lg hover:bg-[#f49120]"
          onClick={toggleForm}
        >
          {showForm ? "Hide Form" : "Add an image"}
        </Button>
      </div>

      {/* Show Table if not showing form */}
      {!showForm && (
        <Table hoverable={true} className="w-full">
          <Table.Head>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell>Image</Table.HeadCell>
            <Table.HeadCell>City</Table.HeadCell>
            <Table.HeadCell>Delete</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {galleries.map((gallery) => (
              <Table.Row key={gallery._id} className="bg-white">
                <Table.Cell>
                  {/* Assuming gallery.date is in the correct format, adjust as necessary */}
                  {new Date(gallery.updatedAt).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  <img
                    src={gallery.imageURL} // Assuming the image URL is stored in gallery.imageURL
                    alt={gallery.name}
                    className="w-16 h-12 object-cover rounded-md"
                  />
                </Table.Cell>
                <Table.Cell>{gallery.city}</Table.Cell>
                <Table.Cell>
                  <span onClick={() => {
                      setShowModal(true);
                      setSelectedGallery(gallery);
                    }} className="font-medium text-red-500 hover:underline cursor-pointer">
                      Delete

                  </span>
                  
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}

      {/* Show Form if showForm is true */}
      {showForm && (
        <GalleryForm
          onSave={() => {
            toggleForm();
            fetchGalleries();
          }}
          initialValues={selectedGallery}
        />
      )}

      {/* Modal for Delete Confirmation */}
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
                  deleteGallery(selectedGallery._id);
                  setShowModal(false);
                  setSelectedGallery(null); // Clear selection after deleting
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
