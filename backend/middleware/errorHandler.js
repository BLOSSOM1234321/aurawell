// Error handler middleware
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Mongoose/PostgreSQL duplicate key error
  if (err.code === '23505') {
    const message = 'Duplicate field value entered';
    return res.status(400).json({
      success: false,
      error: message
    });
  }

  // PostgreSQL foreign key constraint
  if (err.code === '23503') {
    const message = 'Referenced record does not exist';
    return res.status(400).json({
      success: false,
      error: message
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Token expired'
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      error: messages.join(', ')
    });
  }

  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error'
  });
};

// Not found middleware
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};
