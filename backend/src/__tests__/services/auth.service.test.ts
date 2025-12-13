import User from '../../models/User';
import AuthService from '../../services/auth.service';

describe('Auth Service', () => {
  describe('Register', () => {
    it('should register a new user', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      const result = await AuthService.register(userData);

      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(userData.email);
      expect(result.user.name).toBe(userData.name);
      expect(result.token).toBeDefined();
    });

    it('should fail with duplicate email', async () => {
      const userData = {
        name: 'John Doe',
        email: 'duplicate@example.com',
        password: 'password123'
      };

      await AuthService.register(userData);

      await expect(AuthService.register(userData))
        .rejects.toThrow('Email already registered');
    });

    it('should hash password', async () => {
      const userData = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123'
      };

      await AuthService.register(userData);
      const user = await User.findOne({ email: userData.email }).select('+password');

      expect(user?.password).not.toBe(userData.password);
    });
  });

  describe('Login', () => {
    beforeEach(async () => {
      await AuthService.register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
    });

    it('should login with correct credentials', async () => {
      const result = await AuthService.login('test@example.com', 'password123');

      expect(result.user).toBeDefined();
      expect(result.user.email).toBe('test@example.com');
      expect(result.token).toBeDefined();
    });

    it('should fail with incorrect email', async () => {
      await expect(AuthService.login('wrong@example.com', 'password123'))
        .rejects.toThrow('Invalid credentials');
    });

    it('should fail with incorrect password', async () => {
      await expect(AuthService.login('test@example.com', 'wrongpassword'))
        .rejects.toThrow('Invalid credentials');
    });
  });

  describe('Verify Token', () => {
    it('should verify valid token', async () => {
      const { token, user } = await AuthService.register({
        name: 'Token Test',
        email: 'token@example.com',
        password: 'password123'
      });

      const decoded = AuthService.verifyToken(token);

      expect(decoded).toBeDefined();
      expect(decoded.id).toBe(user._id.toString());
    });

    it('should fail with invalid token', () => {
      expect(() => AuthService.verifyToken('invalid-token'))
        .toThrow();
    });
  });
});