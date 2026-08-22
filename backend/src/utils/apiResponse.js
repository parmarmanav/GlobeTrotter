/**
 * Standard API Response Helper
 */

class ApiResponse {
  static success(res, message = 'Success', data = null, statusCode = 200, meta = undefined) {
    const response = {
      success: true,
      message
    };

    if (data !== null && data !== undefined) {
      response.data = data;
    }

    if (meta !== undefined) {
      response.meta = meta;
    }

    return res.status(statusCode).json(response);
  }

  static error(res, message = 'An error occurred', statusCode = 500, errors = null) {
    const response = {
      success: false,
      message
    };

    if (errors) {
      response.errors = errors;
    }

    return res.status(statusCode).json(response);
  }
}

module.exports = ApiResponse;
