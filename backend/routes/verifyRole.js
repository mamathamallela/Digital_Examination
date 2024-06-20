// verifyRole.js

// Middleware function to verify role
function verifyRole(role) {
    return (req, res, next) => {
      if (req.user.role !== role) {
        return res.status(403).json({ message: 'Forbidden: Access denied' });
      }
      next();
    };
  }
  
  module.exports = verifyRole; // Export the function to make it accessible
  