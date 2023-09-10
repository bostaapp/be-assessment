const request = require('supertest');
const mongoose = require('mongoose');
const { MONGO_TEST_URI } = process.env
const app = require('../app'); // Assuming your server file is named server.js
const User = require('../model/user.model');
const UrlCheck = require('../model/urlCheck.model');

// Connect to a test database before running the tests
beforeAll(async () => {
  await mongoose.connect(MONGO_TEST_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Clear the test database after running the tests
afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

const authenticate = async (req, res, next) => {
    // Simulate authentication logic
    const user = await User.findOne({ name: 'testuser' });
    req.user = user;
    next();
  };

describe('UrlCheck Routes', () => {
  beforeEach(async () => {
    // Clear the UrlCheck collection before each test
    await UrlCheck.deleteMany();
  });

  it('should create a new UrlCheck', async () => {
    const response = await request(app)
      .post('/checks')
      .send({ name: 'Example UrlCheck', url: 'http://example.com' });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Example UrlCheck');
    expect(response.body.url).toBe('http://example.com');
  });

  it('should update an existing UrlCheck', async () => {
    const UrlCheck = new UrlCheck({ name: 'Example UrlCheck', url: 'http://example.com', userId: req.user._id });
    await UrlCheck.save();

    const response = await request(app)
      .put(`/checks/${UrlCheck._id}`)
      .send({ name: 'Example UrlCheck' });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Example UrlCheck');
  });

  it('should retrieve UrlCheck of user ', async () => {
    const UrlCheck = new UrlCheck({ name: 'UrlCheck 1', url: 'http://site1.com', userId: req.user._id });
    await Promise.all([UrlCheck.save()]);

    const response = await request(app).get(`/checks/${UrlCheck._id}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('UrlCheck 1');
    expect(response.body.url).toBe('http://site1.com');
  });
});

app.use(authenticate);