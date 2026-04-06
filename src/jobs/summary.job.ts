import cron from 'node-cron';
import User from '../models/User.model';
import * as dashboardService from '../services/dashboard.service';

export const startSummaryJob = () => {
  // Schedule to run every minute for testing. (Typically '0 0 * * 0' for weekly)
  cron.schedule('0 0 * * 0', async () => {
    try {
      const activeUsers = await User.find({ isActive: true });
      
      for (const user of activeUsers) {
        const summary = await dashboardService.getSummary(user._id.toString(), user.role);
        console.log(`[CRON] Sending weekly summary to ${user.email} | Net Balance: $${summary.netBalance}`);
      }
    } catch (error) {
      console.error('[CRON] Error executing weekly summary job:', error);
    }
  });
};
