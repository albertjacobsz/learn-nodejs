const AppError = require('../utils/appError');

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('error', err);
    res.status(500).json({
      status: 'error',
      message: 'something went wrong',
    });
  }
};
const handleCastErrorDB = (err) => {
  const message = `invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
  const message = `Duplicate field value ${err.keyValue.name}, please use another value`;
  return new AppError(message, 402)
}
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `invalid input data. ${errors.join('. ')}`
  return new AppError(message, 400);
}
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV) {
    let error = { ...err, name: err.name};
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error)
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);

    sendErrorProd(error, res);
  }
};
