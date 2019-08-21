import express from 'express';
import bodyParser from 'body-parser';
import userController from '../controller/user';
import auth from '../middleware/auth';

// const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const router = express.Router();

// User sigup
router.post('/auth/signup', userController.userSignup);

// User signin
router.post('/auth/signin', userController.userSignin);

// Change user to Mentor
router.put('/users/:id', urlencodedParser, auth, userController.changeToMentor);

module.exports = router;
