const request = require('supertest');
const jwt = require('jsonwebtoken');

const { User } = require('../../models/user');

const BASE_URL = '/api/users';
let server;


describe('/api/users', () => {
  beforeEach(() => { server = require('../../index'); });
  afterEach(() => { server.close(); });

  
  describe('POST /signup', () => {
    let user;
    const exec = async () => {
      return await request(server)
          .post(BASE_URL + '/signup')
          .send(user);
    }

    beforeEach(() => {
      user = {
        name: "Mohamed",
        email: "test@test.com",
        password: "password",
        confirm_password: "password"
      };
    });

    afterEach(async () => { await User.deleteMany(); })

    it('should return 422 if name less than 5 characters', async ()=> {
      user.name = '1234'
     
      const res = await exec();

      expect(res.status).toBe(422);
    });

    it('should return 422 if name more 30 than 5 characters', async ()=> {
      user.name = new Array(32).join('a');
     
      const res = await exec();

      expect(res.status).toBe(422);
    });

    it('should return 422 if email is not valid email', async ()=> {
      user.email =  "invalidEmail"
     
      const res = await exec();

      expect(res.status).toBe(422);
    });
    
    it('should return 422 if password is less than 8', async ()=> {
      user.password =  "1234567";
     
      const res = await exec();

      expect(res.status).toBe(422);
    });

    it('should return 422 if password is more than 255', async ()=> {
      user.password =  new Array(257).join('1');
     
      const res = await exec();

      expect(res.status).toBe(422);
    });

    it('should return 400 if password & confirm_password did not match', async ()=> {     
      user.confirm_password =  "new_password";

      const res = await exec();

      expect(res.status).toBe(400);
    });
    
    it('should return 400 if user Already registered', async () => {     
      const userBefore = new User(user);
      await userBefore.save();

      const res = await exec();

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'User Already registered');
    });

    it('should save the user if it is a valid user', async ()=> {
      await exec();
      
      const savedUser = await User.find({email: user.email});

      expect(savedUser).not.toBeNull();
    });

    it('should return the user if it is a valid user', async ()=> {
      const res =  await exec();

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("message", "User Created");
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user).toHaveProperty('name', user.name);
      expect(res.body.user).toHaveProperty('email', user.email);
    });
  });

  describe('POST /login', () => {
    
    let login;
    
    const exec = async () => {
      return await request(server)
        .post(BASE_URL + '/login')
        .send(login);
    };

    beforeEach(() => {
      login = {
        email: 'test@test.com',
        password: "password"
      }
    });

    beforeAll(async() => {
      await request(server)
        .post(BASE_URL + '/signup')
        .send({
          name: "Mohamed",
          email: "test@test.com",
          password: "password",
          confirm_password: "password"
        });
    });

    it('should return 422 if email is not valid email', async ()=> {
      login.email =  "invalidEmail"
     
      const res = await exec();

      expect(res.status).toBe(422);
    });
    
    it('should return 422 if password is less than 8', async ()=> {
      login.password =  "1234567";
     
      const res = await exec();

      expect(res.status).toBe(422);
    });

    it('should return 422 if password is more than 255', async ()=> {
      login.password =  new Array(257).join('1');
     
      const res = await exec();

      expect(res.status).toBe(422);
    });

    it('should return 401 if password is Invalid', async () => {
      
      login.password = "new_password"

      const res = await exec();
    
      expect(res.status).toBe(401);
    }); 
  
    it('should logIn a user if email and password is correct', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty("message", "user logedIn");
    });
    
    it('should return 404 if user is not found', async () => {
      await User.deleteMany();

      const res = await exec();

      expect(res.status).toBe(404);
    });
  });

  describe('POST /verifiy', () => {
    let PIN;
    let token;
    const user = {
      name: "Mohamed",
      email: "test@test.com",
      password: "password",
      confirm_password: "password"
    };

    const exec = async() => {
      return await request(server)
        .post(BASE_URL + '/verifiy')
        .set('Authorization', 'Bearer ' + token)
        .send({ PIN });
    };

    beforeEach(async() => {
      const res = await request(server)
        .post(BASE_URL + '/signup')
        .send(user);

      PIN = String(res.body.PIN);
      
      token = jwt.sign({
        email: user.email,
        userId: res.body.user.id
      },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
      );
    });

    afterEach(async() => {
      await User.deleteMany();
    })

    it('should return 422 if PIN is less than 5 characters', async ()=> {
      PIN = '1234';
     
      const res = await exec();
     
      expect(res.status).toBe(422);
    });

    it('should return 422 if PIN is more than 5 characters', async ()=> {
      PIN = '123456';
     
      const res = await exec();
     
      expect(res.status).toBe(422);
    });

    it('should return 401 if PIN is incorrect', async ()=> {
      PIN = '12345';
     
      const res = await exec();
     
      expect(res.status).toBe(401);
    });

    it('should return 200 if PIN is correct', async ()=> {     
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Account is activated');
      expect(res.body).toHaveProperty('accountIsActive', true);
    });
  });
});