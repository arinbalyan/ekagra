import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { Timer } from '../models/Timer';
import { Task } from '../models/Task';
import { AppError } from '../middleware/errorHandler';

export const startTimer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array()[0].msg, 400));
    }

    const { type, duration, task } = req.body;

    // If task is provided, verify it exists and belongs to user
    if (task) {
      const taskExists = await Task.findOne({
        _id: task,
        user: req.user._id
      });

      if (!taskExists) {
        return next(new AppError('Task not found', 404));
      }
    }

    const timer = await Timer.create({
      user: req.user._id,
      type,
      duration,
      task,
      startTime: new Date()
    });

    res.status(201).json({
      status: 'success',
      data: { timer }
    });
  } catch (error) {
    next(error);
  }
};

export const endTimer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const timer = await Timer.findOne({
      _id: req.params.id,
      user: req.user._id,
      completed: false
    });

    if (!timer) {
      return next(new AppError('Timer not found or already completed', 404));
    }

    timer.endTime = new Date();
    timer.completed = true;
    await timer.save();

    // If this was a pomodoro session and it was associated with a task,
    // increment the completed pomodoros count
    if (timer.type === 'pomodoro' && timer.task) {
      await Task.findByIdAndUpdate(timer.task, {
        $inc: { completedPomodoros: 1 }
      });
    }

    res.json({
      status: 'success',
      data: { timer }
    });
  } catch (error) {
    next(error);
  }
};

export const getTimerHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, startDate, endDate } = req.query;
    const query: any = { user: req.user._id };

    if (type) query.type = type;
    if (startDate || endDate) {
      query.startTime = {};
      if (startDate) query.startTime.$gte = new Date(startDate as string);
      if (endDate) query.startTime.$lte = new Date(endDate as string);
    }

    const timers = await Timer.find(query)
      .sort({ startTime: -1 })
      .populate('task', 'title category');

    res.json({
      status: 'success',
      results: timers.length,
      data: { timers }
    });
  } catch (error) {
    next(error);
  }
};

export const getTimerStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = req.query;
    const query: any = {
      user: req.user._id,
      completed: true
    };

    if (startDate || endDate) {
      query.startTime = {};
      if (startDate) query.startTime.$gte = new Date(startDate as string);
      if (endDate) query.startTime.$lte = new Date(endDate as string);
    }

    const stats = await Timer.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$type',
          totalSessions: { $sum: 1 },
          totalMinutes: { $sum: '$duration' },
          averageDuration: { $avg: '$duration' }
        }
      }
    ]);

    res.json({
      status: 'success',
      data: { stats }
    });
  } catch (error) {
    next(error);
  }
}; 