import Bookmark from '../models/Bookmark.js';
import Wishlist from '../models/Wishlist.js';
import Listing from '../models/Listing.js';
import { ApiError } from '../utils/ApiError.js';

export const getUserBookmarks = async (userId) => {
  const bookmarks = await Bookmark.find({ user: userId })
    .populate({
      path: 'listing',
      populate: { path: 'owner', select: 'name email' },
    })
    .sort({ createdAt: -1 })
    .lean();

  return bookmarks.map((b) => b.listing).filter((l) => l && l.isActive);
};

export const toggleBookmark = async (userId, listingId) => {
  const listing = await Listing.findById(listingId);
  if (!listing) {
    throw new ApiError(404, 'Listing not found');
  }

  const existing = await Bookmark.findOne({ user: userId, listing: listingId });

  if (existing) {
    await Bookmark.findByIdAndDelete(existing._id);
    return { bookmarked: false };
  } else {
    await Bookmark.create({ user: userId, listing: listingId });
    return { bookmarked: true };
  }
};

export const isBookmarked = async (userId, listingId) => {
  if (!userId) return false;
  const bookmark = await Bookmark.findOne({ user: userId, listing: listingId });
  return !!bookmark;
};

export const getUserWishlist = async (userId) => {
  const wishlist = await Wishlist.find({ user: userId })
    .populate({
      path: 'listing',
      populate: { path: 'owner', select: 'name email' },
    })
    .sort({ createdAt: -1 })
    .lean();

  return wishlist.map((b) => b.listing).filter((l) => l && l.isActive);
};

export const toggleWishlist = async (userId, listingId) => {
  const listing = await Listing.findById(listingId);
  if (!listing) {
    throw new ApiError(404, 'Listing not found');
  }

  const existing = await Wishlist.findOne({ user: userId, listing: listingId });

  if (existing) {
    await Wishlist.findByIdAndDelete(existing._id);
    return { wishlisted: false };
  } else {
    await Wishlist.create({ user: userId, listing: listingId });
    return { wishlisted: true };
  }
};

export const isWishlisted = async (userId, listingId) => {
  if (!userId) return false;
  const item = await Wishlist.findOne({ user: userId, listing: listingId });
  return !!item;
};
