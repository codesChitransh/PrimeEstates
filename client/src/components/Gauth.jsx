import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useNavigate } from 'react-router-dom';
import googleLogo from '../assets/google-logo.png'; // Ensure this image is placed correctly in your project

function Gauth() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      const res = await fetch('/server/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });

      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      setError('Could not sign in. Please try again.');
      console.log('Could not sign in', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleGoogle}
        className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 p-3 rounded-lg uppercase hover:bg-gray-100 transition duration-300 shadow-md w-full"
        disabled={loading}
      >
        <img src={googleLogo} alt="Google Logo" className="w-5 h-5" />
        {loading ? 'Signing in...' : 'Login with Google'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </>
  );
}

export default Gauth;
