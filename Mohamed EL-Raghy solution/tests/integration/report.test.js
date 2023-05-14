const request = require('supertest');
const jwt = require('jsonwebtoken');

const { User } = require('../../models/user');
const { Check } = require('../../models/check');
const Report = require('../../models/report');

let server;
const BASE_URL = '/api/report';

describe('/api/checks', () => {
  let token;
  let check;
  let id;
  const user = {
    name: "Mohamed",
    email: "test@test.com",
    password: "password",
    confirm_password: "password"
  };

  beforeEach(async () => {
    server = require('../../index'); 

    const res = await request(server)
        .post('/api/users/signup')
        .send(user);

    token = jwt.sign({
      email: user.email,
      userId: res.body.user.id
      },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );
    
    check = {
      name: "Ping Local",
      url: "localhost",
      protocol: "HTTP",
    }

    const checkID = await request(server)
        .post('/api/checks')
        .set('Authorization', 'Bearer ' + token)
        .send(check)

    id = checkID.body.check._id;

    const report = new Report({
      status: 'up',
      availability: 70, 
      outages: 2, 
      downtime: 5, 
      uptime: 15, 
      aveResponseTime: 100,
      forCheck: id
    });

    await report.save();
  });

  afterEach(async () => { 
    await User.deleteMany();
    await Check.deleteMany();
    await Report.deleteMany();
    server.close(); 
  });


  describe('GET /:id', () => {
  
    const exec = async () => {
      return await request(server)
        .get(BASE_URL + `/${id}?tags=`)
        .set('Authorization', 'Bearer ' + token)
    }

    it('should return 404 if ID is invalid', async () => {
      id = '123456'

      const res = await exec();

      expect(res.status).toBe(404);
    });
  
    it('should return 404 if there is no check', async ()=> {
      await Check.deleteMany();
      
      const res = await exec();
  
      expect(res.status).toBe(404);
    });

    it('should return 404 if there is no report', async ()=> {
      await Report.deleteMany();
      
      const res = await exec();
  
      expect(res.status).toBe(404);
    });
  
    it('should return the report', async ()=> {      
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Report Retrieved');
      expect(res.body).toHaveProperty('reports');
      expect(res.body.reports.length).toBe(1);
    });
  });
});