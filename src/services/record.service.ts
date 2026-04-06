import Record, { IRecord } from '../models/Record.model';
import mongoose from 'mongoose';
import AuditLog from '../models/AuditLog.model';

export const createRecord = async (data: Partial<IRecord>, performedByUserId: string): Promise<IRecord> => {
  const record = new Record(data);
  const savedRecord = await record.save();
  await AuditLog.create({ action: 'CREATE', recordId: savedRecord._id, performedBy: performedByUserId, details: data });
  return savedRecord;
};

export const getRecordById = async (id: string): Promise<IRecord | null> => {
  return await Record.findOne({ _id: id, isDeleted: false });
};

export const updateRecord = async (id: string, data: Partial<IRecord>, performedByUserId: string): Promise<IRecord | null> => {
  const updatedRecord = await Record.findOneAndUpdate({ _id: id, isDeleted: false }, data, { new: true });
  if (updatedRecord) {
    await AuditLog.create({ action: 'UPDATE', recordId: id, performedBy: performedByUserId, details: data });
  }
  return updatedRecord;
};

export const deleteRecord = async (id: string, performedByUserId: string): Promise<IRecord | null> => {
  const deletedRecord = await Record.findOneAndUpdate(
    { _id: id },
    { isDeleted: true },
    { new: true }
  );
  if (deletedRecord) {
    await AuditLog.create({ action: 'DELETE', recordId: id, performedBy: performedByUserId });
  }
  return deletedRecord;
};

export interface GetRecordsParams {
  userId: string | mongoose.Types.ObjectId;
  role: string;
  page?: number;
  limit?: number;
  search?: string;
}

export const getRecords = async ({ userId, role, page = 1, limit = 10, search = '' }: GetRecordsParams) => {
  const query: any = { isDeleted: false };
  
  if (role !== 'admin') {
    query.userId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;
  }

  if (search) {
    query.$or = [
      { notes: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (page - 1) * limit;

  const [records, total] = await Promise.all([
    Record.find(query).skip(skip).limit(limit).sort({ date: -1 }),
    Record.countDocuments(query)
  ]);

  return {
    records,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  };
};

export const exportRecordsToCSV = async (userId: string | mongoose.Types.ObjectId, role: string): Promise<string> => {
  const query: any = { isDeleted: false };
  if (role !== 'admin') {
    query.userId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;
  }

  const records = await Record.find(query).sort({ date: -1 });

  let csvString = 'ID,Amount,Type,Category,Date,Notes\n';
  records.forEach(record => {
    const id = record._id.toString();
    const amount = record.amount;
    const type = record.type;
    const category = `"${record.category.replace(/"/g, '""')}"`;
    const date = record.date.toISOString();
    const notes = record.notes ? `"${record.notes.replace(/"/g, '""')}"` : '';
    
    csvString += `${id},${amount},${type},${category},${date},${notes}\n`;
  });

  return csvString;
};
