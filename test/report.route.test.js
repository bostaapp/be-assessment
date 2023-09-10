const request = require('supertest');
const mongoose = require('mongoose');
const { MONGO_TEST_URI } = process.env
const app = require('../app'); // Assuming your server file is named server.js
const User = require('../model/user.model');
const URLCheck = require('../model/urlCheck.model');

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

describe('/uptime-reports', () => {
  beforeEach(async () => {
    // Clear the User and URLCheck collections before each test
    await User.deleteMany();
    await URLCheck.deleteMany();
  });

  it('should return uptime reports for the authenticated user', async () => {

    // Simulate authentication by setting the user in the request object
    const authenticatedRequest = request(app).get('/uptime-reports');

    // Create some URLCheck documents for the user
    const urlChecks = [
      { url: 'http://example.com', userId: req.user._id, isUp: true, responseTime: 100 },
      { url: 'http://example.com', userId: req.user._id, isUp: false, responseTime: 0 },
      { url: 'http://example.org', userId: req.user._id, isUp: true, responseTime: 200 },
      { url: 'http://example.net', userId: req.user._id, isUp: false, responseTime: 0 },
    ];
    await URLCheck.insertMany(urlChecks);

    // Send the authenticated request to the route
    const response = await authenticatedRequest;

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(3);

    // Assert the data of the first URLCheck
    expect(response.body[0].url).toBe('http://example.com');
    expect(response.body[0].status).toBe(false);
    expect(response.body[0].availability).toBe(50);
    expect(response.body[0].averageResponseTime).toBe(100);
    expect(response.body[0].totalUptime).toBe(1);
    expect(response.body[0].downtime).toBe(1);
  });

});

app.use(authenticate);