import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.routes.js';
import sweetsRoutes from './routes/sweets.routes.js';
import errorMiddleware from './middlewares/error.middleware.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --- 🔽 YEH RAHA UPDATED CODE 🔽 ---

// List of origins that are allowed to make requests
const allowedOrigins = [
  "https://sweet-shop-incubyte-eosin.vercel.app", // Aapka Vercel URL
  "http://localhost:5173"                       // Aapka local development URL
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or server-to-server)
    if (!origin) return callback(null, true);
    
    // Check if the incoming origin is in our allowed list
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false); // Block the request
    }
    return callback(null, true); // Allow the request
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// --- 🔼 UPDATE YAHAN KHATM HOTA HAI 🔼 ---

app.use('/public', express.static(path.join(__dirname, '../public')));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetsRoutes);
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

// Only connect to MongoDB and start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log('✅ Connected to MongoDB');
      app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch((err) => {
      console.error('❌ Mongo connection error:', err);
      process.exit(1);
    });
}

export default app;