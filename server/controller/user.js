import {
  compare,
} from 'bcryptjs';
import UserModel from '../model/user';
import generatePassword from '../helpers/generatePassword';
import generateToken from '../helpers/utils';
import validator from '../helpers/validation';

const _ = require('lodash');

const Data = new UserModel();

const userController = {
  userSignup: async (req, res) => {
    // pick the values from the users
    const rawData = _.pick(req.body, ['first_name', 'last_name', 'email',
      'password', 'address', 'bio', 'occupation', 'expertise', 'isAdmin',
    ]);
    const results = validator.validateUser(rawData);
    if (results.error === null) {
      const details = Data.userExists(rawData);
      if (details) {
        return res.status(401).send({
          status: res.statusCode,
          message: 'user already exists',
        });
      }
      // generate a hashed password
      const newPassword = await generatePassword(rawData, Data.updateUsers());
      // update data
      rawData.id = Data.updateUsers() + 1;
      rawData.password = newPassword;
      // update the list of users
      Data.addUser(rawData);
      const token = generateToken(rawData.id, rawData.isAdmin, rawData.email);
      return res.status(201).send({
        status: res.statusCode,
        message: 'User created successfully',
        data: {
          token,
          message: 'User created successfully',
        },
      });
    }
    return res.status(400).send({
      status: res.statusCode,
      message: results.error.details[0].message,
    });
  },
  userSignin: async (req, res) => {
    const rawData = _.pick(req.body, ['email', 'password']);
    // Validate the user input
    const results = validator.validateLogin(rawData);
    if (results.error === null) {
      // Check if we have that user in the db
      const details = Data.userExists(rawData);
      if (!details) {
        return res.status(403).send({
          status: res.statusCode,
          message: 'User doesn\'t exist',
        });
      }
      // Validate the password
      const validPassword = await compare(rawData.password, details.password);
      if (!validPassword) {
        return res.status(400).send({
          status: res.statusCode,
          message: 'Invalid email or password',
        });
      }
      // User types
      let userStatus = '';
      // Generate token for a user
      const token = generateToken(details.id, details.isAdmin, details.email);
      const message = function generateMessage(userType) {
        if (userType !== true) {
          userStatus = 'normalUser';
        }
        userStatus = 'Admin';
      };
      return res.status(200).header('x-auth', token).send({
        status: res.statusCode,
        message: 'user is logged in successfully',
        userType: message(details.isAdmin),
        data: {
          token,
          id: details.id,
          name: details.last_name,
          userStatus,
        },
      });
    }
    // Otherwise bring an error 
    return res.status(400).send({
      status: res.statusCode,
      message: 'something went wrong',
      data: results.error.details[0].message,
    });
  },
};
module.exports = userController;
