import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';  
import axios from 'axios';  // Import Axios for API calls
import { logout } from '../redux/user/userSlice'; // Import logout action from your user slice
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

function Profile() {
  const [formdata, setformdata] = useState({});  
  const [file, setFile] = useState(undefined);  
  const fileRef = useRef(null);  
  const { currentUser } = useSelector((state) => state.user);  
  const [filepercent, setfilepercent] = useState(0);  
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

        <div className='flex justify-between mt-5'>
          <span className='text-red-700 cursor-pointer' onClick={() => alert('Delete Account feature coming soon.')}>
            Delete Account
          </span>
          <span className='text-red-700 cursor-pointer' onClick={handleSignOut}> {/* Call handleSignOut on click */}
            Sign Out
          </span>
        </div>
      </form>
    </div>
  );
}

export default Profile;
