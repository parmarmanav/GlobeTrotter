const ApiResponse = require('../utils/apiResponse');
const Trip = require('../models/Trip');

const verifyTripOwnership = async (req, res, next) => {
  try {
    const tripId = req.params.tripId || req.params.id;
    const trip = await Trip.findById(tripId);

    if (!trip) {
      return ApiResponse.error(res, 'Trip not found', 404);
    }

    if (trip.userId.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return ApiResponse.error(res, 'Forbidden: You do not own this trip', 403);
    }

    req.trip = trip;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  verifyTripOwnership
};
