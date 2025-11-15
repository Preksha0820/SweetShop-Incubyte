import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Use a test database
const TEST_MONGO_URI = process.env.TEST_MONGO_URI || 'mongodb://localhost:27017/sweet-shop-test';

beforeAll(async () => {
  await mongoose.connect(TEST_MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});