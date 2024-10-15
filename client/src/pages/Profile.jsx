import React, { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';  // Make sure your Firebase config is properly set up

function Profile() {
  const [formdata, setformdata] = useState({});  // Initialize as an object
  const [file, setFile] = useState(undefined);  // State to hold the uploaded file
  const fileRef = useRef(null);  // Reference for file input
  const { currentUser } = useSelector((state) => state.user);  // Get current user from Redux
  const [filepercent, setfilepercent] = useState(0);  // File upload progress

  const handleFileUpload = (file) => {
    const storage = getStorage(app);  // Initialize Firebase storage
    const fileName = new Date().getTime() + file.name;  // Create a unique filename
    const storageRef = ref(storage, fileName);  // Create a storage reference
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Monitor the file upload process
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setfilepercent(Math.round(progress));  // Update progress state
      },
      (error) => {
        console.error('Upload failed:', error);  // Handle errors
      },
      () => {
        // Get the download URL after the upload completes
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('Download URL:', downloadURL);  // Log the download URL
          // Store only the download URL in avatar
          setformdata((prevData) => ({ ...prevData, avatar: downloadURL }));
        });
      }
    );
  };

  useEffect(() => {
    if (file) {
      handleFileUpload(file);  // Trigger file upload when file is selected
    }
  }, [file]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formdata);  // Log form data with only the avatar URL
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        {/* Hidden file input for avatar upload */}
        <input
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
          onChange={(e) => setFile(e.target.files[0])}  // Store selected file in state
        />

        {/* Profile Image with Click to Upload */}
        <img
          onClick={() => fileRef.current.click()}  // Open file dialog on image click
          src={currentUser.avatar || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'}
          alt="Profile"
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
        />

        {/* Display upload progress */}
        {filepercent > 0 && <p>Upload Progress: {filepercent}%</p>}

        {/* Input Fields */}
        <input
          id="username"
          type="text"
          placeholder='Username'
          className='border p-3 rounded-lg'
          defaultValue={currentUser.username}  // Set default value from current user
          onChange={(e) => setformdata({ ...formdata, username: e.target.value })}  // Update form data
        />
        <input
          id="email"
          type="email"
          placeholder='Email'
          className='border p-3 rounded-lg'
          defaultValue={currentUser.email}  // Set default value from current user
          onChange={(e) => setformdata({ ...formdata, email: e.target.value })}  // Update form data
        />

        {/* Password input, but we won’t log or submit it */}
        <input
          id="password"
          type="password"
          placeholder='Password'
          className='border p-3 rounded-lg'
          // No need to save password in formdata
        />

        {/* Update Button */}
        <div className="flex justify-between mt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white p-3 rounded-lg flex-1 mr-2 hover:opacity-90"
          >
            Update
          </button>
        </div>

        {/* Delete Account and Sign Out Links */}
        <div className='flex justify-between mt-5'>
          <span className='text-red-700 cursor-pointer' onClick={() => alert('Delete Account feature coming soon.')}>
            Delete Account
          </span>
          <span className='text-red-700 cursor-pointer' onClick={() => alert('Sign Out feature coming soon.')}>
            Sign Out
          </span>
        </div>
      </form>
    </div>
  );
}

export default Profile;
