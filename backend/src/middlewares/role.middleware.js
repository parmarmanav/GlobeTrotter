const ApiResponse = require('../utils/apiResponse');

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return ApiResponse.error(res, 'Access forbidden: Insufficient permissions', 403);
    }
    next();
  };
};

module.exports = {
  restrictTo
};
