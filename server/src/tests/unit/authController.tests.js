import { signup, login } from '../../controllers/authController.js';
import User from '../../models/User.js';
import jwt from 'jsonwebtoken';

// Mock dependencies
jest.mock('../../models/User.js');
jest.mock('jsonwebtoken');

describe('Auth Controller - Unit Tests', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      body: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('should create a new user successfully', async () => {
      mockReq.body = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({
        _id: '123',
        username: 'testuser',
        email: 'test@example.com',
        password: undefined
      });
      jwt.sign.mockReturnValue('mock-token');

      await signup(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'success',
        token: 'mock-token',
        data: {
          user: {
            _id: '123',
            username: 'testuser',
            email: 'test@example.com',
            password: undefined
          }
        }
      });
    });

    it('should return error if user already exists', async () => {
      mockReq.body = {
        username: 'existinguser',
        email: 'existing@example.com',
        password: 'password123'
      };

      User.findOne.mockResolvedValue({ email: 'existing@example.com' });

      await signup(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'User with this email or username already exists'
      });
    });
  });

  describe('login', () => {
    it('should login user successfully with correct credentials', async () => {
      mockReq.body = {
        email: 'test@example.com',
        password: 'correctpassword'
      };

      const mockUser = {
        _id: '123',
        email: 'test@example.com',
        password: 'hashedpassword',
        correctPassword: jest.fn().mockResolvedValue(true)
      };

      User.findOne.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue('mock-token');

      await login(mockReq, mockRes, mockNext);

      expect(mockUser.correctPassword).toHaveBeenCalledWith('correctpassword', 'hashedpassword');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'success',
        token: 'mock-token',
        data: {
          user: mockUser
        }
      });
    });

    it('should return error with incorrect credentials', async () => {
      mockReq.body = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const mockUser = {
        correctPassword: jest.fn().mockResolvedValue(false)
      };

      User.findOne.mockResolvedValue(mockUser);

      await login(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'Incorrect email or password'
      });
    });
  });
});
