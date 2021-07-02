const express = require('express');

const router = express.Router();
const tourController = require('../controllers/tourController');
const authController = require('./../controllers/authController');

/*router.param('id', (req, res, next, val) => {
  console.log(`Tour id = ${val}`);
  next();
});
*/
//router.param('id', tourController.checkId);
router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);
router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createNewTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateNewTour)
  .delete(tourController.deleteTour);
module.exports = router;
