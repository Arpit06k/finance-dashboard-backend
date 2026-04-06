import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import * as dashboardService from '../services/dashboard.service';

export const getSummary = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const role = req.user!.role;

  const [summary, categoryTotals] = await Promise.all([
    dashboardService.getSummary(userId, role),
    dashboardService.getCategoryTotals(userId, role)
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      summary,
      categoryTotals
    }
  });
});
