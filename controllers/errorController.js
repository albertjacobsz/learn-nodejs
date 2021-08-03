const AppError = require('../utils/appError');

const sendErrorDev = (err,req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  } else {
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message
    })
  }

};
const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
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
  } else {
    if (err.isOperational) {
      res.status(err.statusCode).render('error', {
        title: 'Something went wrong',
        msg: err.message
      })
    } else {
      console.error('error', err);
      res.status(err.statusCode).render('error', {
        title: 'Something went wrong',
        msg: 'please try again later'
      })
    }
  }
};
const handleJWTExpiredError = () => new AppError('Your token has expired', 401);
const handleJWTError = () => new AppError("Invalid token please login again", 401);
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
    sendErrorDev(err, req,res);
  } else if (process.env.NODE_ENV) {
    let error = { ...err, name: err.name };
    error.message = err.message
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error)
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error,req, res);
  }
};
