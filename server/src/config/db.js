import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGO_URI; // Use the exact env variable name

  if (!uri) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }

  try {
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit process with failure
  }
};
