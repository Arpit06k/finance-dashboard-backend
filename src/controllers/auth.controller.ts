import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { RegisterUserSchema, LoginUserSchema } from '../utils/validators';
import * as authService from '../services/auth.service';

export const register = catchAsync(async (req: Request, res: Response) => {
  const data = RegisterUserSchema.parse(req.body);
  const user = await authService.registerUser(data);
  res.status(201).json({
    status: 'success',
    data: {
      user
    }
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const data = LoginUserSchema.parse(req.body);
  const result = await authService.loginUser(data.email, data.password);
  res.status(200).json({
    status: 'success',
    data: {
      token: result.token,
      user: result.user
    }
  });
});
