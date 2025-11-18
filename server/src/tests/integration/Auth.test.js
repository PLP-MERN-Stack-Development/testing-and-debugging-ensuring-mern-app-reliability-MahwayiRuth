import request from 'supertest';
import { app } from '../../server.js';
import User from '../../models/User.js';

describe('Auth API - Integration Tests', () => {
  describe('POST /api/auth/signup', () => {
    it('should create a new user and return token', async () => {
      const userData = {
        username: 'integrationtest',
        email: 'integration@test.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(201);

      expect(response.body.status).toBe('success');
      expect(response.body.token).toBeDefined();
      expect(response.body.data.user.username).toBe(userData.username);
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user.password).toBeUndefined();

      // Verify user was saved in database
      const user = await User.findOne({ email: userData.email });
      expect(user).toBeDefined();
      expect(user.username).toBe(userData.username);
    });

    it('should return error for duplicate email', async () => {
      const userData = {
        username: 'testuser1',
        email: 'duplicate@test.com',
        password: 'password123'
      };

      // Create first user
      await request(app)
        .post('/api/auth/signup')
        .send(userData);

      // Try to create user with same email
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          username: 'testuser2',
          email: 'duplicate@test.com',
          password: 'password123'
        })
        .expect(400);

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toContain('already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a user for login tests
      await request(app)
        .post('/api/auth/signup')
        .send({
          username: 'logintest',
          email: 'login@test.com',
          password: 'password123'
        });
    });

    it('should login user with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@test.com',
          password: 'password123'
        })
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.token).toBeDefined();
      expect(response.body.data.user.email).toBe('login@test.com');
    });

    it('should reject login with incorrect password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@test.com',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe('Incorrect email or password');
    });

    it('should reject login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'password123'
        })
        .expect(401);

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe('Incorrect email or password');
    });
  });

  describe('GET /api/auth/me', () => {
    let token;

    beforeEach(async () => {
      // Create user and get token
      const signupResponse = await request(app)
        .post('/api/auth/signup')
        .send({
          username: 'metest',
          email: 'me@test.com',
          password: 'password123'
        });

      token = signupResponse.body.token;
    });

    it('should return user data for valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.user.email).toBe('me@test.com');
      expect(response.body.data.user.username).toBe('metest');
    });

    it('should reject request without token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toContain('not logged in');
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe('Invalid token');
    });
  });
});
