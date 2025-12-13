import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Sweet from '../models/Sweet';
import mongoose from 'mongoose';

export const createSweet = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array()
      });
      return;
    }

    const sweet = await Sweet.create(req.body);

    res.status(201).json({
      success: true,
      data: sweet
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getAllSweets = async (req: Request, res: Response): Promise<void> => {
  try {
    const sweets = await Sweet.find();

    res.status(200).json({
      success: true,
      data: sweets
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const searchSweets = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;
    const query: any = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const sweets = await Sweet.find(query);

    res.status(200).json({
      success: true,
      data: sweets
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateSweet = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid sweet ID'
      });
      return;
    }

    const sweet = await Sweet.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!sweet) {
      res.status(404).json({
        success: false,
        message: 'Sweet not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: sweet
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteSweet = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid sweet ID'
      });
      return;
    }

    const sweet = await Sweet.findByIdAndDelete(id);

    if (!sweet) {
      res.status(404).json({
        success: false,
        message: 'Sweet not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Sweet deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const purchaseSweet = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array()
      });
      return;
    }

    const { id } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid sweet ID'
      });
      return;
    }

    const sweet = await Sweet.findById(id);

    if (!sweet) {
      res.status(404).json({
        success: false,
        message: 'Sweet not found'
      });
      return;
    }

    if (sweet.quantity < quantity) {
      res.status(400).json({
        success: false,
        message: 'Insufficient stock'
      });
      return;
    }

    sweet.quantity -= quantity;
    await sweet.save();

    res.status(200).json({
      success: true,
      data: sweet,
      message: 'Purchase successful'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const restockSweet = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array()
      });
      return;
    }

    const { id } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid sweet ID'
      });
      return;
    }

    const sweet = await Sweet.findById(id);

    if (!sweet) {
      res.status(404).json({
        success: false,
        message: 'Sweet not found'
      });
      return;
    }

    sweet.quantity += quantity;
    await sweet.save();

    res.status(200).json({
      success: true,
      data: sweet,
      message: 'Restock successful'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};