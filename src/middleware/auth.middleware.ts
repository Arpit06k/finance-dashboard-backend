import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';

export const protect = (req: Request, res: Response, next: NextFunction): void => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  try {
    const secret = process.env.JWT_SECRET || 'secret';
    // By default, jwt.verify returns a string or JwtPayload
    const decoded = jwt.verify(token, secret) as any;
    
    // Attach validated payload to request
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };
    
    next();
  } catch (error) {
    return next(new AppError('Invalid token or token has expired', 401));
  }
};
