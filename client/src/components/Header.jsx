import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { useSelector } from 'react-redux';

function Header() {
  const { currentUser } = useSelector((state) => state.user);

  console.log(currentUser?.avatar);  // Check if avatar URL is correctly fetched

  return (
    <header className='bg-slate-200 shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to="/">
        <h1 className='font-bold text-sm sm:text-xl flex-wrap'>
          <span className='text-slate-500'>
            Real
          </span>
          <span className='text-slate-700'>
            Estate
          </span>
        </h1>
        </Link>
        <form className='bg-slate-100 p-3 rounded-lg flex items-center'>
          <input 
            type="text" 
            placeholder='Search' 
            className='bg-transparent focus:outline-none w-24 sm:w-64' 
          />
          <FaSearch className="text-slate-500" />
        </form>
        <ul className='flex gap-4'>
          <Link to="/">
            <li className='hidden sm:inline text-slate-700 hover:underline'>Home</li>
          </Link>
          <Link to="/about">
            <li className='hidden sm:inline text-slate-700 hover:underline'>About</li>
          </Link>
          <Link to='/profile'>
            {currentUser ? (
              <img 
                src={currentUser.avatar || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'} 
                alt='User Avatar' 
                className="w-8 h-8 rounded-full object-cover"
                onError={(e) => e.target.src = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'} // fallback if avatar fails to load
              />
            ) : (
              <Link to="/sign-in">
                <li className='text-slate-700 hover:underline'>
                  Sign In
                </li>
              </Link>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}

export default Header;
