const express = require('express');
const authController = require('./../controllers/authController');
const bookingController = require('./../controllers/bookingController');
const router = express.Router()

router.get('/checkout-session/:tourId', authController.protect, bookingController.getCheckoutSession)
router.use(authController.restrictTo('admin', 'lead-guide'))
router.route('/').get(bookingController.getAllBookings).post(bookingController.createBooking)
router.route('/:id').get(bookingController.getBooking).patch(bookingController.updateBooking).delete(bookingController.deleteBookings)
module.exports =router