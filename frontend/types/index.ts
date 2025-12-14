export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Sweet {
  _id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
}

export interface SweetsResponse {
  success: boolean;
  data: Sweet[];
}

export interface SingleSweetResponse {
  success: boolean;
  data: Sweet;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Array<{ msg: string; param: string }>;
}