import React, { useState } from 'react';

function CreateListing() {
  // State to manage the offer checkbox
  const [isOfferChecked, setIsOfferChecked] = useState(false);

  // Handle the checkbox change
  const handleOfferChange = (e) => {
    setIsOfferChecked(e.target.checked);
  };

  return (
    <main className="max-w-4xl mx-auto mt-8 p-6 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-center mb-7">
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-6">
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
              className="p-3 border border-gray-400 rounded-lg w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              className="p-3 text-white bg-green-700 border-green-800 rounded-lg uppercase hover:shadow-lg"
              type="button"
            >
              Upload
            </button>
          </div>

          <button
            className="mt-6 p-3 bg-gray-800 text-white rounded-lg uppercase hover:bg-gray-900"
            type="submit"
          >
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}

export default CreateListing;
