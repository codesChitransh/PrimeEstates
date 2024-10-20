import React, { useState } from 'react';
import { getDownloadURL, getStorage, uploadBytesResumable, ref } from 'firebase/storage';
import { app } from '../firebase';

function CreateListing() {
  const [isOfferChecked, setIsOfferChecked] = useState(false);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle image upload
  const handleImage = (e) => {
    e.preventDefault();
    
    // Check if total images will exceed 6
    const totalImagesCount = formData.imageUrls.length + files.length;
    
    if (totalImagesCount <= 6) {
      setLoading(true);
      setError(null);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          const updatedImageUrls = formData.imageUrls.concat(urls);
          setFormData({ ...formData, imageUrls: updatedImageUrls });
          console.log('Uploaded Image URLs:', updatedImageUrls);
        })
        .catch((uploadError) => {
          console.error('Error uploading images:', uploadError);
          setError('Error uploading images. Please try again.');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setError(`You can upload a maximum of 6 images. You've already selected ${formData.imageUrls.length}.`);
    }
  };

  // Function to store a single image in Firebase storage
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = `${new Date().getTime()}-${file.name}`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  // Handle the checkbox change
  const handleOfferChange = (e) => {
    setIsOfferChecked(e.target.checked);
  };

  // Handle delete image
  const handleDeleteImage = (url) => {
    const updatedImageUrls = formData.imageUrls.filter((imageUrl) => imageUrl !== url);
    setFormData({ ...formData, imageUrls: updatedImageUrls });
  };

  // Handle form submission (create listing)
  const handleCreateListing = (e) => {
    e.preventDefault();
    // Logic for creating a listing (e.g., sending formData to a database)
    console.log('Listing Created with Data:', formData);
  };

  return (
    <main className="max-w-4xl mx-auto mt-8 p-6 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-center mb-7">Create a Listing</h1>

      {/* Form */}
      <form className="flex flex-col sm:flex-row gap-6" onSubmit={handleCreateListing}>
        {/* Left section */}
        <div className="flex flex-col gap-4 w-full sm:w-96">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg w-full"
            id="name"
            maxLength={62}
            minLength={10}
            required
          />
          <input
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg w-full"
            id="description"
            minLength={10}
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg w-full"
            id="address"
            minLength={10}
            required
          />

          {/* Checkboxes */}
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="sale" className="w-5 h-5" />
              <span>Sell</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="rent" className="w-5 h-5" />
              <span>Rent</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="parking" className="w-5 h-5" />
              <span>Parking Spot</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="furnished" className="w-5 h-5" />
              <span>Furnished</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5 h-5"
                onChange={handleOfferChange}
              />
              <span>Offer</span>
            </div>
          </div>

          {/* Beds, Baths, Prices */}
          <div className="flex flex-wrap gap-6 mt-4">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="beds"
                min={1}
                max={10}
                required
                className="p-3 border border-gray-300 rounded-lg w-20"
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="baths"
                min={1}
                max={10}
                required
                className="p-3 border border-gray-300 rounded-lg w-20"
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min={0}
                required
                className="p-3 border border-gray-300 rounded-lg w-24"
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">($ / Month)</span>
              </div>
            </div>

            {/* Conditionally render the Discounted Price field */}
            {isOfferChecked && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountedPrice"
                  min={0}
                  required
                  className="p-3 border border-gray-300 rounded-lg w-24"
                />
                <div className="flex flex-col items-center">
                  <p>Discounted Price</p>
                  <span className="text-xs">($ / Month)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right section */}
        <div className="flex flex-col flex-1">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4 mt-2">
            <input
              onChange={(e) => {
                setFiles(e.target.files);
              }}
              className="p-3 border border-gray-400 rounded-lg w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              onClick={handleImage}
              className="p-3 text-white bg-green-700 border-green-800 rounded-lg uppercase hover:shadow-lg"
              type="button"
            >
              Upload
            </button>
          </div>

          {/* Display loading spinner or message */}
          {loading && <p className="text-blue-600 mt-3">Uploading images, please wait...</p>}

          {/* Display error message */}
          {error && <p className="text-red-600 mt-3">{error}</p>}

          {/* Display uploaded images with delete option */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {formData.imageUrls.map((url, index) => (
              <div key={index} className="relative">
                <img src={url} alt={`Uploaded ${index + 1}`} className="w-full h-40 object-cover rounded-lg" />
                <button
                  onClick={() => handleDeleteImage(url)}
                  className="absolute top-2 right-2 text-red-500 bg-white rounded-full shadow-lg p-1 hover:bg-red-600"
                >
                  &#10005;
                </button>
              </div>
            ))}
          </div>
        </div>
      </form>

      {/* Create Listing Button */}
      <div className="flex justify-center mt-6">
        <button
          type="submit"
          className="px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold uppercase"
        >
          Create Listing
        </button>
      </div>
    </main>
  );
}

export default CreateListing;
