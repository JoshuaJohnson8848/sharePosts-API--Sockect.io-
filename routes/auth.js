const express = require('express');
const router = express.Router();
const { body } = require('express-validator/check');
const User = require('../models/user');
const isAuth = require('../middleware/isAuth');

const authController = require('../controller/auth');

router.put('/signup', [
  body('email')
    .isEmail()
    .withMessage('Invalid Email')
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then((userDoc) => {
        if (userDoc) {
          return Promise.reject('Email is Already Exist');
        }
      });
    })
    .normalizeEmail(),
  body('password').trim().isLength({ min: 5 }),
  body('name').trim().not().isEmpty(),
  authController.signup,
]);

router.post('/login', authController.login);

router.get('/status', isAuth, authController.getStatus);

router.put('/status', isAuth, authController.updateStatus);

module.exports = router;
