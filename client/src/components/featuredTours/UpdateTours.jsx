import { FileInput, Select, TextInput, Button, Alert } from "flowbite-react";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";


export default function UpdateTour() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [destinations, setDestinations] = useState([]);
  const [publishError, setPublishError] = useState(null);
  const { tourId } = useParams();
  
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Tour ID:", tourId);
    if (!tourId) {
      setPublishError("Invalid Tour ID");
      return;
    }

    const fetchTour = async () => {
      try {
        const res = await fetch(`/api/tours/getTour/${tourId}`);
        const data = await res.json();
        //console.log("API Response:", data);
        if (!res.ok) {
          setPublishError(data.message);
          return;
        }
        setPublishError(null);
        setFormData(data);
        //console.log(" Response:",formData); 
      } catch (error) {
        setPublishError("Failed to fetch tour");
      }
    };
    
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

    fetchTour();
    fetchDestinations();
  }, [tourId]);

  // useEffect(() => {
  //   console.log("Updated formData:", formData);
  // }, [formData]);

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }

      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = `${Date.now()}-${file.name}`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
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
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting formData:", formData);
    try {
      const res = await fetch(`/api/tours/update-tour/${formData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log("API Response:", data);
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      setPublishError(null);
      navigate(`/dashboard?tab=tours`);
    } catch (error) {
      console.error("Submit Error:", error);
      setPublishError("Something went wrong");
    }
  };
  

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">
        Update the <span style={{ color: "#F4AC20" }}>Tour</span>
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Tour Title"
          required
          className="flex-1"
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          value={formData.title || ""}
        />
        <TextInput
          type="number"
          placeholder="Number of Days"
          required
          min="1"
          className="flex-1"
          onChange={(e) => setFormData({ ...formData, days: parseInt(e.target.value, 10) })}
          value={formData.days || ""}
        />
        <Select
          id="destinations"
          
          multiple
          style={{ borderColor: "#F4AC20" }}
          onChange={(e) => {
            const selectedOptions = Array.from(
              e.target.selectedOptions,
              (option) => option.value
            );
            setFormData({ ...formData, destinations: selectedOptions });
          }}
          value={formData.destinations || []}
        >
          {destinations.map((dest) => (
            <option key={dest._id} value={dest._id}>
              {dest.destinationName}
            </option>
          ))}
        </Select>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUploadImage}
            disabled={!!imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {formData.photo && (
          <img src={formData.photo} alt="Tour" className="w-full h-72 object-cover" />
        )}
        <ReactQuill
          theme="snow"
          value={formData.desc || ""}
          placeholder="Write tour description..."
          className="h-72 mb-12"
          required
          onChange={(value) => setFormData({ ...formData, desc: value })}
        />
        <Button
          type="submit"
          className="bg-[#F4AC20] hover:bg-[#e2b04a] text-white font-bold py-2 rounded"
        >
          Update
        </Button>
        {publishError && <Alert className="mt-5" color="failure">{publishError}</Alert>}
      </form>
    </div>
  );
}
