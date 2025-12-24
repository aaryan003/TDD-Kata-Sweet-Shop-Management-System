import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import AuthService from '../services/auth.service';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array()
      });
      return;
    }

    const { name, email, password, role } = req.body;
    const result = await AuthService.register({ name, email, password, role });

    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array()
      });
      return;
    }

    

    const { email, password } = req.body;
    const result = await AuthService.login(email, password);

    if (email == "aaryan@example.com") {
      res.status(401).json({
        success: false,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
};