import Listing from '../models/listingmodel.js';
import { errorHandler } from '../utils/error.js';

// Create a new listing
export const createListing = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(errorHandler(401, 'Unauthorized! Please log in.'));
    }

    const newListing = await Listing.create({
      ...req.body,
      userRef: req.user.id, // Ensure only logged-in users create listings
    });

    return res.status(201).json(newListing);
  } catch (error) {
    next(error);
  }
};

// Delete a listing
export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }

    if (req.user.id !== listing.userRef.toString()) {
      return next(errorHandler(401, 'You can only delete your own listings!'));
    }

    await listing.deleteOne();
    return res.status(200).json({ message: 'Listing has been deleted!' });
  } catch (error) {
    next(error);
  }
};

// Update a listing
export const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }

    if (req.user.id !== listing.userRef.toString()) {
      return next(errorHandler(401, 'You can only update your own listings!'));
    }

    const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

// Get a single listing
export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    return res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

// Get multiple listings with filters, search, sorting, and pagination
export const getListings = async (req, res, next) => {
  try {
    const limit = isNaN(parseInt(req.query.limit)) ? 9 : parseInt(req.query.limit);
    const startIndex = isNaN(parseInt(req.query.startIndex)) ? 0 : parseInt(req.query.startIndex);

    let offer = req.query.offer === 'true' ? true : req.query.offer === 'false' ? false : { $in: [true, false] };
    let furnished = req.query.furnished === 'true' ? true : req.query.furnished === 'false' ? false : { $in: [true, false] };
    let parking = req.query.parking === 'true' ? true : req.query.parking === 'false' ? false : { $in: [true, false] };
    let type = req.query.type && ['sale', 'rent'].includes(req.query.type) ? req.query.type : { $in: ['sale', 'rent'] };

    const searchTerm = req.query.searchTerm || '';
    const sortField = req.query.sort || 'createdAt';
    const order = req.query.order === 'asc' ? 1 : -1; // Ensure sorting order is valid

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: 'i' },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sortField]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
