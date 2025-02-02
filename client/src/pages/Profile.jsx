import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import axios from 'axios';
import { logout } from '../redux/user/userSlice';
import { Link, useNavigate } from 'react-router-dom';

function Profile() {
  const [formdata, setformdata] = useState({});  
  const [file, setFile] = useState(undefined);  
  const fileRef = useRef(null);  
  const [showListingsError, setShowListingsError] = useState(false);
  const { currentUser } = useSelector((state) => state.user);  
  const [filePercent, setFilePercent] = useState(0);  
  const [userListings, setUserListings] = useState([]);
  const [updateSuccess, setUpdateSuccess] = useState(false);  // Corrected spelling
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercent(Math.round(progress));  // Corrected variable name
      },
      (error) => {
        console.error('Upload failed:', error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setformdata((prevData) => ({ ...prevData, avatar: downloadURL }));
        });
      }
    );
  };

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/server/user/update/${currentUser._id}`, formdata, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      setUpdateSuccess(true);  // Corrected setter name
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await axios.post('/server/auth/signout', {}, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/server/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/server/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) return;
      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-bold text-center my-7 text-slate-700'>Your Profile</h1>
      
      {updateSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
          Profile updated successfully!
        </div>
      )}

      <div className='bg-white shadow-lg rounded-xl p-6'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
          <div className='flex flex-col items-center'>
            <div className='relative group cursor-pointer'>
              <img
                onClick={() => fileRef.current.click()}
                src={currentUser.avatar || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'}
                alt="Profile"
                className='rounded-full h-32 w-32 object-cover border-4 border-white shadow-lg'
              />
              <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'>
                <span className='text-white text-sm font-medium'>Upload Photo</span>
              </div>
            </div>
            
            {filePercent > 0 && (
              <div className='w-full bg-gray-200 rounded-full h-2.5 mt-4'>
                <div
                  className='bg-blue-600 h-2.5 rounded-full transition-all'
                  style={{ width: `${filePercent}%` }}
                ></div>
              </div>
            )}
          </div>

          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Username</label>
              <input
                type="text"
                placeholder='Username'
                className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                defaultValue={currentUser.username}
                onChange={(e) => setformdata({ ...formdata, username: e.target.value })}
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
              <input
                type="email"
                placeholder='Email'
                className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                defaultValue={currentUser.email}
                onChange={(e) => setformdata({ ...formdata, email: e.target.value })}
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Password</label>
              <input
                type="password"
                placeholder='••••••••'
                className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                onChange={(e) => setformdata({ ...formdata, password: e.target.value })}
              />
            </div>
          </div>

          <div className='flex flex-col gap-3'>
            <button
              type="submit"
              className='w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium'
            >
              Update Profile
            </button>
            
            <Link
              to="/create-listing"
              className='bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors font-medium text-center'
            >
              Create New Listing
            </Link>
          </div>
        </form>

        <div className='mt-6 pt-6 border-t border-gray-200'>
          <div className='flex justify-between items-center'>
            <button
              onClick={() => confirm('Are you sure you want to delete your account?')}
              className='text-red-600 hover:text-red-700 font-medium'
            >
              Delete Account
            </button>
            <button
              onClick={handleSignOut}
              className='px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors font-medium'
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className='mt-8'>
        <button
          onClick={handleShowListings}
          className='w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-gray-700 transition-colors'
        >
          {userListings.length > 0 ? 'Manage Listings' : 'Show Listings'}
        </button>

        {showListingsError && (
          <p className='text-red-500 text-center mt-4'>Error showing listings</p>
        )}

        {userListings.length > 0 && (
          <div className='mt-6'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-4'>Your Listings</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {userListings.map((listing) => (
                <div
                  key={listing._id}
                  className='bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow'
                >
                  <div className='flex gap-4'>
                    <Link to={`/listing/${listing._id}`} className='flex-shrink-0'>
                      <img
                        src={listing.imageUrls[0]}
                        alt='Listing cover'
                        className='h-20 w-20 object-cover rounded-lg'
                      />
                    </Link>
                    <div className='flex flex-col justify-between flex-grow'>
                      <Link
                        to={`/listing/${listing._id}`}
                        className='text-gray-700 hover:text-blue-600 font-medium truncate'
                      >
                        {listing.name}
                      </Link>
                      <div className='flex gap-3 mt-2'>
                        <Link
                          to={`/update-listing/${listing._id}`}
                          className='text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200 transition-colors'
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleListingDelete(listing._id)}
                          className='text-sm bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 transition-colors'
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;