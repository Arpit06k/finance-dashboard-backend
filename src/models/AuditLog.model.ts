import mongoose, { Document, Schema } from 'mongoose';

export interface IAuditLog extends Document {
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  recordId: mongoose.Types.ObjectId;
  performedBy: mongoose.Types.ObjectId;
  details: any;
  createdAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>({
  action: {
    type: String,
    enum: ['CREATE', 'UPDATE', 'DELETE'],
    required: true,
  },
  recordId: {
    type: Schema.Types.ObjectId,
    ref: 'Record',
    required: true,
  },
  performedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  details: {
    type: Schema.Types.Mixed,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const AuditLog = mongoose.model<IAuditLog>('AuditLog', auditLogSchema);

export default AuditLog;
