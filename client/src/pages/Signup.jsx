import React from 'react'
import {Link} from 'react-router-dom'
function Signup() {
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>
        Sign Up
      </h1>
      <form className='flex flex-col gap-4'>
        <input type="text" placeholder='username' className='border p-3 rounded-lg 'id='username'></input>
      
     
        <input type="email" placeholder='email' className='border p-3 rounded-lg 'id='email'></input>
      
      
        <input type="password" placeholder='password' className='border p-3 rounded-lg 'id='password'></input>
        <button className='bg-slate-800 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Sign Up</button>
      </form>
      <div className='flex flex-col gap-2 mt-5'>
        <p>
          Have an account?
          <Link to={"/sign-in"}>
          <span className='text-blue-700 hover:underline'> Sign In</span>
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Signup;