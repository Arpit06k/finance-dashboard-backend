import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import connectDB from './config/db';
import { errorHandler } from './middleware/error.middleware';

// Routes
import authRoutes from './routes/auth.routes';
import recordRoutes from './routes/record.routes';
import dashboardRoutes from './routes/dashboard.routes';
import auditRoutes from './routes/audit.routes';

// Jobs
import { startSummaryJob } from './jobs/summary.job';

dotenv.config();

const app: Application = express();

// Global Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per 15 minutes
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/audit', auditRoutes);

// Error Middleware (must be at the very end)
app.use(errorHandler);

// Connect to DB and Start Server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  // Start Background Jobs
  startSummaryJob();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
