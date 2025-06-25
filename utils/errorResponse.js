function errorResponse(res, statusCode, message) {
  return res.status(statusCode).json({ success: false, error: message });
}

module.exports = errorResponse;
