import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../index';
// import generateToken from '../helpers/utils';

const { expect } = chai;
const signupUrl = '/api/v1/auth/signup';
const signinUrl = '/api/v1/auth/signin';
chai.use(chaiHttp);

const {
  regData, regData1, regData2, regData3, logindata, logindata1, logindata2,
  logindata3, regDataFalse, logindataFalse,
} = require('./testdata/testData');

describe('User Authentication', () => {
  describe('User signup', () => {
    it('should register a user and return user details', (done) => {
      chai.request(server).post(signupUrl).send(regData).end((_err, res) => {
        expect(res.status).to.eq(201);
        done();
      });
    });
    it('should return user exists error if same user is registered more than once', (done) => {
      chai.request(server).post(signupUrl).send(regData1).end((_err, res) => {
        expect(res.status).to.eq(401);
        done();
      });
    });
    it('should return error if one of the fields is not filled', (done) => {
      chai.request(server).post(signupUrl).send(regData2).end((_err, res) => {
        expect(res.status).to.eq(400);
        done();
      });
    });
    it('should return error if data entered violates the set rules', (done) => {
      chai.request(server).post(signupUrl).send(regData3).end((_err, res) => {
        expect(res.status).to.eq(400);
        done();
      });
    });
  });
  describe('User signin', () => {
    it('should sign in the user', (done) => {
      chai.request(server).post(signinUrl).send(logindata).end((_err, res) => {
        expect(res.status).to.eq(200);
        done();
      });
    });
    it('should bring error is wrong email or password is provided', (done) => {
      chai.request(server).post(signinUrl).send(logindata1).end((_err, res) => {
        expect(res.status).to.eq(400);
        done();
      });
    });
    it('should bring error if some fields are not filled', (done) => {
      chai.request(server).post(signinUrl).send(logindata2).end((_err, res) => {
        expect(res.status).to.eq(400);
        done();
      });
    });
    it('should return error if user entered does not exist', (done) => {
      chai.request(server).post(signinUrl).send(logindata3).end((_err, res) => {
        expect(res.status).to.eq(403);
        done();
      });
    });
    it('should return a welcome message for regular users', async () => {
      await chai.request(server).post(signupUrl).send(regDataFalse);
      chai.request(server).post(signinUrl).send(logindataFalse).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.message).to.eq('User is logged in successfully');
      })
        .catch(error => error);
    });
  });
});
