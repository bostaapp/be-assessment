const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const auth = require('../../../middleware/is-Auth');

describe('auth middleware', () => {
  let token;
  let req;
  
  const next = jest.fn();
  const res = {};
  const user = { 
    _id: new mongoose.Types.ObjectId().toHexString(), 
    email: 'test@test.com' 
  };

  beforeEach(() => { 
    token = jwt.sign({
      email: user.email,
      userId: user._id.toString()
    },
      process.env.JWT_KEY,
    { expiresIn: '1h' }
    );
  });

  const exec = () => {
    auth(req, res, next);
  };

  it('should populate req.isAuth with false if no header provided', () => {

    req = {
      get: jest.fn().mockReturnValue(undefined)
    };
    
    exec();

    expect(req.isAuth).toBe(false);
  });

  it('should populate req.isAut with false if token is not valid', () => {
    req = {
      get: jest.fn().mockReturnValue('Bearer ' + 'token')
    };

    exec();

    expect(req.isAuth).toBe(false);
  });

  it('should populate req with the payload of a valid JWT', () => {
    req = {
      get: jest.fn().mockReturnValue('Bearer ' + token)
    };

    exec();

    expect(req.userId).toBe(user._id);
    expect(req.userEmail).toBe(user.email);
    expect(req.isAuth).toBe(true);
  });
});