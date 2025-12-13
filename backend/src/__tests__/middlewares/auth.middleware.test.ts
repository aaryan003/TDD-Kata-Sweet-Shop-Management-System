import { Request, Response, NextFunction } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import User from '../../models/User';
import AuthService from '../../services/auth.service';

describe('Auth Middleware', () => {
  describe('authenticate', () => {
    it('should authenticate valid token', async () => {
      const { user, token } = await AuthService.register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      const req = {
        header: jest.fn().mockReturnValue(`Bearer ${token}`)
      } as unknown as Request;

      const res = {} as Response;
      const next = jest.fn() as NextFunction;

      await authenticate(req, res, next);

      expect(req.user).toBeDefined();
      expect(req.user?._id.toString()).toBe(user._id);
      expect(next).toHaveBeenCalled();
    });

    it('should fail without token', async () => {
      const req = {
        header: jest.fn().mockReturnValue(null)
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      const next = jest.fn() as NextFunction;

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Access denied. No token provided'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should fail with invalid token', async () => {
      const req = {
        header: jest.fn().mockReturnValue('Bearer invalid-token')
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      const next = jest.fn() as NextFunction;

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });
  });
describe('authorize', () => {
    it('should allow admin role', async () => {
      const admin = await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin'
      });

      // FIX: Use double casting (as unknown as Request)
      const req = { user: admin } as unknown as Request;
      const res = {} as Response;
      const next = jest.fn() as NextFunction;

      const middleware = authorize('admin');
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should deny non-admin role', async () => {
      const user = await User.create({
        name: 'Regular User',
        email: 'user@example.com',
        password: 'password123',
        role: 'user'
      });

      // FIX: Use double casting (as unknown as Request)
      const req = { user } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;
      const next = jest.fn() as NextFunction;

      const middleware = authorize('admin');
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Access denied. Insufficient permissions'
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});