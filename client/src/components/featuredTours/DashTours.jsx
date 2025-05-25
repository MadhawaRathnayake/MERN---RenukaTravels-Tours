import {
  Button,
  Modal,
  Table,
  TextInput,
  Alert,
  FileInput,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import Waypoint from "../shared/waypoint";
import ReactQuill from "react-quill";

export default function DashTours() {
  const { currentUser } = useSelector((state) => state.user);
  const [userTours, setUserTours] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [tourIdToDelete, setTourIdToDelete] = useState("");
  const [showAlternateView, setShowAlternateView] = useState(false);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await fetch(`/api/tours/gettours`);
        const data = await res.json();
        if (res.ok) {
          setUserTours(data.tours);
          if (data.tours.length < 9) {
            setShowMore(false);
          }
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser && currentUser.isAdmin) {
      fetchTours();
    }
  }, [currentUser]);

  const handleShowMore = async () => {
    const startIndex = userTours.length;
    try {
      const res = await fetch(`/api/tours/gettours?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUserTours((prev) => [...prev, ...data.tours]);
        if (data.tours.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteTour = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/tours/delete-tour/${tourIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserTours((prev) =>
          prev.filter((tour) => tour._id !== tourIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  /*create new tours*/
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    days: 1,
    destinations: [],
    photo: "",
  });

  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();

  const handleWaypointChange = (day, value) => {
    const updatedDestinations = [...formData.destinations];
    updatedDestinations[day - 1] = value;
    setFormData((prev) => ({ ...prev, destinations: updatedDestinations }));
  };

  const handleUploadImage = async () => {
    if (!file) {
      setImageUploadError("Please select an image.");
      return;
    }

    try {
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = `${Date.now()}-${file.name}`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(Math.round(progress));
        },
        () => {
          setImageUploadError("Image upload failed.");
          setImageUploadProgress(null);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setImageUploadProgress(null);
          setFormData((prev) => ({ ...prev, photo: downloadURL }));
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed.");
      setImageUploadProgress(null);
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, desc, days, destinations, photo } = formData;

    if (!title || !desc || !days || destinations.length < days || !photo) {
      setPublishError(
        "Please fill in all required fields and upload an image."
      );
      return;
    }

    try {
      const res = await fetch("/api/tours/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        setPublishError(data.message || "Failed to create tour.");
      } else {
        setPublishError(null);
        navigate("/tours");
      }
    } catch (error) {
      setPublishError("Something went wrong.");
      console.error(error);
    }
  };

  return (
    <section className="w-full">
      {showAlternateView ? (
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center my-4 sm:my-7 gap-4">
            <h1 className="text-center sm:text-left text-2xl sm:text-3xl font-semibold">
              Create a new Tour
            </h1>
            <button
              className="w-full sm:w-auto bg-[#F4AC20] text-white py-2 px-6 rounded-lg hover:bg-[#f49120]"
              onClick={() => setShowAlternateView(false)}
            >
              Hide Form
            </button>
          </div>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <TextInput
              type="text"
              placeholder="Tour Title"
              required
              className="flex-1"
              style={{ borderColor: "#F4AC20" }}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <TextInput
              type="number"
              placeholder="Number of Days"
              required
              min="1"
              className="flex-1"
              style={{ borderColor: "#F4AC20" }}
              onChange={(e) =>
                setFormData({ ...formData, days: parseInt(e.target.value, 10) })
              }
            />
            <Waypoint days={formData.days} onChange={handleWaypointChange} />
            <div className="flex flex-col sm:flex-row gap-4 items-center border-4 p-3">
              <div className="w-full">
                <FileInput
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const selectedFile = e.target.files[0];
                    if (selectedFile) {
                      setFile(selectedFile);
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
                                photo: downloadURL,
                              });
                            }
                          );
                        }
                      );
                    }
                  }}
                />
              </div>
              {imageUploadProgress && (
                <div className="w-16 h-16 flex-shrink-0">
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
            {formData.photo && (
              <img
                src={formData.photo}
                alt="Tour"
                className="w-full h-72 object-cover"
              />
            )}
            <ReactQuill
              type="snow"
              placeholder="Write tour description..."
              className="h-72 mb-12"
              required
              onChange={(value) => setFormData({ ...formData, desc: value })}
            />
            <Button type="submit" className="bg-[#F4AC20] text-white">
              Create Tour
            </Button>
            {publishError && <Alert color="failure">{publishError}</Alert>}
          </form>
        </div>
      ) : (
        <div className="p-4 w-full overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              <span className="text-[#F4AC20]">ALL</span> TOURS
            </h2>
            <Button
              className="w-full sm:w-auto bg-[#F4AC20] text-white py-2 px-6 rounded-lg hover:bg-[#f49120]"
              onClick={() => setShowAlternateView(true)}
            >
              Add a Tour
            </Button>
          </div>

          {currentUser.isAdmin && userTours.length > 0 ? (
            <div className="overflow-x-auto">
              <Table hoverable className="w-full text-sm sm:text-base">
                <Table.Head>
                  <Table.HeadCell>Date Updated</Table.HeadCell>
                  <Table.HeadCell>Tour Photo</Table.HeadCell>
                  <Table.HeadCell>Tour Title</Table.HeadCell>
                  <Table.HeadCell>Days</Table.HeadCell>
                  <Table.HeadCell>Delete</Table.HeadCell>
                  <Table.HeadCell>Edit</Table.HeadCell>
                </Table.Head>
                {userTours.map((tour) => (
                  <Table.Body key={tour._id} className="divide-y">
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell>
                        {new Date(tour.updatedAt).toLocaleDateString()}
                      </Table.Cell>
                      <Table.Cell>
                        <Link to={`/tour/${tour._id}`}>
                          <img
                            src={tour.photo}
                            alt={tour.title}
                            className="w-16 h-10 sm:w-20 sm:h-12 object-cover bg-gray-500 rounded"
                          />
                        </Link>
                      </Table.Cell>
                      <Table.Cell>
                        <Link
                          className="font-medium text-gray-900 dark:text-white"
                          to={`/tour/${tour._id}`}
                        >
                          {tour.title}
                        </Link>
                      </Table.Cell>
                      <Table.Cell>{tour.days} days</Table.Cell>
                      <Table.Cell>
                        <span
                          onClick={() => {
                            setShowModal(true);
                            setTourIdToDelete(tour._id);
                          }}
                          className="text-red-500 hover:underline cursor-pointer"
                        >
                          Delete
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <Link
                          className="text-teal-500 hover:underline"
                          to={`/update-tour/${tour._id}`}
                        >
                          Edit
                        </Link>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                ))}
              </Table>

              {showMore && (
                <button
                  onClick={handleShowMore}
                  className="w-full text-teal-500 text-sm sm:text-base py-4"
                >
                  Show More
                </button>
              )}
            </div>
          ) : (
            <p className="text-center text-lg py-4 animate-pulse">
              Loading...!
            </p>
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
                <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
                <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete this tour?
                </h3>
                <div className="flex justify-center gap-5">
                  <Button color="failure" onClick={handleDeleteTour}>
                    Yes, I'm Sure
                  </Button>
                  <Button color="gray" onClick={() => setShowModal(false)}>
                    No, Cancel
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      )}
    </section>
  );
}