const Tour = require('../models/userModels');
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
exports.getAllUsers = catchAsync( async (req, res) => {
  const users = await User.find;

  res.status(200).json({
    status: 'success',
    results: users.length,
    requestedAt: req.requestTime,
    data : {
      users
    }
  });
});
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined',
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined',
  });
};
