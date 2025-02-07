import { useState } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUpload, FaTrash, FaTag, FaCouch, FaParking, FaMoneyBillWave } from 'react-icons/fa';
import { GiBed, GiBathtub } from 'react-icons/gi';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
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

  const handleImageSubmit = () => {
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
        .catch(() => {
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

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1) return setError('You must upload at least one image');
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('Discount price must be lower than regular price');

      setLoading(true);
      setError(false);
      
      const res = await fetch('/server/listing/create', {
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
      } else {
        navigate(`/listing/${data._id}`);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className='min-h-screen bg-gradient-to-b from-blue-50 to-white p-6'>
      <div className='max-w-6xl mx-auto'>
        <h1 className='text-4xl font-bold text-center text-blue-900 mb-8'>
          List Your Property
        </h1>
        
        <form onSubmit={handleSubmit} className='grid md:grid-cols-2 gap-8 bg-white p-8 rounded-2xl shadow-xl'>
          {/* Left Column */}
          <div className='space-y-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Property Title</label>
              <input
                type='text'
                placeholder='Luxury Downtown Apartment'
                className='w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition'
                id='name'
                required
                onChange={handleChange}
                value={formData.name}
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Description</label>
              <textarea
                placeholder='Describe your property in detail...'
                className='w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-32 transition'
                id='description'
                required
                onChange={handleChange}
                value={formData.description}
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Address</label>
              <input
                type='text'
                placeholder='123 Main Street, City'
                className='w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition'
                id='address'
                required
                onChange={handleChange}
                value={formData.address}
              />
            </div>

            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-900'>Listing Type</h3>
              <div className='flex gap-4'>
                <button
                  type='button'
                  onClick={() => setFormData({...formData, type: 'sale'})}
                  className={`flex-1 p-3 rounded-xl flex items-center justify-center gap-2 transition-colors 
                   ${formData.type === 'sale' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  <FaTag className='text-lg' />
                  For Sale
                </button>
                <button
                  type='button'
                  onClick={() => setFormData({...formData, type: 'rent'})}
                  className={`flex-1 p-3 rounded-xl flex items-center justify-center gap-2 transition-colors 
                    ${formData.type === 'rent' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  <FaTag className='text-lg' />
                  For Rent
                </button>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='bg-gray-50 p-4 rounded-xl'>
                <label className='flex items-center gap-3 cursor-pointer'>
                  <input
                    type='checkbox'
                    id='parking'
                    className='w-5 h-5 text-blue-600 rounded-lg border-gray-300 focus:ring-blue-500'
                    onChange={handleChange}
                    checked={formData.parking}
                  />
                  <FaParking className='text-xl text-gray-700' />
                  <span className='text-gray-700'>Parking</span>
                </label>
              </div>
              
              <div className='bg-gray-50 p-4 rounded-xl'>
                <label className='flex items-center gap-3 cursor-pointer'>
                  <input
                    type='checkbox'
                    id='furnished'
                    className='w-5 h-5 text-blue-600 rounded-lg border-gray-300 focus:ring-blue-500'
                    onChange={handleChange}
                    checked={formData.furnished}
                  />
                  <FaCouch className='text-xl text-gray-700' />
                  <span className='text-gray-700'>Furnished</span>
                </label>
              </div>
              
              <div className='bg-gray-50 p-4 rounded-xl'>
                <label className='flex items-center gap-3 cursor-pointer'>
                  <input
                    type='checkbox'
                    id='offer'
                    className='w-5 h-5 text-blue-600 rounded-lg border-gray-300 focus:ring-blue-500'
                    onChange={handleChange}
                    checked={formData.offer}
                  />
                  <FaMoneyBillWave className='text-xl text-gray-700' />
                  <span className='text-gray-700'>Offer</span>
                </label>
              </div>
            </div>

            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-900'>Specifications</h3>
              <div className='grid grid-cols-2 gap-4'>
                <div className='bg-gray-50 p-4 rounded-xl'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Bedrooms</label>
                  <div className='flex items-center gap-3'>
                    <GiBed className='text-xl text-gray-700' />
                    <input
                      type='number'
                      id='bedrooms'
                      min='1'
                      max='10'
                      className='w-full p-2 bg-white border border-gray-300 rounded-lg'
                      onChange={handleChange}
                      value={formData.bedrooms}
                    />
                  </div>
                </div>
                
                <div className='bg-gray-50 p-4 rounded-xl'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Bathrooms</label>
                  <div className='flex items-center gap-3'>
                    <GiBathtub className='text-xl text-gray-700' />
                    <input
                      type='number'
                      id='bathrooms'
                      min='1'
                      max='10'
                      className='w-full p-2 bg-white border border-gray-300 rounded-lg'
                      onChange={handleChange}
                      value={formData.bathrooms}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-900'>Pricing</h3>
              <div className='space-y-4'>
                <div className='bg-gray-50 p-4 rounded-xl'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Regular Price</label>
                  <div className='flex items-center gap-3'>
                    <span className='text-gray-500'>₹</span>
                    <input
                      type='number'
                      id='regularPrice'
                      min='50'
                      max='10000000'
                      className='w-full p-2 bg-white border border-gray-300 rounded-lg'
                      onChange={handleChange}
                      value={formData.regularPrice}
                    />
                    {formData.type === 'rent' && <span className='text-gray-500 text-sm'>/ month</span>}
                  </div>
                </div>

                {formData.offer && (
                  <div className='bg-gray-50 p-4 rounded-xl'>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Discounted Price</label>
                    <div className='flex items-center gap-3'>
                      <span className='text-gray-500'>₹</span>
                      <input
                        type='number'
                        id='discountPrice'
                        min='0'
                        max='10000000'
                        className='w-full p-2 bg-white border border-gray-300 rounded-lg'
                        onChange={handleChange}
                        value={formData.discountPrice}
                      />
                      {formData.type === 'rent' && <span className='text-gray-500 text-sm'>/ month</span>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className='space-y-6'>
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-900'>Property Images</h3>
              <div className='border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors'>
                <input
                  onChange={(e) => setFiles(Array.from(e.target.files))}
                  className='hidden'
                  type='file'
                  id='images'
                  accept='image/*'
                  multiple
                />
                <label htmlFor='images' className='cursor-pointer'>
                  <FaUpload className='mx-auto text-3xl text-gray-400 mb-3' />
                  <p className='text-gray-600'>
                    Drag & drop images or <span className='text-blue-600 font-medium'>browse</span>
                  </p>
                  <p className='text-sm text-gray-500 mt-1'>Up to 6 images (2MB each)</p>
                </label>
              </div>
              
              <button
                type='button'
                disabled={uploading}
                onClick={handleImageSubmit}
                className='w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors'
              >
                {uploading ? 'Uploading...' : 'Confirm Upload'}
              </button>
              
              {imageUploadError && (
                <p className='text-red-600 text-sm text-center'>{imageUploadError}</p>
              )}
            </div>

            {formData.imageUrls.length > 0 && (
              <div className='space-y-4'>
                <h4 className='font-medium text-gray-900'>Uploaded Images</h4>
                <div className='grid grid-cols-3 gap-4'>
                  {formData.imageUrls.map((url, index) => (
                    <div key={url} className='relative group'>
                      <img
                        src={url}
                        alt='listing'
                        className='w-full h-32 object-cover rounded-lg'
                      />
                      <button
                        type='button'
                        onClick={() => handleRemoveImage(index)}
                        className='absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
                      >
                        <FaTrash className='text-sm' />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              disabled={loading || uploading}
              className='w-full py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors'
            >
              {loading ? 'Publishing...' : 'Publish Listing'}
            </button>

            {error && (
              <p className='text-red-600 text-sm text-center'>{error}</p>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}