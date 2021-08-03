const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/appError");
const jwt = require('jsonwebtoken');
const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');

exports.getAllReviews = factory.getAll(Review)
exports.setTourAndUserId = (req, res, next) => {
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
}
exports.createNewReview = factory.createOne(Review);
exports.deleteReview = factory.deleteOne(Review)
exports.updateReview = factory.updateOne(Review);
exports.getReview = factory.getOne(Review)