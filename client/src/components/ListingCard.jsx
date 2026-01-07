import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useState } from 'react';

function ListingCard({ listing }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <Link
      to={`/listings/${listing._id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden relative group"
    >
      <button
        onClick={(e) => {
          e.preventDefault();
          setIsWishlisted(!isWishlisted);
        }}
        className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white text-gray-400 hover:text-yellow-500 transition-colors z-10 opacity-0 group-hover:opacity-100 focus:opacity-100"
        title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Star className={`w-5 h-5 ${isWishlisted ? 'fill-yellow-500 text-yellow-500' : ''}`} />
      </button>
      {listing.imageUrl ? (
        <img
          src={listing.imageUrl}
          alt={listing.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
          }}
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400">No Image</span>
        </div>
      )}
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{listing.name}</h3>
        <p className="text-sm text-blue-600 mb-2">{listing.category}</p>
        <p className="text-sm text-gray-600 mb-2">
          {listing.location.city}, {listing.location.area}
        </p>
        <p className="text-gray-700 text-sm line-clamp-2">{listing.shortDescription}</p>
      </div>
    </Link>
  );
}

export default ListingCard;

