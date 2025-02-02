import { useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/server/listing/get/${listingId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    };
    fetchListing();
  }, []);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError('You must upload at least one image');
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('Discount price must be lower than regular price');
      setLoading(true);
      setError(false);
      const res = await fetch(`/server/listing/update/${params.listingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-bold text-center my-7 text-slate-700'>
        Update Property Listing
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-8'>
        {/* Left Column */}
        <div className='flex flex-col gap-4 flex-1'>
          <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700'>Title</label>
            <input
              type='text'
              placeholder='Property name'
              className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              id='name'
              maxLength='62'
              minLength='10'
              required
              onChange={handleChange}
              value={formData.name}
            />
          </div>

          <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700'>Description</label>
            <textarea
              placeholder='Detailed property description'
              className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32'
              id='description'
              required
              onChange={handleChange}
              value={formData.description}
            />
          </div>

          <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700'>Address</label>
            <input
              type='text'
              placeholder='Full property address'
              className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              id='address'
              required
              onChange={handleChange}
              value={formData.address}
            />
          </div>

          <div className='flex flex-wrap gap-6 py-4 border-t border-gray-200'>
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-gray-700'>Type</h3>
              <div className='flex gap-4'>
                <label className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    id='sale'
                    className='w-5 h-5 accent-blue-600'
                    onChange={handleChange}
                    checked={formData.type === 'sale'}
                  />
                  <span>Sell</span>
                </label>
                <label className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    id='rent'
                    className='w-5 h-5 accent-blue-600'
                    onChange={handleChange}
                    checked={formData.type === 'rent'}
                  />
                  <span>Rent</span>
                </label>
              </div>
            </div>

            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-gray-700'>Amenities</h3>
              <div className='flex flex-col gap-2'>
                <label className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    id='parking'
                    className='w-5 h-5 accent-blue-600'
                    onChange={handleChange}
                    checked={formData.parking}
                  />
                  <span>Parking Spot</span>
                </label>
                <label className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    id='furnished'
                    className='w-5 h-5 accent-blue-600'
                    onChange={handleChange}
                    checked={formData.furnished}
                  />
                  <span>Furnished</span>
                </label>
                <label className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    id='offer'
                    className='w-5 h-5 accent-blue-600'
                    onChange={handleChange}
                    checked={formData.offer}
                  />
                  <span>Special Offer</span>
                </label>
              </div>
            </div>
          </div>

          <div className='flex flex-wrap gap-6 py-4 border-t border-gray-200'>
            <div className='space-y-2'>
              <label className='block text-sm font-medium text-gray-700'>Bedrooms</label>
              <input
                type='number'
                id='bedrooms'
                min='1'
                max='10'
                required
                className='w-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500'
                onChange={handleChange}
                value={formData.bedrooms}
              />
            </div>

            <div className='space-y-2'>
              <label className='block text-sm font-medium text-gray-700'>Bathrooms</label>
              <input
                type='number'
                id='bathrooms'
                min='1'
                max='10'
                required
                className='w-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500'
                onChange={handleChange}
                value={formData.bathrooms}
              />
            </div>

            <div className='space-y-2'>
              <label className='block text-sm font-medium text-gray-700'>
                Regular Price
                {formData.type === 'rent' && (
                  <span className='text-gray-500 ml-1'>(per month)</span>
                )}
              </label>
              <input
                type='number'
                id='regularPrice'
                min='50'
                required
                className='w-36 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500'
                onChange={handleChange}
                value={formData.regularPrice}
              />
            </div>

            {formData.offer && (
              <div className='space-y-2'>
                <label className='block text-sm font-medium text-gray-700'>
                  Discounted Price
                  {formData.type === 'rent' && (
                    <span className='text-gray-500 ml-1'>(per month)</span>
                  )}
                </label>
                <input
                  type='number'
                  id='discountPrice'
                  min='0'
                  className='w-36 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500'
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className='flex flex-col flex-1 gap-6'>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <h3 className='text-lg font-medium text-gray-700'>Property Images</h3>
              <p className='text-sm text-gray-500'>
                The first image will be the cover (max 6)
              </p>
            </div>
            
            <div className='flex gap-4'>
              <input
                onChange={(e) => setFiles(e.target.files)}
                className='w-full px-4 py-2 border rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
                type='file'
                id='images'
                accept='image/*'
                multiple
              />
              <button
                type='button'
                disabled={uploading}
                onClick={handleImageSubmit}
                className='px-6 py-2 text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {uploading ? 'Uploading...' : 'Add'}
              </button>
            </div>
            
            {imageUploadError && (
              <p className='text-red-500 text-sm'>{imageUploadError}</p>
            )}
          </div>

          <div className='grid grid-cols-2 gap-4'>
            {formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className='relative group border rounded-lg overflow-hidden'
              >
                <img
                  src={url}
                  alt='listing'
                  className='w-full h-32 object-cover'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                  className='absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <button
            disabled={loading || uploading}
            className='w-full py-3 px-6 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? 'Saving Changes...' : 'Update Listing'}
          </button>

          {error && <p className='text-red-500 text-sm text-center'>{error}</p>}
        </div>
      </form>
    </main>
  );
}