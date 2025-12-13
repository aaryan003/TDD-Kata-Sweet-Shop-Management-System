import mongoose from 'mongoose';
import User, { IUser } from '../../models/User';

describe('User Model', () => {
  describe('User Creation', () => {
    it('should create a user with valid data', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user'
      };

      const user = await User.create(userData);

      expect(user.name).toBe(userData.name);
      expect(user.email).toBe(userData.email);
      expect(user.password).not.toBe(userData.password); // Should be hashed
      expect(user.role).toBe('user');
    });

    it('should fail without required fields', async () => {
      const user = new User({});
      let error;

      try {
        await user.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
    });

    it('should fail with duplicate email', async () => {
      const userData = {
        name: 'John Doe',
        email: 'duplicate@example.com',
        password: 'password123'
      };

      await User.create(userData);
      let error;

      try {
        await User.create(userData);
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
    });

    it('should default role to user', async () => {
      const userData = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123'
      };

      const user = await User.create(userData);
      expect(user.role).toBe('user');
    });
  });

  describe('Password Methods', () => {
    it('should match correct password', async () => {
      const userData = {
        name: 'John Doe',
        email: 'test@example.com',
        password: 'password123'
      };

      const user = await User.create(userData);
      const isMatch = await user.comparePassword('password123');

      expect(isMatch).toBe(true);
    });

    it('should not match incorrect password', async () => {
      const userData = {
        name: 'John Doe',
        email: 'test2@example.com',
        password: 'password123'
      };

      const user = await User.create(userData);
      const isMatch = await user.comparePassword('wrongpassword');

      expect(isMatch).toBe(false);
    });
  });
});