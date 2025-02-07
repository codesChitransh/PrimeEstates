import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ListingItem from '../components/ListingItem';
import { MdOutlineBathtub, MdOutlineBedroomParent, MdCancel } from 'react-icons/md';
import { TbCurrencyDollar } from 'react-icons/tb';

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'createdAt',
    order: 'desc',
    minPrice: '',
    maxPrice: ''
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    
    const fetchListings = async () => {
      setLoading(true);
      setError(null);
      try {
        const searchQuery = urlParams.toString();
        const res = await fetch(`/server/listing/get?${searchQuery}`);
        
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        const data = await res.json();
        
        setShowMore(data.length >= 9);
        setListings(prev => urlParams.get('startIndex') ? [...prev, ...data] : data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    const newData = { ...sidebarData };

    if (type === 'checkbox') {
      newData[id] = checked;
    } else if (id === 'sort_order') {
      const [sort, order] = value.split('_');
      newData.sort = sort;
      newData.order = order;
    } else {
      newData[id] = value;
    }

    setSidebarData(newData);
    updateURL(newData);
  };

  const updateURL = (data) => {
    const urlParams = new URLSearchParams();
    
    Object.entries(data).forEach(([key, value]) => {
      if (value && value !== 'all') urlParams.set(key, value);
    });

    navigate(`/search?${urlParams.toString()}`, { replace: true });
  };

  const handlePriceRange = (type, value) => {
    const newData = { ...sidebarData };
    newData[type] = value;
    setSidebarData(newData);
    updateURL(newData);
  };

  const clearFilters = () => {
    setSidebarData({
      searchTerm: '',
      type: 'all',
      parking: false,
      furnished: false,
      offer: false,
      sort: 'createdAt',
      order: 'desc',
      minPrice: '',
      maxPrice: ''
    });
    navigate('/search');
  };

  const loadMore = async () => {
    const startIndex = listings.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    
    try {
      const res = await fetch(`/server/listing/get?${urlParams.toString()}`);
      const data = await res.json();
      setShowMore(data.length >= 9);
      setListings(prev => [...prev, ...data]);
    } catch (err) {
      console.error('Load more error:', err);
    }
  };

  return (
    <div className='flex flex-col md:flex-row gap-4 p-4'>
      {/* Filters Sidebar */}
      <div className='w-full md:w-80 bg-white p-4 rounded-lg shadow-md'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-semibold'>Filters</h2>
          <button 
            onClick={clearFilters}
            className='text-red-500 hover:text-red-700 flex items-center gap-1'
          >
            <MdCancel className='text-lg'/> Clear
          </button>
        </div>

        <div className='space-y-6'>
          {/* Search Input */}
          <div>
            <label className='block text-sm font-medium mb-2'>Search</label>
            <input
              type='text'
              id='searchTerm'
              value={sidebarData.searchTerm}
              onChange={handleChange}
              className='w-full p-2 border rounded-lg'
              placeholder='Enter keywords...'
            />
          </div>

          {/* Property Type */}
          <div>
            <label className='block text-sm font-medium mb-2'>Type</label>
            <select
              id='type'
              value={sidebarData.type}
              onChange={handleChange}
              className='w-full p-2 border rounded-lg'
            >
              <option value='all'>All</option>
              <option value='rent'>Rent</option>
              <option value='sale'>Sale</option>
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className='block text-sm font-medium mb-2'>Price Range</label>
            <div className='flex gap-2'>
              <input
                type='number'
                placeholder='Min ₹'
                value={sidebarData.minPrice}
                onChange={(e) => handlePriceRange('minPrice', e.target.value)}
                className='w-1/2 p-2 border rounded-lg'
              />
              <input
                type='number'
                placeholder='Max ₹'
                value={sidebarData.maxPrice}
                onChange={(e) => handlePriceRange('maxPrice', e.target.value)}
                className='w-1/2 p-2 border rounded-lg'
              />
            </div>
          </div>

          {/* Amenities */}
          <div className='space-y-2'>
            <label className='block text-sm font-medium'>Amenities</label>
            <div className='flex items-center gap-2'>
              <input
                type='checkbox'
                id='parking'
                checked={sidebarData.parking}
                onChange={handleChange}
                className='w-4 h-4'
              />
              <label>Parking</label>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='checkbox'
                id='furnished'
                checked={sidebarData.furnished}
                onChange={handleChange}
                className='w-4 h-4'
              />
              <label>Furnished</label>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='checkbox'
                id='offer'
                checked={sidebarData.offer}
                onChange={handleChange}
                className='w-4 h-4'
              />
              <label>Special Offer</label>
            </div>
          </div>

          {/* Sorting */}
          <div>
            <label className='block text-sm font-medium mb-2'>Sort By</label>
            <select
              id='sort_order'
              value={`${sidebarData.sort}_${sidebarData.order}`}
              onChange={handleChange}
              className='w-full p-2 border rounded-lg'
            >
              <option value='regularPrice_desc'>Price: High to Low</option>
              <option value='regularPrice_asc'>Price: Low to High</option>
              <option value='createdAt_desc'>Newest First</option>
              <option value='createdAt_asc'>Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className='flex-1'>
        <h1 className='text-2xl font-semibold mb-4'>
          {listings.length} Properties Found
        </h1>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {loading && Array(6).fill(0).map((_, i) => (
            <div key={i} className='animate-pulse bg-gray-200 h-64 rounded-lg' />
          ))}

          {!loading && listings.map((listing) => (
            <ListingItem key={listing._id} listing={listing} />
          ))}
        </div>

        {showMore && (
          <button
            onClick={loadMore}
            className='w-full mt-4 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
          >
            Show More
          </button>
        )}

        {error && (
          <div className='mt-4 p-4 bg-red-100 text-red-700 rounded-lg'>
            Error: {error}
          </div>
        )}
      </div>
    </div>
  );
}