import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';  
import axios from 'axios';  // Import Axios for API calls
import { logout } from '../redux/user/userSlice'; // Import logout action from your user slice
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

function Profile() {
  const [formdata, setformdata] = useState({});  
  const [file, setFile] = useState(undefined);  
  const fileRef = useRef(null);  
  const[ShowListingsError,setShowListingsError]=useState(false);
  const { currentUser } = useSelector((state) => state.user);  
  const [filepercent, setfilepercent] = useState(0);  
  const[UserListings,setUserListings]=useState([]);
  const [updateSucess, setupdateSucess] = useState(false);  
  
  const dispatch = useDispatch(); // Initialize dispatch
  const navigate = useNavigate(); // Initialize navigate

  const handleFileUpload = (file) => {
    const storage = getStorage(app);  
    const fileName = new Date().getTime() + file.name;  
    const storageRef = ref(storage, fileName);  
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setfilepercent(Math.round(progress));  
      },
      (error) => {
        console.error('Upload failed:', error);  
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setformdata((prevData) => ({ ...prevData, avatar: downloadURL })); // Save URL in form data
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
      // Make an API call to the backend to update the user info
      const response = await axios.post(`/server/user/update/${currentUser._id}`, formdata, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,  // Include token for authentication
        },
      });

      console.log("Profile updated:", response.data);
      setupdateSucess(true);  // Show success message
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await axios.post('/server/auth/signout', {}, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,  // Include token for authentication
        },
      });
      dispatch(logout()); // Dispatch logout action to update Redux state
      navigate('/login'); // Redirect to the login page
      console.log('Signed out successfully');
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
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      {updateSucess && (
        <p className="text-green-600 text-center mb-4">
          Profile updated successfully!
        </p>
      )}
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
          onChange={(e) => setFile(e.target.files[0])}  
        />

        <img
          onClick={() => fileRef.current.click()}  
          src={currentUser.avatar || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'}
          alt="Profile"
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
        />

        {filepercent > 0 && <p>Upload Progress: {filepercent}%</p>}

        <input
          id="username"
          type="text"
          placeholder='Username'
          className='border p-3 rounded-lg'
          defaultValue={currentUser.username}  
          onChange={(e) => setformdata({ ...formdata, username: e.target.value })}  
        />
        <input
          id="email"
          type="email"
          placeholder='Email'
          className='border p-3 rounded-lg'
          defaultValue={currentUser.email}  
          onChange={(e) => setformdata({ ...formdata, email: e.target.value })}  
        />

        <input
          id="password"
          type="password"
          placeholder='Password'
          className='border p-3 rounded-lg'
          onChange={(e) => setformdata({ ...formdata, password: e.target.value })}  
        />

        <div className="flex justify-between mt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white p-3 rounded-lg flex-1 mr-2 hover:opacity-90"
          >
            Update
          </button>
        </div>
        <Link className="bg-green-600 text-white p-3 rounded-lg uppercase text-center hover:opacity-85"to="/create-listing">
        Create Listing
        </Link>
        <div className='flex justify-between mt-2'>
          <span className='text-red-700 cursor-pointer' onClick={() => alert('Delete Account feature coming soon.')}>
            Delete Account
          </span>
          <span className='text-red-700 cursor-pointer' onClick={handleSignOut}> 
            Sign Out
          </span>
        </div>
      </form>
      <button onClick={handleShowListings}className='text-green-600 w-full'>Show Listings</button>
      <p className='text-red-600 mt-5'>{ShowListingsError?'Error showing Listings':''}</p>
      {UserListings && UserListings.length > 0 && (
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>
            Your Listings
          </h1>
          {UserListings.map((listing) => (
            <div
              key={listing._id}
              className='border rounded-lg p-3 flex justify-between items-center gap-4'
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='h-16 w-16 object-contain'
                />
              </Link>
              <Link
                className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className='flex flex-col item-center'>
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className='text-red-700 uppercase'
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;
