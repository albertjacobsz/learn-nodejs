
const Tour = require('./../models/tourModels');

const User = require('./../models/userModels');

const Booking = require('./../models/bookingModel');
//const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const Stripe = require('stripe');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    const stripe = Stripe(process.env.STRIPE_SECRET_KEY_1)
    console.log(process.env.STRIPE_SECRET_KEY_1)
  // 1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/my-tours`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
        amount: tour.price * 100,
        currency: 'usd',
        quantity: 1
      }
    ]
  });

  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session
  });
});
/*exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  const { tour, user, price } = req.query
  if (!tour && !user && !price) return next();
  await Booking.create({ tour, user, price })

  res.redirect(req.originalUrl.split('?')[0])
})*/
const createBookingCheckout = async session => {
  const tour = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email })).id;
  const price = session.line_items[0].amount / 100;
  await Booking.create({ tour, user, price })
}
exports.createBooking = factory.createOne(Booking)
exports.getBooking = factory.getOne(Booking)
exports.getAllBookings = factory.getAll(Booking)
exports.updateBooking = factory.updateOne(Booking)
exports.deleteBookings = factory.deleteOne(Booking)
exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers['strip-signature']
  let event
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`)
  }
  if (event.type === 'checkout.session.complete') {
    createBookingCheckout(event.data.object)
  }
  res.status(200).json({received:true})
}