import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { listingAPI, userAPI, cartAPI } from '../lib/api';
import useAuthStore from '../state/authStore';
import DeliveryModal from '../components/DeliveryModal';
import OrderingFlow from '../components/OrderingFlow';
import ReportModal from '../components/ReportModal';
import RecentlyViewed from '../components/RecentlyViewed';

function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Core states
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Bookmark
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);

  // Booking
  const [bookingData, setBookingData] = useState({
    scheduledDate: '',
    scheduledTime: '',
    quantity: 1,
    notes: '',
  });
  const [addingToCart, setAddingToCart] = useState(false);

  // Modals
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showOrderingFlow, setShowOrderingFlow] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // Fetch listing
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await listingAPI.getListing(id);
        const listingData = res.listing || res.data?.listing || res;
        setListing(listingData);
        setIsBookmarked(listingData.isBookmarked || false);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load listing');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  // Save to Recently Viewed
  useEffect(() => {
    if (listing) {
      try {
        const existing = localStorage.getItem('recentlyViewed');
        let items = existing ? JSON.parse(existing) : [];

        // Remove current item if it exists (to move it to top)
        items = items.filter(i => i._id !== listing._id);

        // Add current item to front
        items.unshift({
          _id: listing._id,
          name: listing.name,
          imageUrl: listing.imageUrl,
          category: listing.category,
          location: listing.location,
          rating: listing.rating,
          shortDescription: listing.shortDescription || (listing.description ? listing.description.substring(0, 100) + '...' : ''),
          price: listing.price
        });

        // Keep max 8 items
        if (items.length > 8) items = items.slice(0, 8);

        localStorage.setItem('recentlyViewed', JSON.stringify(items));
      } catch (e) {
        console.error('Error saving to recently viewed:', e);
      }
    }
  }, [listing]);

  // Bookmark handler
  const handleBookmark = async () => {
    if (!user) return navigate('/login');

    try {
      setBookmarking(true);
      const res = await userAPI.toggleBookmark(id);
      const bookmarked = res.bookmarked ?? res.data?.bookmarked ?? false;
      setIsBookmarked(bookmarked);
      toast.success(bookmarked ? 'Bookmarked' : 'Removed bookmark');
    } catch (err) {
      toast.error(err.message || 'Failed to toggle bookmark');
    } finally {
      setBookmarking(false);
    }
  };

  // Delete listing handler
  const handleDelete = async () => {
    if (!window.confirm('Delete this listing?')) return;

    try {
      await listingAPI.deleteListing(id);
      toast.success('Listing deleted');
      navigate('/listings');
    } catch (err) {
      toast.error(err.message || 'Failed to delete listing');
    }
  };

  // Add to cart handler
  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');

    try {
      setAddingToCart(true);
      await cartAPI.addToCart({
        listingId: id,
        serviceName: listing.name,
        price: listing.price || 50, // Default price if not specified
        ...bookingData,
      });
      toast.success('Added to cart');
      navigate('/cart');
    } catch (err) {
      toast.error(err.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) return <div className="text-center py-10 text-gray-600">Loading...</div>;
  if (error) return <div className="text-center text-red-600 py-10">Error: {error}</div>;
  if (!listing) return <div className="text-center text-red-600 py-10">Listing not found</div>;

  const isOwner = user && user.id === listing.owner?._id;
  const isAdmin = user && user.role === 'admin';

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Link to="/listings" className="text-blue-600 hover:text-blue-800 transition-colors mb-4 inline-block">
        ← Back to Listings
      </Link>

      <div className="bg-white shadow-xl rounded-lg overflow-hidden mt-2">
        {/* Header Section with Image Background if available */}
        <div className="relative h-64 md:h-80 bg-gray-200">
          {listing.imageUrl ? (
            <img
              src={listing.imageUrl}
              alt={listing.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <span className="text-4xl">🏢</span>
            </div>
          )}
          <div className="absolute top-4 right-4 flex gap-2">
            <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
              {listing.category}
            </span>
            <span className="bg-blue-600/90 backdrop-blur text-white px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
              ★ {listing.rating || 'New'} ({listing.reviewCount || 0})
            </span>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">

            {/* Main Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{listing.name}</h1>
              <p className="text-gray-500 mb-4 flex items-center gap-2">
                📍 {listing.location?.area}, {listing.location?.city}
              </p>

              <div className="flex flex-wrap gap-3 mb-6">
                {user && (
                  <button
                    onClick={handleBookmark}
                    disabled={bookmarking}
                    className={`px-4 py-2 rounded-lg transition-colors border ${isBookmarked
                      ? 'bg-yellow-100 border-yellow-300 text-yellow-700 hover:bg-yellow-200'
                      : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
                      }`}
                  >
                    {bookmarking ? '...' : isBookmarked ? '★ Bookmarked' : '☆ Bookmark'}
                  </button>
                )}

                <button
                  onClick={() => setShowReportModal(true)}
                  className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                >
                  ⚠ Report
                </button>

                {(isOwner || isAdmin) && (
                  <>
                    <Link
                      to={`/listings/${id}/edit`}
                      className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      ✎ Edit
                    </Link>
                    <button
                      onClick={handleDelete}
                      className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      🗑 Delete
                    </button>
                  </>
                )}
              </div>

              <div className="prose max-w-none text-gray-600">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                <p className="whitespace-pre-line mb-6">{listing.description}</p>

                {listing.amenities && listing.amenities.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {listing.amenities.map(am => (
                        <span key={am} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">{am}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar / Actions */}
            <div className="w-full md:w-80 bg-gray-50 p-6 rounded-xl border border-gray-100">
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Make a Booking / Order</h3>
                <form onSubmit={handleAddToCart} className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Date</label>
                    <input
                      type="date"
                      className="w-full border rounded-lg p-2"
                      value={bookingData.scheduledDate}
                      onChange={(e) => setBookingData({ ...bookingData, scheduledDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Time</label>
                    <input
                      type="time"
                      className="w-full border rounded-lg p-2"
                      value={bookingData.scheduledTime}
                      onChange={(e) => setBookingData({ ...bookingData, scheduledTime: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Quantity / Guests</label>
                    <input
                      type="number"
                      min="1"
                      className="w-full border rounded-lg p-2"
                      value={bookingData.quantity}
                      onChange={(e) => setBookingData({ ...bookingData, quantity: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Notes</label>
                    <textarea
                      rows="2"
                      className="w-full border rounded-lg p-2"
                      placeholder="Any special requests?"
                      value={bookingData.notes}
                      onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={addingToCart}
                    className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                  >
                    {addingToCart ? 'Adding...' : 'Add to Cart'}
                  </button>
                </form>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3">Contact Info</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>📞 {listing.phone}</p>
                  <p>🕒 {listing.hours || 'Hours not configured'}</p>
                  {listing.website && (
                    <p>🌐 <a href={listing.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Visit Website</a></p>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Modals */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        listingId={id}
      />

      {showOrderingFlow && (
        <OrderingFlow business={listing} onClose={() => setShowOrderingFlow(false)} />
      )}

      {showDeliveryModal && (
        <DeliveryModal business={listing} onClose={() => setShowDeliveryModal(false)} />
      )}

      {/* Recently Viewed Section */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <RecentlyViewed excludeId={id} />
      </div>
    </div>
  );
}

export default ListingDetail;
