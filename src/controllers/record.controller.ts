import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { CreateRecordSchema } from '../utils/validators';
import * as recordService from '../services/record.service';
import { AppError } from '../utils/AppError';

export const getRecords = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const role = req.user!.role;
  const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
  const search = req.query.search as string | undefined;

  const result = await recordService.getRecords({ userId, role, page, limit, search });

  res.status(200).json({
    status: 'success',
    data: result
  });
});

export const createRecord = catchAsync(async (req: Request, res: Response) => {
  const data = CreateRecordSchema.parse(req.body);
  const record = await recordService.createRecord({ ...data, userId: req.user!.id } as any, req.user!.id);

  res.status(201).json({
    status: 'success',
    data: {
      record
    }
  });
});

export const updateRecord = catchAsync(async (req: Request, res: Response) => {
  const data = CreateRecordSchema.partial().parse(req.body);
  const id = req.params.id as string;

  const record = await recordService.updateRecord(id, data as any, req.user!.id);
  
  if (!record) {
    throw new AppError('Record not found', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      record
    }
  });
});

export const deleteRecord = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const record = await recordService.deleteRecord(id, req.user!.id);

  if (!record) {
    throw new AppError('Record not found', 404);
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

export const exportRecords = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const role = req.user!.role;

  const csvString = await recordService.exportRecordsToCSV(userId, role);

  res.header('Content-Type', 'text/csv');
  res.header('Content-Disposition', 'attachment; filename="finance_records.csv"');
  res.send(csvString);
});
