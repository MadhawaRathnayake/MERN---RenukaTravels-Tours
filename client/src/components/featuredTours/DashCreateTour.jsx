import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileInput, TextInput, Button, Alert, Select } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { app } from "../../firebase";

export default function CreateTour() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    days: "",
    destinations: [],
    photo: "",
  });
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await fetch("/api/destination/get-dest");
        const data = await res.json();
        if (res.ok) {
          setDestinations(data.destinations);
        } else {
          console.error("Failed to load destinations:", data.message);
        }
      } catch (error) {
        console.error("Error fetching destinations:", error);
      }
    };

    fetchDestinations();
  }, []);

  const handleUploadImage = async () => {
    if (!file) {
      setImageUploadError("Please select an image");
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
          setImageUploadError("Image upload failed");
          setImageUploadProgress(null);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setImageUploadProgress(null);
          setFormData((prev) => ({ ...prev, photo: downloadURL }));
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, desc, days, destinations, photo } = formData;

    if (!title || !desc || !days || !destinations.length || !photo) {
      setPublishError("Please fill in all required fields");
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
        setPublishError(data.message || "Failed to create tour");
      } else {
        setPublishError(null);
        navigate("/tours");
      }
    } catch (error) {
      setPublishError("Something went wrong");
      console.error(error);
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-bold">
        Add a <span className="text-[#F4AC20]">Tour</span>
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Tour Title"
          required
          className="flex-1"
          style={{ borderColor: "#F4AC20" }}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
        <Select
          id="destinations"
          required
          multiple
          style={{ borderColor: "#F4AC20" }}
          onChange={(e) => {
            const selectedOptions = Array.from(
              e.target.selectedOptions,
              (option) => option.value
            );
            setFormData({ ...formData, destinations: selectedOptions });
          }}
        >
          <option value="" disabled>
            Select Destinations
          </option>
          {destinations.map((dest) => (
            <option key={dest._id} value={dest._id}>
              {dest.destinationName}
            </option>
          ))}
        </Select>
        <div className="flex gap-4 items-center justify-between border-4 border-dotted p-3 border-[#F4AC20]">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            className="bg-[#F4AC20] text-white"
            onClick={handleUploadImage}
            disabled={!!imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
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
          theme="snow"
          placeholder="Write tour description..."
          className="h-72 mb-12"
          onChange={(value) => setFormData({ ...formData, desc: value })}
        />
        <Button type="submit" className="bg-[#F4AC20] text-white">
          Create Tour
        </Button>
        {publishError && <Alert color="failure">{publishError}</Alert>}
      </form>
    </div>
  );
}
