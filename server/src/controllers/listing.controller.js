import * as listingService from '../services/listing.service.js';
import * as userService from '../services/user.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

import Listing from '../models/Listing.js';
import Report from '../models/Report.js';

/* ================== GET LISTINGS ================== */
export const getListings = asyncHandler(async (req, res) => {
  const filters = {
    search: req.query.search,
    category: req.query.category,
    city: req.query.city,
    area: req.query.area,
  };

  const pagination = {
    page: req.query.page || 1,
    limit: req.query.limit || 12,
  };

  const sort = req.query.sort || 'newest';

  const result = await listingService.getListings(filters, pagination, sort);

  if (req.user) {
    for (const listing of result.listings) {
      listing.isBookmarked = await userService.isBookmarked(
        req.user.id,
        listing._id.toString()
      );
    }
  }

  res.json({ success: true, data: result });
});

/* ================== GET SINGLE LISTING ================== */
export const getListing = asyncHandler(async (req, res) => {
  const listing = await listingService.getListingById(req.params.id);

  if (req.user) {
    listing.isBookmarked = await userService.isBookmarked(
      req.user.id,
      listing._id.toString()
    );
  }

  res.json({ success: true, data: { listing } });
});

/* ================== CREATE LISTING ================== */
export const createListing = asyncHandler(async (req, res) => {
  const listing = await listingService.createListing(req.body, req.user.id);

  res.status(201).json({ success: true, data: { listing } });
});

/* ================== UPDATE LISTING ================== */
export const updateListing = asyncHandler(async (req, res) => {
  const listing = await listingService.updateListing(
    req.params.id,
    req.body,
    req.user.id,
    req.user.role
  );

  res.json({ success: true, data: { listing } });
});

/* ================== DELETE LISTING ================== */
export const deleteListing = asyncHandler(async (req, res) => {
  await listingService.deleteListing(req.params.id, req.user.id, req.user.role);

  res.json({ success: true, message: 'Listing deleted successfully' });
});

/* ================== MY LISTINGS ================== */
export const getMyListings = asyncHandler(async (req, res) => {
  const listings = await listingService.getUserListings(req.user.id);

  res.json({ success: true, data: { listings } });
});

/* ================== REPORT LISTING ================== */
export const reportListing = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const listingId = req.params.id;

  if (!reason) {
    return res.status(400).json({ message: 'Reason is required' });
  }

  const listing = await Listing.findById(listingId);
  if (!listing) {
    return res.status(404).json({ message: 'Listing not found' });
  }

  const report = await Report.create({
    listing: listingId,
    reporter: req.user ? req.user.id : null,
    reason,
  });

  res.status(201).json({
    success: true,
    message: 'Listing reported successfully',
    data: { report },
  });
});
