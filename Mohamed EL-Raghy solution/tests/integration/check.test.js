const request = require('supertest');
const jwt = require('jsonwebtoken');

const { User } = require('../../models/user');
const { Check } = require('../../models/check');

let server;
const BASE_URL = '/api/checks';

describe('/api/checks', () => {
  let token;
  let check;
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
  });

  afterEach(async () => { 
    await User.deleteMany();
    await Check.deleteMany();
    server.close(); 
  });

  describe('POST /', () => {
    
    const exec = async () => {
      return await request(server)
        .post(BASE_URL)
        .set('Authorization', 'Bearer ' + token)
        .send(check)
    }

    it('should return 422 if name less than 5 characters', async ()=> {
      check.name = '1234';

      const res = await exec();

      expect(res.status).toBe(422);
    });

    it('should return 422 if name more than 30 characters', async ()=> {
      check.name = new Array(32).join('a');

      const res = await exec();

      expect(res.status).toBe(422);
    });

    it('should return 422 if url is empty', async ()=> {
      check.url = '';

      const res = await exec();

      expect(res.status).toBe(422);
    });

    it('should return 422 if protocol no one of [HTTP, HTTPS, TCP]', async ()=> {
      check.protocol = '';

      const res = await exec();

      expect(res.status).toBe(422);
    });

    it('should return 400 if check already exist',async () => {
      await exec();
      const res = await exec();
  
      expect(res.status).toBe(400);
    });

    it('should save check if it is a valid check', async () => {
      await exec();
      
      const res = await Check.find({protocol: check.protocol, url: check.url});
      
      expect(res).not.toBeNull();
    });

    it('should return check if it is a valid check', async () => {
      const res = await exec();
      
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message', 'Check Created');
      expect(res.body).toHaveProperty('check');
    });
  });

  describe('GET /', () => {

    beforeEach(async () => {
      await request(server)
        .post(BASE_URL)
        .set('Authorization', 'Bearer ' + token)
        .send(check)
    });

    const exec = async () => {
      return await request(server)
        .get(BASE_URL + '?tags')
        .set('Authorization', 'Bearer ' + token)
    }

    it('should return 404 if there is no check to  ', async ()=> {
      await Check.deleteMany();
      
      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return list of checks', async ()=> {      
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('checks');
      expect(res.body.checks.length).toBe(1);
    });
  });

  describe('GET /:id', () => {
    let id;

    beforeEach(async () => {
      const checkID = await request(server)
        .post(BASE_URL)
        .set('Authorization', 'Bearer ' + token)
        .send(check)

      id = checkID.body.check._id
    });

    const exec = async () => {
      return await request(server)
        .get(BASE_URL + `/${id}`)
        .set('Authorization', 'Bearer ' + token)
    }

    it('should return 404 if ID is invalid', async () => {
      id = '123456'

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return 404 if not check found', async () => {
      await Check.deleteMany();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return 200 if check with ID found', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('check');

    });
  });

  describe('PUT /:id', () => {
    let updatedCheck;
    let id;

    beforeEach(async () => {      
      updatedCheck = {
        name: "updated Ping Local",
        url: "localhost",
        path: "/api/users/signup",
        protocol: "TCP",
      }

      const checkID = await request(server)
        .post(BASE_URL)
        .set('Authorization', 'Bearer ' + token)
        .send(check)

      id = checkID.body.check._id
    });

    const exec = async () => {
      return await request(server)
        .put(BASE_URL + `/${id}`)
        .set('Authorization', 'Bearer ' + token)
        .send(updatedCheck)
    }

    it('should return 422 if name less than 5 characters', async ()=> {
      updatedCheck.name = '1234';

      const res = await exec();

      expect(res.status).toBe(422);
    });

    it('should return 422 if name more than 30 characters', async ()=> {
      updatedCheck.name = new Array(32).join('a');

      const res = await exec();

      expect(res.status).toBe(422);
    });

    it('should return 422 if url is empty', async ()=> {
      updatedCheck.url = '';

      const res = await exec();

      expect(res.status).toBe(422);
    });

    it('should return 422 if protocol no one of [HTTP, HTTPS, TCP]', async ()=> {
      updatedCheck.protocol = '';

      const res = await exec();

      expect(res.status).toBe(422);
    });

    it('should return 404 if ID is invalid', async () => {
      id = '123456'

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return 404 if no check to updated', async () => {
      await Check.deleteMany();
      
      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return 400 if updated check Already Exist', async () => {
      updatedCheck = check;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 200 if updated check is valid', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'check Updated');
      expect(res.body).toHaveProperty('check');
    });
  });
  
  describe('DELETE /:id', () => {
    let id;

    beforeEach(async () => {
      const checkID = await request(server)
        .post(BASE_URL)
        .set('Authorization', 'Bearer ' + token)
        .send(check)

      id = checkID.body.check._id
    });

    const exec = async () => {
      return await request(server)
        .delete(BASE_URL + `/${id}`)
        .set('Authorization', 'Bearer ' + token)
    }

    it('should return 404 if ID is invalid', async () => {
      id = '123456'

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return 404 if not check found', async () => {
      await Check.deleteMany();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return 204 if check with ID found', async () => {
      const res = await exec();

      expect(res.status).toBe(204);
    });
  });
});