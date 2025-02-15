import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false); // State to track JWT expiration error

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/server/user/${listing.userRef}`);
        if (res.status === 401) {
          setError(true); // Set error state if JWT expired
          return;
        }
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
        setError(true);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);

  return (
    <>
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mt-5 rounded-md">
          <strong>Error:</strong> Your session has expired. Please <Link to="/sign-in" className="font-semibold underline">Sign In</Link> again.
        </div>
      )}

      {landlord && !error && (
        <div className='flex flex-col gap-2'>
          <p>
            Contact <span className='font-semibold'>{landlord.username}</span>{' '}
            for{' '}
            <span className='font-semibold'>{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name='message'
            id='message'
            rows='2'
            value={message}
            onChange={onChange}
            placeholder='Enter your message here...'
            className='w-full border p-3 rounded-lg'
          ></textarea>

          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
          >
            Send Message          
          </Link>
        </div>
      )}
    </>
  );
}
