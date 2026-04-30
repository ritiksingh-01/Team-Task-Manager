import mongoose from 'mongoose';

export const connectDB = async () => {
  mongoose.set('strictQuery', true);
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/team-task-manager';

  if (!process.env.MONGO_URI) {
    console.warn('MONGO_URI is not set, using the local fallback MongoDB URI');
  }

  await mongoose.connect(mongoUri);
  console.log('MongoDB connected');
};
