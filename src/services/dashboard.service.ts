import Record from '../models/Record.model';
import mongoose from 'mongoose';

export const getSummary = async (userId: string | mongoose.Types.ObjectId, role: string) => {
  const matchStage: any = { isDeleted: false };

  if (role !== 'admin') {
    matchStage.userId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;
  }

  const result = await Record.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalIncome: {
          $sum: {
            $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0]
          }
        },
        totalExpenses: {
          $sum: {
            $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0]
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        totalIncome: 1,
        totalExpenses: 1,
        netBalance: { $subtract: ['$totalIncome', '$totalExpenses'] }
      }
    }
  ]);

  if (result.length === 0) {
    return { totalIncome: 0, totalExpenses: 0, netBalance: 0 };
  }

  return result[0];
};

export const getCategoryTotals = async (userId: string | mongoose.Types.ObjectId, role: string) => {
  const matchStage: any = { isDeleted: false };

  if (role !== 'admin') {
    matchStage.userId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;
  }

  const result = await Record.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$category',
        totalAmount: { $sum: '$amount' }
      }
    },
    {
      $project: {
        _id: 0,
        category: '$_id',
        totalAmount: 1
      }
    },
    {
      $sort: { totalAmount: -1 }
    }
  ]);

  return result;
};
