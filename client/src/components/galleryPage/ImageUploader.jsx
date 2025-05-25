import React, { useState } from "react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../../firebase"; // Correct path to Firebase config
import { Alert, FileInput } from "flowbite-react"; // Ensure this package is installed
import { CircularProgressbar } from "react-circular-progressbar"; // You'll need to install this: npm install react-circular-progressbar
import "react-circular-progressbar/dist/styles.css";

function ImageUploader({ setImageURL, label, id, imageURL }) {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + selectedFile.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
            setImageURL(downloadURL);
          });
        }
      );
    }
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center border-4 p-3">
        <div className="w-full">
          <FileInput
            type="file"
            accept="image/*"
            id={id}
            onChange={handleImageChange}
            required
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
        <Alert color="failure" className="mt-2">
          {imageUploadError}
        </Alert>
      )}

      {imageURL && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
          <div className="relative">
            <img 
              src={imageURL} 
              alt="Uploaded preview" 
              className="max-w-full h-48 object-cover rounded-lg shadow-md border border-gray-200"
            />
            <div className="mt-2 text-xs text-green-600 flex items-center">
              <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Image uploaded successfully
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageUploader;