import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
}

interface AuthResponse {
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  token: string;
}

class AuthService {
  private generateToken(userId: string): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    return jwt.sign(
      { id: userId },
      secret,
      { expiresIn: process.env.JWT_EXPIRE || '7d' } as jwt.SignOptions
    );
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const existingUser = await User.findOne({ email: data.email });
    
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const user = await User.create(data);
    const token = this.generateToken(user._id.toString());

    return {
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user._id.toString());

    return {
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    };
  }

  verifyToken(token: string): { id: string } {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }
    
    return jwt.verify(token, secret) as { id: string };
  }
}

export default new AuthService();