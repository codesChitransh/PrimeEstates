import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

function Signin() {
  const [formdata, setformdata] = useState({});
  const [error, seterror] = useState(null);
  const [loading, setloading] = useState(false);
  const navigate=useNavigate();
  function handleChange(e) {
    setformdata({
      ...formdata,
      [e.target.id]: e.target.value,
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
   
    if (!formdata.email || !formdata.password) {
      seterror("All fields are required");
      return;
    }
    
    try {
      setloading(true);
      seterror(null); 

      const res = await fetch('/server/auth/signin', {
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
      navigate("/")
      setloading(false);
     
    } catch (error) {
      setloading(false);
      seterror(error.message);
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
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
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
      {error && <p className="text-red-500 mt-3">{error}</p>} 
      <div className="flex flex-col gap-2 mt-5">
        <p>
          Dont have an account?{' '}
          <Link to={"/sign-up"}>
            <span className="text-blue-700 hover:underline">Sign Up</span>
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signin;
