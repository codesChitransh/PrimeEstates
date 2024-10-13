import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { Navigate,useNavigate } from 'react-router-dom';

function Gauth() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
    const navigate=useNavigate();
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
      navigate("/");
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
        className="bg-orange-500 text-white p-3 rounded-lg uppercase hover:opacity-95"
        disabled={loading}
      >
        {loading ? 'Signing in...' : 'Login with Google'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </>
  );
}

export default Gauth;
