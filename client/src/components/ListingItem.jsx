import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';
import { MdOutlineBathtub, MdOutlineBedroomParent } from 'react-icons/md';
import { TbCurrencyDollar } from 'react-icons/tb';

export default function ListingItem({ listing }) {
  return (
    <div className='bg-white shadow-sm hover:shadow-md transition-shadow rounded-lg overflow-hidden'>
      <Link to={`/listing/${listing._id}`} className='block h-full'>
        <img
          src={listing.imageUrls[0] || 'https://via.placeholder.com/300x200'}
          alt='property'
          className='h-48 w-full object-cover hover:scale-105 transition-transform duration-300'
        />
        
        <div className='p-4'>
          <div className='flex items-center justify-between mb-2'>
            <h3 className='text-lg font-semibold truncate'>{listing.name}</h3>
            <div className='flex items-center text-sm text-gray-600'>
              <MdLocationOn className='mr-1' />
              <span className='truncate'>{listing.address}</span>
            </div>
          </div>

          <p className='text-gray-600 text-sm line-clamp-2 mb-4'>
            {listing.description}
          </p>

          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-4 text-gray-600'>
              <div className='flex items-center gap-1'>
                <MdOutlineBedroomParent />
                <span>{listing.bedrooms} Beds</span>
              </div>
              <div className='flex items-center gap-1'>
                <MdOutlineBathtub />
                <span>{listing.bathrooms} Baths</span>
              </div>
            </div>

            <div className='flex items-center font-semibold'>
              <p>₹</p>
              <span className='text-sm'>
                {listing.offer ? listing.discountPrice : listing.regularPrice}
                {listing.type === 'rent' && '/mo'}
              </span>
            </div>
          </div>

          {listing.offer && (
            <div className='bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs inline-block'>
              Special Offer!
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}