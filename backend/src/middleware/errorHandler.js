// src/middleware/errorHandler.js

/* eslint-disable no-unused-vars */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};
/* eslint-enable no-unused-vars */

export default errorHandler;
