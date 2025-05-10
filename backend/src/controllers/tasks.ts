import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { Task } from '../models/Task';
import { AppError } from '../middleware/errorHandler';

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array()[0].msg, 400));
    }

    const task = await Task.create({
      ...req.body,
      user: req.user._id
    });

    res.status(201).json({
      status: 'success',
      data: { task }
    });
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, category, priority } = req.query;
    const query: any = { user: req.user._id };

    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;

    const tasks = await Task.find(query).sort({ createdAt: -1 });

    res.json({
      status: 'success',
      results: tasks.length,
      data: { tasks }
    });
  } catch (error) {
    next(error);
  }
};

export const getTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) {
      return next(new AppError('Task not found', 404));
    }

    res.json({
      status: 'success',
      data: { task }
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array()[0].msg, 400));
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      return next(new AppError('Task not found', 404));
    }

    res.json({
      status: 'success',
      data: { task }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) {
      return next(new AppError('Task not found', 404));
    }

    res.json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

export const updateTaskStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    if (!['todo', 'in-progress', 'completed'].includes(status)) {
      return next(new AppError('Invalid status', 400));
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      {
        status,
        completedAt: status === 'completed' ? new Date() : undefined
      },
      { new: true }
    );

    if (!task) {
      return next(new AppError('Task not found', 404));
    }

    res.json({
      status: 'success',
      data: { task }
    });
  } catch (error) {
    next(error);
  }
}; 