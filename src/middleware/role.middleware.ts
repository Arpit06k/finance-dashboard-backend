import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !req.user.role) {
      return next(new AppError('User not authenticated properly to check permissions', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }

    next();
  };
};
