import mongoose, { Document, Schema } from 'mongoose';

export interface IRecord extends Document {
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: Date;
  notes?: string;
  userId: mongoose.Types.ObjectId;
  isDeleted: boolean;
}

const recordSchema = new Schema<IRecord>(
  {
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Record = mongoose.model<IRecord>('Record', recordSchema);

export default Record;
