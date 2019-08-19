import express from 'express';
import userController from '../controller/user';

const router = express.Router();

// User sigup
router.post('/auth/signup', userController.userSignup);

// User signin
router.post('/auth/signin', userController.userSignin);

module.exports = router;
