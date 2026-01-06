import { asyncHandler } from '../utils/asyncHandler.js';
import Booking from '../models/Booking.js';
import { ApiError } from '../utils/ApiError.js';

export const createOrder = asyncHandler(async (req, res) => {
    const orderData = req.body;

    // Basic validation or mapping if needed
    // Assuming orderData structure matches Booking schema or needs slight adaptation
    // For now, dumping body into Booking creation with customer ID

    const booking = await Booking.create({
        ...orderData,
        customer: req.user.id,
        // Ensure status is pending by default
        status: 'pending'
    });

    res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: { order: booking },
    });
});

export const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Booking.find({ customer: req.user.id })
        .sort({ createdAt: -1 })
        .populate('cartSnapshot.items.listing');

    res.json({
        success: true,
        data: { orders },
    });
});

export const getOrder = asyncHandler(async (req, res) => {
    const order = await Booking.findById(req.params.id)
        .populate('cartSnapshot.items.listing');

    if (!order) {
        throw new ApiError(404, 'Order not found');
    }

    // Ensure user owns the order (or is admin)
    if (order.customer.toString() !== req.user.id && req.user.role !== 'admin') {
        throw new ApiError(403, 'Access denied');
    }

    res.json({
        success: true,
        data: { order },
    });
});
