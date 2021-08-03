const reviewController = require('./../controllers/reviewController');
const express = require('express');
const authController = require('./../controllers/authController');
const router = express.Router({ mergeParams: true });
router.use(authController.protect)
router.route('/')
    .get(reviewController.getAllReviews)
    .post(authController.restrictTo('user'),reviewController.setTourAndUserId,reviewController.createNewReview);
router.route('/:id').delete(reviewController.deleteReview).patch(authController.restrictTo('admin','user'),reviewController.updateReview).get(reviewController.getReview).delete(authController.restrictTo('admin'),reviewController.deleteReview)
module.exports = router;