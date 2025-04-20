/**
 * Authentication middleware
 * Used to protect routes that require authentication
 */

/**
 * Middleware to ensure user is authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.ensureAuth = (req, res, next) => {
  // Check if user is authenticated via Passport
  if (req.isAuthenticated()) {
    return next();
  }
  
  // If not authenticated, return 401 Unauthorized
  return res.status(401).json({
    success: false,
    error: 'Unauthorized. Please log in to access this resource.'
  });
};

/**
 * Middleware to ensure user is a guest (not authenticated)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.ensureGuest = (req, res, next) => {
  // Check if user is NOT authenticated
  if (!req.isAuthenticated()) {
    return next();
  }
  
  // If already authenticated, redirect to dashboard or home
  return res.status(400).json({
    success: false,
    error: 'You are already logged in.'
  });
}; 