import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userAPI } from '../lib/api';
import ListingCard from '../components/ListingCard';

function Wishlist() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                setLoading(true);
                const response = await userAPI.getWishlist();
                setListings(response.data.listings);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWishlist();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">Loading wishlist...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center text-red-600">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">My Wishlist</h1>

            {listings.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                    <p className="text-gray-600 mb-4">You haven't added any items to your wishlist yet.</p>
                    <Link
                        to="/listings"
                        className="text-blue-600 hover:underline font-medium"
                    >
                        Browse listings
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listings.map((listing) => (
                        <ListingCard key={listing._id} listing={{ ...listing, isWishlisted: true }} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Wishlist;
