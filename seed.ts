import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.model';
import Record from './src/models/Record.model';
import connectDB from './src/config/db';

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Record.deleteMany({});

    console.log('Cleared existing Users and Records.');

    // Insert Users
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
    });

    const analyst = await User.create({
      name: 'Analyst User',
      email: 'analyst@example.com',
      password: 'password123',
      role: 'analyst',
    });

    const viewer = await User.create({
      name: 'Viewer User',
      email: 'viewer@example.com',
      password: 'password123',
      role: 'viewer',
    });

    console.log('Seeded Users: 1 Admin, 1 Analyst, 1 Viewer.');

    // Insert 20 random financial records
    const categories = ['Salary', 'Freelance', 'Food', 'Transport', 'Utilities', 'Entertainment'];
    const users = [admin._id, analyst._id, viewer._id];
    const recordsToInsert = [];

    for (let i = 0; i < 20; i++) {
      const type = Math.random() > 0.5 ? 'income' : 'expense';
      const userIdx = Math.floor(Math.random() * users.length);
      const categoryIdx = Math.floor(Math.random() * categories.length);
      const amount = Number((Math.random() * 1000 + 10).toFixed(2));

      recordsToInsert.push({
        amount,
        type,
        category: categories[categoryIdx],
        date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)), // Random date in past
        notes: `Sample ${type} record ${i + 1}`,
        userId: users[userIdx],
      });
    }

    await Record.insertMany(recordsToInsert);

    console.log(`Seeded ${recordsToInsert.length} random financial records.`);
    console.log('Database seeded successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
