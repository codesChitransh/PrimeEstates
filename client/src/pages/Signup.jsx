import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Gauth from '../components/Gauth';
import { FaUser, FaEnvelope, FaLock, FaArrowRight } from 'react-icons/fa';

function Signup() {
  const [formdata, setformdata] = useState({});
  const [error, seterror] = useState(null);
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setformdata({
      ...formdata,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formdata.username || !formdata.email || !formdata.password) {
      seterror("All fields are required");
      return;
    }
    
    try {
      setloading(true);
      seterror(null);

      const res = await fetch('/server/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formdata),
      });

      const data = await res.json();
      if (data.success === false) {
        setloading(false);
        seterror(data.message);
        return;
      }
      navigate("/sign-in");
      setloading(false);
    } catch (error) {
      setloading(false);
      seterror(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">
          Create Your Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Username"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                id="username"
                onChange={handleChange}
                required
              />
            </div>

            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Email"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                id="email"
                onChange={handleChange}
                required
              />
            </div>

            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                placeholder="Password"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                id="password"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center p-3 bg-red-50 rounded-lg">
              {error}
            </div>
          )}

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                Sign Up
                <FaArrowRight className="text-sm" />
              </>
            )}
          </button>

          <div className="relative flex items-center justify-center my-6">
            <div className="absolute inset-0 border-t border-gray-200"></div>
            <span className="relative bg-white px-4 text-gray-500">OR</span>
          </div>

          <Gauth />
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link
              to="/sign-in"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;