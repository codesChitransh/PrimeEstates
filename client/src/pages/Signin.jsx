import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signINStart, signInSuccess, signInFailure } from '../redux/user/userSlice';

function Signin() {
  const [formdata, setformdata] = useState({});
  const { loading, error } = useSelector((state => state.user));
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleChange(e) {
    setformdata({
      ...formdata,
      [e.target.id]: e.target.value,
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formdata.email || !formdata.password) {
      dispatch(signInFailure("All fields are required"));
      return;
    }
    
    try {
      dispatch(signINStart());

      console.log('Form data:', formdata);  // Debug form data

      const res = await fetch('/server/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formdata),
      });

      const data = await res.json();
      console.log('Response data:', data);  // Debug response

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }

      dispatch(signInSuccess(data));
      navigate("/");

    } catch (error) {
      dispatch(signInFailure("Failed to sign in"));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">
        Sign In
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-800 text-white p-3 rounded-lg uppercase hover:opacity-95"
        >
          {loading ? 'Loading...' : 'Sign In'}
        </button>
      </form>
      
      {error && <p className="text-red-500 mt-3">{error}</p>}  {/* Display errors */}
      <div className="flex flex-col gap-2 mt-5">
        <p>
          Don't have an account?{' '}
          <Link to="/sign-up">
            <span className="text-blue-700 hover:underline">Sign Up</span>
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signin;
