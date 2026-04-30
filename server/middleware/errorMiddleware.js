export const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (error, _req, res, _next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      message: Object.values(error.errors)
        .map((item) => item.message)
        .join(', ')
    });
  }

  if (error.code === 11000) {
    return res.status(409).json({ message: 'Email already exists' });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid resource id' });
  }

  res.status(statusCode).json({
    message: error.message || 'Something went wrong'
  });
};
