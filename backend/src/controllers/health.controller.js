const ApiResponse = require('../utils/apiResponse');

/**
 * @desc   Health check endpoint
 * @route  GET /api/v1/health
 * @access Public
 */
const checkHealth = (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'GlobeTrotter API is running'
  });
};

module.exports = {
  checkHealth
};
