import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';
import { FaArrowRight, FaHome, FaTag } from 'react-icons/fa';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation, Autoplay]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const [offerRes, rentRes, saleRes] = await Promise.all([
          fetch('/server/listing/get?offer=true&limit=4'),
          fetch('/server/listing/get?type=rent&limit=4'),
          fetch('/server/listing/get?type=sale&limit=4')
        ]);
        
        const offerData = await offerRes.json();
        const rentData = await rentRes.json();
        const saleData = await saleRes.json();
        
        setOfferListings(offerData);
        setRentListings(rentData);
        setSaleListings(saleData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchListings();
  }, []);

  return (
    <div className='bg-gradient-to-b from-blue-50 to-white min-h-screen'>
      {/* Hero Section */}
      <div className='max-w-6xl mx-auto px-4 py-16 sm:py-24 lg:py-32'>
        <div className='text-center bg-white p-8 rounded-2xl shadow-xl'>
          <h1 className='text-4xl font-bold text-blue-900 sm:text-5xl lg:text-6xl mb-6'>
            Discover Your Dream <span className='text-blue-600'>Property</span>
          </h1>
          <p className='text-lg text-gray-600 mb-8 max-w-2xl mx-auto'>
            Explore premium real estate options with PrimeEstates. Find your perfect 
            home from our curated collection of exclusive properties.
          </p>
          <Link
            to='/search'
            className='inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors'
          >
            Browse Listings
            <FaArrowRight className='ml-2' />
          </Link>
        </div>
      </div>

      {/* Featured Carousel with Autoplay */}
      <div className='max-w-6xl mx-auto px-4 pb-16'>
        <Swiper 
          navigation 
          autoplay={{ delay: 3000, disableOnInteraction: false }} // Added Autoplay
          loop={true} // Ensures smooth looping
          className='rounded-2xl shadow-xl overflow-hidden'
        >
          {offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                  background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${listing.imageUrls[0]}) center/cover`,
                }}
                className='h-[500px] flex items-end p-8'
              >
                <div className='text-white'>
                  <h3 className='text-3xl font-bold mb-2'>{listing.name}</h3>
                  <p className='text-lg mb-4'>${listing.offer ? listing.discountPrice : listing.regularPrice}</p>
                  <Link
                    to={`/listing/${listing._id}`}
                    className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 w-fit'
                  >
                    View Details
                    <FaArrowRight className='text-sm' />
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Listings Sections */}
      <div className='max-w-6xl mx-auto px-4 pb-16 space-y-16'>
        <Section title='Special Offers' listings={offerListings} type='offer' />
        <Section title='Recent Rentals' listings={rentListings} type='rent' />
        <Section title='Properties for Sale' listings={saleListings} type='sale' />
      </div>
    </div>
  );
}

function Section({ title, listings, type }) {
  return (
    <div className='bg-white p-8 rounded-2xl shadow-xl'>
      <div className='flex justify-between items-center mb-8'>
        <h2 className='text-3xl font-bold text-blue-900'>
          <FaTag className='inline-block mr-3 text-blue-600' />
          {title}
        </h2>
        <Link
          to={`/search?${type === 'offer' ? 'offer=true' : `type=${type}`}`}
          className='text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2'
        >
          View All
          <FaArrowRight className='text-sm' />
        </Link>
      </div>
      <div className='grid text-[12px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        {listings.map((listing) => (
          <ListingItem 
            listing={listing} 
            key={listing._id} 
            className='hover:shadow-lg transition-shadow duration-200'
          />
        ))}
      </div>
    </div>
  );
}
