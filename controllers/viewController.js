const Tour = require('../models/tourModels');
const Booking = require('../models/bookingModel');
const catchAsync = require("../utils/catchAsync");
const AppError = require('./../utils/appError')
const User = require('../models/userModels');
exports.getOverview = catchAsync(async (req, res, next) => {
    const tours = await Tour.find()
    res.status(200).render('overview', {
        title: 'Overview of tours',
        tours
    })
})
exports.getTour = catchAsync(async(req, res,next) => {
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        fields: 'reviews rating user'
    });
    res.set(
        'Content-Security-Policy',
        "default-src 'self' https://*.mapbox.com; base-uri 'self'; block-all-mixed-content; font-src 'self' https:; frame-ancestors 'self'; img-src 'self' blob: data:; object-src 'none'; script-src 'unsafe-inline' https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob:; style-src 'self' https: 'unsafe-inline'; upgrade-insecure-requests;"
    );
    if (!tour) {
        return next(new AppError('There is no tour with that name', 404))
    }
    res.status(200).render('tour', {
        title: `${tour.name} Tour`,
        tour: tour
    });
})
exports.getLoginForm = (req, res) => {
    res
      .status(200)
      .set(
        'Content-Security-Policy',
        "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
      )
      .render('login', {
        title: 'Login',
      });
};
exports.getAccount = (req, res) => {
    res.status(200).render('account', {
        title: 'your account'
    });
}
exports.updateUserData = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user.id, {
        name: req.body.name,
        email: req.body.email
    }, {
        new: true,
        runValidators: true
    });
    res.status(200).render('account', {
        title: 'your account'
    });
})
exports.getMyTours = catchAsync(async (req, res, next) => {
    const bookings = await Booking.find({ user: req.user.id })
    const tourIds = bookings.map(el => el.tour)
    const tours = await Tour.find({ _id: { $in: tourIds } })
    
    res.status(200).render('overview', {
        title: 'your booked tours',
        tours
    })
})
exports.alerts = (req, res, next) => {
    const { alert } = req.query
    if (alert === 'booking') {
        res.locals.alert = 'your booking was succesful'
    }
    next()
}