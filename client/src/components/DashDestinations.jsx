import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import React from "react";
import {
  Alert,
  Button,
  TextInput,
  Table,
  Modal,
  FileInput,
} from "flowbite-react";
import ReactQuill from "react-quill";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import "react-quill/dist/quill.snow.css";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";

export default function DashDestinations() {
  const { currentUser } = useSelector((state) => state.user);
  const [destinationsList, setDestinationsList] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [destinationIdToDelete, setDestinationIdToDelete] = useState(null);
  const [showAlternateView, setShowAlternateView] = useState(false);
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await fetch(`/api/destination/get-dest`);
        const data = await res.json();
        if (res.ok) {
          setDestinationsList(data.destinations);
          if (data.destinations.length < 10) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchDestinations();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = destinationsList.length;
    try {
      const res = await fetch(
        `/api/destination/get-dest?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setDestinationsList((prev) => [...prev, ...data.destinations]);
        if (data.destinations.length < 10) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeletedestination = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/destination/delete-dest/${destinationIdToDelete}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setDestinationsList((prev) =>
          prev.filter(
            (destination) => destination._id !== destinationIdToDelete
          )
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Create destination functions
  const handleUpdloadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image!");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Image uploading failed!");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, destImage: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload Failed!");
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/destination/create-dest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/destinations/${data.slug}`);
      }
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };

  return (
    <section className="w-full">
      {showAlternateView ? ( // Conditional rendering
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex justify-between items-center my-7">
            <h1 className="text-left text-3xl font-semibold">
              Create a new Destination
            </h1>
            <button
              className="bg-[#F4AC20] text-white py-2 px-6 rounded-lg hover:bg-[#f49120]"
              onClick={() => setShowAlternateView(false)}
            >
              Hide Form
            </button>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="justify-between">
              <TextInput
                type="text"
                placeholder="Destination Name"
                required
                id="title"
                className="flex-1"
                onChange={(e) =>
                  setFormData({ ...formData, destinationName: e.target.value })
                }
              />
            </div>
            <div className="flex gap-4 items-center justify-between border-4 p-3">
              <FileInput
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const selectedFile = e.target.files[0];
                  if (selectedFile) {
                    setFile(selectedFile);
                    // Start upload process immediately
                    const storage = getStorage(app);
                    const fileName =
                      new Date().getTime() + "-" + selectedFile.name;
                    const storageRef = ref(storage, fileName);
                    const uploadTask = uploadBytesResumable(
                      storageRef,
                      selectedFile
                    );

                    uploadTask.on(
                      "state_changed",
                      (snapshot) => {
                        const progress =
                          (snapshot.bytesTransferred / snapshot.totalBytes) *
                          100;
                        setImageUploadProgress(progress.toFixed(0));
                      },
                      (error) => {
                        setImageUploadError("Image uploading failed!");
                        setImageUploadProgress(null);
                      },
                      () => {
                        getDownloadURL(uploadTask.snapshot.ref).then(
                          (downloadURL) => {
                            setImageUploadProgress(null);
                            setImageUploadError(null);
                            setFormData({
                              ...formData,
                              destImage: downloadURL,
                            });
                          }
                        );
                      }
                    );
                  }
                }}
              />
              {imageUploadProgress && (
                <div className="w-16 h-16">
                  <CircularProgressbar
                    value={imageUploadProgress}
                    text={`${imageUploadProgress || 0}%`}
                  />
                </div>
              )}
            </div>
            {imageUploadError && (
              <Alert color="failure">{imageUploadError}</Alert>
            )}
            {formData.destImage && (
              <img
                src={formData.destImage}
                alt="upload"
                className="w-full h-72 object-cover"
              />
            )}
            <ReactQuill
              theme="snow"
              placeholder="Description"
              className="h-72 mb-12"
              required
              onChange={(value) => {
                setFormData({ ...formData, description: value });
              }}
            />
            <Button type="submit" color="warning">
              Add Destination
            </Button>
            {publishError && (
              <Alert className="mt-5" color="failure">
                {publishError}
              </Alert>
            )}
          </form>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-semibold text-gray-900 ">
              <span className="text-[#F4AC20]">DESTINATION</span> DETAILS
            </h2>
            <button
              className="bg-[#F4AC20] text-white py-2 px-6 rounded-lg hover:bg-[#f49120]"
              onClick={() => setShowAlternateView(true)}
            >
              Create a new Destination
            </button>
          </div>
          <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300">
            {currentUser.isAdmin && destinationsList.length > 0 ? (
              <>
                <Table hoverable className="shadow-md">
                  <Table.Head>
                    <Table.HeadCell>Destination Image</Table.HeadCell>
                    <Table.HeadCell>Destination Name</Table.HeadCell>
                    <Table.HeadCell>Delete</Table.HeadCell>
                    <Table.HeadCell>Edit</Table.HeadCell>
                  </Table.Head>
                  {destinationsList.map((destination) => (
                    <Table.Body className="divide-y" key={destination._id}>
                      <Table.Row className="bg-white">
                        <Table.Cell>
                          <Link to={`/destination/${destination.slug}`}>
                            <img
                              src={destination.destImage}
                              alt={destination.destinationName}
                              className="w-20 h-10 object-cover bg-gray-500"
                            />
                          </Link>
                        </Table.Cell>
                        <Table.Cell>
                          <Link
                            className="font-medium text-gray-900"
                            to={`/destination/${destination.slug}`}
                          >
                            {destination.destinationName}
                          </Link>
                        </Table.Cell>
                        <Table.Cell>
                          <span
                            onClick={() => {
                              setShowModal(true);
                              setDestinationIdToDelete(destination._id);
                            }}
                            className="font-medium text-red-500 hover:underline cursor-pointer"
                          >
                            Delete
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          <Link
                            className="text-teal-500 hover:underline"
                            to={`/update-destination/${destination._id}`}
                          >
                            <span>Edit</span>
                          </Link>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  ))}
                </Table>
                {showMore && (
                  <button
                    onClick={handleShowMore}
                    className="w-full text-teal-500 self-center text-sm py-7"
                  >
                    Show more
                  </button>
                )}
              </>
            ) : (
              <p>You have no destinations yet!</p>
            )}
            <Modal
              show={showModal}
              onClose={() => setShowModal(false)}
              popup
              size="md"
            >
              <Modal.Header />
              <Modal.Body>
                <div className="text-center">
                  <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 mb-4 mx-auto" />
                  <h3 className="mb-5 text-lg text-gray-500">
                    Are you sure you want to delete this destination?
                  </h3>
                  <div className="flex justify-center gap-4">
                    <Button color="failure" onClick={handleDeletedestination}>
                      Yes, I'm sure
                    </Button>
                    <Button color="gray" onClick={() => setShowModal(false)}>
                      No, cancel
                    </Button>
                  </div>
                </div>
              </Modal.Body>
            </Modal>
          </div>
        </>
      )}
    </section>
  );
}
