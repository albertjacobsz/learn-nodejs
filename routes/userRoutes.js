const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');



router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout)
router.post('/forgotPassword', authController.forgotPassword);
router.get('/me', authController.protect, userController.getMe, userController.getUser)
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);
router.patch('/updateMe',userController.uploadUserPhoto,userController.resizeUserPhoto, userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);
router.use(authController.restrictTo('admin'))
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateMe)
  .delete(userController.deleteMe);

module.exports = router;
