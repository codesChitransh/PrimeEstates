import React from 'react'
import { useSelector } from 'react-redux'
function Profile() {
  const {currentUser}=useSelector((state)=>state.user)
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
      Profile
      </h1>
      <form className='flex flex-col gap-4'>
        <img src={currentUser.avatar} alt="profile" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'></img>
      <input id="username"type="text"placeholder='username'className='border p-3 rounded-lg'></input>
      <input id="email"type="email"placeholder='email'className='border p-3 rounded-lg'></input>
      <input id="password"type="password"placeholder='password'className='border p-3 rounded-lg'></input><div className="flex justify-between mt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white p-3 rounded-lg flex-1 mr-2 hover:opacity-90"
          >
            Update
          </button>
        
        </div>
        <div className='flex justify-between mt-5'>
          <span className='text-red-700 cursor-pointer'>Delete Account</span>
          <span className='text-red-700 cursor-pointer'>Sign out</span>
        </div>
      </form>
    </div>
  )
}

export default Profile