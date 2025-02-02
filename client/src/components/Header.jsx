import { FaSearch, FaHome, FaInfoCircle, FaSignInAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className='bg-gradient-to-r from-blue-800 to-blue-600 shadow-lg'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-4'>
        <Link to='/' className='flex items-center gap-1'>
          <h1 className='font-bold text-xl sm:text-2xl text-white tracking-tight'>
            <span className='text-blue-200'>Prime</span>Estates
          </h1>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 text-blue-200" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M19 9.3V4h-3v2.6L12 3 2 12h3v8h6v-6h2v6h6v-8h3l-3-2.7zm-9 1.7c0-1.1.9-2 2-2s2 .9 2 2h-4z"/>
          </svg>
        </Link>

        <form
          onSubmit={handleSubmit}
          className='bg-white p-2 rounded-full flex items-center shadow-md hover:shadow-lg transition-shadow duration-200'
        >
          <input
            type='text'
            placeholder='Search properties...'
            className='bg-transparent focus:outline-none w-32 sm:w-64 px-4 py-1'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className='bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition-colors'>
            <FaSearch className='text-white text-sm' />
          </button>
        </form>

        <nav className='flex items-center gap-4 sm:gap-6'>
          <Link 
            to='/' 
            className='text-white hover:text-blue-200 transition-colors hidden sm:flex items-center gap-1'
          >
            <FaHome className='text-lg' />
            <span className='font-medium'>Home</span>
          </Link>
          
          <Link 
            to='/about' 
            className='text-white hover:text-blue-200 transition-colors hidden sm:flex items-center gap-1'
          >
            <FaInfoCircle className='text-lg' />
            <span className='font-medium'>About</span>
          </Link>

          <Link 
            to='/profile' 
            className='flex items-center gap-2 group'
          >
            {currentUser ? (
              <>
                <img
                  className='rounded-full h-8 w-8 object-cover border-2 border-white group-hover:border-blue-200 transition-all'
                  src={currentUser.avatar}
                  alt='profile'
                />
                <span className='text-white text-sm font-medium hidden lg:inline'>
                  {currentUser.username}
                </span>
              </>
            ) : (
              <div className='flex items-center gap-1 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-colors'>
                <FaSignInAlt className='text-white' />
                <span className='text-white font-medium text-sm'>Sign In</span>
              </div>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}